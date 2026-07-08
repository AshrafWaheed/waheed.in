<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscriber extends Model
{
    protected $fillable = [
        'email',
        'source',
        'beehiiv_status',
    ];

    /**
     * Record (or update) a subscriber by email. First source seen is kept;
     * beehiiv_status is refreshed on each touch.
     */
    public static function record(string $email, string $source, ?string $beehiivStatus): self
    {
        $sub = static::firstOrNew(['email' => $email]);
        if (! $sub->exists) {
            $sub->source = $source;
        }
        $sub->beehiiv_status = $beehiivStatus;
        $sub->save();

        return $sub;
    }
}
