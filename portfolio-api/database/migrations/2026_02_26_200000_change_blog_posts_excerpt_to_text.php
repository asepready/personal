<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE blog_posts MODIFY excerpt TEXT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE blog_posts MODIFY excerpt VARCHAR(255) NULL');
    }
};
