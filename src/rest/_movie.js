const Router = require('@koa/router');
const movieService = require('../service/movie');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');
const Joi = require('joi');
const validate = require('./_validation.js');

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Represents movies
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - title
 *             - releaseYear
 *             - synopsis
 *             - imdbLink
 *           properties:
 *             title:
 *               type: "string"
 *             releaseYear:
 *               type: "integer"
 *             synopsis:
 *               type: "string"
 *             imdbLink:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Movie"
 *     MoviesList:
 *       allOf:
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Movie"
 *   examples:
 *     Movie:
 *       id: "b049a745-f10f-4cad-a887-59f876e8a72c"
 *       title: "Stargate"
 *       releaseYear: 1994
 *       synopsis: "An interstellar teleportation device, found in Egypt, leads to a planet with humans resembling ancient Egyptians who worship the god Ra."
 *       imdbLink: "https://www.imdb.com/title/tt0111282/"
 *   requestBodies:
 *     NewMovie:
 *       description: The new movie info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Edge Of Tomorrow"
 *               releaseYear:
 *                 type: integer
 *                 example: 2014
 *               synopsis:
 *                 type: string
 *                 example: "A soldier fighting aliens gets to relive the same day over and over again, the day restarting every time he dies."
 *               imdbLink:
 *                 type: string
 *                 example: "https://www.imdb.com/title/tt1631867/"
 *     MovieUpdate:
 *       description: Edited version of a default existing movie (year changed +1 year)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Stargate"
 *               releaseYear:
 *                 type: integer
 *                 example: 1995
 *               synopsis:
 *                 type: string
 *                 example: "An interstellar teleportation device, found in Egypt, leads to a planet with humans resembling ancient Egyptians who worship the god Ra."
 *               imdbLink:
 *                 type: string
 *                 example: "https://www.imdb.com/title/tt0111282/"
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     security:
 *        - bearerAuth: []
 *     summary: Get all movies ordered by their title from A-Z (Logged in user)
 *     description: Gives back a list of all the movies sorted from A-Z to a logged in user.
 *     tags:
 *      - Movies
 *     responses:
 *       200:
 *         description: List of movies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MoviesList"
 */
const getAllMovies = async (ctx) => {
  ctx.body = await movieService.getAll();
}

/**
 * @swagger
 * /api/movies:
 *   post:
 *     security:
 *        - bearerAuth: []
 *     summary: Create a new movie (Trusted user)
 *     description: Let's a trusted user create a new movie other users can add to their watchlist.
 *     tags:
 *      - Movies
 *     requestBody:
 *       $ref: "#/components/requestBodies/NewMovie"
 *     responses:
 *       201:
 *         description: The created movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewMovie"
 */
const createMovie = async (ctx) => {
  const newMovie = await movieService.createMovie(ctx.request.body);
  ctx.body = newMovie;
  ctx.status = 201;
}

createMovie.validationScheme = {
  body: {
    title: Joi.string(),
    releaseYear: Joi.number().integer().positive(),
    synopsis: Joi.string(),
    imdbLink: Joi.string().pattern(/(?:http:\/\/|https:\/\/)?(?:www\.)?(?:imdb.com\/title\/)?(tt)/, {name: "validImdbLink"}),
  },
}

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     security:
 *        - bearerAuth: []
 *     summary: Get a single movie (Logged in user)
 *     description: Gives back the information of a single movie to an user that's logged in.
 *     tags:
 *      - Movies
 *     parameters:
 *       - $ref: "#/components/parameters/idParamMovie"
 *     responses:
 *       200:
 *         description: The requested movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Movie"
 */
const getMovieById = async (ctx) => {
  ctx.body = await movieService.getById(ctx.params.id);
}

getMovieById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     security:
 *        - bearerAuth: []
 *     summary: Updates an existing movie (Trusted user)
 *     description: Let's a trusted user update the information of an existing movie.
 *     tags:
 *      - Movies
 *     parameters:
 *       - $ref: "#/components/parameters/idParamMovie"
 *     requestBody:
 *       $ref: "#/components/requestBodies/MovieUpdate"
 *     responses:
 *       200:
 *         description: The updated movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Movie"
 */
const updateMovie = async (ctx) => {
  ctx.body = await movieService.updateById(ctx.params.id, ctx.request.body);
}

updateMovie.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    title: Joi.string(),
    releaseYear: Joi.number().integer().positive(),
    synopsis: Joi.string(),
    imdbLink: Joi.string().pattern(/(?:http:\/\/|https:\/\/)?(?:www\.)?(?:imdb.com\/title\/)?(tt)/, {name: "validImdbLink"}),
  },
}

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     security:
 *        - bearerAuth: []
 *     summary: Deletes a movie (Admin user)
 *     description: Let's an admin user delete a movie from the database.
 *     tags:
 *      - Movies
 *     parameters:
 *       - $ref: "#/components/parameters/idParamMovie"
 *     responses:
 *       204:
 *         description: No response, the delete was successful
 */
const deleteMovie = async (ctx) => {
  await movieService.deleteById(ctx.params.id);
  ctx.status = 204;
}

deleteMovie.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
}

module.exports = (app) => {
  const router = new Router({
    prefix: '/movies',
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);
  const requireTrusted = makeRequireRole(Role.TRUSTEDUSER);

  router.get('/', requireAuthentication, getAllMovies);
  router.post('/', requireAuthentication, validate(createMovie.validationScheme), requireTrusted, createMovie);
  router.get('/:id', requireAuthentication, validate(getMovieById.validationScheme), getMovieById);
  router.put('/:id', requireAuthentication, validate(updateMovie.validationScheme), requireTrusted, updateMovie);
  router.delete('/:id', requireAuthentication, validate(deleteMovie.validationScheme), requireAdmin ,deleteMovie);

  app.use(router.routes()).use(router.allowedMethods());
}