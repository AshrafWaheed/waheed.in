<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriberController extends Controller
{
    /** All newsletter subscribers (local mirror), newest first. */
    public function index(): AnonymousResourceCollection
    {
        return JsonResource::collection(
            Subscriber::query()->latest()->get()
        );
    }
}
