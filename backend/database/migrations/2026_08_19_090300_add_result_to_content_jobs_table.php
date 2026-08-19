<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * What a job produced, for jobs whose product is not a row somewhere else.
 *
 * A draft job finishes and the browser goes to the post; a variant job finishes
 * and the browser goes to the variant. A learning batch finishes and there is
 * nowhere to go: it produced a handful of proposals and a paragraph about what
 * it decided not to propose, and the poller needs somewhere to read that from.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('content_jobs', function (Blueprint $table) {
            $table->json('result')->nullable()->after('error');
        });
    }

    public function down(): void
    {
        Schema::table('content_jobs', function (Blueprint $table) {
            $table->dropColumn('result');
        });
    }
};
