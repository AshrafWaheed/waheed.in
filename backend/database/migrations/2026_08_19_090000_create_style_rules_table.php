<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The learning store. See documents/CONTENT_ENGINE.md §7.
 *
 * A rule is an observation about WAHEED's voice, extracted from the edits a
 * human made to generated drafts, proposed to that human, and only then folded
 * into the system prompt. Nothing here reaches a generation without an approval
 * (P6), which is why `status` starts at `proposed` and the compiler reads only
 * `approved`.
 *
 * Versioning is the load-bearing part, and it is why there are two columns
 * rather than one `ruleset_version`. Every change to the approved set mints a
 * new version: an approval stamps `effective_from`, a retirement or a late
 * rejection stamps `effective_to`. The set that was live at version N is then
 * `effective_from <= N and (effective_to is null or effective_to > N)` — so a
 * post that recorded `style_ruleset_version = 6` can have the exact voice that
 * produced it reconstructed years later, which is the whole of P5. A single
 * mutable version counter would only ever tell you the ruleset changed, never
 * what it used to say.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('style_rules', function (Blueprint $table) {
            $table->id();

            // Phrased as an observation ("WAHEED opens with the verdict"), never
            // as a correction ("don't write long introductions"). §7 Tier 2
            // explains why: corrective phrasing makes the model over-correct,
            // which produces a contradicting rule next batch, and the ruleset
            // oscillates instead of converging.
            $table->text('rule');
            $table->string('category')->default('voice'); // voice|structure|sourcing|formatting|faith
            $table->text('rationale')->nullable();

            // proposed | approved | rejected | retired
            $table->string('status')->default('proposed');

            // Up to a handful of {post_id, before, after} triples. Kept because a
            // rule with no evidence is an opinion, and the reviewer is entitled
            // to see what the machine actually saw before agreeing to it.
            $table->json('evidence')->nullable();
            $table->unsignedInteger('evidence_count')->default(0);

            $table->unsignedInteger('effective_from')->nullable();
            $table->unsignedInteger('effective_to')->nullable();

            /*
             * A rule that was retired and later brought back is a NEW row that
             * points at the old one, rather than the old row having its dates
             * rewritten. Reusing the row would overwrite the interval it was
             * previously live for, and the reconstruction above would then
             * quietly lie about every post generated during that interval —
             * which is the one thing the from/to pair exists to prevent.
             */
            $table->foreignId('supersedes_id')->nullable()->constrained('style_rules')->nullOnDelete();

            // Which extraction produced it, and when it was last seen again in
            // the edits. §7: an approved rule not reinforced in 20 posts is a
            // candidate for retirement, because a ruleset that only grows is
            // accumulation rather than learning.
            $table->string('batch')->nullable();
            $table->timestamp('last_reinforced_at')->nullable();

            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('decision_note')->nullable();

            $table->timestamps();

            $table->index(['status', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('style_rules');
    }
};
