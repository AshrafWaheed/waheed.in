<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * The one connected Google account whose calendar the bookings land on.
 *
 * Single-tenant by design: visitors never authenticate with Google. One admin
 * connects `ashraf@waheed.in` once, and its refresh token is used server-side
 * from then on. There is exactly one row; {@see current()} is how everything
 * reaches it.
 *
 * Both tokens use the `encrypted` cast, so `APP_KEY` — not the database — is
 * what protects them. A restored dump on a box with a different APP_KEY will
 * fail to decrypt, which is correct: reconnect rather than move ciphertext.
 */
class GoogleAccount extends Model
{
    protected $fillable = [
        'email',
        'access_token',
        'refresh_token',
        'expires_at',
        'scopes',
        'calendar_id',
        'connected_at',
    ];

    protected $hidden = ['access_token', 'refresh_token'];

    protected function casts(): array
    {
        return [
            'access_token' => 'encrypted',
            'refresh_token' => 'encrypted',
            'expires_at' => 'datetime',
            'connected_at' => 'datetime',
        ];
    }

    /** The connected account, or null when nobody has connected one yet. */
    public static function current(): ?self
    {
        return static::query()->orderBy('id')->first();
    }

    /**
     * True when the access token is missing or within a minute of expiring.
     * The minute of slack keeps a token from dying mid-request.
     */
    public function needsRefresh(): bool
    {
        return ! $this->access_token
            || ! $this->expires_at
            || $this->expires_at->isBefore(now()->addMinute());
    }

    public function isConnected(): bool
    {
        return (bool) $this->refresh_token;
    }
}
