module.exports = {
  apps: [
    {
      name: "anitha-dresses",
      script: "npm",
      args: "start",
      cwd: "/var/www/anitha-dresses",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
