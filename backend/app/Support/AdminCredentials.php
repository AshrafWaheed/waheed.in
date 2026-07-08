<?php

namespace App\Support;

class AdminCredentials
{
    /**
     * Write admin credentials to the gitignored ADMIN_CREDENTIALS.txt (0600).
     * A throwaway hand-off file: the operator moves it into a manager, then
     * deletes it. Never committed (see .gitignore).
     */
    public static function write(string $email, string $password): void
    {
        $path = base_path('ADMIN_CREDENTIALS.txt');
        $now = now()->toDayDateTimeString();

        $body = <<<TXT
        WAHEED.in — Admin credentials
        Generated: {$now}

        Login URL: https://waheed.in/jundullah
        Email:     {$email}
        Password:  {$password}

        → Move this into your password manager, then DELETE this file.
        → This file is gitignored and will never be committed.
        TXT;

        file_put_contents($path, $body."\n");
        @chmod($path, 0600);
    }
}
