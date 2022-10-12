const { hashPassword, verifyPassword } = require('../core/password');
const Role = require('../core/roles');
const userRepo = require('../repository/user');
const { generateJWT, verifyJWT } = require('../core/jwt');
const { getChildLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('user-service');
  this.logger.debug(message, meta);
};

const checkAndParseSession = async (authHeader) => {
	if (!authHeader) {
		throw ServiceError.unauthorized('You need to be signed in');
	}

	if (!authHeader.startsWith('Bearer ')) {
		throw ServiceError.unauthorized('Invalid authentication token');
	}

	const authToken = authHeader.substr(7);
	try {
		const {
			roles, userId,
		} = await verifyJWT(authToken);

		return {
			userId,
			roles,
			authToken,
		};
	} catch (error) {
		const logger = getChildLogger('user-service');
    logger.error(error.message, { error });
		throw ServiceError.unauthorized(error.message);
	}
};

const checkRole = (role, roles) => {
	const hasPermission = roles.includes(role);

	if (!hasPermission) {
		throw ServiceError.forbidden('You are not allowed to view this part of the application');
	}
};

const getAll = async () => {
	debugLog('Fetching all users');
  const data = await userRepo.findAll();
  return data.map(makeExposedUser);
}

const getById = async (id) => {
	debugLog(`Fetching user with id ${id}`);
  const user = await userRepo.findById(id);

  if(!user){
    throw ServiceError.notFound(`No user with id ${id} exists`, { id });
  }

  return makeExposedUser(user);
}

const makeExposedUser = ({ id, username, email, roles }) => ({
	id,
	username,
	email,
	roles,
});

const makeLoginData = async (user) => {
  const token = await generateJWT(user);

  return {
		user: makeExposedUser(user),
		token,
	};
}

const register = async ({username, email, password}) => {
	debugLog('Creating a new user', { username });
  const passwordHash = await hashPassword(password);
  const user = await userRepo.createUser({username, email, passwordHash, roles: [Role.USER]});

  return await makeLoginData(user);
}

const login = async (email, password) => {
  const user = await userRepo.findByEmail(email);

  if(!user){
    throw ServiceError.unauthorized('The given email and password do not match');
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid) {
		throw ServiceError.unauthorized('The given email and password do not match');
	}

  return await makeLoginData(user);
}

const updateUser = async (id, { email }) => {
	debugLog(`Updating user with id ${id}`, { email });
  const user = { email };
  return await userRepo.updateById(id, user);
}

const deleteUser = async (id) => {
	debugLog(`Deleting user with id ${id}`);
  const deleted = await userRepo.deleteById(id);
	
	if(!deleted) throw ServiceError.notFound(`No user with id ${id} exists`, { id });
}

module.exports = {
  getAll,
  getById,
  register,
  login,
  updateUser,
  deleteUser,
  checkAndParseSession,
  checkRole
}