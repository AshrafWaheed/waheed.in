<?php

namespace App\Services\Content;

use App\Models\Post;
use App\Models\PostVariant;
use Illuminate\Support\Str;
use Mews\Purifier\Facades\Purifier;
use RuntimeException;

/**
 * Derives platform variants from a finished post (CONTENT_ENGINE.md §6 stage 6).
 *
 * The design decision that matters here is that a variant is a DIFFERENT PIECE,
 * not the article reformatted (§2 P7). Reprinting one article across four
 * platforms produces four near-duplicates competing with the original, and a
 * canonical tag is a hint search engines may ignore, not a rule they obey.
 * Writing a genuinely different angle that links back removes the duplication
 * at source. It is also simply better: nobody wants to read the same piece
 * twice because they follow you in two places.
 *
 * Each variant FORKS the post's drafting session rather than starting cold.
 * That inherits the research the model already did — the sources it read, the
 * rulings it checked — without the variants contaminating each other, because
 * a fork branches instead of continuing. A cold call would re-research the
 * same ground, cost a full draft, and risk citing something the article does
 * not, which would put an unverified claim in front of readers by the back
 * door: variants have no fact gate of their own, so they inherit the article's
 * checked ground or they are not safe to ship.
 */
class VariantGenerator
{
    public function __construct(
        private ClaudeRunner $runner,
        private SiteContext $site,
    ) {}

    /**
     * Generate (or regenerate) one platform's variant.
     *
     * Regeneration replaces in place: the unique index on (post_id, platform)
     * means there is one variant per platform, never a pile of rival takes.
     */
    public function generate(Post $post, string $platform, int $userId, ?string $extra = null): PostVariant
    {
        $spec = config("content.platforms.{$platform}")
            ?? throw new RuntimeException("Unknown platform: {$platform}");

        if (blank($post->body_html)) {
            throw new RuntimeException('This post has no body to derive a variant from.');
        }

        /*
         * The fact gate reaches through to syndication. A variant argues from
         * the article's material, so shipping one from an unchecked article
         * puts unverified claims on five platforms instead of one — and those
         * copies are the ones we cannot quietly correct later.
         */
        if (! $post->factCheckCleared()) {
            $n = $post->claims()->unverified()->count();
            throw new RuntimeException(
                "This post still has {$n} unverified claim(s). Variants argue from the same "
                .'material, so they inherit the same problem on every platform they reach. '
                .'Clear the fact gate first.'
            );
        }

        $existing = $post->variants()->where('platform', $platform)->first();

        $result = $this->runner->run(
            prompt: $this->prompt($post, $platform, $spec, $extra),
            // Fork the drafting session: inherit the research, stay out of the
            // siblings' way. Falls back to a cold session for posts written by
            // hand, which have no session to fork.
            sessionId: $post->claude_session_id,
            resume: filled($post->claude_session_id),
            fork: filled($post->claude_session_id),
            schema: 'platform_variant.json',
            postId: $post->id,
            stage: "variant:{$platform}",
            userId: $userId,
        );

        $data = $result['json'] ?? throw new RuntimeException(
            'The model did not return a variant matching the schema.'
        );

        $body = $spec['format'] === 'html'
            ? Purifier::clean($data['body'])
            // Plain-text platforms: strip any markup that crept in rather than
            // letting raw tags be pasted into a LinkedIn box.
            : trim(html_entity_decode(strip_tags($data['body'])));

        $attrs = [
            'title' => Str::limit(trim($data['title']), 140, ''),
            'body_html' => $body,
            'tags' => array_values(array_slice($data['tags'] ?? [], 0, 8)),
            'angle' => trim($data['angle']),
            'status' => 'draft',
            'canonical_url' => $this->canonicalUrl($post),
            'source_hash' => PostVariant::hashOf($post->body_html),
            // A regenerated variant is unapproved again by construction. It is
            // different text; the previous approval was of something else.
            'approved_at' => null,
            'approved_by' => null,
            'claude_session_id' => $result['session_id'],
            'generator_prompt_version' => config('content.prompts.variant_version'),
            'model_id' => config('content.claude.model'),
        ];

        if ($existing) {
            $existing->update($attrs);

            return $existing->fresh();
        }

        return $post->variants()->create(['platform' => $platform] + $attrs);
    }

    /**
     * House rules for a variant, checked after generation.
     *
     * Same reasoning as the blog's warnings(): a rule that only lives in the
     * prompt is a request, and models drift. Stating it twice means a drift
     * shows up as a warning instead of shipping.
     *
     * @return list<string>
     */
    public function warnings(PostVariant $variant): array
    {
        $out = [];
        $spec = $variant->spec();
        $body = $variant->body_html;
        $text = trim(html_entity_decode(strip_tags($body)));

        if ($spec && mb_strlen($text) > $spec['max_chars']) {
            $out[] = sprintf(
                '%s: %s characters, over the %s limit for %s.',
                'Too long', number_format(mb_strlen($text)), number_format($spec['max_chars']),
                $spec['label'],
            );
        }

        if (! str_contains($body, $variant->canonical_url)) {
            $out[] = 'No link back to the waheed.in original. Without it this is a duplicate '
                .'competing with the article instead of feeding it.';
        }

        if ($spec && $spec['format'] === 'text' && preg_match('/<[a-z][^>]*>/i', $body)) {
            $out[] = 'Contains HTML tags, but this platform takes plain text.';
        }

        if (str_contains($body, '—')) {
            $out[] = 'Contains an em dash. House rule: none.';
        }

        if ($variant->post && Str::of($variant->title)->lower()->trim()
            ->exactly(Str::lower(trim($variant->post->title)))) {
            $out[] = 'Title is identical to the article. A variant is a different piece and '
                .'needs its own headline.';
        }

        if ($variant->isStale()) {
            $out[] = 'The article has been edited since this was written from it. Regenerate, '
                .'or check by hand that it still reflects the piece.';
        }

        return $out;
    }

    private function canonicalUrl(Post $post): string
    {
        return config('content.site_url').'/blog/'.$post->slug;
    }

    private function prompt(Post $post, string $platform, array $spec, ?string $extra): string
    {
        $canonical = $this->canonicalUrl($post);
        $article = trim(html_entity_decode(strip_tags($post->body_html)));

        // Siblings already written, so the model can differ from them too rather
        // than converging on the same "best" angle five times.
        $siblings = $post->variants()
            ->where('platform', '!=', $platform)
            ->get()
            ->map(fn ($v) => "- {$v->spec()['label']}: {$v->angle}")
            ->implode("\n");
        $siblingBlock = $siblings !== ''
            ? "ANGLES ALREADY TAKEN by other platforms' versions. Yours must not duplicate "
              ."these:\n{$siblings}"
            : 'No other versions exist yet, so you are setting the first angle.';

        $format = $spec['format'] === 'text'
            ? "PLAIN TEXT. No HTML, no markdown, no asterisks for emphasis. Blank lines between "
              ."paragraphs. Put the link to the article on its own line at the end."
            : 'Simple semantic HTML only: p, h2, h3, ul, ol, li, strong, em, a, blockquote. No '
              .'divs, no classes, no inline styles.';

        /*
         * Give the model a target below the real ceiling and validate against
         * the ceiling. First run came in at 3,139 characters against LinkedIn's
         * 3,000 — models overshoot a stated limit by a few percent, so stating
         * the true limit as the target reliably produces something a person then
         * has to trim by hand. Budget for the drift instead.
         */
        $target = (int) floor($spec['max_chars'] * 0.85);

        return <<<PROMPT
        You wrote the article below. Now write the {$spec['label']} version.

        This is NOT a repost, a summary, or the article reformatted. It is a
        DIFFERENT PIECE arguing from the same research, which links back to the
        article for the full case. If someone read both, the second must still be
        worth their time. Two near-identical pieces on two domains compete with each
        other in search and insult a reader who follows you in both places.

        THE ANGLE FOR {$spec['label']}:
        {$spec['angle']}

        {$siblingBlock}

        HARD REQUIREMENTS
        - Format: {$format}
        - Length: aim for {$target} characters. {$spec['max_chars']} is a hard ceiling
          the platform enforces, and going over means a person has to cut it by hand.
        - Link to the article exactly once, using this URL verbatim: {$canonical}
          Point at it as where the full reasoning and the sources live. Do not
          pretend the reader has already read it.
        - Every factual claim you make must be one the article already makes and
          already cites. You have the research from writing it. Do NOT introduce a
          new statistic, ruling, date or attribution here: the article's claims have
          been checked by a human one at a time, and anything new arrives unchecked
          on a platform we cannot quietly correct later. If the angle needs a fact
          the article does not have, change the angle.
        - Audience is Europe and the Americas. British-leaning spelling.
        - Follow the voice rules in your system prompt. The no-dash rule is hard.
        - `angle` must state in one sentence what this piece argues that the article
          does not. A human reads that field to check these are actually different.

        THE ARTICLE
        Title: {$post->title}
        URL: {$canonical}

        {$article}

        {$extra}
        PROMPT;
    }
}
