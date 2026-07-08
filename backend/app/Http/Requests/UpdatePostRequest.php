<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    /** Route middleware (auth:sanctum + admin) already gated this. */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Partial updates allowed: only validate the fields that are present.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $postId = $this->route('post')?->id;

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', 'alpha_dash', Rule::unique('posts', 'slug')->ignore($postId)],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body_html' => ['sometimes', 'required', 'string'],
            'cover_image' => ['nullable', 'string', 'max:2048'],
            'status' => ['sometimes', Rule::in(['draft', 'published'])],
            'category' => ['sometimes', 'nullable', 'string', 'max:255'],
            'tags' => ['sometimes', 'nullable', 'array', 'max:20'],
            'tags.*' => ['string', 'max:50'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_desc' => ['nullable', 'string', 'max:500'],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
