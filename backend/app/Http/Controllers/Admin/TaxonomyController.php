<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;

class TaxonomyController extends Controller
{
    /** All categories + tags (name/slug), for editor autocomplete. */
    public function index(): JsonResponse
    {
        return response()->json([
            'categories' => Category::orderBy('name')->get(['name', 'slug']),
            'tags' => Tag::orderBy('name')->get(['name', 'slug']),
        ]);
    }
}
