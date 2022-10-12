const {tables} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.movie, (table) => {
      table.uuid('id')
        .primary();

      table.string('title', 255)
        .notNullable();

      table.integer('releaseYear', 4)
        .notNullable();
      
      table.text('synopsis')
        .notNullable();

      table.string('imdbLink', 50)
        .notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.movie);
  },
};