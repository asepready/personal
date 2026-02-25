<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_skills', function (Blueprint $table) {
            $table->unsignedSmallInteger('years_experience')->nullable()->after('proficiency_level');
        });
        DB::table('user_skills')->update(['years_experience' => DB::raw('years_of_experience')]);
        Schema::table('user_skills', function (Blueprint $table) {
            $table->dropColumn('years_of_experience');
        });
    }

    public function down(): void
    {
        Schema::table('user_skills', function (Blueprint $table) {
            $table->unsignedSmallInteger('years_of_experience')->nullable()->after('proficiency_level');
        });
        DB::table('user_skills')->update(['years_of_experience' => DB::raw('years_experience')]);
        Schema::table('user_skills', function (Blueprint $table) {
            $table->dropColumn('years_experience');
        });
    }
};
