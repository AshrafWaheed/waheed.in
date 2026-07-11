<?php

namespace App\Http\Controllers;

use App\Models\ContactSubmission;
use App\Models\Subscriber;
use App\Services\BeehiivService;
use App\Services\HubSpotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContactController extends Controller
{
    /**
     * Store a project enquiry, add the email to the Beehiiv newsletter list, and
     * sync the lead into HubSpot (contact + company + deal). Both integrations
     * are best-effort — an outage must not lose the lead already saved to MySQL.
     */
    public function store(Request $request, BeehiivService $beehiiv, HubSpotService $hubspot): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'brand' => ['required', 'string', 'min:2', 'max:255'],
            // Optional, but if given must be a real phone number (≥7 digits,
            // only + and common separators) — rejects "abc".
            'phone' => ['nullable', 'string', 'max:30', 'regex:/^\+?(?:\d[\s().-]*){7,}$/'],
            'location' => ['nullable', 'string', 'max:255'],
            'service' => ['required', 'string', 'max:255'],
            // Required (≥1) only when the "Custom" package is chosen.
            'customServices' => ['array', 'max:50', Rule::requiredIf(fn () => $request->input('service') === 'Custom')],
            'customServices.*' => ['string', 'max:255'],
            'stage' => ['nullable', 'string', 'max:255'],
            'budget' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'timeline' => ['nullable', 'string', 'max:255'],
            'consent' => ['accepted'],
        ], [
            'phone.regex' => 'Please enter a valid phone number.',
            'consent.accepted' => 'Please confirm you agree to our values-based working guidelines.',
            'customServices.required' => 'Please choose at least one service.',
            'message.min' => 'Please tell us a little more about your project (at least 10 characters).',
        ]);

        $email = strtolower(trim($data['email']));

        $submission = ContactSubmission::create([
            'name' => $data['name'],
            'email' => $email,
            'brand' => $data['brand'],
            'phone' => $data['phone'] ?? null,
            'location' => $data['location'] ?? null,
            'service' => $data['service'],
            'custom_services' => $data['customServices'] ?? [],
            'stage' => $data['stage'] ?? null,
            'budget' => $data['budget'] ?? null,
            'message' => $data['message'],
            'timeline' => $data['timeline'] ?? null,
        ]);

        $status = $beehiiv->subscribe($email);
        Subscriber::record($email, 'contact', $status);

        $hubspotStatus = $hubspot->syncLead($submission);
        $submission->update(['hubspot_status' => $hubspotStatus]);

        return response()->json(['ok' => true], 201);
    }
}
