module.exports = {
  apps: [
    {
      name: 'ersin-site',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: process.env.PM2_APP_DIR || '/var/www/ersin-site',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,  // Can be overridden via .env.production
      },
      error_file: (process.env.PM2_LOG_DIR || '/var/log/pm2') + '/ersin-site-error.log',
      out_file: (process.env.PM2_LOG_DIR || '/var/log/pm2') + '/ersin-site-out.log',
      log_file: (process.env.PM2_LOG_DIR || '/var/log/pm2') + '/ersin-site.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
    },
  ],
};

