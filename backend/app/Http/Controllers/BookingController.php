<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingEvent;
use App\Models\BookingType;
use App\Services\GoogleCalendarService;
use App\Services\SlotService;
use Carbon\CarbonImmutable;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Throwable;

/**
 * The public booking API. Everything here is unauthenticated and therefore
 * throttled, honeypotted and strict about what it accepts.
 *
 * ── The ordering rule that matters ──────────────────────────────────────────
 * The database row is written BEFORE the Google event, always. If Google fails
 * the booking still exists, is flagged `calendar_failed`, shows red in the
 * admin console and can be retried. Doing it the other way round can leave a
 * real event on a real calendar with nothing in the database pointing at it —
 * an appointment nobody can find, cancel or even explain.
 *
 * ── And the one about races ─────────────────────────────────────────────────
 * {@see SlotService::isAvailable()} is checked first because it produces a good
 * error message, but it does not prevent double-booking: two requests can pass
 * it microseconds apart. The unique index on `bookings.slot_lock` is the real
 * arbiter, and the 409 below is what the loser gets.
 */
class BookingController extends Controller
{
    /** What can be booked, and the shape of its calendar. */
    public function types(SlotService $slots): JsonResponse
    {
        $types = BookingType::query()
            ->where('is_active', true)
            ->orderBy('sort')
            ->get()
            ->map(fn (BookingType $t) => [
                'slug' => $t->slug,
                'name' => $t->name,
                'description' => $t->description,
                'duration_min' => $t->duration_min,
                'location' => $t->location,
                'horizon_days' => $t->horizon_days,
                'min_notice_min' => $t->min_notice_min,
            ]);

        return response()->json([
            'timezone' => $slots->timezone(),
            'types' => $types,
        ]);
    }

    /**
     * Bookable start times, as UTC instants grouped by date in the business
     * timezone. The browser does all local rendering — the server never guesses
     * the visitor's zone, it only reports its own.
     */
    public function slots(Request $request, SlotService $slots): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'string', Rule::exists('booking_types', 'slug')->where('is_active', true)],
            'from' => ['required', 'date_format:Y-m-d'],
            'to' => ['required', 'date_format:Y-m-d', 'after_or_equal:from'],
        ]);

        $type = BookingType::query()->where('slug', $data['type'])->firstOrFail();
        $tz = $slots->timezone();

        $from = CarbonImmutable::createFromFormat('Y-m-d', $data['from'], $tz)->startOfDay();
        $to = CarbonImmutable::createFromFormat('Y-m-d', $data['to'], $tz)->endOfDay();

        // A visitor paging fast should not be able to ask for a decade.
        if ($from->diffInDays($to) > 62) {
            $to = $from->addDays(62);
        }

        $days = [];
        foreach ($slots->slots($type, $from, $to) as $date => $instants) {
            $days[] = [
                'date' => $date,
                'slots' => array_map(fn (CarbonImmutable $s) => $s->toIso8601ZuluString(), $instants),
            ];
        }

        return response()->json([
            'timezone' => $tz,
            'duration_min' => $type->duration_min,
            'days' => $days,
        ]);
    }

    /** Take a booking. */
    public function store(Request $request, SlotService $slots, GoogleCalendarService $calendar): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'string', Rule::exists('booking_types', 'slug')->where('is_active', true)],
            'starts_at' => ['required', 'date'],
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30', 'regex:/^\+?(?:\d[\s().-]*){7,}$/'],
            'company' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string', 'max:2000'],
            'visitor_tz' => ['nullable', 'string', 'max:64'],
            // Honeypot: a real person never fills this, it is hidden. Bots do.
            'website' => ['nullable', 'string', 'max:0'],
        ], [
            'phone.regex' => 'Please enter a valid phone number.',
            'website.max' => 'That submission looked automated. Please try again.',
        ]);

        $type = BookingType::query()->where('slug', $data['type'])->firstOrFail();
        $start = CarbonImmutable::parse($data['starts_at'])->utc()->seconds(0);
        $end = $start->addMinutes($type->duration_min);

        if (! $slots->isAvailable($type, $start)) {
            throw ValidationException::withMessages([
                'starts_at' => 'That time is no longer available. Please pick another.',
            ]);
        }

        // Guard against one visitor filling the calendar with the same email.
        $existing = Booking::query()
            ->where('email', strtolower($data['email']))
            ->where('status', Booking::STATUS_CONFIRMED)
            ->where('starts_at', '>=', now())
            ->count();

        if ($existing >= 2) {
            throw ValidationException::withMessages([
                'email' => 'You already have upcoming calls booked. Reply to your confirmation email if you need another.',
            ]);
        }

        try {
            $booking = DB::transaction(fn () => Booking::create([
                'booking_type_id' => $type->id,
                'name' => $data['name'],
                'email' => strtolower($data['email']),
                'phone' => $data['phone'] ?? null,
                'company' => $data['company'] ?? null,
                'message' => $data['message'] ?? null,
                'starts_at' => $start,
                'ends_at' => $end,
                'visitor_tz' => $this->safeTimezone($data['visitor_tz'] ?? null),
                'status' => Booking::STATUS_CONFIRMED,
                'slot_lock' => Booking::lockFor($type->id, $start),
                'source' => 'web',
            ]));
        } catch (UniqueConstraintViolationException) {
            // Someone else took it between the availability check and the insert.
            return response()->json([
                'error' => 'That time was booked moments ago. Please pick another.',
                'code' => 'slot_taken',
            ], 409);
        }

        $booking->recordEvent(BookingEvent::CREATED, [
            'ip' => $request->ip(),
            'visitor_tz' => $booking->visitor_tz,
        ]);

        $this->syncToCalendar($booking, $calendar);

        return response()->json([
            'ok' => true,
            'booking' => $this->publicShape($booking->fresh()),
        ], 201);
    }

    /** Read a booking from its manage link. */
    public function show(string $token): JsonResponse
    {
        return response()->json(['booking' => $this->publicShape($this->byToken($token))]);
    }

    /** Cancel from the manage link. */
    public function cancel(string $token, GoogleCalendarService $calendar): JsonResponse
    {
        $booking = $this->byToken($token);

        if ($booking->status === Booking::STATUS_CANCELLED) {
            return response()->json(['ok' => true, 'booking' => $this->publicShape($booking)]);
        }

        $booking->markCancelled('visitor');
        $booking->recordEvent(BookingEvent::CANCELLED, ['by' => 'visitor']);

        if ($booking->google_event_id) {
            try {
                $calendar->deleteEvent($booking->google_event_id);
            } catch (Throwable $e) {
                // The booking IS cancelled either way — the calendar is now the
                // thing out of step, and that is a cleanup job, not a failure to
                // report to someone who just cancelled successfully.
                Log::warning('Calendar delete failed on cancel', ['booking' => $booking->uid, 'message' => $e->getMessage()]);
                $booking->recordEvent(BookingEvent::CALENDAR_FAILED, ['op' => 'delete', 'message' => $e->getMessage()]);
            }
        }

        return response()->json(['ok' => true, 'booking' => $this->publicShape($booking->fresh())]);
    }

    /** Move a booking from the manage link. */
    public function reschedule(Request $request, string $token, SlotService $slots, GoogleCalendarService $calendar): JsonResponse
    {
        $booking = $this->byToken($token);

        if ($booking->status !== Booking::STATUS_CONFIRMED) {
            throw ValidationException::withMessages([
                'starts_at' => 'This booking can no longer be changed.',
            ]);
        }

        $data = $request->validate(['starts_at' => ['required', 'date']]);

        $type = $booking->bookingType;
        $start = CarbonImmutable::parse($data['starts_at'])->utc()->seconds(0);
        $end = $start->addMinutes($type->duration_min);

        if ($start->equalTo($booking->starts_at)) {
            return response()->json(['ok' => true, 'booking' => $this->publicShape($booking)]);
        }

        if (! $slots->isAvailable($type, $start)) {
            throw ValidationException::withMessages([
                'starts_at' => 'That time is no longer available. Please pick another.',
            ]);
        }

        $was = $booking->starts_at->toIso8601ZuluString();

        try {
            $booking->moveTo($start, $end);
        } catch (UniqueConstraintViolationException) {
            return response()->json([
                'error' => 'That time was booked moments ago. Please pick another.',
                'code' => 'slot_taken',
            ], 409);
        }

        $booking->recordEvent(BookingEvent::RESCHEDULED, ['from' => $was, 'to' => $start->toIso8601ZuluString()]);

        if ($booking->google_event_id) {
            try {
                $calendar->moveEvent($booking->google_event_id, $start, $end);
                $booking->forceFill(['calendar_status' => 'synced'])->save();
            } catch (Throwable $e) {
                $booking->forceFill(['calendar_status' => 'failed'])->save();
                $booking->recordEvent(BookingEvent::CALENDAR_FAILED, ['op' => 'move', 'message' => $e->getMessage()]);
            }
        } else {
            // Never made it onto the calendar in the first place — try again now.
            $this->syncToCalendar($booking, $calendar);
        }

        return response()->json(['ok' => true, 'booking' => $this->publicShape($booking->fresh())]);
    }

    /**
     * Put the booking on the calendar, recording either outcome. Never throws:
     * the booking is already saved, and a Google outage must not turn a
     * successful booking into an error page.
     */
    private function syncToCalendar(Booking $booking, GoogleCalendarService $calendar): void
    {
        try {
            $event = $calendar->createEvent($booking);

            $booking->forceFill([
                'google_event_id' => $event['event_id'],
                'google_html_link' => $event['html_link'],
                'meet_url' => $event['meet_url'],
                'calendar_status' => 'synced',
            ])->save();

            $booking->recordEvent(BookingEvent::CALENDAR_SYNCED, ['meet_url' => $event['meet_url']]);
        } catch (Throwable $e) {
            Log::error('Booking calendar sync failed', ['booking' => $booking->uid, 'message' => $e->getMessage()]);

            $booking->forceFill(['calendar_status' => 'failed'])->save();
            $booking->recordEvent(BookingEvent::CALENDAR_FAILED, ['op' => 'create', 'message' => $e->getMessage()]);
        }
    }

    private function byToken(string $token): Booking
    {
        return Booking::query()
            ->with('bookingType')
            ->where('manage_token', $token)
            ->firstOrFail();
    }

    /** Only ever reject a bad timezone quietly — it is cosmetic, not load-bearing. */
    private function safeTimezone(?string $tz): string
    {
        return $tz && in_array($tz, timezone_identifiers_list(), true) ? $tz : 'UTC';
    }

    /** What a visitor is allowed to see. No ids, no tokens, no admin notes. */
    private function publicShape(Booking $booking): array
    {
        return [
            'uid' => $booking->uid,
            'status' => $booking->status,
            'name' => $booking->name,
            'email' => $booking->email,
            'starts_at' => $booking->starts_at->toIso8601ZuluString(),
            'ends_at' => $booking->ends_at->toIso8601ZuluString(),
            'visitor_tz' => $booking->visitor_tz,
            'meet_url' => $booking->meet_url,
            'type' => [
                'name' => $booking->bookingType->name,
                'duration_min' => $booking->bookingType->duration_min,
            ],
            // Present so the confirmation screen can link straight to it; it is
            // the same secret the caller already used to get here.
            'manage_token' => $booking->manage_token,
        ];
    }
}
