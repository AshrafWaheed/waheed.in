<?php

namespace App\Mail;

use App\Models\Booking;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * The internal heads-up: someone booked, moved or cancelled a call.
 *
 * Separate from {@see BookingMail} because it is a different document for a
 * different reader — no .ics (Google already put it on the calendar), no
 * reassurance, and the visitor's message and contact details up front where
 * they are useful for preparing.
 *
 * Times render in the BUSINESS timezone, with the visitor's alongside when it
 * differs, which is the reverse of the customer-facing mail and correct for the
 * same reason: each reader gets their own clock.
 */
class BookingAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Booking $booking,
        public string $kind, // confirmed | rescheduled | cancelled
    ) {}

    public function envelope(): Envelope
    {
        $verb = match ($this->kind) {
            'rescheduled' => 'moved',
            'cancelled' => 'CANCELLED',
            default => 'booked',
        };

        return new Envelope(
            subject: "Call {$verb}: {$this->booking->name} — {$this->businessTime()}",
            replyTo: [$this->booking->email],
        );
    }

    public function content(): Content
    {
        $businessTz = Setting::get('booking_timezone', 'UTC');
        $visitorTz = $this->booking->visitor_tz;

        return new Content(
            view: 'mail.booking.admin',
            with: [
                'booking' => $this->booking,
                'kind' => $this->kind,
                'businessTz' => $businessTz,
                'businessWhen' => $this->businessTime(),
                'visitorTz' => $visitorTz !== $businessTz ? $visitorTz : null,
                'visitorWhen' => $this->booking->starts_at->copy()->setTimezone($visitorTz)->format('l j F, H:i'),
                'adminUrl' => rtrim((string) config('app.frontend_url', config('app.url')), '/').'/jundullah/bookings',
            ],
        );
    }

    private function businessTime(): string
    {
        return $this->booking->starts_at
            ->copy()
            ->setTimezone(Setting::get('booking_timezone', 'UTC'))
            ->format('D j M, H:i');
    }
}
