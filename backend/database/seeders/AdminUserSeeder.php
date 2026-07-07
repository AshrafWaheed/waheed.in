<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    private const ADMIN_EMAIL = 'ashraf@waheed.in';
    private const ADMIN_NAME = 'Ashraf Waheed';

    /**
     * Seed the WAHEED admin account.
     *
     * Idempotent: if the admin already exists we do NOT touch the password
     * (so re-running seeds never rotates a live credential). A fresh account
     * gets a random 12-char password, written once to a gitignored file.
     */
    public function run(): void
    {
        $existing = User::where('email', self::ADMIN_EMAIL)->first();

        if ($existing) {
            // Make sure the role is correct, but leave the password alone.
            if ($existing->role !== 'admin') {
                $existing->update(['role' => 'admin']);
            }
            $this->command?->warn('Admin '.self::ADMIN_EMAIL.' already exists — password left unchanged.');

            return;
        }

        $password = Str::password(12, letters: true, numbers: true, symbols: true, spaces: false);

        User::create([
            'name' => self::ADMIN_NAME,
            'email' => self::ADMIN_EMAIL,
            'password' => Hash::make($password),
            'role' => 'admin',
        ]);

        $this->writeCredentialsFile($password);

        $this->command?->newLine();
        $this->command?->info('════════════════════════════════════════════════════');
        $this->command?->info('  WAHEED admin created');
        $this->command?->info('  Email:    '.self::ADMIN_EMAIL);
        $this->command?->info('  Password: '.$password);
        $this->command?->info('  (also written to backend/ADMIN_CREDENTIALS.txt)');
        $this->command?->info('════════════════════════════════════════════════════');
        $this->command?->newLine();
    }

    private function writeCredentialsFile(string $password): void
    {
        $path = base_path('ADMIN_CREDENTIALS.txt');
        $body = <<<TXT
        WAHEED.in — Admin credentials
        Generated: {$this->now()}

        Login URL: https://waheed.in/jundullah
        Email:     {$this->emailForFile()}
        Password:  {$password}

        → Move this into your password manager, then DELETE this file.
        → This file is gitignored and will never be committed.
        TXT;

        file_put_contents($path, $body."\n");
        @chmod($path, 0600);
    }

    private function now(): string
    {
        return now()->toDayDateTimeString();
    }

    private function emailForFile(): string
    {
        return self::ADMIN_EMAIL;
    }
}
