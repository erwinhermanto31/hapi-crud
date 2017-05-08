'use strict';

const Hapi = require('hapi');
const Good = require('Good');
const config = require('config');

const { Book } = require('./models');
const { addRoutes } = require('./routes');

process.on('unhandledRejection', (error, promise) => {
  console.error('##### Unhandled Promise Rejection: #####');
  console.error((error && error.stack) || error);
  console.error(promise);
  throw error;
});

const server = new Hapi.Server();
const port = config.port;
server.connection({ port: port });
server.register(
  {
    register: Good,
    options: {
      reporters: {
        console: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [
              {
                response: '*',
                log: '*',
              },
            ],
          },
          {
            module: 'good-console',
          },
          'stdout',
        ],
      },
    },
  },
  err => {
    if (err) {
      throw err;
    }

    addRoutes(server);

    server.start(err => {
      if (err) {
        throw err;
      }

      console.log('Listening on port ' + port);
    });
  }
);

module.exports = server; // for testing
