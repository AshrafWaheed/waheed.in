<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingAvailabilityRule;
use App\Models\BookingDateOverride;
use App\Models\BookingType;
use App\Models\Setting;
use App\Services\SlotService;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * The admin side of "when am I bookable": weekly hours, one-off exceptions, the
 * call type's own knobs, and the business timezone.
 *
 * The weekly grid is saved WHOLESALE — the payload is the complete new week and
 * it replaces every global rule in one transaction. That is deliberate: a grid
 * editor has no stable per-row identity (deleting Tuesday's second window and
 * adding one to Thursday is indistinguishable from editing it), and diffing ids
 * client-side to issue individual PATCHes is a great deal of machinery to end up
 * in the same place. The cost is that two admins editing at once would have a
 * last-writer-wins collision; with a single-admin panel that is not a real risk.
 */
class BookingSettingsController extends Controller
{
    /** Everything the availability screen renders, in one round trip. */
    public function index(SlotService $slots): JsonResponse
    {
        $type = BookingType::query()->orderBy('sort')->firstOrFail();

        return response()->json([
            'timezone' => $slots->timezone(),
            'use_freebusy' => Setting::get('booking_use_freebusy', '1') === '1',
            'timezones' => timezone_identifiers_list(),
            'rules' => BookingAvailabilityRule::query()
                ->whereNull('booking_type_id')
                ->orderBy('weekday')->orderBy('start_time')
                ->get(['id', 'weekday', 'start_time', 'end_time', 'is_active']),
            // Past dates are noise on this screen — they cannot affect anything.
            'overrides' => BookingDateOverride::query()
                ->where('date', '>=', CarbonImmutable::now($slots->timezone())->format('Y-m-d'))
                ->orderBy('date')
                ->get(['id', 'date', 'is_closed', 'start_time', 'end_time', 'note']),
            'type' => $type->only([
                'id', 'slug', 'name', 'description', 'duration_min', 'buffer_before',
                'buffer_after', 'min_notice_min', 'horizon_days', 'daily_cap', 'is_active',
            ]),
        ]);
    }

    /** Replace the whole weekly grid. */
    public function updateAvailability(Request $request): JsonResponse
    {
        $data = $request->validate([
            'rules' => ['present', 'array', 'max:100'],
            'rules.*.weekday' => ['required', 'integer', 'between:0,6'],
            'rules.*.start_time' => ['required', 'date_format:H:i'],
            'rules.*.end_time' => ['required', 'date_format:H:i', 'after:rules.*.start_time'],
        ], [
            'rules.*.end_time.after' => 'Each window must end after it starts.',
        ]);

        DB::transaction(function () use ($data) {
            BookingAvailabilityRule::query()->whereNull('booking_type_id')->delete();

            foreach ($data['rules'] as $rule) {
                BookingAvailabilityRule::create([
                    'booking_type_id' => null,
                    'weekday' => $rule['weekday'],
                    'start_time' => $rule['start_time'],
                    'end_time' => $rule['end_time'],
                    'is_active' => true,
                ]);
            }
        });

        return $this->index(app(SlotService::class));
    }

    /** Add a one-off exception — a closed day, or custom hours for a date. */
    public function storeOverride(Request $request): JsonResponse
    {
        $data = $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
            'is_closed' => ['required', 'boolean'],
            'start_time' => ['nullable', 'required_if:is_closed,false', 'date_format:H:i'],
            'end_time' => ['nullable', 'required_if:is_closed,false', 'date_format:H:i', 'after:start_time'],
            'note' => ['nullable', 'string', 'max:255'],
        ], [
            'start_time.required_if' => 'Custom hours need a start and end time.',
            'end_time.required_if' => 'Custom hours need a start and end time.',
            'end_time.after' => 'The window must end after it starts.',
        ]);

        // A closed day wins over custom hours, so storing both is contradictory
        // rather than additive — drop the times instead of keeping dead data.
        if ($data['is_closed']) {
            $data['start_time'] = null;
            $data['end_time'] = null;

            BookingDateOverride::query()->where('date', $data['date'])->delete();
        }

        BookingDateOverride::create($data);

        return $this->index(app(SlotService::class));
    }

    public function destroyOverride(BookingDateOverride $override): JsonResponse
    {
        $override->delete();

        return $this->index(app(SlotService::class));
    }

    /** The call type's scheduling knobs. */
    public function updateType(Request $request, BookingType $type): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'min:2', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'duration_min' => ['sometimes', 'integer', 'between:5,480'],
            'buffer_before' => ['sometimes', 'integer', 'between:0,240'],
            'buffer_after' => ['sometimes', 'integer', 'between:0,240'],
            'min_notice_min' => ['sometimes', 'integer', 'between:0,20160'],
            'horizon_days' => ['sometimes', 'integer', 'between:1,365'],
            'daily_cap' => ['sometimes', 'nullable', 'integer', 'between:1,50'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $type->update($data);

        return $this->index(app(SlotService::class));
    }

    /** Business timezone and whether Google's busy blocks are honoured. */
    public function updateSettings(Request $request): JsonResponse
    {
        $data = $request->validate([
            'timezone' => ['sometimes', 'string', Rule::in(timezone_identifiers_list())],
            'use_freebusy' => ['sometimes', 'boolean'],
        ]);

        if (isset($data['timezone'])) {
            Setting::put('booking_timezone', $data['timezone']);
        }

        if (array_key_exists('use_freebusy', $data)) {
            Setting::setFlag('booking_use_freebusy', $data['use_freebusy']);
        }

        return $this->index(app(SlotService::class));
    }

    /**
     * A read-only preview of what the weekly grid actually produces for the
     * next fortnight. The rules are simple individually and surprising in
     * combination — buffers, caps, notice and the real calendar all interact —
     * so the screen shows the result rather than asking the admin to picture it.
     */
    public function preview(SlotService $slots): JsonResponse
    {
        $tz = $slots->timezone();
        $type = BookingType::query()->orderBy('sort')->firstOrFail();
        $from = CarbonImmutable::now($tz)->startOfDay();

        $days = [];
        foreach ($slots->slots($type, $from, $from->addDays(13)) as $date => $instants) {
            $days[] = [
                'date' => $date,
                'count' => count($instants),
                'times' => array_map(
                    fn (CarbonImmutable $s) => $s->setTimezone($tz)->format('H:i'),
                    $instants,
                ),
            ];
        }

        return response()->json(['timezone' => $tz, 'days' => $days]);
    }
}
