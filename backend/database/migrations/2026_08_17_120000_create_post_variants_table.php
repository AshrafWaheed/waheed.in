<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Platform variants (CONTENT_ENGINE.md §5 `post_variants`, §6 stage 6).
 *
 * One row per platform per post. Each is a genuinely different piece derived
 * from the same research, not a reprint — see P7. That distinction is why
 * `angle` is stored: it makes "these are actually different" checkable at a
 * glance rather than a claim in a design doc.
 *
 * `source_hash` is the load-bearing column. A variant is derived from a
 * specific state of the article, and the article keeps being edited after the
 * variants exist. Without a hash of what it was derived from, editing the blog
 * post silently leaves four approved variants asserting the old version — and
 * nobody finds out, because nothing looks broken. With it, they go stale
 * visibly and refuse to be treated as current.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('posts')->cascadeOnDelete();
            $table->string('platform', 40);              // key into config('content.platforms')

            $table->string('title');
            $table->longText('body_html');               // plain text lives here too, for text platforms
            $table->json('tags')->nullable();
            $table->text('angle');                       // the distinct angle this one takes

            // draft → approved → queued → published, or failed.
            $table->string('status', 20)->default('draft');

            $table->string('canonical_url', 512);        // always the waheed.in original
            $table->string('external_url', 512)->nullable();

            /*
             * sha1 of the post body this was derived from. Compared against the
             * live body to decide staleness; see the model's isStale().
             */
            $table->string('source_hash', 64);

            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('publish_after')->nullable();
            $table->timestamp('published_at')->nullable();

            $table->unsignedSmallInteger('attempts')->default(0);
            $table->text('last_error')->nullable();

            $table->string('claude_session_id')->nullable();
            $table->string('generator_prompt_version', 20)->nullable();
            $table->string('model_id')->nullable();

            $table->timestamps();

            // One variant per platform per post. Regenerating replaces in place
            // rather than quietly accumulating rival copies of the same thing.
            $table->unique(['post_id', 'platform']);
            $table->index(['status', 'publish_after']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_variants');
    }
};
