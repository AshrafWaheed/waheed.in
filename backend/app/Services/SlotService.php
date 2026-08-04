<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\BookingAvailabilityRule;
use App\Models\BookingDateOverride;
use App\Models\BookingType;
use App\Models\Setting;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * Works out which start times a visitor may actually book.
 *
 * The whole module's correctness lives here, so the rules are stated once,
 * explicitly:
 *
 * ── Timezones ───────────────────────────────────────────────────────────────
 * Availability is authored as WALL-CLOCK time in the business timezone ("I work
 * 10 til 1"), and stored that way. It is converted to UTC instants per calendar
 * date, at the moment it is used — never cached as instants. That is what keeps
 * the working day fixed when a DST boundary passes: 10:00 stays 10:00 locally
 * and moves in UTC, which is the behaviour a human expects and a stored instant
 * would get backwards. Everything this class RETURNS is UTC.
 *
 * ── Buffers ─────────────────────────────────────────────────────────────────
 * A candidate slot does not occupy `duration` minutes, it occupies
 * `buffer_before + duration + buffer_after`. Conflict tests use that padded
 * interval on BOTH sides, so two calls can sit exactly one grid step apart and
 * no closer. The meeting itself, however, must fit inside the availability
 * window without its buffers — a 10-minute tail is dead time, not work, and
 * refusing a 12:30 slot because its buffer crosses 13:00 would cost a bookable
 * call for no reason.
 *
 * ── Degradation ─────────────────────────────────────────────────────────────
 * If Google is unreachable, {@see GoogleCalendarService::freeBusy()} returns []
 * and slots are computed from the local bookings table alone. An empty calendar
 * loses a customer outright; a double-booking costs one apology. The trade is
 * deliberate.
 */
class SlotService
{
    public function __construct(private readonly GoogleCalendarService $calendar) {}

    /** The business timezone — the one place a local zone exists server-side. */
    public function timezone(): string
    {
        return Setting::get('booking_timezone', 'Asia/Kolkata');
    }

    private function useFreeBusy(): bool
    {
        return Setting::get('booking_use_freebusy', '1') === '1';
    }

    /**
     * Bookable start times for a date range, grouped by calendar date in the
     * business timezone.
     *
     * Everything is loaded up front — rules, overrides, live bookings, one
     * freebusy call for the whole span — so paging a month is a constant number
     * of queries rather than one per day.
     *
     * @return array<string, array<int, CarbonImmutable>>  'Y-m-d' => UTC instants
     */
    public function slots(BookingType $type, CarbonImmutable $from, CarbonImmutable $to): array
    {
        $tz = $this->timezone();
        $now = CarbonImmutable::now();

        // Clamp the request to what the type actually allows, so a crafted
        // ?to=2099 cannot make us expand ten thousand days of windows.
        $earliest = $now->addMinutes($type->min_notice_min);
        $latest = $now->addDays($type->horizon_days)->endOfDay();

        $from = $from->setTimezone($tz)->startOfDay();
        $to = $to->setTimezone($tz)->endOfDay();

        if ($to->lessThan($earliest) || $from->greaterThan($latest)) {
            return [];
        }

        $rules = $this->rulesFor($type);
        $overrides = $this->overridesBetween($from, $to);
        $booked = $this->liveBookingsBetween($from->utc(), $to->utc());
        $busy = $this->useFreeBusy()
            ? $this->calendar->freeBusy($from->utc(), $to->utc())
            : [];

        $out = [];

        for ($day = $from; $day->lessThanOrEqualTo($to); $day = $day->addDay()) {
            $key = $day->format('Y-m-d');
            $windows = $this->windowsFor($day, $tz, $rules, $overrides->get($key, collect()));

            if ($windows === []) {
                continue;
            }

            $slots = [];

            foreach ($windows as [$windowStart, $windowEnd]) {
                $cursor = $windowStart;

                // The meeting must fit; its trailing buffer need not.
                while ($cursor->addMinutes($type->duration_min)->lessThanOrEqualTo($windowEnd)) {
                    $start = $cursor->utc();

                    if ($start->greaterThanOrEqualTo($earliest)
                        && $start->lessThanOrEqualTo($latest)
                        && ! $this->conflicts($type, $start, $booked, $busy)) {
                        $slots[] = $start;
                    }

                    $cursor = $cursor->addMinutes($type->blockMinutes());
                }
            }

            // A day already at its cap offers nothing, however much room is left.
            if ($type->daily_cap !== null) {
                $taken = $booked->filter(
                    fn (Booking $b) => $b->starts_at->copy()->setTimezone($tz)->format('Y-m-d') === $key
                )->count();

                if ($taken >= $type->daily_cap) {
                    continue;
                }
            }

            if ($slots !== []) {
                $out[$key] = $slots;
            }
        }

        return $out;
    }

    /**
     * Is this exact start time bookable right now?
     *
     * Called at submit time, because the visitor's slot list may be minutes old
     * by the time they finish typing. This is the honest check — but it is NOT
     * the thing that prevents double-booking. Two requests can both pass here
     * microseconds apart; the unique index on `bookings.slot_lock` is what
     * actually decides, and the caller must be ready for it to throw.
     */
    public function isAvailable(BookingType $type, CarbonImmutable $start): bool
    {
        $tz = $this->timezone();
        $local = $start->setTimezone($tz);
        $day = $local->startOfDay();

        $slots = $this->slots($type, $day, $day);

        foreach ($slots[$local->format('Y-m-d')] ?? [] as $candidate) {
            if ($candidate->equalTo($start)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Weekly rules that apply to this type. A type with rules of its own uses
     * ONLY those; otherwise it inherits the global (null-type) set. Mixing the
     * two would make "give this call type its own narrower hours" impossible to
     * express, since the global rows would keep re-widening it.
     *
     * @return Collection<int, Collection<int, BookingAvailabilityRule>> keyed by weekday
     */
    private function rulesFor(BookingType $type): Collection
    {
        $own = BookingAvailabilityRule::query()
            ->where('is_active', true)
            ->where('booking_type_id', $type->id)
            ->get();

        $rules = $own->isNotEmpty()
            ? $own
            : BookingAvailabilityRule::query()
                ->where('is_active', true)
                ->whereNull('booking_type_id')
                ->get();

        return $rules->groupBy('weekday');
    }

    /** @return Collection<string, Collection<int, BookingDateOverride>> keyed by 'Y-m-d' */
    private function overridesBetween(CarbonImmutable $from, CarbonImmutable $to): Collection
    {
        return BookingDateOverride::query()
            ->whereBetween('date', [$from->format('Y-m-d'), $to->format('Y-m-d')])
            ->get()
            ->groupBy(fn (BookingDateOverride $o) => $o->date->format('Y-m-d'));
    }

    /** @return Collection<int, Booking> */
    private function liveBookingsBetween(CarbonImmutable $from, CarbonImmutable $to): Collection
    {
        return Booking::query()
            ->whereIn('status', [Booking::STATUS_CONFIRMED, Booking::STATUS_COMPLETED])
            // Widened by a day either side so a booking that starts just outside
            // the range but whose buffer reaches into it still blocks.
            ->whereBetween('starts_at', [$from->subDay(), $to->addDay()])
            ->get();
    }

    /**
     * The open windows on one calendar date, as UTC instant pairs.
     *
     * Overrides beat the weekly rules outright: a closed row shuts the day
     * whatever else is set, and any open override rows REPLACE the day's
     * windows rather than adding to them.
     *
     * @param  Collection<int, Collection<int, BookingAvailabilityRule>>  $rules
     * @param  Collection<int, BookingDateOverride>  $dayOverrides
     * @return array<int, array{0: CarbonImmutable, 1: CarbonImmutable}>
     */
    private function windowsFor(
        CarbonImmutable $day,
        string $tz,
        Collection $rules,
        Collection $dayOverrides,
    ): array {
        if ($dayOverrides->contains(fn (BookingDateOverride $o) => $o->is_closed)) {
            return [];
        }

        $source = $dayOverrides->isNotEmpty()
            ? $dayOverrides->filter(fn (BookingDateOverride $o) => $o->start_time && $o->end_time)
            : ($rules->get($day->dayOfWeek) ?? collect());

        $windows = [];

        foreach ($source as $row) {
            $start = $this->at($day, $row->start_time, $tz);
            $end = $this->at($day, $row->end_time, $tz);

            // A window that ends before it starts is a data-entry error, not a
            // window that wraps past midnight. Skip it rather than generating
            // slots at 3am.
            if ($end->greaterThan($start)) {
                $windows[] = [$start, $end];
            }
        }

        usort($windows, fn ($a, $b) => $a[0] <=> $b[0]);

        return $this->merge($windows);
    }

    /**
     * Collapse overlapping or touching windows into one.
     *
     * This is not tidying — it is required for correctness. Each window is
     * sliced into its own grid starting at its own edge, so two windows that
     * overlap produce two grids out of phase with each other: 10:00–16:30 plus
     * 15:00–16:30 offers 15:00, 15:20 and 15:40 as separate slots, and the
     * first two collide for any call longer than 20 minutes. The admin screen
     * cannot prevent the input either — "Wednesday 10–16:30" and a leftover
     * "15:00–16:30" is an ordinary editing slip — so the engine has to be the
     * thing that copes.
     *
     * Touching windows (13:00–15:00 after 10:00–13:00) merge too, giving one
     * continuous grid rather than a phase reset at the seam.
     *
     * @param  array<int, array{0: CarbonImmutable, 1: CarbonImmutable}>  $windows  sorted by start
     * @return array<int, array{0: CarbonImmutable, 1: CarbonImmutable}>
     */
    private function merge(array $windows): array
    {
        $merged = [];

        foreach ($windows as [$start, $end]) {
            $last = count($merged) - 1;

            if ($last >= 0 && $start->lessThanOrEqualTo($merged[$last][1])) {
                if ($end->greaterThan($merged[$last][1])) {
                    $merged[$last][1] = $end;
                }

                continue;
            }

            $merged[] = [$start, $end];
        }

        return $merged;
    }

    /**
     * Pin a wall-clock time to a calendar date in a given zone.
     *
     * The `H:i:s` is re-parsed rather than trusted as-is because MySQL TIME
     * columns come back in a couple of shapes depending on driver and cast.
     */
    private function at(CarbonImmutable $day, string $time, string $tz): CarbonImmutable
    {
        [$h, $m] = array_pad(explode(':', $time), 2, '0');

        return $day->setTimezone($tz)->setTime((int) $h, (int) $m, 0);
    }

    /**
     * Does a candidate start collide with anything already on the calendar?
     *
     * The candidate is padded by its buffers on both sides; existing bookings
     * are padded the same way; Google's busy blocks are taken raw, since the
     * padded candidate already keeps its distance from them.
     *
     * @param  Collection<int, Booking>  $booked
     * @param  array<int, array{0: CarbonImmutable, 1: CarbonImmutable}>  $busy
     */
    private function conflicts(BookingType $type, CarbonImmutable $start, Collection $booked, array $busy): bool
    {
        $padStart = $start->subMinutes($type->buffer_before);
        $padEnd = $start->addMinutes($type->duration_min + $type->buffer_after);

        foreach ($booked as $booking) {
            $bStart = CarbonImmutable::instance($booking->starts_at)->subMinutes($type->buffer_before);
            $bEnd = CarbonImmutable::instance($booking->ends_at)->addMinutes($type->buffer_after);

            if ($padStart->lessThan($bEnd) && $padEnd->greaterThan($bStart)) {
                return true;
            }
        }

        foreach ($busy as [$bStart, $bEnd]) {
            if ($padStart->lessThan($bEnd) && $padEnd->greaterThan($bStart)) {
                return true;
            }
        }

        return false;
    }
}
