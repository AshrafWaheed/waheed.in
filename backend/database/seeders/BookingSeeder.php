<?php

namespace Database\Seeders;

use App\Models\BookingAvailabilityRule;
use App\Models\BookingType;
use App\Models\Setting;
use Illuminate\Database\Seeder;

/**
 * Boots the booking module with something workable rather than an empty
 * calendar: one call type and a sane Mon–Fri week, all of it editable from the
 * admin console afterwards.
 *
 * Idempotent — every write is an updateOrCreate/firstOrCreate, so re-running it
 * after the admin has changed the hours will not stamp on their edits.
 */
class BookingSeeder extends Seeder
{
    public function run(): void
    {
        // The business timezone. THE only place a local zone exists server-side;
        // everything else stores UTC and converts against this.
        Setting::query()->firstOrCreate(
            ['key' => 'booking_timezone'],
            ['value' => 'Asia/Kolkata'],
        );

        // Whether the slot engine also subtracts the real Google Calendar's busy
        // blocks. On until someone deliberately turns it off.
        Setting::query()->firstOrCreate(
            ['key' => 'booking_use_freebusy'],
            ['value' => '1'],
        );

        $type = BookingType::query()->firstOrCreate(
            ['slug' => 'clarity-call'],
            [
                'name' => 'Clarity call',
                'description' => 'A 30-minute call to understand what you are building, '
                    .'what it has to do, and whether we are the right people to build it. '
                    .'No pitch deck, no obligation.',
                'duration_min' => 30,
                'buffer_before' => 0,
                'buffer_after' => 10,
                // Four hours' notice, so nobody books a call that starts before
                // the confirmation email has been read.
                'min_notice_min' => 240,
                'horizon_days' => 30,
                'daily_cap' => 4,
                'location' => 'meet',
                'is_active' => true,
                'sort' => 0,
            ],
        );

        // Monday–Friday, split around midday. Weekday numbering is Carbon's:
        // 0 = Sunday. Global rules (null type) apply to every booking type.
        if (BookingAvailabilityRule::query()->doesntExist()) {
            foreach ([1, 2, 3, 4, 5] as $weekday) {
                foreach ([['10:00', '13:00'], ['15:00', '18:00']] as [$start, $end]) {
                    BookingAvailabilityRule::query()->create([
                        'booking_type_id' => null,
                        'weekday' => $weekday,
                        'start_time' => $start,
                        'end_time' => $end,
                        'is_active' => true,
                    ]);
                }
            }
        }

        $this->command?->info("Booking module seeded — type #{$type->id} ({$type->slug}), Mon–Fri 10:00–13:00 & 15:00–18:00 Asia/Kolkata.");
    }
}
