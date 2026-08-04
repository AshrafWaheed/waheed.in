<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Simple key-value store for site-wide settings. Currently holds the two
 * site-mode flags (coming_soon, maintenance) read by the Next.js proxy.
 */
class Setting extends Model
{
    protected $primaryKey = 'key';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['key', 'value'];

    /** Read a boolean flag (defaults to false when unset). */
    public static function flag(string $key): bool
    {
        return static::query()->where('key', $key)->value('value') === '1';
    }

    /** Write a boolean flag. */
    public static function setFlag(string $key, bool $value): void
    {
        static::query()->updateOrCreate(
            ['key' => $key],
            ['value' => $value ? '1' : '0'],
        );
    }

    /** Read a plain string setting (booking timezone, etc.). */
    public static function get(string $key, ?string $default = null): ?string
    {
        $value = static::query()->where('key', $key)->value('value');

        return $value === null || $value === '' ? $default : $value;
    }

    /** Write a plain string setting. */
    public static function put(string $key, string $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
