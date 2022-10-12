const { shutdownData, getKnex, tables } = require('../src/data');

module.exports = async () => {
	await getKnex()(tables.list).delete();
	await getKnex()(tables.movie).delete();
	await getKnex()(tables.user).delete();

	await shutdownData();
};