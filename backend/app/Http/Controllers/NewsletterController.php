<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use App\Services\BeehiivService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    /**
     * Subscribe an email to the Beehiiv newsletter list (source of truth) and
     * mirror it locally. If Beehiiv is configured but rejects the request, we
     * still record the attempt but return an error so the visitor can retry.
     */
    public function store(Request $request, BeehiivService $beehiiv): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $email = strtolower(trim($data['email']));

        $status = $beehiiv->subscribe($email);
        Subscriber::record($email, 'newsletter', $status);

        if ($status === 'failed') {
            return response()->json(['error' => 'Subscription failed, please try again.'], 502);
        }

        return response()->json(['ok' => true], 201);
    }
}
