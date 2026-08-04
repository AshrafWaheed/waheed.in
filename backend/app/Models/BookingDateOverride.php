<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * An exception to the weekly rules for one calendar date.
 *
 *   is_closed = true   → the day is blocked outright; the time columns are
 *                        ignored. ("Eid", "travelling".)
 *   is_closed = false  → this row REPLACES the weekly windows for that date.
 *                        Several rows give several windows, same as the rules.
 *
 * A closed row always wins: if a date has both, the day is shut. That way
 * blocking a day is one insert and never requires deleting the custom hours
 * someone set earlier.
 *
 * Times are wall-clock in the business timezone, exactly as in
 * {@see BookingAvailabilityRule}.
 */
class BookingDateOverride extends Model
{
    protected $fillable = [
        'date',
        'is_closed',
        'start_time',
        'end_time',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_closed' => 'boolean',
        ];
    }
}
