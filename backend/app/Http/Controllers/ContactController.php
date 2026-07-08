<?php

namespace App\Http\Controllers;

use App\Models\ContactSubmission;
use App\Models\Subscriber;
use App\Services\BeehiivService;
use App\Services\HubSpotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'brand' => ['required', 'string', 'max:255'],
            'whatsapp' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:255'],
            'service' => ['required', 'string', 'max:255'],
            'customServices' => ['nullable', 'array', 'max:50'],
            'customServices.*' => ['string', 'max:255'],
            'stage' => ['nullable', 'string', 'max:255'],
            'budget' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'timeline' => ['nullable', 'string', 'max:255'],
        ]);

        $email = strtolower(trim($data['email']));

        $submission = ContactSubmission::create([
            'name' => $data['name'],
            'email' => $email,
            'brand' => $data['brand'],
            'whatsapp' => $data['whatsapp'] ?? null,
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
