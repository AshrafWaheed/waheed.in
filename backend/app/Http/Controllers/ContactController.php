<?php

namespace App\Http\Controllers;

use App\Models\ContactSubmission;
use App\Models\Subscriber;
use App\Services\BeehiivService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Store a project enquiry and add the email to the Beehiiv newsletter list.
     * Beehiiv is best-effort here — a mailing-list hiccup must not lose the lead.
     */
    public function store(Request $request, BeehiivService $beehiiv): JsonResponse
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

        ContactSubmission::create([
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

        return response()->json(['ok' => true], 201);
    }
}
