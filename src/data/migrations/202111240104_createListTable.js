const {tables} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.list, (table) => {
      table.uuid('id')
        .primary();

      table.uuid('userId')
        .notNullable();

      table.foreign('userId', 'fk_watch_user')
        .references(`${tables.user}.id`)
        .onDelete('CASCADE');

      table.uuid('movieId')
        .notNullable();

      table.foreign('movieId', 'fk_watch_movie')
        .references(`${tables.movie}.id`)
        .onDelete('CASCADE');

      table.boolean('watched')
        .notNullable();

      table.unique(['userId', 'movieId'], 'idx_combo_userId_movieId_unique');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.list);
  },
};