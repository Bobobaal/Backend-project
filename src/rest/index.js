const Router = require('@koa/router');
const installMovieRouter = require('./_movie');
const installUserRouter = require('./_user');
const installListRouter = require('./_list');

/**
 * @swagger
 * components:
 *   schemas:
 *     Base:
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: "uuid"
 *       example:
 *         id: "01d7b6aa-076a-473e-b798-9a991e2038c3"
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     idParamMovie:
 *       in: path
 *       name: id
 *       description: ID of the movie to fetch/update/delete, (default value is the ID from the movie Stargate)
 *       required: true
 *       schema:
 *         type: string
 *         format: "uuid"
 *         default: b049a745-f10f-4cad-a887-59f876e8a72c
 *     idParamUser:
 *       in: path
 *       name: id
 *       description: ID of the user to fetch/update/delete, (default value is the ID from the user test2)
 *       required: true
 *       schema:
 *         type: string
 *         format: "uuid"
 *         default: 98188940-e698-418f-83b1-f4e026e39367
 *     idParamUserList:
 *       in: path
 *       name: userId
 *       description: ID of the user to fetch/update/delete, (default value is the ID from the user test2)
 *       required: true
 *       schema:
 *         type: string
 *         format: "uuid"
 *         default: 98188940-e698-418f-83b1-f4e026e39367
 *     idParamList:
 *       in: path
 *       name: id
 *       description: "ID of the listitem to fetch/update/delete, (default value is the ID of a listitem belonging to user Test4 containing movie Star Trek: The Future Begins)"
 *       required: true
 *       schema:
 *         type: string
 *         format: "uuid"
 *         default: 06b33a1b-2b82-4426-8199-fc4b93da684c
 */

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installMovieRouter(router);
  installUserRouter(router);
  installListRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};