<?php

namespace App\Services\Content;

use App\Models\Post;
use App\Models\PostEdit;
use Illuminate\Support\Str;

/**
 * Tier 1 of the learning system: record what a human changed, every time.
 *
 * Deliberately silent and cheap. This runs inside an ordinary post save, and a
 * failure to record training data must never be a reason a save fails, so the
 * only thing it does is write a row.
 */
class EditCapture
{
    public function __construct(private ParagraphDiff $diff) {}

    /**
     * Record a human edit if there is one worth recording.
     *
     * Only generated posts are captured: a hand-written post has no model output
     * to compare against, so its "diff" would be the whole article and would
     * drown the corpus in a signal that means nothing.
     */
    public function capture(Post $post, string $before, string $after, ?int $userId): ?PostEdit
    {
        if (blank($post->claude_session_id)) {
            return null;
        }

        $changes = $this->diff->changes($before, $after);
        if ($changes === []) {
            // Markup reflowed, words identical. Not an edit.
            return null;
        }

        $touched = 0;
        foreach ($changes as $c) {
            $touched += max($this->words((string) $c['before']), $this->words((string) $c['after']));
        }

        return PostEdit::create([
            'post_id' => $post->id,
            'user_id' => $userId,
            'before_html' => $before,
            'after_html' => $after,
            'words_before' => $this->diff->wordCount($before),
            'words_after' => $this->diff->wordCount($after),
            'paragraphs_changed' => count($changes),
            'words_touched' => $touched,
            'turn' => max(1, $post->generationRuns()->whereIn('stage', ['draft', 'revise'])->count()),
        ]);
    }

    /**
     * How much of the model's output the human had to change, 0 to 1-ish.
     *
     * This is the number the hold-out comparison turns on (§7). It is a proxy,
     * not a quality score: an editor who rewrites a good draft to taste and an
     * editor fixing errors both register. It is still the only honest signal
     * available without asking someone to rate every post, and across ten posts
     * the difference between "the ruleset is helping" and "the ruleset is
     * getting long" shows up in it.
     */
    public function burden(Post $post): ?float
    {
        if (blank($post->generated_body_html)) {
            return null;
        }

        $generated = $this->diff->wordCount($post->generated_body_html);
        if ($generated === 0) {
            return null;
        }

        /*
         * Summed across every recorded edit, not measured off the current
         * snapshot. `generated_body_html` is re-frozen on each machine turn, so
         * a single snapshot diff only ever shows the editing done since the LAST
         * revision — a post edited heavily, revised, then edited again would
         * report only the second round and look easy. The edit rows are the
         * whole history, which is what they exist for.
         */
        $touched = (int) $post->edits()->sum('words_touched');

        return round($touched / $generated, 4);
    }

    private function words(string $html): int
    {
        $text = trim(Str::squish(html_entity_decode(strip_tags($html))));

        return $text === '' ? 0 : count(preg_split('/\s+/', $text, -1, PREG_SPLIT_NO_EMPTY) ?: []);
    }
}
