<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One line of a booking's history. Append-only: rows are written by
 * {@see Booking::recordEvent()} and never updated or deleted, which is why the
 * model turns `updated_at` off.
 *
 * This table is the answer to "did the confirmation actually send?" — the mail
 * result is recorded here, not inferred from the absence of an exception.
 */
class BookingEvent extends Model
{
    public const UPDATED_AT = null;

    public const CREATED = 'created';

    public const RESCHEDULED = 'rescheduled';

    public const CANCELLED = 'cancelled';

    public const MAIL_SENT = 'mail_sent';

    public const MAIL_FAILED = 'mail_failed';

    public const REMINDER_SENT = 'reminder_sent';

    public const CALENDAR_SYNCED = 'calendar_synced';

    public const CALENDAR_FAILED = 'calendar_failed';

    public const HUBSPOT_SYNCED = 'hubspot_synced';

    public const HUBSPOT_FAILED = 'hubspot_failed';

    protected $fillable = ['kind', 'meta'];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
