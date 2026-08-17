<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A second, separate lane on the fact gate: what a machine found when it checked.
 *
 * The gate itself is unchanged and deliberately so. `Post::factCheckCleared()`
 * reads `verified_at`, and nothing here writes to it. An agent pass can never
 * clear a post for publishing — only a person can. That is the whole point of
 * P1 (documents/CONTENT_ENGINE.md §2) and it has to be true structurally rather
 * than by convention, because the convention is exactly what erodes at 3am on
 * post 19 when there are 35 claims and a deadline.
 *
 * What the lane is for is throughput. A human checking 35 claims cold reads
 * every source. A human checking 35 claims that a machine has already run
 * against their sources reads the three it flagged and spot-checks the rest.
 * The verdict a person records is still theirs; they are just no longer the
 * one doing the fetching.
 *
 * Storing it beside the human columns rather than in them also keeps the two
 * disagreeable. If the agent says confirmed and the person says corrected, both
 * survive in the row, which is the only way we ever learn that the agent pass
 * is drifting.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('post_claims', function (Blueprint $table) {
            // confirmed | corrected | removed — same vocabulary as the human
            // verdict so the two are directly comparable.
            $table->string('agent_verdict')->nullable()->after('note');
            $table->text('agent_note')->nullable()->after('agent_verdict');

            // Where the agent thinks the source *should* point. Kept apart from
            // source_url so the model's original citation stays on the record:
            // a citation that drifted is a signal about the generator prompt,
            // and overwriting it destroys the evidence.
            $table->string('agent_source_url', 1024)->nullable()->after('agent_note');

            $table->timestamp('agent_checked_at')->nullable()->after('agent_source_url');
            $table->string('agent_model')->nullable()->after('agent_checked_at');
        });
    }

    public function down(): void
    {
        Schema::table('post_claims', function (Blueprint $table) {
            $table->dropColumn([
                'agent_verdict', 'agent_note', 'agent_source_url',
                'agent_checked_at', 'agent_model',
            ]);
        });
    }
};
