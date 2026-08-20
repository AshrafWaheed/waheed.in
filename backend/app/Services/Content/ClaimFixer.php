<?php

namespace App\Services\Content;

use App\Models\Post;
use App\Models\PostClaim;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Mews\Purifier\Facades\Purifier;
use RuntimeException;

/**
 * Turns a fact-check finding into an edit the publisher can accept in one press.
 *
 * The fact-check pass (FactChecker) tells you a hadith number is wrong. Before
 * this class existed it then told you to go and retype it yourself, which is a
 * strange place to stop: the pass already knows the old string and the new one,
 * and typing it back in by hand is the one part of the job with no judgement in
 * it at all.
 *
 * ── What this does NOT relax ────────────────────────────────────────────────
 *
 * P1 is that a human approves anything public. That was never a requirement
 * that the human do the TYPING — it is a requirement that nothing reaches the
 * article without a person agreeing to it. So this class proposes, and a
 * separate deliberate press applies. Two properties keep that honest:
 *
 *   · Proposals are stored, not applied. `propose()` writes nothing to the
 *     post. `apply()` is a different call behind a different endpoint.
 *   · Every fix is an exact string substitution that must match ONCE. Not a
 *     rewrite, not "here is the new body". A model handed a whole article and
 *     asked for a corrected one will quietly improve six other sentences on the
 *     way past, and those changes are invisible against a 1,700-word diff. A
 *     find/replace pair that must match exactly once is reviewable in a line,
 *     and fails loudly instead of guessing when the article has moved on.
 *
 * The applied edit is deliberately NOT recorded as a PostEdit. The learning
 * loop reads human edits to infer the house voice (§7); a machine correcting
 * its own citation says nothing about how the publisher writes, and feeding it
 * back in would teach the generator from its own output.
 */
class ClaimFixer
{
    public function __construct(private ClaudeRunner $runner) {}

    /**
     * Ask for concrete substitutions for the claims the pass flagged.
     *
     * @return array{fixes: array<int, array>, notes: string, skipped: array<int, string>}
     */
    public function propose(Post $post, ?int $userId = null): array
    {
        $claims = $this->fixable($post);

        if ($claims->isEmpty()) {
            throw new RuntimeException(
                'No claim on this post is flagged as needing a change. Run the agent pass '
                .'first, or there is simply nothing to correct.'
            );
        }

        $result = $this->runner->run(
            prompt: $this->prompt($post, $claims),
            schema: 'claim_fixes.json',
            postId: $post->id,
            stage: 'fix',
            userId: $userId,
            holdout: true,
        );

        $json = $result['json'] ?? null;
        if (! is_array($json)) {
            throw new RuntimeException('The fix run returned nothing usable. Nothing was changed.');
        }

        return $this->validate($post, $claims, $json);
    }

    /**
     * Apply the proposals a person has just approved.
     *
     * Re-validated against the CURRENT body rather than trusted from the job
     * result: minutes may have passed and the post may have been edited in
     * another tab. A fix whose `find` no longer matches exactly once is skipped
     * and reported, never approximated.
     *
     * @param  array<int, array>  $fixes
     * @return array{applied: int, skipped: array<int, string>, claims: array<int, int>}
     */
    public function apply(Post $post, array $fixes, int $userId): array
    {
        $body = (string) $post->body_html;
        $applied = 0;
        $skipped = [];
        $touched = [];

        foreach ($fixes as $fix) {
            $claimId = (int) ($fix['claim_id'] ?? 0);
            $find = (string) ($fix['find'] ?? '');
            $replace = (string) ($fix['replace'] ?? '');

            if ($find === '' || $find === $replace) {
                $skipped[$claimId] = 'The proposal did not describe a change.';
                continue;
            }

            $hits = substr_count($body, $find);
            if ($hits !== 1) {
                $skipped[$claimId] = $hits === 0
                    ? 'The text this would replace is no longer in the article.'
                    : "The text this would replace appears {$hits} times, so the edit is ambiguous.";
                continue;
            }

            $body = str_replace($find, $replace, $body);
            $applied++;
            $touched[] = $claimId;
        }

        if ($applied > 0) {
            /*
             * Purified on the way in, like every other write to a post body.
             * The replacement text came back from a model that had just read
             * pages nobody here controls, so it is untrusted input however
             * benign it looks.
             */
            $clean = Purifier::clean($body);
            $post->update([
                'body_html' => $clean,
                'reading_mins' => max(1, (int) ceil(str_word_count(strip_tags($clean)) / 200)),
            ]);

            $this->stampSources($post, $fixes, $touched);
        }

        return ['applied' => $applied, 'skipped' => $skipped, 'claims' => $touched];
    }

    /** Claims the agent flagged as needing a change, still awaiting a person. */
    public function fixable(Post $post): Collection
    {
        return $post->claims()
            ->whereNull('verified_at')
            ->whereIn('agent_verdict', ['corrected', 'removed'])
            ->orderBy('id')
            ->get();
    }

    // ── internals ───────────────────────────────────────────────────────────

    /**
     * Move a corrected citation onto the claim record.
     *
     * `source_url` is the claim's own citation, which is metadata about the
     * check rather than the link in the prose — the prose link is changed by
     * the substitution like any other text. Both need doing or the record and
     * the article disagree.
     */
    private function stampSources(Post $post, array $fixes, array $touched): void
    {
        foreach ($fixes as $fix) {
            $claimId = (int) ($fix['claim_id'] ?? 0);
            $url = trim((string) ($fix['source_url'] ?? ''));

            if (! in_array($claimId, $touched, true) || ! Str::startsWith($url, ['http://', 'https://'])) {
                continue;
            }

            $post->claims()->where('id', $claimId)->update(['source_url' => Str::limit($url, 1024, '')]);
        }
    }

    /**
     * Reject anything that cannot be applied cleanly, before a human is asked
     * to look at it. A proposal that will fail on apply is worse than no
     * proposal: it costs a review and then does nothing.
     *
     * @return array{fixes: array<int, array>, notes: string, skipped: array<int, string>}
     */
    private function validate(Post $post, Collection $claims, array $json): array
    {
        $body = (string) $post->body_html;
        $ids = $claims->pluck('id')->all();
        $ok = [];
        $skipped = [];

        foreach (($json['fixes'] ?? []) as $fix) {
            if (! is_array($fix)) {
                continue;
            }

            $claimId = (int) ($fix['claim_id'] ?? 0);
            if (! in_array($claimId, $ids, true)) {
                continue; // a claim we did not ask about
            }

            $find = (string) ($fix['find'] ?? '');
            $replace = (string) ($fix['replace'] ?? '');
            $hits = $find === '' ? 0 : substr_count($body, $find);

            if ($hits !== 1) {
                $skipped[$claimId] = $hits === 0
                    ? 'The model quoted text that is not in the article verbatim, so this one '
                        .'needs doing by hand.'
                    : "That text appears {$hits} times in the article, so the edit would be ambiguous.";
                continue;
            }
            if ($find === $replace) {
                $skipped[$claimId] = 'The proposal changes nothing.';
                continue;
            }

            $ok[] = [
                'claim_id' => $claimId,
                'find' => $find,
                'replace' => $replace,
                'rationale' => trim((string) ($fix['rationale'] ?? '')),
                'source_url' => Str::startsWith((string) ($fix['source_url'] ?? ''), ['http://', 'https://'])
                    ? (string) $fix['source_url']
                    : null,
            ];
        }

        // Anything flagged that produced no usable fix is stated plainly rather
        // than silently dropped — those are the ones still needing a person.
        foreach ($claims as $claim) {
            $has = collect($ok)->contains(fn ($f) => $f['claim_id'] === $claim->id);
            if (! $has && ! isset($skipped[$claim->id])) {
                $skipped[$claim->id] = 'No mechanical fix proposed; this one needs an editorial decision.';
            }
        }

        return [
            'fixes' => $ok,
            'notes' => trim((string) ($json['notes'] ?? '')),
            'skipped' => $skipped,
        ];
    }

    private function prompt(Post $post, Collection $claims): string
    {
        $findings = $claims->map(function (PostClaim $c) {
            $lines = [
                "claim_id: {$c->id}",
                "verdict: {$c->agent_verdict}",
                "the claim as written: {$c->claim}",
                "cited source: ".($c->source_url ?: 'none'),
                "what the check found: {$c->agent_note}",
            ];

            if (filled($c->agent_source_url)) {
                $lines[] = "the check suggests this source instead: {$c->agent_source_url}";
            }

            return implode("\n", $lines);
        })->join("\n\n---\n\n");

        $body = $post->body_html;

        return <<<PROMPT
        A fact-check pass read the sources cited by an article and found problems with
        the claims below. Your job is to turn each finding into the smallest exact edit
        to the article that resolves it.

        You are proposing, not editing. A person reads what you return and decides
        whether to apply it. Nothing you write reaches the article on its own.

        HOW A FIX HAS TO BE SHAPED

        Give a `find` string copied CHARACTER FOR CHARACTER out of the article HTML
        below, and the `replace` string it becomes. The find string must appear exactly
        once in the article. Copy it, do not reconstruct it from memory: if it does not
        match the article byte for byte the fix is thrown away, and a fix thrown away
        costs the publisher a review and gives them nothing.

        Keep it short. A phrase, not a paragraph, wherever a phrase is enough — the
        person reviewing this has to be able to see the whole change at a glance. If
        the surrounding HTML tags fall inside the span you need, include them and keep
        them intact in the replacement.

        WHAT NOT TO DO

        - Change only what the finding requires. Do not re-word neighbouring prose, do
          not tighten the writing, do not fix anything you were not asked about. An
          unrelated improvement smuggled into a correction is the thing that makes
          these unreviewable, and it will be rejected.
        - Do not soften a claim into vagueness to make it defensible. If a statement
          cannot be made true by a substitution, do not propose one.
        - Do not invent a replacement source. Use the one the check identified, or none.

        WHEN TO PROPOSE NOTHING

        Omitting a claim is a correct answer, and often the right one. Omit it when the
        fix needs a judgement rather than a substitution — a claim that has to be cut
        and the paragraph re-flowed, a ruling that should be presented as disputed, a
        sentence whose whole argument depends on the wrong fact. Say why in `notes`.
        The publisher can then make that call knowing you looked and decided not to.

        THE FINDINGS

        {$findings}

        THE ARTICLE HTML. Copy your `find` strings out of this exactly.

        {$body}
        PROMPT;
    }
}
