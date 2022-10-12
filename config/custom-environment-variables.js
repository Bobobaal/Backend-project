module.exports = {
  env:'NODE_ENV',
  database: {
    username: 'DATABASE_USERNAME',
    password: 'DATABASE_PASSWORD',
    host: 'DATABASE_HOST',
    port: 'DATABASE_PORT',
    name: 'DATABASE_NAME'
  },
  auth:{
    jwt:{
      secret: 'JWT_SECRET'
    }
  }
}