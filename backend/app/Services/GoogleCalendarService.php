<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\GoogleAccount;
use Carbon\CarbonImmutable;
use DateTimeInterface;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * The calendar half: read busy time, create the event that carries the Google
 * Meet link, move it, delete it.
 *
 * ── Where the Meet link actually comes from ─────────────────────────────────
 * There is no separate Meet API to enable. A Meet link is minted by asking
 * events.insert for one — `conferenceData.createRequest` in the body plus
 * `conferenceDataVersion=1` in the QUERY STRING. Omit the query parameter and
 * Google silently drops the conference request and returns a perfectly valid
 * event with no Meet link, no error. That silent failure is the single easiest
 * thing to get wrong here, which is why it is asserted in createEvent().
 *
 * ── Failure posture ─────────────────────────────────────────────────────────
 * Reads (freeBusy) degrade quietly: if Google is unreachable the slot engine
 * falls back to the local bookings table rather than showing an empty calendar,
 * because an empty calendar loses a customer while a double-booking merely
 * costs an apology. Writes (createEvent) throw, because a booking whose event
 * never landed must be recorded as calendar_failed and retried, never silently
 * accepted.
 */
class GoogleCalendarService
{
    private const BASE = 'https://www.googleapis.com/calendar/v3';

    public function __construct(private readonly GoogleOAuthService $oauth) {}

    /** An authenticated client, refreshing the access token if needed. */
    private function http(GoogleAccount $account): PendingRequest
    {
        return Http::withToken($this->oauth->accessToken($account))
            ->acceptJson()
            ->timeout(15);
    }

    private function account(): GoogleAccount
    {
        $account = GoogleAccount::current();

        if (! $account || ! $account->isConnected()) {
            throw new RuntimeException('Google is not connected. Connect it in Admin → Bookings → Google.');
        }

        return $account;
    }

    /**
     * Busy intervals on the connected calendar, as [start, end] CarbonImmutable
     * pairs in UTC.
     *
     * Cached for 60 seconds: a visitor paging through a month fires this on
     * every click, and Google's quota is not worth spending on a calendar that
     * changes a few times a day. The cache is keyed by range so paging forward
     * is not served a stale window.
     *
     * Returns [] on ANY failure — see the class note on failure posture.
     *
     * @return array<int, array{0: CarbonImmutable, 1: CarbonImmutable}>
     */
    public function freeBusy(DateTimeInterface $from, DateTimeInterface $to): array
    {
        $key = 'gcal:freebusy:'.$from->format('YmdHi').':'.$to->format('YmdHi');

        return Cache::remember($key, 60, function () use ($from, $to) {
            try {
                $account = $this->account();

                $res = $this->http($account)->post(self::BASE.'/freeBusy', [
                    'timeMin' => CarbonImmutable::instance($from)->utc()->toRfc3339String(),
                    'timeMax' => CarbonImmutable::instance($to)->utc()->toRfc3339String(),
                    'items' => [['id' => $account->calendar_id]],
                ]);

                if (! $res->successful()) {
                    Log::warning('Google freeBusy failed', ['status' => $res->status(), 'body' => $res->json()]);

                    return [];
                }

                $busy = $res->json('calendars.'.$account->calendar_id.'.busy', []);

                return array_map(
                    fn ($b) => [
                        CarbonImmutable::parse($b['start'])->utc(),
                        CarbonImmutable::parse($b['end'])->utc(),
                    ],
                    $busy,
                );
            } catch (\Throwable $e) {
                Log::warning('Google freeBusy threw', ['message' => $e->getMessage()]);

                return [];
            }
        });
    }

    /**
     * Create the calendar event for a booking and return what came back.
     *
     * `sendUpdates=all` makes Google email the attendee a real calendar
     * invitation, which is worth more than our own confirmation alone: it puts
     * the call in THEIR calendar with the Meet link attached. Our confirmation
     * email still goes out separately, because Google's invite has no
     * reschedule/cancel link of ours in it.
     *
     * @return array{event_id: string, html_link: ?string, meet_url: ?string}
     *
     * @throws RuntimeException
     */
    public function createEvent(Booking $booking): array
    {
        $account = $this->account();
        $type = $booking->bookingType;

        $res = $this->http($account)
            ->post(self::BASE.'/calendars/'.rawurlencode($account->calendar_id).'/events?'.http_build_query([
                // WITHOUT THIS THERE IS NO MEET LINK. See the class note.
                'conferenceDataVersion' => 1,
                'sendUpdates' => 'all',
            ]), [
                'summary' => $type->name.' · '.$booking->name,
                'description' => $this->describe($booking),
                'start' => ['dateTime' => $booking->starts_at->toRfc3339String(), 'timeZone' => 'UTC'],
                'end' => ['dateTime' => $booking->ends_at->toRfc3339String(), 'timeZone' => 'UTC'],
                'attendees' => [
                    ['email' => $booking->email, 'displayName' => $booking->name],
                ],
                'conferenceData' => [
                    'createRequest' => [
                        // Idempotency key. Tied to the booking, so a retry after a
                        // timeout reuses the same conference instead of minting a
                        // second Meet room for the same call.
                        'requestId' => 'waheed-'.$booking->uid,
                        'conferenceSolutionKey' => ['type' => 'hangoutsMeet'],
                    ],
                ],
                'guestsCanModify' => false,
                'guestsCanInviteOthers' => false,
                'reminders' => ['useDefault' => true],
                // Survives the round trip, so a stray event can be traced back.
                'extendedProperties' => ['private' => ['waheed_booking_uid' => $booking->uid]],
            ]);

        if (! $res->successful()) {
            Log::error('Google event create failed', ['status' => $res->status(), 'body' => $res->json()]);
            throw new RuntimeException($this->explain($res->status(), $res->json('error.message')));
        }

        return [
            'event_id' => $res->json('id'),
            'html_link' => $res->json('htmlLink'),
            'meet_url' => $this->meetUrl($res->json()),
        ];
    }

    /** Move an existing event. Used by reschedule. */
    public function moveEvent(string $eventId, DateTimeInterface $start, DateTimeInterface $end): void
    {
        $account = $this->account();

        $res = $this->http($account)
            ->patch(self::BASE.'/calendars/'.rawurlencode($account->calendar_id).'/events/'.rawurlencode($eventId).'?sendUpdates=all', [
                'start' => ['dateTime' => CarbonImmutable::instance($start)->utc()->toRfc3339String(), 'timeZone' => 'UTC'],
                'end' => ['dateTime' => CarbonImmutable::instance($end)->utc()->toRfc3339String(), 'timeZone' => 'UTC'],
            ]);

        if (! $res->successful()) {
            Log::error('Google event move failed', ['status' => $res->status(), 'body' => $res->json()]);
            throw new RuntimeException($this->explain($res->status(), $res->json('error.message')));
        }
    }

    /**
     * Delete an event. A 404/410 counts as success — the event is gone, which
     * is all the caller wanted, and cancelling a booking must not fail because
     * someone already deleted the event by hand in Google Calendar.
     */
    public function deleteEvent(string $eventId): void
    {
        $account = $this->account();

        $res = $this->http($account)
            ->delete(self::BASE.'/calendars/'.rawurlencode($account->calendar_id).'/events/'.rawurlencode($eventId).'?sendUpdates=all');

        if ($res->successful() || in_array($res->status(), [404, 410], true)) {
            return;
        }

        Log::error('Google event delete failed', ['status' => $res->status(), 'body' => $res->json()]);
        throw new RuntimeException($this->explain($res->status(), $res->json('error.message')));
    }

    /**
     * End-to-end proof that the whole chain works: token refresh, event insert,
     * Meet minting, and delete. Creates a throwaway event 10 years out (so it
     * cannot collide with anything real or notify anyone) and removes it again.
     * Backs the "Test connection" button in the admin console.
     *
     * @return array{ok: bool, message: string, meet_url?: string, email?: string}
     */
    public function selfTest(): array
    {
        try {
            $account = $this->account();
            $start = CarbonImmutable::now()->addYears(10)->startOfHour();

            $res = $this->http($account)
                ->post(self::BASE.'/calendars/'.rawurlencode($account->calendar_id).'/events?conferenceDataVersion=1', [
                    'summary' => 'WAHEED connection test (safe to ignore)',
                    'start' => ['dateTime' => $start->toRfc3339String(), 'timeZone' => 'UTC'],
                    'end' => ['dateTime' => $start->addMinutes(15)->toRfc3339String(), 'timeZone' => 'UTC'],
                    'conferenceData' => [
                        'createRequest' => [
                            'requestId' => 'waheed-test-'.Str::random(12),
                            'conferenceSolutionKey' => ['type' => 'hangoutsMeet'],
                        ],
                    ],
                ]);

            if (! $res->successful()) {
                return ['ok' => false, 'message' => $this->explain($res->status(), $res->json('error.message'))];
            }

            $meet = $this->meetUrl($res->json());
            $this->deleteEvent($res->json('id'));

            if (! $meet) {
                return [
                    'ok' => false,
                    'message' => 'The event was created but Google returned no Meet link. '
                        .'This usually means the connected account cannot host Meet conferences.',
                ];
            }

            return [
                'ok' => true,
                'email' => $account->email,
                'meet_url' => $meet,
                'message' => 'Created a test event on '.$account->email.', got a Meet link, and deleted it again.',
            ];
        } catch (\Throwable $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Pull the Meet URL out of an event. `hangoutLink` is the convenient field
     * but is not always present, so fall back to walking the entry points.
     */
    private function meetUrl(array $event): ?string
    {
        if (! empty($event['hangoutLink'])) {
            return $event['hangoutLink'];
        }

        foreach ($event['conferenceData']['entryPoints'] ?? [] as $entry) {
            if (($entry['entryPointType'] ?? null) === 'video' && ! empty($entry['uri'])) {
                return $entry['uri'];
            }
        }

        return null;
    }

    /** What the admin sees on the event in their own calendar. */
    private function describe(Booking $booking): string
    {
        $lines = [
            $booking->name.' <'.$booking->email.'>',
        ];

        if ($booking->company) {
            $lines[] = 'Company: '.$booking->company;
        }
        if ($booking->phone) {
            $lines[] = 'Phone: '.$booking->phone;
        }
        if ($booking->message) {
            $lines[] = '';
            $lines[] = 'What they want to talk about:';
            $lines[] = $booking->message;
        }

        $lines[] = '';
        $lines[] = 'Booked via waheed.in · ref '.$booking->uid;

        return implode("\n", $lines);
    }

    /** Google's HTTP failures, translated into next actions. */
    private function explain(int $status, ?string $message): string
    {
        if ($status === 403 && $message && str_contains($message, 'has not been used in project')) {
            return 'The Google Calendar API is not enabled on this project. Enable it at '
                .'APIs & Services → Library → Google Calendar API, then try again.';
        }

        return match ($status) {
            401 => 'Google rejected the access token. Reconnect the account in Admin → Bookings → Google.',
            403 => 'Google refused the request'.($message ? ': '.$message : '.')
                .' Check that the calendar scopes are listed on the OAuth consent screen.',
            404 => 'The calendar or event was not found. Check GOOGLE_CALENDAR_ID in backend/.env.',
            409 => 'Google reports that event already exists.',
            429 => 'Google rate-limited the request. Try again shortly.',
            default => 'Google returned HTTP '.$status.($message ? ': '.$message : '.'),
        };
    }
}
