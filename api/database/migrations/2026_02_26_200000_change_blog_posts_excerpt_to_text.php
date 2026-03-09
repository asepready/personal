<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite (testing) does not support MySQL's MODIFY syntax, and its TEXT/VARCHAR
        // limits are effectively dynamic, so we can skip this migration there.
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        DB::statement('ALTER TABLE blog_posts MODIFY excerpt TEXT NULL');
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        DB::statement('ALTER TABLE blog_posts MODIFY excerpt VARCHAR(255) NULL');
    }
};
