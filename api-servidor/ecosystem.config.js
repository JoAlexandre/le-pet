module.exports = {
  apps: [{
    name: 'api-lepet',
    script: './dist/main.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    // Restart strategies
    min_uptime: 10000,
    max_restarts: 10,
    restart_delay: 4000,
    // Environment variables
    env_production: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 8080
    }
  }]
};
