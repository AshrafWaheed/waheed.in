<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactController extends Controller
{
    /** Paginated list of enquiries, newest first, with optional search. */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = ContactSubmission::query()->latest();

        $q = trim((string) $request->query('q', ''));
        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%")
                    ->orWhere('brand', 'like', "%{$q}%");
            });
        }

        $perPage = min(max((int) $request->query('per_page', 20), 1), 100);

        return JsonResource::collection($query->paginate($perPage)->withQueryString());
    }

    /** A single enquiry. */
    public function show(ContactSubmission $contact): JsonResponse
    {
        return response()->json(['data' => $contact]);
    }
}
