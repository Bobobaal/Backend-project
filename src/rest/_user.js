const Router = require('@koa/router');
const userService = require('../service/user');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');
const Joi = require('joi');
const validate = require('./_validation');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Represents users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - username
 *             - email
 *             - password
 *             - roles
 *           properties:
 *             username:
 *               type: "string"
 *             email:
 *               type: "email"
 *             password:
 *               type: "string"
 *             roles:
 *               type: "array"
 *               items:
 *                 type: "string"
 *           example:
 *             $ref: "#/components/examples/User"
 *     UserWithToken:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - username
 *             - email
 *             - password
 *             - roles
 *             - token
 *           properties:
 *             username:
 *               type: "string"
 *             email:
 *               type: "email"
 *             password:
 *               type: "string"
 *             roles:
 *               type: "array"
 *               items:
 *                 type: "string"
 *             token:
 *               type: "JWT"
 *           example:
 *             $ref: "#/components/examples/UserWithToken"
 *     UsersList:
 *       allOf:
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *   examples:
 *     User:
 *       id: "1536f5ae-6cfe-4810-a44a-39ff2875535b"
 *       username: "Test1"
 *       email: "test1@hotmail.com"
 *       password_hash: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4"
 *       roles:
 *         - "admin"
 *         - "user"
 *     UserWithToken:
 *       id: "1536f5ae-6cfe-4810-a44a-39ff2875535b"
 *       username: "Test1"
 *       email: "test1@hotmail.com"
 *       password_hash: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4"
 *       roles:
 *         - "admin"
 *         - "user"
 *       token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNTM2ZjVhZS02Y2ZlLTQ4MTAtYTQ0YS0zOWZmMjg3NTUzNWIiLCJyb2xlcyI6WyJhZG1pbiIsInVzZXIiLCJ0cnVzdGVkIl0sImlhdCI6MTYzOTQ5MTM4MywiZXhwIjoxNjM5NDk0OTgzLCJhdWQiOiJ3YXRjaGxpc3QuZGlldGVyLnZtYiIsImlzcyI6IndhdGNobGlzdC5kaWV0ZXIudm1iIiwic3ViIjoiYXV0aCJ9.6NFnUBQuDtvWSNQBnouuQDfDopcKan449IjCPoeWybA"
 *   requestBodies:
 *     NewUser:
 *       description: The new user info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Test5"
 *               email:
 *                 type: email
 *                 example: "test5@hotmail.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     LoginUser:
 *       description: User login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: email
 *                 example: "test1@hotmail.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     UserUpdate:
 *       description: Edited version of a default existing user (password changed to 123456789).
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Test2"
 *               email:
 *                 type: email
 *                 example: "test2@hotmail.com"
 *               password:
 *                 type: password
 *                 example: "123456789"
 *               roles:
 *                 type: string
 *                 example:
 *                    - "user"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     security:
 *        - bearerAuth: []
 *     summary: Return a list of all users (Admin user)
 *     tags:
 *      - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersList"
 */
const getAllUsers = async (ctx) => {
  ctx.body = await userService.getAll();
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     description: Logs a user in with the given email and password
 *     tags:
 *      - Users
 *     requestBody:
 *       $ref: "#/components/requestBodies/LoginUser"
 *     responses:
 *       200:
 *         description: The logged in user with its auth token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserWithToken"
 */
const login = async (ctx) => {
	const {email, password } = ctx.request.body;
	const session = await userService.login(email, password);
	ctx.body = session;
};

login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registers a new user
 *     description: Registers a new user with the given username, email and password
 *     tags:
 *      - Users
 *     requestBody:
 *       $ref: "#/components/requestBodies/NewUser"
 *     responses:
 *       200:
 *         description: The created user with its auth token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserWithToken"
 */
const register = async (ctx) => {
	const session = await userService.register(ctx.request.body);
	ctx.body = session;
};

register.validationScheme = {
  body: {
    username: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).min(8).max(30),
  },
};

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     security:
 *        - bearerAuth: []
 *     summary: Get a single user (Admin user)
 *     description: Gives back the information of a single user to an admin user.
 *     tags:
 *      - Users
 *     parameters:
 *       - $ref: "#/components/parameters/idParamUser"
 *     responses:
 *       200:
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
const getUserById = async (ctx) => {
  ctx.body = await userService.getById(ctx.params.id);
};

getUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     security:
 *        - bearerAuth: []
 *     summary: Updates an existing user (Logged in user)
 *     description: Let's a logged in user update the information of themselves user.
 *     tags:
 *      - Users
 *     parameters:
 *       - $ref: "#/components/parameters/idParamUser"
 *     requestBody:
 *       $ref: "#/components/requestBodies/UserUpdate"
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
const updateUser = async (ctx) => {
  ctx.body = await userService.updateUser(ctx.params.id, ctx.request.body);
};

updateUser.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    email: Joi.string().email(),
  },
};

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     security:
 *        - bearerAuth: []
 *     summary: Deletes an user (Admin user)
 *     description: Let's an admin user delete an user from the database.
 *     tags:
 *      - Users
 *     parameters:
 *       - $ref: "#/components/parameters/idParamUser"
 *     responses:
 *       204:
 *         description: No response, the delete was successful
 */
const deleteUser = async (ctx) => {
  await userService.deleteUser(ctx.params.id);
  ctx.status = 204;
};

deleteUser.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/users',
  });

  router.post('/login', validate(login.validationScheme), login);
  router.post('/register', validate(register.validationScheme), register);

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get('/', requireAuthentication, requireAdmin, getAllUsers);
  router.get('/:id', requireAuthentication, validate(getUserById.validationScheme), getUserById);
  router.put('/:id', requireAuthentication, validate(updateUser.validationScheme), updateUser);
  router.delete('/:id', requireAuthentication, validate(deleteUser.validationScheme), requireAdmin, deleteUser);

  app.use(router.routes()).use(router.allowedMethods());
}