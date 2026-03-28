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
    {
      name: 'waheed-backend',
      cwd: '/var/www/waheed.in/backend',
      script: 'php',
      args: 'artisan serve --host=127.0.0.1 --port=8000',
      interpreter: 'none',
      env: {
        APP_ENV: 'production',
      },
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
