<?php

namespace App\Jobs;

use App\Models\Booking;
use App\Models\BookingEvent;
use App\Services\HubSpotService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

/**
 * Push a booking into HubSpot as a meeting engagement, off the request.
 *
 * The contact form syncs to HubSpot inline, which is defensible there: it is a
 * form submission and the visitor expects a moment's wait. A booking already
 * spends that moment talking to Google, and adding three more HubSpot round
 * trips before the Meet link appears would be paid for by the customer.
 *
 * {@see HubSpotService::syncBooking()} never throws and always returns a
 * status, so this job records the outcome and finishes; there is nothing here
 * worth retrying that the service has not already given up on.
 */
class SyncBookingToHubSpot implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    public function __construct(public int $bookingId) {}

    public function handle(HubSpotService $hubspot): void
    {
        $booking = Booking::with('bookingType')->find($this->bookingId);

        if (! $booking) {
            return;
        }

        $status = $hubspot->syncBooking($booking);
        $booking->forceFill(['hubspot_status' => $status])->save();

        if ($status === 'skipped') {
            return; // not configured; silence is the correct amount of noise
        }

        $booking->recordEvent(
            $status === 'synced' ? BookingEvent::HUBSPOT_SYNCED : BookingEvent::HUBSPOT_FAILED,
        );
    }
}
