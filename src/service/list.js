const listRepo = require('../repository/list');
const { getChildLogger } = require('../core/logging');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('list-service');
  this.logger.debug(message, meta);
};

const getAllWatched = async () => {
  debugLog('Fetching all lists');
  return await listRepo.findAll();
}

const getAllByUserId = async (userId) => {
  debugLog(`Fetching list of user with id ${userId}`)
  return await listRepo.findAllByUserId(userId);
}

const addToList = async ({userId, movieId, watched}) => {
  const item = {userId, movieId, watched};
  debugLog(`Adding new item to list of user with id ${userId}`, item);
  return await listRepo.createListItem(item);
}

const updateById = async (id, {userId, movieId, watched}) => {
  const item = {userId, movieId, watched};
  debugLog(`Updating listitem with id ${id}`, item);
  return await listRepo.updateById(id, item);
}

const deleteFromListById = async (id) => {
  debugLog(`Deleting listiem with id ${id}`);
  return await listRepo.deleteListItem(id);
}

module.exports = {
  getAllWatched,
  getAllByUserId,
  addToList,
  updateById,
  deleteFromListById
}