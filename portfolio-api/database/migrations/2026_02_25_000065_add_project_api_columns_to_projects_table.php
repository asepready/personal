<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('summary', 500)->nullable()->after('slug');
            $table->string('url')->nullable()->after('description');
            $table->string('repository_url')->nullable()->after('url');
            $table->boolean('is_active')->default(true)->after('end_date');
            $table->boolean('is_featured')->default(false)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['summary', 'url', 'repository_url', 'is_active', 'is_featured']);
        });
    }
};
