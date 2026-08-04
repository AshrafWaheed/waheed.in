<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One recurring weekly window of availability — "Mondays, 10:00 to 13:00".
 *
 * `start_time` / `end_time` are WALL-CLOCK times in the business timezone
 * (`settings.booking_timezone`), never UTC. Storing them as instants would mean
 * the working day silently shifted by an hour whenever a DST boundary passed;
 * "I work 10 til 1" has to stay true across the year.
 *
 * A split day is two rows. A day with no rows is simply not bookable.
 */
class BookingAvailabilityRule extends Model
{
    /** 0 = Sunday, matching PHP's `w` / Carbon's `dayOfWeek`. */
    public const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    protected $fillable = [
        'booking_type_id',
        'weekday',
        'start_time',
        'end_time',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'weekday' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function bookingType(): BelongsTo
    {
        return $this->belongsTo(BookingType::class);
    }
}
