<?php

namespace App\Services\Content;

use App\Models\Post;
use App\Models\PostClaim;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Runs a machine pass over a draft's claims and records what it found.
 *
 * This fills the agent lane added in 2026_08_17_091500 and nothing else. It
 * writes `agent_verdict`, `agent_note`, `agent_source_url`, `agent_checked_at`
 * and `agent_model`; it does not touch `verified_at`, `verified_by`,
 * `verified_via` or `verdict`. A pass can never clear the gate. Only a person
 * pressing accept can, and that is enforced in the controller rather than
 * trusted to this class (§2 P1).
 *
 * ── Why the prompt is written the way it is ─────────────────────────────────
 *
 * The obvious version of this feature is worthless. Asked "is this claim
 * correct?", a model that has just written the claim and chosen its citation
 * will mostly say yes, from memory, without going near the page — and it will
 * say it fluently. That produces a screen full of green ticks that means
 * nothing, which is strictly worse than no pass at all, because a human
 * reading it will stop checking.
 *
 * Three things push against that, and all three matter:
 *
 *   1. `fetched` is a required boolean, separate from the verdict. A verdict
 *      is an opinion; whether a page was actually retrieved is a fact, and
 *      splitting them means a confident answer with fetched=false is visibly
 *      an answer from memory. Those are downgraded here, in code, not left to
 *      the model's discretion.
 *   2. `unverifiable` exists as a first-class verdict. Without it the only
 *      way to report a dead link is to pick one of confirmed/corrected/removed
 *      and be wrong. Note that this widens the agent vocabulary beyond the
 *      human one on purpose: a person who cannot verify something goes and
 *      finds another source, an agent in a batch cannot.
 *   3. The note has to carry what the page said. A note that only says "looks
 *      correct" cannot be spot-checked, and being spot-checkable is the entire
 *      value of the lane.
 *
 * The pass runs as a hold-out (`holdout: true`) so the learned style rules are
 * not loaded. They describe how WAHEED writes, which is irrelevant to whether
 * a statistic is true, and every token of irrelevant instruction is a token of
 * budget and attention taken from the checking.
 */
class FactChecker
{
    /**
     * Claims per agent run.
     *
     * Not a token limit — it is an attention limit. One run asked to fetch
     * thirty pages and report on all of them reliably gets thorough about the
     * first few and terse about the rest, and the terse ones are indis-
     * tinguishable from checked ones in the output. Smaller batches cost a
     * little more in fixed overhead and buy uniform effort across the post.
     */
    private const CHUNK = 8;

    public function __construct(private ClaudeRunner $runner) {}

    /**
     * Check every claim on a post that has not already been verified by a human.
     *
     * @return array{claims: int, checked: int, confirmed: int, corrected: int, removed: int, unverifiable: int, unfetched: int, runs: int, notes: string}
     */
    public function check(Post $post, ?int $userId = null): array
    {
        $claims = $this->outstanding($post);

        if ($claims->isEmpty()) {
            throw new RuntimeException(
                'Every claim on this post has already been verified by a person. '
                .'There is nothing for a machine pass to add.'
            );
        }

        $model = (string) config('content.claude.model');
        $notes = [];
        $runs = 0;

        foreach ($claims->chunk(self::CHUNK) as $batch) {
            $result = $this->runner->run(
                prompt: $this->prompt($post, $batch),
                schema: 'fact_check.json',
                postId: $post->id,
                stage: 'factcheck',
                userId: $userId,
                // Not shaped by the voice rules: this run is not writing prose.
                holdout: true,
            );
            $runs++;

            $json = $result['json'] ?? null;
            if (! is_array($json)) {
                throw new RuntimeException(
                    'The fact-check run returned nothing usable. Claims already written in '
                    .'earlier batches are kept; re-run to finish the rest.'
                );
            }

            $this->record($batch, $json['checks'] ?? [], $model);

            if (filled($json['notes'] ?? null)) {
                $notes[] = trim((string) $json['notes']);
            }
        }

        return $this->summary($post, $runs, $notes);
    }

    /**
     * What a pass should look at: claims no person has signed off yet.
     *
     * Deliberately not "claims with no agent verdict". Re-running the pass on a
     * post should re-check everything still outstanding, including claims a
     * previous pass already looked at — a second opinion on a flagged claim is
     * worth having, and a dead link may have come back.
     */
    public function outstanding(Post $post): Collection
    {
        return $post->claims()->whereNull('verified_at')->orderBy('id')->get();
    }

    /** Is there anything a pass could usefully do here? Drives the button state. */
    public function canRun(Post $post): bool
    {
        return $this->outstanding($post)->isNotEmpty();
    }

    // ── internals ───────────────────────────────────────────────────────────

    /**
     * Write the findings back.
     *
     * Two guards worth their weight. Ids are matched against the batch that was
     * actually sent, so a hallucinated id cannot write to another post's claim.
     * And `fetched === false` downgrades any positive verdict to unverifiable:
     * a model that did not open the page did not check the claim, whatever it
     * concluded, and letting that through as `confirmed` is the exact failure
     * this feature exists to avoid.
     */
    private function record(Collection $batch, array $checks, string $model): void
    {
        $byId = $batch->keyBy('id');
        $now = now();

        foreach ($checks as $check) {
            if (! is_array($check)) {
                continue;
            }

            $claim = $byId->get((int) ($check['claim_id'] ?? 0));
            if (! $claim instanceof PostClaim) {
                continue; // an id we did not send
            }

            $verdict = (string) ($check['verdict'] ?? '');
            if (! in_array($verdict, ['confirmed', 'corrected', 'removed', 'unverifiable'], true)) {
                continue;
            }

            $fetched = (bool) ($check['fetched'] ?? false);
            $note = trim((string) ($check['note'] ?? ''));

            if (! $fetched && $verdict !== 'unverifiable') {
                $note = 'Recorded as unverifiable because the source was not retrieved in this '
                    ."run. What the pass said anyway: [{$verdict}] ".$note;
                $verdict = 'unverifiable';
            }

            $suggested = trim((string) ($check['source_url'] ?? ''));

            $claim->update([
                'agent_verdict' => $verdict,
                'agent_note' => Str::limit($note, 2000, ''),
                // Never overwrites source_url. A citation that drifted is
                // evidence about the generator prompt and has to survive.
                'agent_source_url' => Str::startsWith($suggested, ['http://', 'https://'])
                    ? Str::limit($suggested, 1024, '')
                    : null,
                'agent_checked_at' => $now,
                'agent_model' => $model,
            ]);
        }
    }

    private function prompt(Post $post, Collection $batch): string
    {
        $items = $batch->map(function (PostClaim $c) {
            $lines = ["claim_id: {$c->id}", "claim: {$c->claim}"];

            $lines[] = blank($c->source_url)
                ? 'cited source: NONE. The generator gave no source for this one.'
                : "cited source: {$c->source_url}";

            if (filled($c->source_about)) {
                $lines[] = "the generator says that page is about: {$c->source_about}";
            }

            return implode("\n", $lines);
        })->join("\n\n---\n\n");

        $title = $post->title;

        return <<<PROMPT
        You are checking factual claims in a draft article titled "{$title}" against
        their cited sources. Another instance of this model wrote both the claims and
        the citations. Treat none of it as reliable.

        Your findings are a RECOMMENDATION. A person reads them and decides. Nothing
        you return publishes anything, and nothing you return clears the article for
        publishing, so there is no cost to you in reporting that a claim does not
        hold up or that you could not check it. There is a large cost in the other
        direction: a claim you wave through is a claim nobody checks again.

        THE ONE RULE THAT MATTERS

        Retrieve the cited page and read it, in this session, before you judge the
        claim. Do not answer from what you remember about the source, the
        organisation, or the subject. If you did not open the page, `fetched` is
        false, and the honest verdict is `unverifiable` — that is a useful result,
        not a failure. Recognising a URL is not reading it.

        HOW TO DECIDE

        - confirmed: you retrieved the page and it supports the claim as written.
          Put the supporting sentence, quoted or closely paraphrased, in the note so
          a human can spot-check you without fetching it again.
        - corrected: you retrieved the page and it contradicts a detail that editing
          could fix — a wrong figure, year, name, or an overstated scope. Put the
          correct version in the note.
        - removed: the claim is wrong in a way editing cannot repair, or the source
          does not support anything like it. Say what you found instead.
        - unverifiable: the fetch failed, was blocked or paywalled, the page has
          changed, or the page simply does not address the claim. Say which.

        PARTICULAR THINGS TO CATCH

        - A citation that points at the right ORGANISATION but the wrong page. This
          is the common failure and it looks fine at a glance. If the generator told
          you what the page is about and the page turns out to be about something
          else, that is a finding worth reporting even when the claim itself is true.
        - A statistic that is real but superseded by a newer figure on the same site.
          Report the current figure under `corrected`.
        - A number, date or proper noun that is close but not exact.
        - A claim about Islamic rulings attributed to a scholar or body. Check that
          the cited source actually attributes it to them, and say plainly when a
          ruling is disputed rather than settled. Where the claim rests on a hadith
          or a verse, check the reference resolves to that text.
        - A claim with NO cited source. Search for a primary source. If you find one,
          put it in `source_url` and judge the claim against it. If you cannot find
          one, that is `unverifiable`.

        Return one entry per claim_id below. Every id, none invented.

        THE CLAIMS

        {$items}
        PROMPT;
    }

    /** @return array{claims: int, checked: int, confirmed: int, corrected: int, removed: int, unverifiable: int, unfetched: int, runs: int, notes: string} */
    private function summary(Post $post, int $runs, array $notes): array
    {
        $all = $post->claims()->get();
        $checked = $all->whereNotNull('agent_verdict');

        return [
            'claims' => $all->count(),
            'checked' => $checked->count(),
            'confirmed' => $checked->where('agent_verdict', 'confirmed')->count(),
            'corrected' => $checked->where('agent_verdict', 'corrected')->count(),
            'removed' => $checked->where('agent_verdict', 'removed')->count(),
            'unverifiable' => $checked->where('agent_verdict', 'unverifiable')->count(),
            'unfetched' => $all->whereNull('agent_verdict')->count(),
            'runs' => $runs,
            'notes' => implode("\n\n", $notes),
        ];
    }
}
