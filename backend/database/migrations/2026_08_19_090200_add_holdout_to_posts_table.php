<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The hold-out flag (CONTENT_ENGINE.md §7, "the trap, and the guards").
 *
 * Every tenth generated post is drafted WITHOUT the learned rules. Without a
 * control there is no way to tell a ruleset that is teaching the model
 * something from one that has merely got long: both look like progress, and
 * both feel like progress, and only one of them is.
 *
 * `style_ruleset_version` (already on the table) records which ruleset produced
 * a post; 0 means none were in force. A hold-out is the deliberate 0.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->boolean('holdout')->default(false)->after('style_ruleset_version');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('holdout');
        });
    }
};
