const Router = require('@koa/router');
const listService = require('../service/list');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');
const Joi = require('joi');
const validate = require('./_validation');

/**
 * @swagger
 * tags:
 *   name: List
 *   description: Represents watchlists
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ListItem:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - userId
 *             - movieId
 *             - watched
 *           properties:
 *             userId:
 *               type: "uuid"
 *             movieId:
 *               type: "uuid"
 *             watched:
 *               type: "boolean"
 *           example:
 *             $ref: "#/components/examples/ListItem"
 *     WatchList:
 *       allOf:
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ListItem"
 *   examples:
 *     ListItem:
 *       id: "06b33a1b-2b82-4426-8199-fc4b93da684c"
 *       movieId: "771c9bcb-03a2-46ff-813c-f6c0fd932c29"
 *       userId: "8d96cc76-522c-49c9-aad7-a39546d2d94b"
 *       watched: false
 *   requestBodies:
 *     NewItem:
 *       description: The new item to add to a user's list.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: uuid
 *                 example: "1536f5ae-6cfe-4810-a44a-39ff2875535b"
 *               movieId:
 *                 type: uuid
 *                 example: "01d7b6aa-076a-473e-b798-9a991e2038c3"
 *               watched:
 *                 type: boolean
 *                 example: false
 *     ListItemUpdate:
 *       description: "Changed to value of watched to true for user Test4's listitem containing movie Star Trek: The Future Begins."
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: uuid
 *                 example: "771c9bcb-03a2-46ff-813c-f6c0fd932c29"
 *               movieId:
 *                 type: uuid
 *                 example: "8d96cc76-522c-49c9-aad7-a39546d2d94b"
 *               watched:
 *                 type: boolean
 *                 example: true
 */

/**
 * @swagger
 * /api/list:
 *   get:
 *     security:
 *        - bearerAuth: []
 *     summary: Get all listitems ordered by the various userId's from A-Z (Admin user)
 *     description: Gives back a list of every all created listitems by users order by the userId's
 *     tags:
 *      - List
 *     responses:
 *       200:
 *         description: List of all the created listitems
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WatchList"
 */
const getAllWatched = async (ctx) => {
  ctx.body = await listService.getAllWatched();
}

/**
 * @swagger
 * /api/list:
 *   post:
 *     security:
 *        - bearerAuth: []
 *     summary: Create a new listitem (Logged in user)
 *     description: Let's a logged in user create a new listitem that gets added to their watchlist.
 *     tags:
 *      - List
 *     requestBody:
 *       $ref: "#/components/requestBodies/NewItem"
 *     responses:
 *       201:
 *         description: The created listitem that's added to the user's watchlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListItem"
 */
const addToList = async (ctx) => {
  const newListItem = await listService.addToList(ctx.request.body);
  ctx.body = newListItem;
  ctx.status = 201;
}

addToList.validationScheme = {
  body: {
    userId: Joi.string().uuid(),
    movieId: Joi.string().uuid(),
    watched: Joi.boolean()
  }
}

/**
 * @swagger
 * /api/list/{userId}:
 *   get:
 *     security:
 *        - bearerAuth: []
 *     summary: Get full list of a specific user (Logged in user)
 *     description: Gives back the full list of a specific user.
 *     tags:
 *      - List
 *     parameters:
 *       - $ref: "#/components/parameters/idParamUserList"
 *     responses:
 *       200:
 *         description: The user's watchlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WatchList"
 */
const getAllByUserId = async (ctx) => {
  ctx.body = await listService.getAllByUserId(ctx.params.userId);
}

getAllByUserId.validationScheme = {
  params: {
    userId: Joi.string().uuid(),
  }
}

/**
 * @swagger
 * /api/list/{id}:
 *   put:
 *     security:
 *        - bearerAuth: []
 *     summary: Updates a listitem (Logged in user)
 *     description: Let's an user update a listitem in their watchlist.
 *     tags:
 *      - List
 *     parameters:
 *       - $ref: "#/components/parameters/idParamList"
 *     requestBody:
 *       $ref: "#/components/requestBodies/ListItemUpdate"
 *     responses:
 *       200:
 *         description: The updated listitem
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListItem"
 */
const updateWatched = async (ctx) => {
  ctx.body = await listService.updateById(ctx.params.id, ctx.request.body);
}

updateWatched.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    userId: Joi.string().uuid(),
    movieId: Joi.string().uuid(),
    watched: Joi.boolean(),
  }
}

/**
 * @swagger
 * /api/list/{id}:
 *   delete:
 *     security:
 *        - bearerAuth: []
 *     summary: Deletes an item from the list (Logged in user)
 *     description: Let's a logged in user delete an item from their watchlist.
 *     tags:
 *      - List
 *     parameters:
 *       - $ref: "#/components/parameters/idParamList"
 *     responses:
 *       204:
 *         description: No response, the delete was successful
 */
const deleteFromListById = async (ctx) => {
  await listService.deleteFromListById(ctx.params.id);
  ctx.status = 204
}

deleteFromListById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  }
}

module.exports = (app) => {
  const router = new Router({
    prefix: '/list',
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get('/', requireAuthentication, requireAdmin, getAllWatched);
  router.post('/', requireAuthentication, validate(addToList.validationScheme), addToList);
  router.get('/:userId', requireAuthentication, validate(getAllByUserId.validationScheme), getAllByUserId);
  router.put('/:id', requireAuthentication, validate(updateWatched.validationScheme), updateWatched);
  router.delete('/:id', requireAuthentication, validate(deleteFromListById.validationScheme), deleteFromListById);

  app.use(router.routes()).use(router.allowedMethods());
}