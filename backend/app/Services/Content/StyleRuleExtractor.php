<?php

namespace App\Services\Content;

use App\Models\PostEdit;
use App\Models\StyleRule;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Tier 2 of the learning system: read the accumulated human edits and propose
 * candidate voice rules. See CONTENT_ENGINE.md §7.
 *
 * Nothing this produces reaches a generation. Every proposal lands as
 * `proposed` and waits for a person (P6). That is not ceremony: the input here
 * is a pile of diffs with no explanation attached, and a plausible-sounding
 * rule derived from three coincidences is exactly what this would produce if
 * left to apply its own output.
 *
 * The batch runs against edits that have not been read before. Re-reading the
 * whole corpus every time would inflate evidence counts on rules that were
 * already extracted from those same edits, which makes an old rule look
 * repeatedly confirmed when nothing new has happened.
 */
class StyleRuleExtractor
{
    /** Roughly one paragraph pair; enough to see the change, not the article. */
    private const EXCERPT_CHARS = 600;

    public function __construct(
        private ClaudeRunner $runner,
        private ParagraphDiff $diff,
        private VoiceCompiler $voice,
    ) {}

    /** How many unread edits are waiting. Drives the "run it now?" affordance. */
    public function pending(): Collection
    {
        return PostEdit::whereNull('consumed_by_batch')
            ->with('post:id,title,holdout,style_ruleset_version')
            ->orderBy('id')
            ->get();
    }

    public function readyToRun(): bool
    {
        return $this->pending()->count() >= (int) config('content.learning.batch_size', 5);
    }

    /**
     * @return array{batch: string, proposed: int, reinforced: int, notes: string}
     */
    public function extract(?int $userId = null): array
    {
        $edits = $this->pending();

        if ($edits->isEmpty()) {
            throw new RuntimeException(
                'There are no unread edits to learn from. Rules come from the differences '
                .'between what the generator wrote and what you changed it to, so edit a '
                .'generated draft first.'
            );
        }

        $existing = StyleRule::whereIn('status', ['approved', 'proposed'])->get();
        $batch = 'batch-'.now()->format('Ymd-His');

        $result = $this->runner->run(
            prompt: $this->prompt($edits, $existing),
            schema: 'style_rules.json',
            stage: 'extract',
            userId: $userId,
            // The extractor must never be shaped by the rules it is judging.
            // Feed it the compiled voice and it will find evidence for whatever
            // is already in there, which is the feedback loop §7 warns about.
            holdout: true,
        );

        $data = $result['json'] ?? throw new RuntimeException(
            'Extraction returned no structured output. Raw: '.Str::limit($result['raw'], 300)
        );

        return DB::transaction(function () use ($data, $edits, $batch, $existing) {
            $proposed = $this->storeProposals($data['proposals'] ?? [], $batch);
            $reinforced = $this->storeReinforcements($data['reinforcements'] ?? [], $existing);

            PostEdit::whereIn('id', $edits->pluck('id'))->update(['consumed_by_batch' => $batch]);

            return [
                'batch' => $batch,
                'proposed' => $proposed,
                'reinforced' => $reinforced,
                'notes' => (string) ($data['notes'] ?? ''),
                'edits_read' => $edits->count(),
            ];
        });
    }

    private function storeProposals(array $proposals, string $batch): int
    {
        $count = 0;

        foreach ($proposals as $p) {
            if (blank($p['rule'] ?? null)) {
                continue;
            }

            /*
             * Last-ditch dedupe. The model is handed the existing rules and told
             * to reinforce rather than restate, but a near-identical rule
             * arriving under a different wording still costs the reviewer a
             * decision and, if approved twice, costs every future generation the
             * same instruction twice.
             */
            if ($this->alreadySaid($p['rule'])) {
                continue;
            }

            StyleRule::create([
                'rule' => Str::limit(trim($p['rule']), 400, ''),
                'category' => in_array($p['category'] ?? '', ['voice', 'structure', 'sourcing', 'formatting', 'faith'], true)
                    ? $p['category'] : 'voice',
                'rationale' => $p['rationale'] ?? null,
                'evidence' => $this->trimEvidence($p['evidence'] ?? []),
                'evidence_count' => count($p['evidence'] ?? []),
                'batch' => $batch,
                'status' => 'proposed',
            ]);
            $count++;
        }

        return $count;
    }

    private function storeReinforcements(array $reinforcements, Collection $existing): int
    {
        $count = 0;

        foreach ($reinforcements as $r) {
            $rule = $existing->firstWhere('id', $r['rule_id'] ?? null);
            if (! $rule) {
                continue; // hallucinated id, or a rule retired mid-batch
            }

            $new = $this->trimEvidence($r['evidence'] ?? []);

            $rule->update([
                'evidence' => array_slice([...($rule->evidence ?? []), ...$new], -6),
                'evidence_count' => $rule->evidence_count + count($new),
                'last_reinforced_at' => now(),
            ]);
            $count++;
        }

        return $count;
    }

    /** Cheap similarity guard: same rule said two ways is still the same rule. */
    private function alreadySaid(string $rule): bool
    {
        $needle = Str::lower(Str::squish($rule));

        return StyleRule::whereIn('status', ['approved', 'proposed'])->get()
            ->contains(function (StyleRule $r) use ($needle) {
                similar_text($needle, Str::lower(Str::squish($r->rule)), $percent);

                return $percent >= 82;
            });
    }

    private function trimEvidence(array $evidence): array
    {
        return collect($evidence)->take(4)->map(fn ($e) => [
            'post_id' => (int) ($e['post_id'] ?? 0),
            'before' => Str::limit((string) ($e['before'] ?? ''), self::EXCERPT_CHARS),
            'after' => Str::limit((string) ($e['after'] ?? ''), self::EXCERPT_CHARS),
        ])->values()->all();
    }

    // ── prompt ───────────────────────────────────────────────────────────

    private function prompt(Collection $edits, Collection $existing): string
    {
        $corpus = $this->corpus($edits);
        $known = $existing->isEmpty()
            ? 'There are no rules yet. This is the first batch.'
            : $existing->map(fn (StyleRule $r) => "[{$r->id}] ({$r->status}, {$r->category}) {$r->rule}")
                ->join("\n");

        return <<<PROMPT
        You are reading the edits a publisher made to articles that an AI generator
        wrote for them, and inferring what their house voice actually is.

        Your output becomes a proposal for a human to approve or reject. It does not
        take effect on its own. An honest empty result is far more useful than a
        confident invented one.

        RULES ALREADY ON RECORD — reinforce these by id rather than restating them
        in slightly different words:

        {$known}

        THE EDITS. Each block is one save: what the generator wrote, and what the
        publisher changed it to.

        {$corpus}

        What to look for:

        - A pattern needs at least TWO independent edits, in different posts where
          possible. One edit is a preference about one sentence. Two is a habit.
        - Ignore edits that only fix a fact, a URL, a name or a number. Those are
          verification, not voice, and a rule derived from them would teach the
          generator to write around a citation it got wrong once.
        - Ignore pure formatting noise: reflowed markup, a moved link, whitespace.
        - Watch especially for things REMOVED. What a publisher consistently cuts
          says more about a voice than what they add.

        How to phrase a rule. This matters more than the finding:

        - Write it as an OBSERVATION about how WAHEED writes, in the present tense.
          Good: "WAHEED states the verdict in the first paragraph, then earns it."
          Bad:  "Do not write long introductions."
        - The bad version creates an oscillation. A generator told what to avoid
          writes defensively, the publisher corrects the over-correction, and the
          next batch proposes a rule contradicting this one. A description of the
          voice does not have that failure mode.
        - No rule may contradict the standing voice document, which already forbids
          em dashes and hype vocabulary and requires a source for every figure. If
          the edits keep fixing a rule that already exists, that is a generator
          problem and belongs in `notes`, not in a new rule.
        - One idea per rule. A rule with an "and" in it cannot be rejected by half.

        Evidence: quote the actual before and after text you are relying on, with
        the post id it came from. A rule whose evidence does not obviously show the
        pattern will be rejected by the reviewer, and it should be.
        PROMPT;
    }

    private function corpus(Collection $edits): string
    {
        $blocks = [];

        foreach ($edits as $edit) {
            $changes = $this->diff->changes($edit->before_html, $edit->after_html);
            if ($changes === []) {
                continue;
            }

            $lines = collect($changes)
                ->take(40)
                ->map(fn ($c) => match ($c['type']) {
                    'changed' => "  WROTE: {$this->excerpt($c['before'])}\n  BECAME: {$this->excerpt($c['after'])}",
                    'removed' => '  CUT ENTIRELY: '.$this->excerpt($c['before']),
                    default => '  ADDED: '.$this->excerpt($c['after']),
                })
                ->join("\n\n");

            $title = $edit->post?->title ?? 'untitled';
            $blocks[] = "POST {$edit->post_id} — {$title}\n{$lines}";
        }

        return implode("\n\n---\n\n", $blocks);
    }

    private function excerpt(?string $text): string
    {
        return Str::limit(Str::squish((string) $text), self::EXCERPT_CHARS);
    }
}
