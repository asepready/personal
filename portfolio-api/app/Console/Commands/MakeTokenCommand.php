<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MakeTokenCommand extends Command
{
    protected $signature = 'make:token {user_id? : The ID of the user to assign the token to (default: first user)}';

    protected $description = 'Generate an API token and assign it to a user';

    public function handle(): int
    {
        $userId = $this->argument('user_id');
        $user = $userId
            ? User::find($userId)
            : User::query()->first();

        if (! $user) {
            $this->error('No user found.');

            return 1;
        }

        $token = Str::random(60);
        $user->api_token = $token;
        $user->save();

        $this->info('API token generated successfully.');
        $this->line('User: ' . $user->full_name . ' (ID: ' . $user->id . ')');
        $this->line('Token: ' . $token);
        $this->newLine();
        $this->comment('Use in requests: Authorization: Bearer ' . $token);

        return 0;
    }
}
