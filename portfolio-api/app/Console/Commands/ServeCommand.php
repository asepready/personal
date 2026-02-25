<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ServeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'serve {--host=127.0.0.1 : The host to serve on} {--port=8000 : The port to serve on}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start the development server';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $host = $this->option('host');
        $port = $this->option('port');
        $base = base_path('public');

        $this->info("Lumen development server started: http://{$host}:{$port}");
        $this->info('Press Ctrl+C to stop.');

        passthru(sprintf(
            'php -S %s:%s -t %s',
            $host,
            $port,
            escapeshellarg($base)
        ), $status);

        return $status ?? 0;
    }
}
