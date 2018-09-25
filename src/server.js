'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Good = require('Good');
const config = require('config');

const { Barang } = require('./models');
const { addRoutes } = require('./routes');

process.on('unhandledRejection', (error, promise) => {
  console.error('##### Unhandled Promise Rejection: #####');
  console.error((error && error.stack) || error);
  console.error(promise);
  throw error;
});

const server = new Hapi.Server();
const port = config.port;
server.connection({ "host": "localhost","port":"8080" ,routes: {cors: {origin: ['http://localhost:8080/barangs']} }});
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
