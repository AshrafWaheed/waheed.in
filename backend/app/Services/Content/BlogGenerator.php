<?php

namespace App\Services\Content;

use App\Models\GenerationRun;
use App\Models\Post;
use App\Models\Topic;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Mews\Purifier\Facades\Purifier;
use RuntimeException;

/**
 * Turns a Topic into a draft Post, and drives the conversation that refines it.
 *
 * The generator's output is never trusted directly: it is validated against the
 * house rules (§validate) and sanitised through the same Purifier pass the
 * admin editor uses before anything is stored.
 */
class BlogGenerator
{
    public function __construct(
        private ClaudeRunner $runner,
        private SiteContext $site,
    ) {}

    /** First turn: research and draft. Creates the Post and its claims. */
    public function draft(Topic $topic, int $authorId, ?string $extraInstructions = null): Post
    {
        $sessionId = (string) Str::uuid();

        $result = $this->runner->run(
            prompt: $this->draftPrompt($topic, $extraInstructions),
            sessionId: $sessionId,
            schema: 'blog_draft.json',
            stage: 'draft',
            userId: $authorId,
        );

        $data = $result['json'] ?? throw new RuntimeException(
            'Generator returned no structured output. Raw: '.Str::limit($result['raw'], 300)
        );

        return DB::transaction(function () use ($data, $topic, $authorId, $result) {
            $post = $this->persist($data, $topic, $authorId, $result['session_id']);
            $topic->update(['status' => 'in_progress', 'post_id' => $post->id]);

            /*
             * Backfill the run that produced this post.
             *
             * The run is logged inside ClaudeRunner before the Post exists —
             * there is nothing to point at yet — so without this the drafting
             * turn is orphaned: the turn counter reads zero on a post that has
             * already had one, and the cost of producing it is invisible on the
             * post it produced. Matching on session_id is exact; a session id is
             * minted per draft and never reused.
             */
            GenerationRun::whereNull('post_id')
                ->where('session_id', $result['session_id'])
                ->update(['post_id' => $post->id]);

            return $post;
        });
    }

    /**
     * A follow-up turn on an existing draft. `$fork` branches the session so an
     * alternative take can be compared against the original rather than
     * replacing it.
     */
    public function revise(Post $post, string $instruction, int $userId, bool $fork = false): Post
    {
        if (blank($post->claude_session_id)) {
            throw new RuntimeException('This post has no generation session to resume.');
        }

        $result = $this->runner->run(
            prompt: $instruction,
            sessionId: $post->claude_session_id,
            resume: true,
            fork: $fork,
            schema: 'blog_draft.json',
            postId: $post->id,
            stage: $fork ? 'fork' : 'revise',
            userId: $userId,
        );

        $data = $result['json'] ?? throw new RuntimeException('Revision returned no structured output.');

        return DB::transaction(function () use ($post, $data, $result, $fork) {
            if ($fork) {
                // Branch: a sibling draft, original untouched.
                $sibling = $this->persist($data, $post->topic, $post->author_id, $result['session_id']);
                $sibling->update(['title' => $sibling->title.' (alt)']);

                return $sibling;
            }

            $this->apply($post, $data);
            $post->update(['claude_session_id' => $result['session_id']]);

            return $post->fresh(['claims']);
        });
    }

    // ── persistence ──────────────────────────────────────────────────────

    private function persist(array $data, ?Topic $topic, int $authorId, string $sessionId): Post
    {
        $body = $this->sanitise($data['body_html'] ?? '');

        $post = Post::create([
            'title' => $data['title'] ?? 'Untitled',
            'slug' => $this->uniqueSlug($data['slug'] ?? $data['title'] ?? 'untitled'),
            'excerpt' => $data['excerpt'] ?? null,
            'body_html' => $body,
            'generated_body_html' => $body,   // frozen: the diff against this is the learning signal
            'status' => 'draft',
            'seo_title' => $data['seo_title'] ?? null,
            'seo_desc' => $data['seo_desc'] ?? null,
            'reading_mins' => $this->readingMinutes($body),
            'author_id' => $authorId,
            'topic_id' => $topic?->id,
            'claude_session_id' => $sessionId,
            'generator_prompt_version' => config('content.prompts.draft_version'),
            'model_id' => config('content.claude.model'),
            'fact_check_state' => 'pending',
            'published_at' => null,
        ]);

        $this->syncClaims($post, $data['claims'] ?? []);

        return $post->load('claims');
    }

    /** Update an existing draft in place, preserving verified claims. */
    private function apply(Post $post, array $data): void
    {
        $body = $this->sanitise($data['body_html'] ?? $post->body_html);

        $post->update([
            'title' => $data['title'] ?? $post->title,
            'excerpt' => $data['excerpt'] ?? $post->excerpt,
            'body_html' => $body,
            'seo_title' => $data['seo_title'] ?? $post->seo_title,
            'seo_desc' => $data['seo_desc'] ?? $post->seo_desc,
            'reading_mins' => $this->readingMinutes($body),
        ]);

        if (array_key_exists('claims', $data)) {
            $this->syncClaims($post, $data['claims']);
        }
    }

    /**
     * Replace the claim set, but keep verification already done: a claim whose
     * text is unchanged keeps its tick, so a wording revision does not silently
     * reset the fact gate and make you re-check twenty rows.
     */
    private function syncClaims(Post $post, array $claims): void
    {
        $verified = $post->claims()->whereNotNull('verified_at')->get()->keyBy(
            fn ($c) => $this->claimKey($c->claim)
        );

        $post->claims()->delete();

        foreach ($claims as $c) {
            if (blank($c['claim'] ?? null)) {
                continue;
            }
            $prior = $verified->get($this->claimKey($c['claim']));

            $post->claims()->create([
                'claim' => $c['claim'],
                'source_url' => $c['source_url'] ?? null,
                'model_confidence' => in_array($c['confidence'] ?? '', ['high', 'medium', 'low'], true)
                    ? $c['confidence'] : 'medium',
                'verified_by' => $prior?->verified_by,
                'verified_at' => $prior?->verified_at,
                'verdict' => $prior?->verdict,
                'note' => $prior?->note,
            ]);
        }

        $post->update(['fact_check_state' => $this->factState($post->fresh())]);
    }

    private function claimKey(string $claim): string
    {
        return md5(Str::squish(Str::lower($claim)));
    }

    private function factState(Post $post): string
    {
        $total = $post->claims()->count();
        if ($total === 0) {
            return 'cleared';
        }
        $done = $post->claims()->whereNotNull('verified_at')->count();

        return match (true) {
            $done === 0 => 'pending',
            $done < $total => 'partial',
            default => 'cleared',
        };
    }

    // ── house-rule validation ────────────────────────────────────────────

    /**
     * Problems worth surfacing to the editor rather than silently accepting.
     * Not fatal — a human is about to read this anyway — but shown in the UI so
     * they are fixed before publish rather than after.
     *
     * @return list<string>
     */
    public function warnings(Post $post, ?Topic $topic = null): array
    {
        $w = [];
        $topic ??= $post->topic;

        if (Str::contains($post->body_html, ['—', '–'])) {
            $w[] = 'Contains an em dash or en dash. House rule forbids both.';
        }
        if (mb_strlen((string) $post->seo_title) > 60) {
            $w[] = 'SEO title is '.mb_strlen((string) $post->seo_title).' chars (limit 60).';
        }
        if (mb_strlen((string) $post->seo_desc) > 160) {
            $w[] = 'Meta description is '.mb_strlen((string) $post->seo_desc).' chars (limit ~155).';
        }
        if ($topic?->bridge_target && ! Str::contains($post->body_html, $topic->bridge_target)) {
            $w[] = "Does not link to its bridge target ({$topic->bridge_target}).";
        }
        /*
         * The on-page checklist from the strategy, enforced rather than
         * remembered. Six placements: title, SEO title, slug, meta description,
         * first 100 words, and one H2.
         */
        if ($topic?->primary_keyword) {
            $kw = Str::lower($topic->primary_keyword);
            $text = Str::lower(strip_tags($post->body_html));
            $first100 = Str::of($text)->explode(' ')->take(100)->join(' ');
            preg_match_all('/<h2>(.*?)<\/h2>/i', $post->body_html, $h2s);

            $missing = collect([
                'title' => Str::contains(Str::lower($post->title), $kw),
                'SEO title' => Str::contains(Str::lower((string) $post->seo_title), $kw),
                'slug' => Str::contains($post->slug, Str::slug($kw)),
                'meta description' => Str::contains(Str::lower((string) $post->seo_desc), $kw),
                'first 100 words' => Str::contains($first100, $kw),
                'an H2' => collect($h2s[1])->contains(fn ($h) => Str::contains(Str::lower(strip_tags($h)), $kw)),
            ])->reject(fn ($ok) => $ok)->keys();

            if ($missing->isNotEmpty()) {
                $w[] = "Primary keyword \"{$topic->primary_keyword}\" missing from: ".$missing->join(', ').'.';
            }
        }

        /*
         * Internal links are the point of the whole content strategy: a post that
         * ranks but sends nobody onward is traffic, not a funnel. The generator
         * gets the closed list of real URLs (SiteContext), so anything outside it
         * is a hallucinated 404 and worth flagging loudly.
         */
        preg_match_all('/href="([^"]+)"/i', $post->body_html, $hrefs);
        $internal = collect($hrefs[1])
            ->filter(fn ($u) => Str::startsWith($u, '/') || Str::contains($u, 'waheed.in'))
            ->map(fn ($u) => Str::of($u)->after('waheed.in')->before('#')->before('?')->rtrim('/')->toString())
            ->filter()
            ->unique()
            ->values();

        if ($internal->count() < 2) {
            $w[] = 'Only '.$internal->count().' internal link(s). Every post should point the reader '
                .'somewhere useful on waheed.in; the strategy wants at least two.';
        }

        $allowed = $this->site->allowedInternalUrls();
        $bogus = $internal->reject(fn ($u) => in_array($u, $allowed, true));
        if ($bogus->isNotEmpty()) {
            $w[] = 'Links to page(s) that do not exist: '.$bogus->join(', ').'. These would 404.';
        }
        $unsourced = $post->claims()->whereNull('source_url')->count();
        if ($unsourced > 0) {
            $w[] = "{$unsourced} claim(s) carry no source URL.";
        }

        /*
         * Recording a source and showing it are different things, and the first
         * generated post got this wrong: it quoted an IslamQA fatwa verbatim and
         * linked nothing, so the sources existed only in the verification table
         * where no reader would ever see them. In a niche where credibility is
         * the whole moat, an unlinked quotation asks the reader to take your word
         * for it. Checking it here means the gap cannot quietly come back.
         */
        $sourced = $post->claims()->whereNotNull('source_url')->pluck('source_url');
        $uncited = $sourced
            ->reject(fn ($url) => Str::contains($post->body_html, $url))
            ->unique()
            ->values();

        if ($uncited->isNotEmpty()) {
            $w[] = $uncited->count().' cited source(s) are never linked in the article: '
                .$uncited->take(3)->map(fn ($u) => parse_url($u, PHP_URL_HOST) ?: $u)->join(', ')
                .($uncited->count() > 3 ? ' and others' : '').'.';
        }
        $words = str_word_count(strip_tags($post->body_html));
        if ($words < 1000) {
            $w[] = "Only {$words} words. Target is 1200-2000.";
        }

        return $w;
    }

    // ── prompt ───────────────────────────────────────────────────────────

    private function draftPrompt(Topic $topic, ?string $extra): string
    {
        $secondary = filled($topic->secondary_keywords)
            ? implode(', ', $topic->secondary_keywords) : 'none specified';
        $bridge = $topic->bridge_target
            ? "REQUIRED: link to {$topic->bridge_target} at least once, with descriptive anchor "
              ."text that reads naturally (never \"click here\" or \"our services\")."
            : 'This is an authority piece with no single service to bridge to, so link to '
              .'whichever pages below are genuinely relevant instead. It still needs internal links.';

        $menu = $this->site->linkMenu($topic);

        return <<<PROMPT
        Write a blog post for waheed.in.

        TITLE (working, improve it if you can): {$topic->title}
        PRIMARY KEYWORD: {$topic->primary_keyword}
        SECONDARY KEYWORDS: {$secondary}
        PILLAR: {$topic->pillar}
        NOTES: {$topic->notes}

        AUDIENCE AND MARKET: Muslim business owners, masjid and charity trustees in
        EUROPE AND THE AMERICAS. Not India, not the Gulf. When you reach for data,
        regulation or examples, use UK, EU, US or Canadian ones. British-leaning
        spelling throughout.

        INTERNAL PAGES YOU MAY LINK TO — this is the complete list. Never invent a
        waheed.in URL that is not here; a made-up link is a 404 for the reader.

        {$menu}

        Requirements:
        - Research first. Search for current figures and verify them against primary
          sources before writing. Check whether any statistic has been superseded.
        - KEYWORD PLACEMENT, all six: the primary keyword goes in the title, the SEO
          title, the slug, the meta description, the first 100 words of the body, and
          at least one H2. Naturally, in a sentence a person would actually write.
        - {$bridge}
        - AT LEAST TWO internal links from the list above, placed where a reader
          would genuinely want them, not bolted onto the end. Every article should
          give the reader somewhere useful to go next on waheed.in.
        - 1200 to 2000 words. Depth over padding.
        - Answer-first: state the verdict in the opening paragraph.
        - Follow the voice and sourcing rules in your system prompt exactly. The
          no-dash rule and the sourcing rule are hard requirements, not preferences.
        - Populate `claims` with EVERY factual assertion you make. A human verifies
          each one before this publishes, so an incomplete list wastes their time and
          a dishonest confidence rating is worse than a low one.
        - Every source you cite in `claims` must also be a clickable <a href> link in
          the article itself, on its first mention, with the source's name as the
          anchor text. Readers in this niche check whether you actually know the
          subject; a quoted ruling they can click through settles that, an unlinked
          one does not. A source recorded but never linked does not count as cited.

        {$extra}
        PROMPT;
    }

    // ── helpers (mirroring Admin\PostController) ─────────────────────────

    private function sanitise(string $html): string
    {
        return Purifier::clean($html);
    }

    private function readingMinutes(string $html): int
    {
        $words = str_word_count(trim(html_entity_decode(strip_tags($html))));

        return max(1, (int) ceil($words / 200));
    }

    private function uniqueSlug(string $base): string
    {
        $slug = Str::slug($base) ?: 'post';
        $candidate = $slug;
        $i = 2;
        while (Post::where('slug', $candidate)->exists()) {
            $candidate = $slug.'-'.$i++;
        }

        return $candidate;
    }
}
