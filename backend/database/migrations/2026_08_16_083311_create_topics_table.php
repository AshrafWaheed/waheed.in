<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The content engine's work queue.
 *
 * Seeded from the keyword strategy (documents/CONTENT_ENGINE.md §5) so every
 * topic arrives carrying the metadata a good post needs — target keyword, the
 * service page it bridges to, its pillar. A free-text "what shall I write
 * about" box throws all of that away and produces generic output; picking from
 * this queue means the on-page checklist is enforced by the data model rather
 * than by remembering it.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('pillar');                          // halal-income | halal-marketing | web-app-software | islamic-branding | charities-masjids
            $table->string('primary_keyword');
            $table->json('secondary_keywords')->nullable();
            $table->string('difficulty')->default('medium');   // easy | medium | hard | low-comp
            $table->string('bridge_target')->nullable();       // service page this post must link to
            $table->unsignedInteger('priority')->default(500); // lower sorts first; strategy's first-12 get 1..12
            $table->string('status')->default('queued');       // queued | in_progress | published | parked
            $table->foreignId('post_id')->nullable()->constrained('posts')->nullOnDelete();
            $table->text('notes')->nullable();                 // angle, what to cover, what to avoid
            $table->timestamps();

            $table->index(['status', 'priority']);
            $table->index('pillar');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('topics');
    }
};
