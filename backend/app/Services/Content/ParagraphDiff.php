<?php

namespace App\Services\Content;

use Illuminate\Support\Str;

/**
 * A paragraph-level diff between two versions of an article body.
 *
 * The learning system's entire input is "the model wrote this, the human
 * changed it to that", so the quality of this diff decides the quality of every
 * rule extracted downstream. Three decisions matter:
 *
 *   1. It diffs PARAGRAPHS, not characters or lines. A word-level diff of prose
 *      produces confetti — a hundred single-token changes with no context — and
 *      a rule extracted from "and → but" is noise. A paragraph is the smallest
 *      unit where you can still see what the writer was doing.
 *
 *   2. It compares TEXT, not markup. Re-saving through the editor reflows tags
 *      without changing a word, and a diff that reports those as edits teaches
 *      the extractor that the model's markup is constantly wrong when nobody
 *      touched it. Headings keep a marker so structural edits stay visible.
 *
 *   3. Unmatched runs are PAIRED into modifications where the counts allow it.
 *      "Removed this, added that" hides the relationship; "this became that" is
 *      the thing worth learning from.
 */
class ParagraphDiff
{
    /**
     * @return list<array{type: string, before: ?string, after: ?string}>
     */
    public function changes(string $beforeHtml, string $afterHtml): array
    {
        $a = $this->blocks($beforeHtml);
        $b = $this->blocks($afterHtml);

        $out = [];
        foreach ($this->align($a, $b) as [$left, $right]) {
            // Pair positionally inside each unmatched run: the nth rewritten
            // paragraph almost always corresponds to the nth original.
            $pairs = max(count($left), count($right));
            for ($i = 0; $i < $pairs; $i++) {
                $before = $left[$i] ?? null;
                $after = $right[$i] ?? null;

                $out[] = [
                    'type' => match (true) {
                        $before === null => 'added',
                        $after === null => 'removed',
                        default => 'changed',
                    },
                    'before' => $before,
                    'after' => $after,
                ];
            }
        }

        return $out;
    }

    /** Words on the heavier side of every changed block. */
    public function wordsTouched(string $beforeHtml, string $afterHtml): int
    {
        $touched = 0;
        foreach ($this->changes($beforeHtml, $afterHtml) as $c) {
            $touched += max($this->words((string) $c['before']), $this->words((string) $c['after']));
        }

        return $touched;
    }

    /** Words in a body, after markup. */
    public function wordCount(string $html): int
    {
        return $this->words($this->text($html));
    }

    /**
     * Split into comparable blocks. Headings are prefixed so that promoting a
     * paragraph to an H2 reads as a change rather than as an identical match.
     *
     * @return list<string>
     */
    public function blocks(string $html): array
    {
        $normalised = preg_replace('#<(h[1-6])[^>]*>#i', "\n<\\1>", $html) ?? $html;
        $normalised = preg_replace('#</(p|div|li|h[1-6]|blockquote)>#i', "\n", $normalised) ?? $normalised;
        $normalised = preg_replace('#<br\s*/?>#i', "\n", $normalised) ?? $normalised;

        $blocks = [];
        foreach (preg_split('/\n+/', $normalised) ?: [] as $chunk) {
            $isHeading = (bool) preg_match('/^\s*<h([1-6])>/i', $chunk, $m);
            $text = $this->text($chunk);
            if ($text === '') {
                continue;
            }
            $blocks[] = $isHeading ? "H{$m[1]}: {$text}" : $text;
        }

        return $blocks;
    }

    /**
     * Longest common subsequence over blocks, returned as the runs BETWEEN the
     * matches — i.e. only the parts that differ, in document order.
     *
     * @param  list<string>  $a
     * @param  list<string>  $b
     * @return list<array{0: list<string>, 1: list<string>}>
     */
    private function align(array $a, array $b): array
    {
        $n = count($a);
        $m = count($b);

        // Guard against a pathological body: the table is O(n*m) and an article
        // is tens of blocks, so this only trips on something that is not prose.
        if ($n * $m > 400_000) {
            return [[$a, $b]];
        }

        $keyA = array_map(fn ($s) => $this->key($s), $a);
        $keyB = array_map(fn ($s) => $this->key($s), $b);

        $lcs = array_fill(0, $n + 1, array_fill(0, $m + 1, 0));
        for ($i = $n - 1; $i >= 0; $i--) {
            for ($j = $m - 1; $j >= 0; $j--) {
                $lcs[$i][$j] = $keyA[$i] === $keyB[$j]
                    ? $lcs[$i + 1][$j + 1] + 1
                    : max($lcs[$i + 1][$j], $lcs[$i][$j + 1]);
            }
        }

        $runs = [];
        $left = $right = [];
        $i = $j = 0;
        while ($i < $n && $j < $m) {
            if ($keyA[$i] === $keyB[$j]) {
                if ($left !== [] || $right !== []) {
                    $runs[] = [$left, $right];
                    $left = $right = [];
                }
                $i++;
                $j++;
            } elseif ($lcs[$i + 1][$j] >= $lcs[$i][$j + 1]) {
                $left[] = $a[$i++];
            } else {
                $right[] = $b[$j++];
            }
        }
        while ($i < $n) {
            $left[] = $a[$i++];
        }
        while ($j < $m) {
            $right[] = $b[$j++];
        }
        if ($left !== [] || $right !== []) {
            $runs[] = [$left, $right];
        }

        return $runs;
    }

    /**
     * Match key. Case and whitespace are ignored so that a reflow or a
     * capitalisation tweak does not read as a rewritten paragraph, but
     * punctuation is kept: replacing an em dash with a comma is exactly the
     * kind of edit this system exists to notice.
     */
    private function key(string $block): string
    {
        return Str::lower(Str::squish($block));
    }

    private function text(string $html): string
    {
        return trim(Str::squish(html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5)));
    }

    private function words(string $text): int
    {
        return $text === '' ? 0 : count(preg_split('/\s+/', trim($text), -1, PREG_SPLIT_NO_EMPTY) ?: []);
    }
}
