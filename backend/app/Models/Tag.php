<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Tag extends Model
{
    protected $fillable = ['name', 'slug'];

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }

    /**
     * Map a list of display names to tag ids, creating any that don't exist.
     *
     * @param  array<int, string>  $names
     * @return array<int, int>
     */
    public static function idsForNames(array $names): array
    {
        $ids = [];

        foreach ($names as $name) {
            $name = trim($name);
            if ($name === '') {
                continue;
            }
            $slug = Str::slug($name);
            if ($slug === '') {
                continue;
            }
            $tag = static::firstOrCreate(['slug' => $slug], ['name' => $name]);
            $ids[$tag->id] = $tag->id;
        }

        return array_values($ids);
    }
}
