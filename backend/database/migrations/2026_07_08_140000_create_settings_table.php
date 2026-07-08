<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Seed the two site-mode flags. Coming-soon starts ON to match the
        // pre-launch state; maintenance starts OFF.
        $now = now();
        DB::table('settings')->insert([
            ['key' => 'coming_soon', 'value' => '1', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'maintenance', 'value' => '0', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
