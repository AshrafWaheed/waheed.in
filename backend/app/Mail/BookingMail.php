<?php

namespace App\Mail;

use App\Models\Booking;
use App\Models\Setting;
use App\Support\Ics;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Every booking email the visitor receives, in one Mailable parameterised by
 * `kind`.
 *
 * Four near-identical classes differing only in a subject line and a template
 * name would be four places to forget the .ics, the timezone handling and the
 * manage link. The differences that actually matter live in {@see SUBJECTS} and
 * the Blade view; everything structural is shared here by construction.
 *
 * The times are rendered in the RECIPIENT's timezone, recorded at booking time.
 * A confirmation that states a time in the sender's zone is the single most
 * effective way to make someone miss a call.
 */
class BookingMail extends Mailable
{
    use Queueable, SerializesModels;

    public const CONFIRMED = 'confirmed';

    public const RESCHEDULED = 'rescheduled';

    public const CANCELLED = 'cancelled';

    public const REMINDER = 'reminder';

    private const SUBJECTS = [
        self::CONFIRMED => 'Your call with WAHEED is booked — :when',
        self::RESCHEDULED => 'Your call with WAHEED has moved — :when',
        self::CANCELLED => 'Your call with WAHEED has been cancelled',
        self::REMINDER => 'Tomorrow: your call with WAHEED — :when',
    ];

    public function __construct(
        public Booking $booking,
        public string $kind,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: str_replace(':when', $this->localShort(), self::SUBJECTS[$this->kind]),
            // Replies go to a human, not to the no-reply-ish from address.
            replyTo: [config('mail.from.address')],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.booking.'.$this->kind,
            with: [
                'booking' => $this->booking,
                'when' => $this->localLong(),
                'tz' => $this->tz(),
                'manageUrl' => url('/book/manage/'.$this->booking->manage_token),
                'bookUrl' => url('/book'),
            ],
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        // A cancellation carries a CANCEL .ics so the event disappears from the
        // recipient's calendar instead of lingering as a meeting nobody attends.
        $method = $this->kind === self::CANCELLED ? 'CANCEL' : 'REQUEST';

        // A reminder deliberately carries nothing: the event is already in their
        // calendar, and a second .ics for the same UID invites a duplicate.
        if ($this->kind === self::REMINDER) {
            return [];
        }

        return [
            Attachment::fromData(fn () => Ics::forBooking($this->booking, $method), 'waheed-call.ics')
                ->withMime('text/calendar'),
        ];
    }

    /** The recipient's own zone, falling back to ours, then UTC. */
    private function tz(): string
    {
        $tz = $this->booking->visitor_tz ?: Setting::get('booking_timezone', 'UTC');

        return in_array($tz, timezone_identifiers_list(), true) ? $tz : 'UTC';
    }

    private function localLong(): string
    {
        return $this->booking->starts_at->copy()->setTimezone($this->tz())->format('l j F Y \a\t H:i');
    }

    private function localShort(): string
    {
        return $this->booking->starts_at->copy()->setTimezone($this->tz())->format('D j M, H:i');
    }
}
