<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * One row per `claude -p` invocation.
 *
 * Two jobs. Cost visibility (so a runaway conversational loop shows up as a
 * number before it shows up as a bill), and answering "what changed?" when
 * output quality shifts — which it will, once learned style rules start
 * feeding back into the prompt. Without prompt_version + ruleset_version
 * recorded per run, that question is unanswerable.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generation_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->nullable()->constrained('posts')->cascadeOnDelete();
            $table->string('stage');                       // draft | revise | fork | variant
            $table->uuid('session_id')->nullable();        // claude -p --session-id
            $table->string('prompt_version')->nullable();  // e.g. gen-v1
            $table->unsignedInteger('ruleset_version')->nullable();
            $table->string('model_id')->nullable();        // claude-opus-5
            $table->unsignedInteger('input_tokens')->nullable();
            $table->unsignedInteger('output_tokens')->nullable();
            $table->decimal('cost_usd', 10, 6)->nullable();
            $table->unsignedInteger('duration_ms')->nullable();
            $table->integer('exit_code')->nullable();
            $table->text('stderr_excerpt')->nullable();    // truncated; never the full transcript
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['post_id', 'stage']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generation_runs');
    }
};
