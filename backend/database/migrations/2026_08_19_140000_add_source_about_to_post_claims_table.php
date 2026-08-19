<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `gen-v4`: what the cited page is ABOUT, in the model's own words.
 *
 * The first full fact-check pass read 35 claims against their sources. Nothing
 * was invented — every hadith number, every fatwa ruling, every legal figure
 * held up. All three failures were the same thing: citation drift, right
 * substance behind the wrong pointer.
 *
 *   claim 127  cited a fatwa that never discusses the requirement it was cited for
 *   claim 152  called a ruling "conditions in contracts"; it is about MARRIAGE contracts
 *   claim 137  true, and carried no citation at all
 *
 * The important part is what did NOT predict them. `model_confidence` was
 * useless here: two of the three sat in the `high` bucket. Confidence measures
 * how sure the model is of the assertion, and the assertions were fine. What
 * would have caught all three is whether the page cited is about the thing the
 * claim asserts, and no self-rating can express that because it is a
 * relationship between two things rather than a property of one.
 *
 * So the model now has to describe the source independently of the claim. A
 * mismatch between "this claim says X" and "this page is about Y" is visible to
 * a human in one second, where checking it currently means opening the tab.
 *
 * Null on everything written before gen-v4, which is the honest signal: those
 * claims were never asked.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('post_claims', function (Blueprint $table) {
            $table->text('source_about')->nullable()->after('source_url');
        });
    }

    public function down(): void
    {
        Schema::table('post_claims', function (Blueprint $table) {
            $table->dropColumn('source_about');
        });
    }
};
