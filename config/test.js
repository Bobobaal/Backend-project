module.exports = {
  log: {
    level:'silly',
    disabled:true
  },
  cors: {
		origins: ['http://localhost:3000'],
		maxAge: 3 * 60 * 60,
	},
  database: {
    client: 'mysql2',
    host: 'localhost',
    port: '3306',
    name: 'watchlist_test',
  },
  auth: {
    argon: {
      saltLength: 16,
			hashLength: 32,
			timeCost: 6,
			memoryCost: 2 ** 17,
    },
    jwt: {
      secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
			expirationInterval: 60 * 60* 1000, // ms (1 hour)
			issuer: 'watchlist.dieter.vmb',
			audience: 'watchlist.dieter.vmb',
    },
  }
}