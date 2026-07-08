<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Public, unauthenticated: the current site mode. Read by the Next.js proxy
     * on every request (cached there), so it must stay cheap and never fail.
     */
    public function mode(): JsonResponse
    {
        return response()->json($this->modePayload());
    }

    /** Admin: current site mode (same shape as the public endpoint). */
    public function show(): JsonResponse
    {
        return response()->json($this->modePayload());
    }

    /** Admin: toggle the coming-soon / maintenance flags. */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'coming_soon' => ['sometimes', 'boolean'],
            'maintenance' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('coming_soon', $data)) {
            Setting::setFlag('coming_soon', (bool) $data['coming_soon']);
        }
        if (array_key_exists('maintenance', $data)) {
            Setting::setFlag('maintenance', (bool) $data['maintenance']);
        }

        return response()->json($this->modePayload());
    }

    private function modePayload(): array
    {
        return [
            'coming_soon' => Setting::flag('coming_soon'),
            'maintenance' => Setting::flag('maintenance'),
        ];
    }
}
