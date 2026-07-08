<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Support\AdminCredentials;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ResetAdminPasswordCommand extends Command
{
    protected $signature = 'admin:reset-password {email} {--password= : Set an explicit password (min 12 chars); otherwise a random one is generated}';

    protected $description = 'Rotate an admin password. Revokes all existing API tokens for that user.';

    public function handle(): int
    {
        $email = Str::lower(trim((string) $this->argument('email')));

        $user = User::where('email', $email)->first();
        if (! $user) {
            $this->error("No user found with {$email}.");

            return self::FAILURE;
        }
        if (! $user->isAdmin()) {
            $this->error("{$email} is not an admin account.");

            return self::FAILURE;
        }

        $explicit = $this->option('password');
        if ($explicit !== null) {
            if (strlen($explicit) < 12) {
                $this->error('An explicit password must be at least 12 characters.');

                return self::FAILURE;
            }
            $password = $explicit;
        } else {
            $password = Str::password(16, letters: true, numbers: true, symbols: true, spaces: false);
        }

        $user->forceFill(['password' => Hash::make($password)])->save();

        // A password change should invalidate any outstanding sessions/tokens.
        $revoked = $user->tokens()->delete();

        AdminCredentials::write($email, $password);

        $this->newLine();
        $this->info('════════════════════════════════════════════════════');
        $this->info('  Password rotated');
        $this->line("  Email:    {$email}");
        $this->line("  Password: {$password}");
        $this->line("  Revoked {$revoked} existing token(s) — all sessions logged out.");
        $this->line('  (also written to backend/ADMIN_CREDENTIALS.txt — gitignored)');
        $this->info('════════════════════════════════════════════════════');
        $this->newLine();
        $this->warn('Move the password into a manager, then delete ADMIN_CREDENTIALS.txt.');

        return self::SUCCESS;
    }
}
