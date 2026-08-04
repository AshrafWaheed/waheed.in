<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * What can be booked. v1 ships a single row ("Clarity call · 30 min"), but the
 * table exists so a second offering never needs a migration.
 *
 * The scheduling knobs all live here rather than in `settings` because they are
 * per-offering by nature: a 15-minute intro and a 90-minute workshop want
 * different buffers, different notice and different horizons.
 */
class BookingType extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'duration_min',
        'buffer_before',
        'buffer_after',
        'min_notice_min',
        'horizon_days',
        'daily_cap',
        'location',
        'is_active',
        'sort',
    ];

    protected function casts(): array
    {
        return [
            'duration_min' => 'integer',
            'buffer_before' => 'integer',
            'buffer_after' => 'integer',
            'min_notice_min' => 'integer',
            'horizon_days' => 'integer',
            'daily_cap' => 'integer',
            'is_active' => 'boolean',
            'sort' => 'integer',
        ];
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /** Weekly windows specific to this type. Empty = it uses the global ones. */
    public function rules(): HasMany
    {
        return $this->hasMany(BookingAvailabilityRule::class);
    }

    /**
     * Total calendar footprint of one booking, buffers included. This — not
     * `duration_min` — is the step the slot grid advances by, otherwise two
     * adjacent slots would overlap each other's buffers.
     */
    public function blockMinutes(): int
    {
        return $this->buffer_before + $this->duration_min + $this->buffer_after;
    }
}
