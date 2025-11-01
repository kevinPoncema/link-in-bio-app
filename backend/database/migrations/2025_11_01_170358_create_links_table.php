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
        Schema::create('links', function (Blueprint $table) {
            $table->id(); // bigint id PK
            // bigint profile_id FK
            $table->foreignId('profile_id')->constrained()->onDelete('cascade');
            $table->string('title'); // varchar title
            $table->string('url'); // varchar url
            $table->string('icon_class')->nullable(); // varchar icon_class
            $table->integer('order')->default(0); // int order
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('links');
    }
};
