<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class BeehiivService
{
    /**
     * Add (or reactivate) an email on the Beehiiv publication.
     *
     * Best-effort and non-fatal: returns a status string the caller can persist.
     * Never throws — a Beehiiv outage must not break a form submission.
     *
     * @return 'synced'|'failed'|'skipped'
     */
    public function subscribe(string $email, string $utmSource = 'waheed.in'): string
    {
        $key = config('services.beehiiv.key');
        $pubId = config('services.beehiiv.publication_id');

        if (! $key || ! $pubId) {
            return 'skipped'; // not configured
        }

        try {
            $res = Http::withToken($key)
                ->acceptJson()
                ->timeout(10)
                ->post("https://api.beehiiv.com/v2/publications/{$pubId}/subscriptions", [
                    'email' => $email,
                    'reactivate_existing' => true,
                    'send_welcome_email' => true,
                    'utm_source' => $utmSource,
                    'referring_site' => 'waheed.in',
                ]);

            if ($res->successful()) {
                return 'synced';
            }

            Log::warning('Beehiiv subscribe failed', [
                'status' => $res->status(),
                'body' => $res->body(),
            ]);

            return 'failed';
        } catch (Throwable $e) {
            Log::error('Beehiiv subscribe threw', ['message' => $e->getMessage()]);

            return 'failed';
        }
    }
}
