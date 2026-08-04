<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Services\BookingMailer;
use Illuminate\Console\Command;

/**
 * Emails a reminder for calls coming up inside the reminder window.
 *
 * Run hourly. The window is "starts within the next N hours and has not been
 * reminded yet", which is deliberately not "starts in exactly N hours": an
 * hourly cron that misses a tick — a reboot, a slow deploy, a queue backlog —
 * would silently skip a whole day's reminders under an exact-match rule. A
 * catch-up window sends late rather than not at all, and late beats silent.
 *
 * `reminder_sent_at` is the guard against duplicates, and {@see Booking::moveTo}
 * clears it, so a rescheduled call correctly earns a fresh reminder.
 */
class SendBookingReminders extends Command
{
    protected $signature = 'bookings:remind {--dry : List what would be sent without sending}';

    protected $description = 'Email reminders for calls starting soon';

    public function handle(BookingMailer $mailer): int
    {
        $hours = (int) config('services.booking.reminder_hours', 24);

        $due = Booking::query()
            ->with('bookingType')
            ->where('status', Booking::STATUS_CONFIRMED)
            ->whereNull('reminder_sent_at')
            ->where('starts_at', '>', now())
            ->where('starts_at', '<=', now()->addHours($hours))
            ->orderBy('starts_at')
            ->get();

        if ($due->isEmpty()) {
            $this->info("No reminders due (window: next {$hours}h).");

            return self::SUCCESS;
        }

        foreach ($due as $booking) {
            $when = $booking->starts_at->format('D j M H:i');

            if ($this->option('dry')) {
                $this->line("would remind {$booking->email} about {$when} UTC");

                continue;
            }

            $mailer->reminder($booking);

            // Stamped on dispatch, not on delivery: if the queue is down we
            // would otherwise re-dispatch the same reminder every hour, and a
            // customer receiving twelve copies is worse than receiving none.
            $booking->forceFill(['reminder_sent_at' => now()])->save();

            $this->line("reminded {$booking->email} about {$when} UTC");
        }

        $this->info(($this->option('dry') ? 'Would send ' : 'Queued ').$due->count().' reminder(s).');

        return self::SUCCESS;
    }
}
