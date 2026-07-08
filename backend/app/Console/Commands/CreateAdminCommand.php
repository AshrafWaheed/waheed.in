<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Support\AdminCredentials;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class CreateAdminCommand extends Command
{
    protected $signature = 'admin:create {email} {--name=Admin}';

    protected $description = 'Create a new admin user with a random password (printed once).';

    public function handle(): int
    {
        $email = Str::lower(trim((string) $this->argument('email')));
        $name = trim((string) $this->option('name')) ?: 'Admin';

        $validator = Validator::make(['email' => $email], ['email' => ['required', 'email']]);
        if ($validator->fails()) {
            $this->error('Invalid email address.');

            return self::FAILURE;
        }

        if (User::where('email', $email)->exists()) {
            $this->error("A user with {$email} already exists. Use `admin:reset-password` to rotate its password.");

            return self::FAILURE;
        }

        $password = Str::password(16, letters: true, numbers: true, symbols: true, spaces: false);

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin',
        ]);

        AdminCredentials::write($email, $password);

        $this->newLine();
        $this->info('════════════════════════════════════════════════════');
        $this->info('  WAHEED admin created');
        $this->line('  Login:    https://waheed.in/jundullah');
        $this->line("  Email:    {$email}");
        $this->line("  Password: {$password}");
        $this->line('  (also written to backend/ADMIN_CREDENTIALS.txt — gitignored)');
        $this->info('════════════════════════════════════════════════════');
        $this->newLine();
        $this->warn('Move the password into a manager, then delete ADMIN_CREDENTIALS.txt.');

        return self::SUCCESS;
    }
}
