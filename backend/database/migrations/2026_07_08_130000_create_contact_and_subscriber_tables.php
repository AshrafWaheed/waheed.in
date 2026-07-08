<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('brand');
            $table->string('whatsapp')->nullable();
            $table->string('location')->nullable();
            $table->string('service');
            $table->json('custom_services')->nullable();
            $table->string('stage')->nullable();
            $table->string('budget')->nullable();
            $table->text('message');
            $table->string('timeline')->nullable();
            $table->timestamps();

            $table->index('email');
            $table->index('created_at');
        });

        // Local mirror of who we pushed to the Beehiiv newsletter list, and from
        // where. Beehiiv remains the source of truth for the mailing list itself.
        Schema::create('subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('source')->default('newsletter'); // newsletter | contact
            $table->string('beehiiv_status')->nullable();     // synced | failed | skipped
            $table->timestamps();

            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscribers');
        Schema::dropIfExists('contact_submissions');
    }
};
