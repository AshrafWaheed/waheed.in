<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
 * Booking reminders.
 *
 * Hourly rather than daily: the command sends for anything inside the reminder
 * window that has not been reminded yet, so an hourly tick means a booking made
 * late in the day still gets its reminder, and a missed tick catches up on the
 * next one instead of skipping a day.
 *
 * `withoutOverlapping` matters because the queue is where the real work lands —
 * two overlapping runs would double-dispatch anything the first had not yet
 * stamped.
 *
 * Requires a cron entry:
 *   * * * * * cd /var/www/waheed.in/backend && php artisan schedule:run >> /dev/null 2>&1
 */
Schedule::command('bookings:remind')
    ->hourly()
    ->withoutOverlapping()
    ->runInBackground();

/*
 * Failed jobs pile up silently otherwise; a week is long enough to notice a
 * mail outage and short enough that the table never becomes a problem.
 */
Schedule::command('queue:prune-failed --hours=168')->weekly();
