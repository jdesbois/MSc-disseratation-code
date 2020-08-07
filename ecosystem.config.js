module.exports = {
  apps : [{
    name: 'PKE graph',
    script: 'app.js',
    watch: '.',
    instances: 'max',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]

};
