module.exports = {
  apps: [
    {
      name: 'ersin-site',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/ersin-site',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/pm2/ersin-site-error.log',
      out_file: '/var/log/pm2/ersin-site-out.log',
      log_file: '/var/log/pm2/ersin-site.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
    },
  ],
};

