// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/panic-button'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
