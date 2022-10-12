const {tables} = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.list).delete();

    await knex(tables.list).insert([
      {
        id: "b44903a4-8eb4-4aab-908d-ce5dd4af598f",
        userId: "1536f5ae-6cfe-4810-a44a-39ff2875535b",
        movieId: "b049a745-f10f-4cad-a887-59f876e8a72c",
        watched: true
      },
      {
        id: "fbd9de54-b263-471c-a472-72cdfea77168",
        userId: "98188940-e698-418f-83b1-f4e026e39367",
        movieId: "8d96cc76-522c-49c9-aad7-a39546d2d94b",
        watched: true
      },
      {
        id: "6093f7b9-b5c8-4497-a1d7-ae0630dc4c57",
        userId: "1536f5ae-6cfe-4810-a44a-39ff2875535b",
        movieId: "8d96cc76-522c-49c9-aad7-a39546d2d94b",
        watched: false
      },
      {
        id: "7692f687-ddfe-4b25-b5f9-fad718fcaeb6",
        userId: "98188940-e698-418f-83b1-f4e026e39367",
        movieId: "b049a745-f10f-4cad-a887-59f876e8a72c",
        watched: false
      },
      {
        id: "b309a83e-8c3c-4d63-8dda-0fb9b8b5c165",
        userId: "b8316264-628d-4cd1-8c05-f015e5717860",
        movieId: "01d7b6aa-076a-473e-b798-9a991e2038c3",
        watched: true
      },
      {
        id: "de804760-563c-4cee-bd21-104a59b47ce2",
        userId: "1536f5ae-6cfe-4810-a44a-39ff2875535b",
        movieId: "dfbec5b6-53b3-40ff-accd-e85a4e0dd1db",
        watched: true
      },
      {
        id: "d5749e2f-cbe4-4a5c-ab22-cf56e8102370",
        userId: "771c9bcb-03a2-46ff-813c-f6c0fd932c29",
        movieId: "dfbec5b6-53b3-40ff-accd-e85a4e0dd1db",
        watched: false
      },
      {
        id: "2fa75e3c-8844-4c81-9faa-e8f7889a006f",
        userId: "b8316264-628d-4cd1-8c05-f015e5717860",
        movieId: "dfbec5b6-53b3-40ff-accd-e85a4e0dd1db",
        watched: true
      },
      {
        id: "06b33a1b-2b82-4426-8199-fc4b93da684c",
        userId: "771c9bcb-03a2-46ff-813c-f6c0fd932c29",
        movieId: "8d96cc76-522c-49c9-aad7-a39546d2d94b",
        watched: false
      },
    ]);
  }
}