<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tracking for generation work that has been handed to the queue.
 *
 * Generation runs for one to nine minutes. It was called synchronously from the
 * controller, which meant the browser held a connection open across the whole
 * thing — and behind nginx's 60s fastcgi_read_timeout it simply could not
 * finish. Every generation through the UI 504'd. It went unnoticed because the
 * drafts so far were produced from the CLI, where no proxy is in the way.
 *
 * So the work moves to the queue and the request returns immediately. This
 * table is what the UI polls: one row per generation, carrying enough state to
 * say "still running", "done, here is what it made", or "failed, here is why"
 * without the caller needing to understand jobs.
 *
 * It is deliberately separate from `generation_runs`. That table is the
 * accounting record of a claude invocation — tokens, cost, exit code — written
 * once the process ends. This one is the lifecycle of a request a human made,
 * and it exists from the moment they click, including for the case where the
 * process never returns at all.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('kind', 20);                  // draft | revise | variant
            $table->string('status', 20)->default('queued'); // queued | running | done | failed

            $table->foreignId('topic_id')->nullable()->constrained('topics')->nullOnDelete();
            $table->foreignId('post_id')->nullable()->constrained('posts')->nullOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('post_variants')->nullOnDelete();
            $table->string('platform', 40)->nullable();

            // Inputs, so a job is re-runnable and inspectable after the fact.
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('author_id')->nullable();
            $table->text('instructions')->nullable();
            $table->boolean('fork')->default(false);

            $table->text('error')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();

            // "Is anything running for this post/topic" is the query the UI makes
            // on every poll, so it gets an index rather than a table scan.
            $table->index(['status', 'post_id']);
            $table->index(['status', 'topic_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_jobs');
    }
};
