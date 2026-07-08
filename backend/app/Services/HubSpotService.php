<?php

namespace App\Services;

use App\Models\ContactSubmission;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Pushes a contact-form lead into HubSpot CRM: upserts a Contact, finds-or-
 * creates a Company, opens a Deal, and associates all three.
 *
 * Best-effort and non-fatal, exactly like {@see BeehiivService}: the lead is
 * already saved in MySQL before this runs, so a HubSpot outage must never break
 * a submission. Every path returns a status string and never throws.
 */
class HubSpotService
{
    private const BASE = 'https://api.hubapi.com';

    /**
     * @return 'synced'|'failed'|'skipped'
     */
    public function syncLead(ContactSubmission $lead): string
    {
        $token = config('services.hubspot.token');
        if (! $token) {
            return 'skipped'; // not configured
        }

        try {
            $http = Http::withToken($token)->acceptJson()->timeout(15);

            $contactId = $this->upsertContact($http, $lead);
            if (! $contactId) {
                return 'failed';
            }

            $companyId = $this->findOrCreateCompany($http, $lead);
            $dealId = $this->createDeal($http, $lead);

            // Associate the three records using HubSpot's default association types.
            if ($dealId && $contactId) {
                $this->associate($http, 'deals', $dealId, 'contacts', $contactId);
            }
            if ($dealId && $companyId) {
                $this->associate($http, 'deals', $dealId, 'companies', $companyId);
            }
            if ($contactId && $companyId) {
                $this->associate($http, 'contacts', $contactId, 'companies', $companyId);
            }

            return 'synced';
        } catch (Throwable $e) {
            Log::error('HubSpot sync threw', ['message' => $e->getMessage()]);

            return 'failed';
        }
    }

    /** Create the contact, or update it if the email already exists (HTTP 409). */
    private function upsertContact(PendingRequest $http, ContactSubmission $lead): ?string
    {
        [$first, $last] = $this->splitName($lead->name);

        $props = array_filter([
            'email' => $lead->email,
            'firstname' => $first,
            'lastname' => $last,
            'phone' => $lead->whatsapp,
            'company' => $lead->brand,
            'hs_lead_status' => 'NEW',
        ], fn ($v) => $v !== null && $v !== '');

        $res = $http->post(self::BASE.'/crm/v3/objects/contacts', ['properties' => $props]);
        if ($res->successful()) {
            return (string) $res->json('id');
        }

        // Existing contact — HubSpot returns 409 with "Existing ID: <id>".
        if ($res->status() === 409 && preg_match('/Existing ID:\s*(\d+)/', $res->body(), $m)) {
            $existingId = $m[1];
            $http->patch(self::BASE."/crm/v3/objects/contacts/{$existingId}", ['properties' => $props]);

            return $existingId;
        }

        Log::warning('HubSpot contact upsert failed', ['status' => $res->status(), 'body' => $res->body()]);

        return null;
    }

    /** Look up a company by exact name; create it if none exists. */
    private function findOrCreateCompany(PendingRequest $http, ContactSubmission $lead): ?string
    {
        $name = trim((string) $lead->brand);
        if ($name === '') {
            return null;
        }

        $search = $http->post(self::BASE.'/crm/v3/objects/companies/search', [
            'filterGroups' => [[
                'filters' => [['propertyName' => 'name', 'operator' => 'EQ', 'value' => $name]],
            ]],
            'properties' => ['name'],
            'limit' => 1,
        ]);
        if ($search->successful() && ! empty($search->json('results'))) {
            return (string) $search->json('results.0.id');
        }

        $props = array_filter([
            'name' => $name,
            'phone' => $lead->whatsapp,
            'city' => $lead->location,
        ], fn ($v) => $v !== null && $v !== '');

        $res = $http->post(self::BASE.'/crm/v3/objects/companies', ['properties' => $props]);
        if ($res->successful()) {
            return (string) $res->json('id');
        }

        Log::warning('HubSpot company create failed', ['status' => $res->status(), 'body' => $res->body()]);

        return null;
    }

    private function createDeal(PendingRequest $http, ContactSubmission $lead): ?string
    {
        $props = array_filter([
            'dealname' => $this->dealName($lead),
            'pipeline' => config('services.hubspot.pipeline'),
            'dealstage' => config('services.hubspot.dealstage'),
            'amount' => $this->parseAmount($lead->budget),
            'description' => $this->dealDescription($lead),
        ], fn ($v) => $v !== null && $v !== '');

        $res = $http->post(self::BASE.'/crm/v3/objects/deals', ['properties' => $props]);
        if ($res->successful()) {
            return (string) $res->json('id');
        }

        Log::warning('HubSpot deal create failed', ['status' => $res->status(), 'body' => $res->body()]);

        return null;
    }

    /** Default (HubSpot-defined) association between two records. */
    private function associate(PendingRequest $http, string $fromType, string $fromId, string $toType, string $toId): void
    {
        $res = $http->put(self::BASE."/crm/v4/objects/{$fromType}/{$fromId}/associations/default/{$toType}/{$toId}");
        if (! $res->successful()) {
            Log::warning('HubSpot associate failed', [
                'from' => "{$fromType}/{$fromId}", 'to' => "{$toType}/{$toId}",
                'status' => $res->status(), 'body' => $res->body(),
            ]);
        }
    }

    /** @return array{0:string,1:?string} first + last name */
    private function splitName(string $name): array
    {
        $parts = preg_split('/\s+/', trim($name), 2) ?: [];

        return [$parts[0] ?? $name, $parts[1] ?? null];
    }

    private function dealName(ContactSubmission $lead): string
    {
        $brand = trim((string) $lead->brand);
        $service = trim((string) $lead->service);

        return $service !== '' ? "{$brand} — {$service}" : ($brand !== '' ? $brand : "Lead: {$lead->email}");
    }

    /** Extract the first number from a free-text budget (e.g. "$5,000–$10,000" → 5000). */
    private function parseAmount(?string $budget): ?string
    {
        if (! $budget) {
            return null;
        }
        if (preg_match('/(\d[\d,]*)/', $budget, $m)) {
            return str_replace(',', '', $m[1]);
        }

        return null;
    }

    /** All the lead context that has no native deal field, kept in the description. */
    private function dealDescription(ContactSubmission $lead): string
    {
        $custom = is_array($lead->custom_services) ? implode(', ', $lead->custom_services) : '';

        $lines = array_filter([
            $lead->service ? "Service: {$lead->service}" : null,
            $custom !== '' ? "Custom services: {$custom}" : null,
            $lead->stage ? "Stage: {$lead->stage}" : null,
            $lead->budget ? "Budget: {$lead->budget}" : null,
            $lead->timeline ? "Timeline: {$lead->timeline}" : null,
            $lead->location ? "Location: {$lead->location}" : null,
            $lead->message ? "\nMessage:\n{$lead->message}" : null,
        ]);

        return implode("\n", $lines);
    }
}
