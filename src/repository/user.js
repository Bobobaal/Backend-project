const { tables, getKnex } = require('../data/index');
const uuid = require('uuid');
const { getChildLogger } = require('../core/logging');

const findAll = () => {
  return getKnex()(tables.user)
    .select()
    .orderBy('username', 'ASC');
};

const findById = async (id) => {
  const user = await getKnex()(tables.user)
  .where('id', id)
  .first();

  return user;
}

const findByEmail = async (email) => {
  return await getKnex()(tables.user)
		.where('email', email)
		.first();
}

const createUser = async ({username, email, passwordHash, roles}) => {
  try{
    const id = uuid.v4();
    await getKnex()(tables.user)
    .insert({
      id,
      username,
      email,
      password_hash: passwordHash,
      roles: JSON.stringify(roles),
    });

    return await findById(id);
  }catch(error){
    const logger = getChildLogger('users-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
}

const updateById = async (id, {email}) => {
  try{
    await getKnex()(tables.user)
      .update({email})
      .where('id', id);

    return await findById(id);
  }catch(error){
    const logger = getChildLogger('users-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
}

const deleteById = async (id) => {
  try{
    const rowsAffected = await getKnex()(tables.user)
      .delete()
      .where('id', id);

    return rowsAffected > 0;
  }catch(error){
    const logger = getChildLogger('users-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  createUser,
  updateById,
  deleteById,
};