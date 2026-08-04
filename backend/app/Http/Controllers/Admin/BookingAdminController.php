<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingEvent;
use App\Services\GoogleCalendarService;
use App\Services\SlotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Throwable;

/**
 * Reading and managing booked calls.
 *
 * The list is deliberately scope-driven rather than a free-form date filter:
 * "upcoming", "past" and "cancelled" are the three questions actually asked of
 * a booking list, and each implies its own sort direction — upcoming reads
 * soonest-first, past reads most-recent-first. A single `order by starts_at`
 * would get one of them backwards.
 */
class BookingAdminController extends Controller
{
    public function index(Request $request, SlotService $slots): JsonResponse
    {
        $data = $request->validate([
            'scope' => ['nullable', Rule::in(['upcoming', 'past', 'cancelled', 'all'])],
            'q' => ['nullable', 'string', 'max:120'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'between:5,100'],
        ]);

        $scope = $data['scope'] ?? 'upcoming';

        $query = Booking::query()->with('bookingType');

        match ($scope) {
            'upcoming' => $query
                ->whereIn('status', [Booking::STATUS_CONFIRMED])
                ->where('starts_at', '>=', now())
                ->orderBy('starts_at'),
            'past' => $query
                ->whereIn('status', [Booking::STATUS_CONFIRMED, Booking::STATUS_COMPLETED, Booking::STATUS_NO_SHOW])
                ->where('starts_at', '<', now())
                ->orderByDesc('starts_at'),
            'cancelled' => $query
                ->where('status', Booking::STATUS_CANCELLED)
                ->orderByDesc('starts_at'),
            default => $query->orderByDesc('starts_at'),
        };

        if ($q = $data['q'] ?? null) {
            $query->where(fn ($sub) => $sub
                ->where('name', 'like', "%{$q}%")
                ->orWhere('email', 'like', "%{$q}%")
                ->orWhere('company', 'like', "%{$q}%")
                ->orWhere('uid', $q));
        }

        $page = $query->paginate($data['per_page'] ?? 20, ['*'], 'page', $data['page'] ?? 1);

        return response()->json([
            'timezone' => $slots->timezone(),
            'counts' => [
                'upcoming' => Booking::where('status', Booking::STATUS_CONFIRMED)->where('starts_at', '>=', now())->count(),
                'past' => Booking::whereIn('status', [Booking::STATUS_CONFIRMED, Booking::STATUS_COMPLETED, Booking::STATUS_NO_SHOW])->where('starts_at', '<', now())->count(),
                'cancelled' => Booking::where('status', Booking::STATUS_CANCELLED)->count(),
            ],
            'data' => collect($page->items())->map(fn (Booking $b) => $this->row($b)),
            'meta' => [
                'current_page' => $page->currentPage(),
                'last_page' => $page->lastPage(),
                'total' => $page->total(),
            ],
        ]);
    }

    /** One booking, with the full audit trail the drawer renders as a timeline. */
    public function show(Booking $booking): JsonResponse
    {
        $booking->load('bookingType', 'events');

        return response()->json([
            'booking' => $this->row($booking) + [
                'message' => $booking->message,
                'phone' => $booking->phone,
                'admin_note' => $booking->admin_note,
                'google_html_link' => $booking->google_html_link,
                'source' => $booking->source,
                'hubspot_status' => $booking->hubspot_status,
                'manage_url' => url('/book/manage/'.$booking->manage_token),
            ],
            'events' => $booking->events->map(fn (BookingEvent $e) => [
                'kind' => $e->kind,
                'meta' => $e->meta,
                'at' => $e->created_at?->toIso8601ZuluString(),
            ]),
        ]);
    }

    /** Admin-side cancel: releases the slot and removes the calendar event. */
    public function cancel(Booking $booking, GoogleCalendarService $calendar): JsonResponse
    {
        if ($booking->status !== Booking::STATUS_CANCELLED) {
            $booking->markCancelled('admin');
            $booking->recordEvent(BookingEvent::CANCELLED, ['by' => 'admin']);

            if ($booking->google_event_id) {
                try {
                    $calendar->deleteEvent($booking->google_event_id);
                } catch (Throwable $e) {
                    // The booking is cancelled either way; the calendar is now
                    // the thing out of step, and that is worth recording rather
                    // than failing a cancel that already happened.
                    $booking->recordEvent(BookingEvent::CALENDAR_FAILED, ['op' => 'delete', 'message' => $e->getMessage()]);
                }
            }
        }

        return $this->show($booking->fresh());
    }

    /**
     * Outcome and notes after the fact.
     *
     * Cancelling is NOT available here — it has side effects (releasing the
     * slot, deleting the Google event) that a general-purpose update would
     * silently skip, so it keeps its own endpoint.
     */
    public function update(Request $request, Booking $booking): JsonResponse
    {
        $data = $request->validate([
            'status' => ['sometimes', Rule::in([Booking::STATUS_CONFIRMED, Booking::STATUS_COMPLETED, Booking::STATUS_NO_SHOW])],
            'admin_note' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ]);

        if (isset($data['status']) && $data['status'] !== $booking->status) {
            $booking->recordEvent($data['status'], ['by' => 'admin', 'from' => $booking->status]);
        }

        $booking->update($data);

        return $this->show($booking->fresh());
    }

    /** Retry the Google event for a booking whose calendar sync failed. */
    public function resync(Booking $booking, GoogleCalendarService $calendar): JsonResponse
    {
        if ($booking->status !== Booking::STATUS_CONFIRMED) {
            return response()->json(['error' => 'Only a confirmed booking can be put on the calendar.'], 422);
        }

        try {
            $event = $calendar->createEvent($booking);

            $booking->forceFill([
                'google_event_id' => $event['event_id'],
                'google_html_link' => $event['html_link'],
                'meet_url' => $event['meet_url'],
                'calendar_status' => 'synced',
            ])->save();

            $booking->recordEvent(BookingEvent::CALENDAR_SYNCED, ['meet_url' => $event['meet_url'], 'retry' => true]);
        } catch (Throwable $e) {
            $booking->recordEvent(BookingEvent::CALENDAR_FAILED, ['op' => 'retry', 'message' => $e->getMessage()]);

            return response()->json(['error' => $e->getMessage()], 422);
        }

        return $this->show($booking->fresh());
    }

    private function row(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'uid' => $booking->uid,
            'name' => $booking->name,
            'email' => $booking->email,
            'company' => $booking->company,
            'starts_at' => $booking->starts_at->toIso8601ZuluString(),
            'ends_at' => $booking->ends_at->toIso8601ZuluString(),
            'visitor_tz' => $booking->visitor_tz,
            'status' => $booking->status,
            'calendar_status' => $booking->calendar_status,
            'meet_url' => $booking->meet_url,
            'type' => $booking->bookingType?->name,
            'duration_min' => $booking->bookingType?->duration_min,
            'created_at' => $booking->created_at?->toIso8601ZuluString(),
        ];
    }
}
