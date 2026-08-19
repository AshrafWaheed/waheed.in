<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One human save of a generated draft, with both sides kept. See the migration.
 */
class PostEdit extends Model
{
    protected $fillable = [
        'post_id', 'user_id', 'before_html', 'after_html',
        'words_before', 'words_after', 'paragraphs_changed', 'words_touched', 'turn', 'consumed_by_batch',
    ];

    protected function casts(): array
    {
        return [
            'words_before' => 'integer',
            'words_after' => 'integer',
            'paragraphs_changed' => 'integer',
            'words_touched' => 'integer',
            'turn' => 'integer',
        ];
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
