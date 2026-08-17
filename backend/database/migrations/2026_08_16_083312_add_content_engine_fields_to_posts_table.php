<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Content-engine columns on the existing posts table.
 *
 * `claude_session_id` is what makes the draft screen conversational: Laravel
 * mints the UUID, `claude -p --session-id` uses it, and every follow-up turn
 * resumes the same session rather than starting cold.
 *
 * The three provenance columns exist so a post can always answer which prompt,
 * which learned-ruleset version, and which model produced it. Posts written by
 * hand leave them null, which is the correct signal.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->uuid('claude_session_id')->nullable()->after('author_id');
            $table->foreignId('topic_id')->nullable()->after('claude_session_id')
                ->constrained('topics')->nullOnDelete();
            $table->string('generator_prompt_version')->nullable()->after('topic_id');
            $table->unsignedInteger('style_ruleset_version')->nullable()->after('generator_prompt_version');
            $table->string('model_id')->nullable()->after('style_ruleset_version');
            // pending | partial | cleared. Hand-written posts start 'cleared'
            // (nothing to check); generated ones start 'pending'.
            $table->string('fact_check_state')->default('cleared')->after('model_id');
            $table->timestamp('indexed_at')->nullable()->after('published_at');
            // Snapshot of body_html as generated, before human editing. The diff
            // between this and the published body is the learning signal.
            $table->longText('generated_body_html')->nullable()->after('body_html');

            $table->index('fact_check_state');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['topic_id']);
            $table->dropIndex(['fact_check_state']);
            $table->dropColumn([
                'claude_session_id', 'topic_id', 'generator_prompt_version',
                'style_ruleset_version', 'model_id', 'fact_check_state',
                'indexed_at', 'generated_body_html',
            ]);
        });
    }
};
