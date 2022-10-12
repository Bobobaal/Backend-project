const config = require('config');
const PORT = config.get('PORT')

module.exports = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Watchlist API with Swagger',
        version: '3.0.0',
        description: 'This is an application made as a project for school',
        license: {
          name: 'MIT',
          url: 'https://spdx.org/licenses/MIT.html',
        },
        contact: {
          name: 'Dieter Van Meerbeeck',
          url: 'http://portfolio-dieter.dx.am/',
          email: 'dieter.vanmeerbeeck@student.hogent.be',
        },
      },
      servers: [
        {
          url: `http://localhost:${PORT}/`,
          description: "Local server"
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      },
    },
    apis: ['./src/rest/*.js'],
  };