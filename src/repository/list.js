const { tables, getKnex } = require('../data/index');
const uuid = require('uuid');
const { getChildLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  `${tables.list}.id`, "userId", 'watched',
  `${tables.movie}.id as movieId`, `${tables.movie}.title as movieTitle`
];

const formatMovie = ({ movieId, movieTitle, ...rest }) => ({
  ...rest,
  movie: {
    id: movieId,
    title: movieTitle,
  },
});

const findAll = async () => {
  const watchListItems = await getKnex()(tables.list)
    .select(SELECT_COLUMNS)
    .orderBy('userId', 'ASC')
    .join(tables.movie, `${tables.list}.movieId`, '=', `${tables.movie}.id`);

  return watchListItems.map(formatMovie);
};

const findById = async (id) => {
  const watchListItem = await getKnex()(tables.list)
  .first(SELECT_COLUMNS)
  .where(`${tables.list}.id`, id)
  .join(tables.movie, `${tables.list}.movieId`, '=', `${tables.movie}.id`);

  return watchListItem && formatMovie(watchListItem);
}

const findAllByUserId = async (id) => {
  const watchListItems = await getKnex()(tables.list)
  .select(SELECT_COLUMNS)
  .where(`${tables.list}.userId`, id)
  .join(tables.movie, `${tables.list}.movieId`, '=', `${tables.movie}.id`);
  
  return watchListItems.map(formatMovie);
}

const createListItem = async ({userId, movieId, watched}) => {
  try{
    const id = uuid.v4();
    await getKnex()(tables.list)
    .insert({
      id,
      userId,
      movieId,
      watched
    });

    return await findById(id);
  }catch(error){
    const logger = getChildLogger('lists-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
}

const updateById = async (id, {userId, movieId, watched}) => {
  try{
    await getKnex()(tables.list)
      .update({userId, movieId, watched})
      .where('id', id);

    return await findById(id);
  }catch(error){
    const logger = getChildLogger('lists-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
}

const deleteListItem = async (id) => {
  try{
    const rowsAffected = await getKnex()(tables.list)
      .delete()
      .where('id', id);

    return rowsAffected > 0;
  }catch(error){
    const logger = getChildLogger('lists-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
}

module.exports = {
  findAll,
  findById,
  findAllByUserId,
  createListItem,
  updateById,
  deleteListItem,
};