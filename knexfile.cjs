// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    client: 'postgresql',
    connection: {
      database: 'trello_objection',
      user:     'test',
      password: 'test'
    },
    pool: {
      min: 0,
      max: 90
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};
