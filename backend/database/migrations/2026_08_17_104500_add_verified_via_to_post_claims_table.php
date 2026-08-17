<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * How a claim came to be verified: someone read the source, or someone accepted
 * a machine pass that read the source.
 *
 * Both are legitimate. What is not legitimate is recording the second as if it
 * were the first, and without this column that is the only thing the schema can
 * express — `verified_by` would name a person who never opened the link.
 *
 * `verified_by` still names the accountable human either way, because accepting
 * a pass is itself a decision someone made and should be answerable for. The
 * column only separates what they did: checked it, or vouched for a check.
 *
 * The reason to keep the distinction at all is that it is the thing you want
 * when a published claim later turns out to be wrong. "Which of our posts went
 * out on an unreviewed agent pass" is answerable in one query with this column
 * and unanswerable without it.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('post_claims', function (Blueprint $table) {
            $table->string('verified_via')->nullable()->after('verified_at'); // human | agent
        });

        // Everything verified before this column existed was verified by hand.
        // (Nothing is, at time of writing, but the backfill keeps the column
        // honest rather than leaving a silent NULL that means "unknown".)
        \DB::table('post_claims')->whereNotNull('verified_at')->update(['verified_via' => 'human']);
    }

    public function down(): void
    {
        Schema::table('post_claims', function (Blueprint $table) {
            $table->dropColumn('verified_via');
        });
    }
};
