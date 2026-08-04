<?php

namespace App\Jobs;

use App\Mail\BookingAdminMail;
use App\Mail\BookingMail;
use App\Models\Booking;
use App\Models\BookingEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Throwable;

/**
 * Send one booking email and write down what happened.
 *
 * Queued for a reason that is about the visitor, not about tidiness: SMTP to
 * an external host takes a second or two on a good day and can hang for thirty
 * on a bad one, and none of that belongs between someone pressing "Confirm" and
 * seeing their Meet link.
 *
 * ── The point of this job existing at all ───────────────────────────────────
 * Mail::send() tells nobody. This records `mail_sent` or `mail_failed` against
 * the booking, so the admin console can answer "did the confirmation actually
 * go out?" from data rather than from the absence of an exception in a log
 * nobody reads.
 *
 * Failure is swallowed after recording: a bounced confirmation must never
 * unwind a booking that genuinely exists on a real calendar.
 */
class SendBookingMail implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /** Widening gaps: a transient SMTP refusal is usually over within a minute. */
    public array $backoff = [10, 60, 180];

    public function __construct(
        public int $bookingId,
        public string $kind,          // confirmed | rescheduled | cancelled | reminder
        public string $audience = 'visitor', // visitor | admin
    ) {}

    public function handle(): void
    {
        $booking = Booking::with('bookingType')->find($this->bookingId);

        if (! $booking) {
            return; // hard-deleted between dispatch and run; nothing to say
        }

        $to = $this->audience === 'admin'
            ? config('services.booking.notify_to')
            : $booking->email;

        if (! $to) {
            // No admin address configured — not an error worth retrying, but
            // worth recording so the silence is explained.
            $booking->recordEvent(BookingEvent::MAIL_FAILED, [
                'kind' => $this->kind,
                'audience' => $this->audience,
                'message' => 'No recipient address configured.',
            ]);

            return;
        }

        $this->keepSmtpAlive();

        try {
            Mail::to($to)->send(
                $this->audience === 'admin'
                    ? new BookingAdminMail($booking, $this->kind)
                    : new BookingMail($booking, $this->kind),
            );

            $booking->recordEvent(
                $this->kind === BookingMail::REMINDER && $this->audience === 'visitor'
                    ? BookingEvent::REMINDER_SENT
                    : BookingEvent::MAIL_SENT,
                ['kind' => $this->kind, 'audience' => $this->audience, 'to' => $to],
            );
        } catch (Throwable $e) {
            Log::error('Booking mail failed', [
                'booking' => $booking->uid,
                'kind' => $this->kind,
                'audience' => $this->audience,
                'message' => $e->getMessage(),
            ]);

            $booking->recordEvent(BookingEvent::MAIL_FAILED, [
                'kind' => $this->kind,
                'audience' => $this->audience,
                'to' => $to,
                'message' => $e->getMessage(),
            ]);

            // Rethrow so the queue retries; the recorded event above means the
            // final failure is still visible if all three attempts fail.
            throw $e;
        }
    }

    /**
     * Stop the worker's SMTP connection going stale.
     *
     * A queue worker is a long-lived process, and Symfony's ESMTP transport
     * keeps its connection open between sends. Hostinger closes an idle one
     * server-side, so the next job inherits a socket that looks open and is
     * not — which surfaces as `421 4.4.2 timeout exceeded` on a perfectly valid
     * email. Observed in exactly that form on the first idle reminder.
     *
     * The ping threshold makes the transport check a connection it has not used
     * for 30 seconds and reconnect if it is dead; the restart threshold cycles
     * it every 20 messages so it never gets old enough to be dropped mid-batch.
     * Retries would eventually paper over this — they did — but a reminder that
     * arrives three minutes late for a call tomorrow is a worse outcome than
     * one connection check.
     */
    private function keepSmtpAlive(): void
    {
        $transport = Mail::mailer()->getSymfonyTransport();

        if ($transport instanceof EsmtpTransport) {
            $transport->setPingThreshold(30);
            $transport->setRestartThreshold(20, 1);
        }
    }
}
