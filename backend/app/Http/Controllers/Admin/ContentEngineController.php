<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\PublishVariant;
use App\Jobs\RunContentGeneration;
use App\Models\ContentJob;
use App\Models\GenerationRun;
use App\Models\Post;
use App\Models\PostClaim;
use App\Models\PostVariant;
use App\Models\Topic;
use App\Services\Content\BlogGenerator;
use App\Services\Content\IndexationService;
use App\Services\Content\Publishing\Syndicator;
use App\Services\Content\VariantGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Mews\Purifier\Facades\Purifier;
use RuntimeException;

/**
 * Admin endpoints for the content engine. See documents/CONTENT_ENGINE.md.
 *
 * Every generation endpoint returns 202 and a job handle rather than the
 * finished work. A research turn takes one to nine minutes, and the request
 * path (nginx → Next.js BFF → nginx → PHP-FPM) gives up at sixty seconds, so
 * the synchronous version could not complete through a browser at all — it
 * only ever worked from the CLI, where no proxy is in the way.
 */
class ContentEngineController extends Controller
{
    public function __construct(
        private BlogGenerator $generator,
        private VariantGenerator $variants,
        private IndexationService $indexation,
        private Syndicator $syndicator,
    ) {}

    /** Engine status + this month's spend, for the dashboard card. */
    public function status(): JsonResponse
    {
        $spend = (float) GenerationRun::whereBetween('created_at', [now()->startOfMonth(), now()])
            ->sum('cost_usd');
        $budget = (float) config('content.limits.monthly_budget_usd');

        return response()->json([
            'enabled' => (bool) config('content.enabled'),
            'has_api_key' => $this->authReady(),
            'auth_mode' => config('content.claude.bare') ? 'api-key' : 'subscription',
            'model' => config('content.claude.model'),
            'prompt_version' => config('content.prompts.draft_version'),
            'month_spend_usd' => round($spend, 4),
            'month_budget_usd' => $budget,
            // Only a real ceiling when the tokens are actually billed. On a
            // subscription this figure is notional and never blocks.
            'budget_enforced' => (bool) config('content.claude.bare'),
            'budget_exhausted' => config('content.claude.bare') && $budget > 0 && $spend >= $budget,
            'queued_topics' => Topic::queued()->count(),
        ]);
    }

    /** The topic queue. */
    public function topics(Request $request): JsonResponse
    {
        $query = Topic::query()->with('post:id,title,slug,status');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($pillar = $request->query('pillar')) {
            $query->where('pillar', $pillar);
        }

        return response()->json([
            'data' => $query->orderBy('priority')->orderBy('id')->get(),
        ]);
    }

    public function storeTopic(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'pillar' => ['required', 'string', 'max:60'],
            'primary_keyword' => ['required', 'string', 'max:255'],
            'secondary_keywords' => ['nullable', 'array'],
            'secondary_keywords.*' => ['string', 'max:255'],
            'difficulty' => ['nullable', Rule::in(['easy', 'medium', 'hard', 'low-comp'])],
            'bridge_target' => ['nullable', 'string', 'max:255'],
            'priority' => ['nullable', 'integer', 'min:1', 'max:9999'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        return response()->json(Topic::create($data + ['status' => 'queued']), 201);
    }

    /**
     * Generate a draft from a topic. The expensive one.
     */
    public function generate(Request $request, Topic $topic): JsonResponse
    {
        $data = $request->validate([
            'author_id' => ['required', 'integer', Rule::exists('users', 'id')],
            'instructions' => ['nullable', 'string', 'max:4000'],
        ]);

        if ($guard = $this->guard()) {
            return $guard;
        }

        if ($topic->status !== 'queued' && $topic->post_id) {
            return response()->json([
                'message' => 'This topic already has a draft.',
                'post_id' => $topic->post_id,
            ], 409);
        }

        if ($busy = $this->alreadyRunning(['topic_id' => $topic->id])) {
            return $busy;
        }

        return $this->queued(ContentJob::create([
            'kind' => 'draft',
            'topic_id' => $topic->id,
            'author_id' => $data['author_id'],
            'user_id' => $request->user()->id,
            'instructions' => $data['instructions'] ?? null,
        ]));
    }

    /**
     * A conversational turn on an existing draft.
     * `fork: true` branches instead of overwriting, so an alternative take can
     * be compared against the original rather than destroying it.
     */
    public function revise(Request $request, Post $post): JsonResponse
    {
        $data = $request->validate([
            'instruction' => ['required', 'string', 'max:4000'],
            'fork' => ['nullable', 'boolean'],
        ]);

        if ($guard = $this->guard()) {
            return $guard;
        }

        $turns = $post->generationRuns()->count();
        $max = (int) config('content.limits.max_turns_per_draft');
        if ($turns >= $max) {
            return response()->json([
                'message' => "This draft has used its {$max} generation turns. Edit it by hand from here.",
            ], 429);
        }

        if ($busy = $this->alreadyRunning(['post_id' => $post->id])) {
            return $busy;
        }

        return $this->queued(ContentJob::create([
            'kind' => 'revise',
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
            'instructions' => $data['instruction'],
            'fork' => (bool) ($data['fork'] ?? false),
        ]));
    }

    /** Draft + claims + house-rule warnings, for the editor screen. */
    public function show(Post $post): JsonResponse
    {
        return response()->json($this->payload($post));
    }

    /**
     * Tick off one claim. This is the fact gate: a post cannot publish while
     * any claim is unverified (CONTENT_ENGINE.md §2 P2).
     */
    public function verifyClaim(Request $request, PostClaim $claim): JsonResponse
    {
        $data = $request->validate([
            'verdict' => ['required', Rule::in(['confirmed', 'corrected', 'removed'])],
            'note' => ['nullable', 'string', 'max:1000'],
            'source_url' => ['nullable', 'string', 'max:1024'],
        ]);

        $claim->update([
            'verdict' => $data['verdict'],
            'note' => $data['note'] ?? null,
            'source_url' => $data['source_url'] ?? $claim->source_url,
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
            'verified_via' => 'human', // someone pressed this on the claim itself
        ]);

        $post = $claim->post;
        $total = $post->claims()->count();
        $done = $post->claims()->whereNotNull('verified_at')->count();
        $post->update([
            'fact_check_state' => match (true) {
                $done === 0 => 'pending',
                $done < $total => 'partial',
                default => 'cleared',
            },
        ]);

        return response()->json($this->payload($post->fresh()));
    }

    /**
     * Accept a completed agent pass for every claim on this post, in one act.
     *
     * This is a deliberate shortcut across the gate, not a hole in it. The gate
     * exists so that nothing publishes on a claim nobody checked — and on an
     * accepted pass, something did check it: it fetched every cited source and
     * compared it against the assertion. What it did not get is a second pair of
     * eyes. That is a real reduction in assurance and the record says so, rather
     * than filing 35 machine reads as 35 human ones.
     *
     * Three conditions make it safe enough to offer:
     *  - the pass must be complete. A partial pass would silently clear the
     *    claims it never looked at, which is the exact failure the gate is for.
     *  - `verified_by` still names whoever pressed the button. Accepting is a
     *    decision someone is answerable for, even though they did not read.
     *  - `verified_via = 'agent'` marks every row, so "which posts went out on
     *    an unreviewed pass" stays answerable in one query afterwards.
     */
    public function acceptAgentCheck(Request $request, Post $post): JsonResponse
    {
        $total = $post->claims()->count();
        if ($total === 0) {
            return response()->json(['message' => 'This post has no claims to accept.'], 422);
        }

        $unchecked = $post->claims()->whereNull('agent_verdict')->count();
        if ($unchecked > 0) {
            return response()->json([
                'message' => "The agent pass is incomplete: {$unchecked} of {$total} claim(s) were "
                    .'never checked. Accepting now would clear those without anything having read '
                    .'them. Run the pass to completion, or verify the remainder by hand.',
            ], 422);
        }

        // Claims the agent wanted removed are not a formality — the prose still
        // contains them until someone takes them out. Refusing here keeps the
        // shortcut away from the one verdict that implies an unmade edit.
        $toRemove = $post->claims()->where('agent_verdict', 'removed')->count();
        if ($toRemove > 0) {
            return response()->json([
                'message' => "{$toRemove} claim(s) were flagged for removal from the article. Those "
                    .'need handling by hand before the rest of the pass can be accepted.',
            ], 422);
        }

        $now = now();
        foreach ($post->claims()->whereNull('verified_at')->get() as $claim) {
            $claim->update([
                'verdict' => $claim->agent_verdict,
                'verified_at' => $now,
                'verified_by' => $request->user()->id,
                'verified_via' => 'agent',
            ]);
        }

        $post->update(['fact_check_state' => 'cleared']);

        return response()->json($this->payload($post->fresh()));
    }

    /** Undo a verification (wrong tick, or the claim changed). */
    public function unverifyClaim(PostClaim $claim): JsonResponse
    {
        $claim->update([
            'verified_at' => null, 'verified_by' => null, 'verified_via' => null, 'verdict' => null,
        ]);
        $post = $claim->post;
        $post->update([
            'fact_check_state' => $post->claims()->whereNotNull('verified_at')->count() === 0
                ? 'pending' : 'partial',
        ]);

        return response()->json($this->payload($post->fresh()));
    }

    // ── variants (phase 2) ───────────────────────────────────────────────

    /** The platforms we can syndicate to, and what each one is for. */
    public function platforms(): JsonResponse
    {
        return response()->json([
            'data' => collect(config('content.platforms'))
                ->map(fn ($spec, $key) => [
                    'key' => $key,
                    'label' => $spec['label'],
                    'format' => $spec['format'],
                    'max_chars' => $spec['max_chars'],
                    'publish' => $spec['publish'],
                    'angle' => $spec['angle'],
                ])
                ->values(),
        ]);
    }

    /** Derive one platform's variant. Another expensive one. */
    public function generateVariant(Request $request, Post $post): JsonResponse
    {
        $data = $request->validate([
            'platform' => ['required', 'string', Rule::in(array_keys(config('content.platforms')))],
            'instructions' => ['nullable', 'string', 'max:4000'],
        ]);

        if ($guard = $this->guard()) {
            return $guard;
        }

        // The fact gate is cheap to check and worth failing fast on, rather than
        // queueing work that will refuse itself four minutes later.
        if (! $post->factCheckCleared()) {
            return response()->json([
                'message' => 'This post still has '.$post->claims()->unverified()->count()
                    .' unverified claim(s). Variants argue from the same material, so they '
                    .'inherit the same problem on every platform they reach.',
            ], 422);
        }

        if ($busy = $this->alreadyRunning(['post_id' => $post->id])) {
            return $busy;
        }

        return $this->queued(ContentJob::create([
            'kind' => 'variant',
            'post_id' => $post->id,
            'platform' => $data['platform'],
            'user_id' => $request->user()->id,
            'instructions' => $data['instructions'] ?? null,
        ]));
    }

    /** Every variant on a post, plus what could still be generated. */
    public function variants(Post $post): JsonResponse
    {
        return response()->json($this->variantPayload($post));
    }

    /** Hand edits to a variant, same as editing the blog body. */
    public function updateVariant(Request $request, PostVariant $variant): JsonResponse
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:140'],
            'body_html' => ['sometimes', 'string', 'max:60000'],
            'tags' => ['sometimes', 'array', 'max:8'],
            'tags.*' => ['string', 'max:40'],
        ]);

        if (array_key_exists('body_html', $data)) {
            $data['body_html'] = $variant->spec()['format'] === 'html'
                ? Purifier::clean($data['body_html'])
                : trim(html_entity_decode(strip_tags($data['body_html'])));
        }

        /*
         * Editing un-approves. An approval is of a specific text, and silently
         * carrying it across an edit would let something reach a platform that
         * nobody approved in the form it went out in.
         */
        if ($variant->status === 'approved') {
            $data += ['status' => 'draft', 'approved_at' => null, 'approved_by' => null];
        }

        $variant->update($data);

        return response()->json($this->variantPayload($variant->post->fresh()));
    }

    /**
     * Approve a variant for syndication.
     *
     * Refuses on a stale one: the article has changed since this was derived
     * from it, so approving would ship a piece that argues from a version of
     * the post that no longer exists.
     */
    public function approveVariant(Request $request, PostVariant $variant): JsonResponse
    {
        if ($variant->isStale()) {
            return response()->json([
                'message' => 'The article has been edited since this variant was written from it. '
                    .'Regenerate it, or edit it by hand so it matches, then approve.',
            ], 422);
        }

        $variant->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
        ]);

        return response()->json($this->variantPayload($variant->post->fresh()));
    }

    /** Take an approval back. */
    public function unapproveVariant(PostVariant $variant): JsonResponse
    {
        $variant->update(['status' => 'draft', 'approved_at' => null, 'approved_by' => null]);

        return response()->json($this->variantPayload($variant->post->fresh()));
    }

    public function destroyVariant(PostVariant $variant): JsonResponse
    {
        $post = $variant->post;
        $variant->delete();

        return response()->json($this->variantPayload($post->fresh()));
    }

    // ── indexation + syndication (phase 3) ───────────────────────────────

    /**
     * Where a post stands against the indexation gate (CONTENT_ENGINE.md P4).
     * Cheap and read-only; the Search Console call is a separate action.
     */
    public function indexationStatus(Post $post): JsonResponse
    {
        return response()->json($this->indexationPayload($post));
    }

    /** Ask Search Console directly. Marks the post indexed if Google says PASS. */
    public function checkIndexation(Post $post): JsonResponse
    {
        try {
            $result = $this->indexation->query($post);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        if ($result['indexed']) {
            $this->indexation->markIndexed($post, 'search-console');
        }

        return response()->json($this->indexationPayload($post->fresh()) + ['check' => $result]);
    }

    /**
     * Confirm indexation by hand.
     *
     * Kept deliberately, not as a stopgap: Search Console access needs console
     * setup and a verified property, and a gate that cannot be satisfied until
     * that is done is a gate people route around rather than use.
     */
    public function confirmIndexation(Request $request, Post $post): JsonResponse
    {
        $request->validate(['indexed' => ['required', 'boolean']]);

        /*
         * An unpublished post is a 404 to the public, so Google cannot have
         * indexed it and confirming that it has is always a mistake. The UI
         * disables the button, but enforcing it only there would make it a
         * suggestion rather than a rule, and this particular mistake writes a
         * timestamp the release schedule is later measured from.
         */
        if ($request->boolean('indexed') && $post->status !== 'published') {
            return response()->json([
                'message' => 'This post is still a draft, so it returns a 404 publicly and Google '
                    .'cannot have indexed it. Publish it first.',
            ], 422);
        }

        $request->boolean('indexed')
            ? $this->indexation->markIndexed($post, 'manual:'.$request->user()->id)
            : $this->indexation->clear($post);

        return response()->json($this->indexationPayload($post->fresh()));
    }

    private function indexationPayload(Post $post): array
    {
        $gate = $this->indexation->gate($post);

        return [
            'url' => $this->indexation->urlFor($post),
            'post_status' => $post->status,
            'indexed_at' => $post->indexed_at?->toIso8601String(),
            'can_query' => $this->indexation->canQuery(),
            'ready' => $gate['ready'],
            'reason' => $gate['reason'],
        ];
    }

    /** Hand an approved variant to its platform's API. */
    public function publishVariant(PostVariant $variant): JsonResponse
    {
        $gate = $this->syndicator->gate($variant);
        if (! $gate['ready']) {
            return response()->json(['message' => $gate['reason']], 422);
        }

        $variant->update(['status' => 'queued', 'last_error' => null]);
        PublishVariant::dispatch($variant->id);

        return response()->json($this->variantPayload($variant->post->fresh()), 202);
    }

    /**
     * Record a publication done by hand. The only route for the three
     * platforms with no publishing API, which is most of them.
     */
    public function recordVariantUrl(Request $request, PostVariant $variant): JsonResponse
    {
        $data = $request->validate([
            'external_url' => ['required', 'url:https', 'max:512'],
        ]);

        try {
            $this->syndicator->recordManual($variant, $data['external_url']);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json($this->variantPayload($variant->post->fresh()));
    }

    // ── queued generation ────────────────────────────────────────────────

    /**
     * Poll one job. This is what the UI watches instead of holding a request
     * open for nine minutes behind a proxy that gives up at sixty seconds.
     */
    public function job(ContentJob $job): JsonResponse
    {
        return response()->json($this->jobPayload($job));
    }

    /** Anything currently running, so a reloaded page can pick the thread back up. */
    public function activeJobs(Request $request): JsonResponse
    {
        $jobs = ContentJob::active()
            ->when($request->query('post_id'), fn ($q, $v) => $q->where('post_id', $v))
            ->when($request->query('topic_id'), fn ($q, $v) => $q->where('topic_id', $v))
            ->latest('id')
            ->get();

        return response()->json(['data' => $jobs->map(fn ($j) => $this->jobPayload($j))]);
    }

    /**
     * One generation at a time per post or topic.
     *
     * Not a lock for its own sake: two concurrent runs on the same post would
     * both write the body, and the loser's work is silently destroyed after
     * costing several minutes. The click that started it is also easy to
     * repeat, because nothing appears to happen for the first minute.
     */
    private function alreadyRunning(array $scope): ?JsonResponse
    {
        $existing = ContentJob::active()->where($scope)->first();
        if (! $existing) {
            return null;
        }

        return response()->json([
            'message' => 'A generation is already running for this '
                .(isset($scope['topic_id']) ? 'topic' : 'post')
                .' ('.$existing->elapsed_seconds.'s so far). Wait for it to finish.',
            'job' => $this->jobPayload($existing),
        ], 409);
    }

    private function queued(ContentJob $job): JsonResponse
    {
        RunContentGeneration::dispatch($job->id);

        // 202: accepted, not done. The body carries the handle to poll.
        return response()->json(['job' => $this->jobPayload($job)], 202);
    }

    private function jobPayload(ContentJob $job): array
    {
        return [
            'id' => $job->id,
            'kind' => $job->kind,
            'status' => $job->status,
            'platform' => $job->platform,
            'topic_id' => $job->topic_id,
            'post_id' => $job->post_id,
            'variant_id' => $job->variant_id,
            'error' => $job->error,
            'elapsed_seconds' => $job->elapsed_seconds,
            'created_at' => $job->created_at?->toIso8601String(),
        ];
    }

    // ── helpers ──────────────────────────────────────────────────────────

    /** Whichever auth mode is configured, is it actually usable? */
    private function authReady(): bool
    {
        $cfg = config('content.claude');

        return $cfg['bare']
            ? filled($cfg['api_key'])
            : is_file(rtrim($cfg['home'], '/').'/.claude/.credentials.json');
    }

    private function guard(): ?JsonResponse
    {
        if (! config('content.enabled')) {
            return response()->json([
                'message' => 'The content engine is switched off. Set CONTENT_ENGINE_ENABLED=true in backend/.env.',
            ], 503);
        }
        if (! $this->authReady()) {
            return response()->json([
                'message' => config('content.claude.bare')
                    ? 'ANTHROPIC_API_KEY is not set in backend/.env. `claude --bare` reads auth only '.
                      'from that variable. Either add it, or set CONTENT_BARE_MODE=false to use the '.
                      'interactive login on this machine.'
                    : 'Subscription mode is on but no interactive login was found. Run `claude` once '.
                      'as the '.basename(config('content.claude.home')).' user to log in.',
            ], 503);
        }

        /*
         * The dollar budget only means anything when the tokens are actually
         * billed, i.e. in API-key mode. On a subscription the CLI's
         * total_cost_usd is a notional API-equivalent price, not money leaving
         * anyone's account — the marginal cost of a draft is zero and the real
         * constraint is the plan's usage window, not a dollar figure. Enforcing
         * it there would stop the user mid-workflow over a number that does not
         * exist. Tracked either way (it is a useful proxy for how hard the plan
         * is being worked); enforced only when it is a real bill.
         */
        if (config('content.claude.bare')) {
            $budget = (float) config('content.limits.monthly_budget_usd');
            if ($budget > 0) {
                $spend = (float) GenerationRun::whereBetween('created_at', [now()->startOfMonth(), now()])
                    ->sum('cost_usd');
                if ($spend >= $budget) {
                    return response()->json([
                        'message' => sprintf('Monthly API budget reached ($%.2f of $%.2f).', $spend, $budget),
                    ], 429);
                }
            }
        }

        return null;
    }

    /**
     * Variants for a post, each with its own warnings and staleness, plus the
     * platforms not yet generated so the UI can offer them without holding a
     * second copy of the platform list.
     */
    private function variantPayload(Post $post): array
    {
        $post->loadMissing('variants.approver:id,name');
        $specs = config('content.platforms');

        $rows = $post->variants
            ->sortBy(fn ($v) => array_search($v->platform, array_keys($specs), true))
            ->values()
            ->map(fn (PostVariant $v) => [
                ...$v->toArray(),
                'label' => $v->spec()['label'] ?? $v->platform,
                'format' => $v->spec()['format'] ?? 'html',
                'max_chars' => $v->spec()['max_chars'] ?? null,
                'publish' => $v->spec()['publish'] ?? 'manual',
                'char_count' => mb_strlen(trim(html_entity_decode(strip_tags($v->body_html)))),
                'is_stale' => $v->isStale(),
                'warnings' => $this->variants->warnings($v),
                'approver' => $v->approver?->only(['id', 'name']),
                // Why this can or cannot be sent anywhere yet, so the UI never
                // shows a button that will only produce a 422.
                'syndication' => $this->syndicator->gate($v),
            ]);

        $have = $post->variants->pluck('platform')->all();

        return [
            'post' => $post->only(['id', 'title', 'slug', 'status']),
            'can_generate' => $post->factCheckCleared(),
            'blocked_reason' => $post->factCheckCleared() ? null
                : $post->claims()->unverified()->count().' claim(s) still unverified. Variants '
                  .'argue from the same material, so they would carry the same problem onto '
                  .'every platform.',
            'indexation' => $this->indexationPayload($post),
            'variants' => $rows,
            'available' => collect($specs)
                ->reject(fn ($s, $k) => in_array($k, $have, true))
                ->map(fn ($s, $k) => ['key' => $k, 'label' => $s['label'], 'publish' => $s['publish']])
                ->values(),
        ];
    }

    private function payload(Post $post): array
    {
        $post->loadMissing(['claims.verifier:id,name', 'topic', 'author:id,name']);

        return [
            'post' => $post,
            'claims' => $post->claims,
            'warnings' => $this->generator->warnings($post),
            'fact_check_state' => $post->fact_check_state,
            'can_publish' => $post->factCheckCleared(),
            'turns_used' => $post->generationRuns()->count(),
            'turns_max' => (int) config('content.limits.max_turns_per_draft'),
        ];
    }
}
