
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id');
        table.string('username').notNullable().unique({indexName: 'user_unique_uname'});
        table.string('email').unique({indexName: 'user_unique_email'});
        table.string('password').notNullable();
    })
    .createTable('columns', function(table) {
        table.increments('id');
        table.string('title').notNullable();
        table.integer('ownerId').notNullable();
    })
    .createTable('cards', function(table) {
        table.increments('id');
        table.string('title').notNullable();
        table.integer('ownerId').notNullable();
        table.integer('columnId').notNullable();
    })
    .createTable('comments', function(table) {
        table.increments('id');
        table.string('content').notNullable();
        table.integer('ownerId').notNullable();
        table.integer('cardId').notNullable();
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments').dropTable('cards').dropTable('columns').dropTable('users');
};
