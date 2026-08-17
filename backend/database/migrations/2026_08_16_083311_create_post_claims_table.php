<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The fact gate.
 *
 * The generator emits every factual assertion it makes as a row here, with the
 * source it used. A post cannot leave `draft` while any row is unverified.
 *
 * This exists because the first hand-written post in this niche needed two real
 * corrections: a government statistic that had been superseded by a newer survey
 * wave, and a false claim that Shopify is Israeli-owned. Both were caught by
 * deliberate checking. Deliberate checking does not scale to 29 posts, so the
 * check becomes a state machine instead of a habit.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_claims', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('posts')->cascadeOnDelete();
            $table->text('claim');                                  // the assertion, verbatim from the draft
            $table->string('source_url', 1024)->nullable();         // what the model cited, if anything
            $table->string('model_confidence')->default('medium');  // high | medium | low (self-reported)
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->string('verdict')->nullable();                  // confirmed | corrected | removed
            $table->text('note')->nullable();                       // what was wrong, when corrected
            $table->timestamps();

            $table->index(['post_id', 'verified_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_claims');
    }
};
