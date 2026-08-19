<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tier 1 of the learning system: every human edit to a generated draft, kept.
 *
 * `posts.generated_body_html` already froze the draft as the model wrote it,
 * and the diff against `posts.body_html` is the signal. That single pair is not
 * enough on its own, for two reasons found while building this phase:
 *
 *   1. It only ever holds ONE diff. Edit, then ask for a revision, and the
 *      revision overwrites `body_html` — the human's edit is gone from the pair
 *      for ever, and it was the highest-value row in the corpus.
 *   2. Its meaning changes silently. `generated_body_html` is re-frozen on each
 *      machine turn (it has to be, or the diff attributes the model's own
 *      revisions to a human), so the surviving pair says something different
 *      after every revise.
 *
 * A row per save fixes both. Both sides are stored in full rather than one side
 * plus a delta: at 29 posts this is a couple of megabytes, and it makes each row
 * a self-contained pair that can be re-diffed later with a better algorithm
 * without needing its neighbours to still exist.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_edits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            $table->longText('before_html');
            $table->longText('after_html');

            // Denormalised so the corpus can be filtered ("show me the edits
            // that actually changed something") without rehydrating megabytes
            // of HTML to find out.
            $table->unsignedInteger('words_before')->default(0);
            $table->unsignedInteger('words_after')->default(0);
            $table->unsignedInteger('paragraphs_changed')->default(0);
            // Words on the heavier side of each changed block, summed. This is
            // the numerator of the edit-burden figure the hold-out comparison
            // turns on, computed once here rather than by re-diffing every post
            // on every page load.
            $table->unsignedInteger('words_touched')->default(0);

            // Whether the model had already been through a revise turn when this
            // edit was made. An edit to a first draft and an edit to something
            // the human already steered are different evidence.
            $table->unsignedInteger('turn')->default(1);

            // Set once an extraction batch has read this row, so batches do not
            // re-derive the same rules from the same edits every time they run.
            $table->string('consumed_by_batch')->nullable();

            $table->timestamps();

            $table->index(['post_id', 'created_at']);
            $table->index('consumed_by_batch');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_edits');
    }
};
