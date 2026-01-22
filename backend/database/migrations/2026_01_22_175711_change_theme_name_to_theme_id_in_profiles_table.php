<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Eliminar columna theme_name
            $table->dropColumn('theme_name');
            
            // Agregar columna theme_id con relación a themes
            $table->foreignId('theme_id')->default(1)->constrained('themes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Eliminar relación y columna theme_id
            $table->dropForeign(['theme_id']);
            $table->dropColumn('theme_id');
            
            // Restaurar columna theme_name
            $table->string('theme_name')->default('default');
        });
    }
};
