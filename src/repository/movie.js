const { tables, getKnex } = require('../data/index');
const uuid = require('uuid');
const { getChildLogger } = require('../core/logging');

const findAll = () => {
  return getKnex()(tables.movie)
    .select()
    .orderBy('title', 'ASC');
};

const findById = async (id) => {
  const movie = await getKnex()(tables.movie)
  .where('id', id)
  .first();

  return movie;
}

const createMovie = async ({title, releaseYear, synopsis, imdbLink}) => {
  try{
    const id = uuid.v4();
    await getKnex()(tables.movie)
    .insert({
      id,
      title,
      releaseYear,
      synopsis,
      imdbLink
    });

    return await findById(id);
  }catch(error){
    const logger = getChildLogger('movies-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
}

const updateById = async (id, {title, releaseYear, synopsis, imdbLink}) => {
  try{
    await getKnex()(tables.movie)
      .update({title, releaseYear, synopsis, imdbLink})
      .where('id', id);

    return await findById(id);
  }catch(error){
    const logger = getChildLogger('movies-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
}

const deleteById = async (id) => {
  try{
    const rowsAffected = await getKnex()(tables.movie)
      .delete()
      .where('id', id);

    return rowsAffected > 0;
  }catch(error){
    const logger = getChildLogger('movies-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
}

module.exports = {
  findAll,
  findById,
  createMovie,
  updateById,
  deleteById,
};