const {tables} = require('..');
const Role = require('../../core/roles');

module.exports = {
  seed: async (knex) => {
    await knex(tables.user).delete();

    await knex(tables.user).insert([
      {
        id: "1536f5ae-6cfe-4810-a44a-39ff2875535b",
        username: "Test1",
        email: "test1@hotmail.com",
        password_hash: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        roles: JSON.stringify([Role.ADMIN, Role.USER, Role.TRUSTEDUSER])
      },
      {
        id: "98188940-e698-418f-83b1-f4e026e39367",
        username: "Test2",
        email: "test2@hotmail.com",
        password_hash: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        roles: JSON.stringify([Role.USER])
      },
      {
        id: "b8316264-628d-4cd1-8c05-f015e5717860",
        username: "Test3",
        email: "test3@hotmail.com",
        password_hash: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        roles: JSON.stringify([Role.USER, Role.TRUSTEDUSER])
      },
      {
        id: "771c9bcb-03a2-46ff-813c-f6c0fd932c29",
        username: "Test4",
        email: "test4@hotmail.com",
        password_hash: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        roles: JSON.stringify([Role.USER])
      },
    ]);
  }
}