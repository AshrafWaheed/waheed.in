<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * One booked call.
 *
 * `starts_at` / `ends_at` are UTC instants. `visitor_tz` is kept so the
 * confirmation, the reminder and the admin console can each render the same
 * moment in the right person's local time without guessing later.
 *
 * TWO INVARIANTS, both enforced here rather than left to callers:
 *
 *   1. `slot_lock` holds "{type}:{starts_at}" while the booking is live and is
 *      NULL once it is cancelled. It carries a UNIQUE index, and because MySQL
 *      ignores NULLs in unique indexes, cancelling frees the slot for reuse
 *      while two simultaneous bookings of the same slot collide at the database.
 *      Always go through {@see markCancelled()} / {@see moveTo()} so the lock
 *      stays in step with `status`.
 *
 *   2. `manage_token` is the ONLY credential on the public reschedule/cancel
 *      page, so it is random and generated on create — never derived from the
 *      id, the email, or anything else guessable.
 */
class Booking extends Model
{
    use HasUlids;

    public const STATUS_CONFIRMED = 'confirmed';

    public const STATUS_CANCELLED = 'cancelled';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_NO_SHOW = 'no_show';

    protected $fillable = [
        'booking_type_id',
        'name',
        'email',
        'phone',
        'company',
        'message',
        'starts_at',
        'ends_at',
        'visitor_tz',
        'status',
        'slot_lock',
        'google_event_id',
        'google_html_link',
        'meet_url',
        'calendar_status',
        'manage_token',
        'source',
        'hubspot_status',
        'admin_note',
        'reminder_sent_at',
        'cancelled_at',
        'cancelled_by',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'reminder_sent_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    /** The ULID lives in `uid`; the primary key stays a plain auto-increment. */
    public function uniqueIds(): array
    {
        return ['uid'];
    }

    protected static function booted(): void
    {
        static::creating(function (self $booking) {
            $booking->manage_token ??= Str::random(64);
        });
    }

    public function bookingType(): BelongsTo
    {
        return $this->belongsTo(BookingType::class);
    }

    /** The audit trail, newest last — what the admin drawer renders. */
    public function events(): HasMany
    {
        return $this->hasMany(BookingEvent::class)->orderBy('created_at');
    }

    /** Append one row to the audit trail. The only way events are written. */
    public function recordEvent(string $kind, array $meta = []): BookingEvent
    {
        return $this->events()->create([
            'kind' => $kind,
            'meta' => $meta ?: null,
        ]);
    }

    /**
     * The value `slot_lock` must hold for a live booking at this time. Kept as
     * one function so the slot engine and the model can never disagree on the
     * format.
     */
    public static function lockFor(int $typeId, \DateTimeInterface $startsAt): string
    {
        return $typeId.':'.$startsAt->format('Y-m-d H:i:s');
    }

    public function isLive(): bool
    {
        return in_array($this->status, [self::STATUS_CONFIRMED, self::STATUS_COMPLETED], true);
    }

    /** Cancel, releasing the slot so someone else can take it. */
    public function markCancelled(string $by = 'visitor'): void
    {
        $this->forceFill([
            'status' => self::STATUS_CANCELLED,
            'slot_lock' => null,
            'cancelled_at' => now(),
            'cancelled_by' => $by,
        ])->save();
    }

    /**
     * Move to a new time, taking the new slot's lock with it. Throws on a
     * unique-constraint violation if that slot is already taken — which is the
     * intended behaviour, and the caller should turn it into a 409.
     */
    public function moveTo(\DateTimeInterface $startsAt, \DateTimeInterface $endsAt): void
    {
        $this->forceFill([
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'slot_lock' => self::lockFor($this->booking_type_id, $startsAt),
            'reminder_sent_at' => null, // a moved call earns a fresh reminder
        ])->save();
    }
}
