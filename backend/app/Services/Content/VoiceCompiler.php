<?php

namespace App\Services\Content;

use App\Models\StyleRule;
use Illuminate\Support\Facades\Cache;
use RuntimeException;

/**
 * Compiles the approved style rules into the system prompt file the generator
 * is given via `--append-system-prompt-file`.
 *
 * The hand-written BRAND_VOICE.md is never touched. It is the constitution: the
 * no-dash rule, the sourcing rule, the market. Learned rules are appended into a
 * SEPARATE compiled file, so a bad extraction can never damage the base voice
 * and recovering from one is `rm` plus a recompile. It also means the base file
 * stays diffable by a human who wants to know what they wrote versus what the
 * machine proposed.
 *
 * §7's phrasing discipline is enforced at the point of writing rather than only
 * at the point of proposing: the compiled section states that these are
 * observations, because a model reading a list of corrections starts writing to
 * avoid the corrections instead of writing in the voice.
 */
class VoiceCompiler
{
    private const CACHE_KEY = 'content.ruleset_version';

    /**
     * The current ruleset version. Derived from the rules themselves rather than
     * held in a counter, so it cannot drift out of step with the set it names.
     */
    public function version(): int
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            $from = (int) StyleRule::max('effective_from');
            $to = (int) StyleRule::max('effective_to');

            return max($from, $to);
        });
    }

    /** Mint the next version. Called by anything that changes the approved set. */
    public function bump(): int
    {
        Cache::forget(self::CACHE_KEY);

        return $this->version() + 1;
    }

    public function forget(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Which system-prompt file a generation should be given.
     *
     * A hold-out run gets the base file and nothing else. That is the control
     * (§7): without a generation that has never seen the learned rules, there is
     * no way to tell whether the ruleset is helping or merely accumulating.
     */
    public function fileFor(bool $holdout = false): string
    {
        $base = config('content.claude.brand_voice_file');

        if ($holdout || StyleRule::approved()->count() === 0) {
            return $base;
        }

        return $this->compile();
    }

    /**
     * Write the compiled file and return its path.
     *
     * Written to a temporary file and renamed, because rename() is atomic on the
     * same filesystem and a generation reading this file halfway through a write
     * would be given a truncated voice with no error anywhere to explain the
     * resulting draft.
     */
    public function compile(): string
    {
        $base = config('content.claude.brand_voice_file');
        if (! is_file($base)) {
            throw new RuntimeException("Brand voice file is missing: {$base}");
        }

        $path = $this->compiledPath();
        $body = file_get_contents($base);
        if ($body === false) {
            throw new RuntimeException("Brand voice file is unreadable: {$base}");
        }

        $rules = StyleRule::approved()->orderBy('category')->orderBy('id')->get();
        if ($rules->isNotEmpty()) {
            $body .= $this->section($rules);
        }

        $tmp = $path.'.'.getmypid().'.tmp';
        if (file_put_contents($tmp, $body) === false || ! rename($tmp, $path)) {
            @unlink($tmp);
            throw new RuntimeException("Could not write the compiled voice file: {$path}");
        }

        return $path;
    }

    public function compiledPath(): string
    {
        return dirname((string) config('content.claude.brand_voice_file')).'/BRAND_VOICE.compiled.md';
    }

    /** What the model will read, without writing anything. For the review UI. */
    public function preview(): string
    {
        $rules = StyleRule::approved()->orderBy('category')->orderBy('id')->get();

        return $rules->isEmpty() ? '' : trim($this->section($rules));
    }

    private function section($rules): string
    {
        $version = $this->version();

        $out = "\n\n---\n\n## Learned house observations (ruleset v{$version})\n\n"
            ."These were derived from edits a human made to earlier drafts and approved\n"
            ."one at a time. They describe how WAHEED already writes. Treat them as\n"
            ."description, not as a list of mistakes to avoid: writing defensively around\n"
            ."a correction produces worse prose than writing naturally in the voice.\n\n";

        foreach ($rules->groupBy('category') as $category => $group) {
            $out .= '### '.ucfirst((string) $category)."\n\n";
            foreach ($group as $rule) {
                $out .= '- '.trim($rule->rule)."\n";
            }
            $out .= "\n";
        }

        return $out;
    }
}
