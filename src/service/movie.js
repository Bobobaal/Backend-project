const movieRepo = require('../repository/movie');
const { getChildLogger } = require('../core/logging');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('movie-service');
  this.logger.debug(message, meta);
};

const getAll = async () => {
  //debugLog('Fetching all movies');
  return await movieRepo.findAll();
}

const getById = async (id) => {
  //debugLog(`Fetching movie with id ${id}`);
  const movie = await movieRepo.findById(id);
  if(!movie) throw ServiceError.notFound(`There is no movie with id ${id}`, { id });
  return movie
}

const createMovie = async ({title, releaseYear, synopsis, imdbLink}) => {
  const movie = {title, releaseYear, synopsis, imdbLink};
  //debugLog('Creating new movie', movie);
  return await movieRepo.createMovie(movie);
}
const updateById = async (id, {title, releaseYear, synopsis, imdbLink}) => {
  const movie = {title, releaseYear, synopsis, imdbLink};
  debugLog(`Updating movie with id ${id}`, movie);
	return await movieRepo.updateById(id, movie);
}
const deleteById = async (id) => {
  debugLog(`Deleting movie with id ${id}`);
	return await movieRepo.deleteById(id);
}

module.exports = {
  getAll,
  getById,
  createMovie,
  updateById,
  deleteById,
}