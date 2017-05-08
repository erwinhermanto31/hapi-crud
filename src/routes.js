'use strict';

const R = require('ramda');
const { Book } = require('./models');
const Boom = require('boom');

function index(request, reply) {
  Book.findAll({
    attributes: ['id', 'title', 'author'],
  }).then(function(books) {
    reply({ books: books });
  });
}

function show(request, reply) {
  const id = request.params.id;
  Book.findById(id, { attributes: ['id', 'title', 'author'] }).then(function(
    book
  ) {
    if (book) {
      reply({ book: book });
    } else {
      reply(Boom.notFound(`Cannot find book ${id}`));
    }
  });
}

function create(request, reply) {
  const attributes = {
    title: request.payload.book.title,
    author: request.payload.book.author,
  };
  Book.create(attributes).then(function(book) {
    if (book) {
      reply({ book: book });
    } else {
      reply(Boom.badImplementation());
    }
  });
}

function update(request, reply) {
  let updatedBook;
  Book.findById(request.params.id)
    .then(function(book) {
      if (!book) {
        reply.status(404);
        return;
      }

      const attributes = R.pick(['title', 'author'], request.payload.book);
      Object.assign(book, attributes);
      updatedBook = book;
      return book.save();
    })
    .then(function() {
      reply({ book: updatedBook });
    });
}

function destroy(request, reply) {
  Book.findById(request.params.id)
    .then(function(book) {
      if (!book) {
        reply.status(404);
        return;
      }

      return book.destroy();
    })
    .then(function() {
      reply({});
    });
}

function addRoutes(server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      return reply('Hello world');
    },
  });
  server.route({
    method: 'GET',
    path: '/books',
    handler: index,
  });
  server.route({
    method: 'GET',
    path: '/books/{id}',
    handler: show,
  });
  server.route({
    method: 'POST',
    path: '/books',
    handler: create,
  });
  server.route({
    method: ['PATCH', 'POST'],
    path: '/books/{id}',
    handler: update,
  });
  server.route({
    method: ['DELETE'],
    path: '/books/{id}',
    handler: destroy,
  });
}

module.exports = {
  addRoutes,
};
