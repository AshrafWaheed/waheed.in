module.exports = {
  apps: [
    {
      name: 'waheed-frontend',
      cwd: '/var/www/waheed.in/frontend',
      script: 'npm',
      args: 'run start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      restart_delay: 3000,
      max_restarts: 10,
    },

    /*
     * Queue worker for the booking module: confirmation/cancellation/reminder
     * email and the HubSpot sync, all of which are dispatched rather than run
     * inline so nothing slow sits between a visitor pressing "Confirm" and
     * seeing their Meet link.
     *
     * `--max-time=3600` recycles the process hourly. A long-lived PHP worker
     * holds its bootstrapped container forever, so config and code changes are
     * invisible to it until it restarts — recycling means a deploy takes effect
     * within the hour even if nobody remembers to `pm2 restart` it.
     */
    {
      name: 'waheed-queue',
      cwd: '/var/www/waheed.in/backend',
      script: 'php',
      args: 'artisan queue:work --queue=default --sleep=3 --tries=3 --max-time=3600',
      interpreter: 'none',
      autorestart: true,
      restart_delay: 5000,
      max_restarts: 50,
    },

    /*
     * NOTE: there is deliberately no `waheed-backend` app here.
     *
     * Laravel is served by nginx + php-fpm on 127.0.0.1:8000, not by
     * `artisan serve`. The old pm2 entry for it was stale and starting it would
     * fail on an already-bound port — or worse, quietly shadow the real one.
     */
  ],
};
