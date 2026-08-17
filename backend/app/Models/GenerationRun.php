<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** One `claude -p` invocation: what it cost, what produced it, whether it worked. */
class GenerationRun extends Model
{
    protected $fillable = [
        'post_id', 'stage', 'session_id', 'prompt_version', 'ruleset_version',
        'model_id', 'input_tokens', 'output_tokens', 'cost_usd', 'duration_ms',
        'exit_code', 'stderr_excerpt', 'user_id',
    ];

    protected function casts(): array
    {
        return [
            'cost_usd' => 'decimal:6',
            'input_tokens' => 'integer',
            'output_tokens' => 'integer',
            'duration_ms' => 'integer',
        ];
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
