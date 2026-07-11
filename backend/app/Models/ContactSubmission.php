<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    protected $fillable = [
        'name',
        'email',
        'brand',
        'phone',
        'location',
        'service',
        'custom_services',
        'stage',
        'budget',
        'message',
        'timeline',
        'hubspot_status',
    ];

    protected function casts(): array
    {
        return [
            'custom_services' => 'array',
        ];
    }
}
