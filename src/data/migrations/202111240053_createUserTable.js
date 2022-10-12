const {tables} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.user, (table) => {
      table.uuid('id')
        .primary();

      table.string('username')
        .notNullable();

      table.unique('username', 'idx_user_username_unique');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.user);
  },
};