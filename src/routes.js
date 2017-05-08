'use strict';

const R = require('ramda');
const { Book } = require('./models');
const Boom = require('boom');

async function index(request, reply) {
  const books = await Book.findAll({
    attributes: ['id', 'title', 'author'],
  });
  reply({ books: books });
}

async function show(request, reply) {
  const id = request.params.id;
  const book = await Book.findById(id, {
    attributes: ['id', 'title', 'author'],
  });
  if (book) {
    reply({ book: book });
  } else {
    reply(Boom.notFound(`Cannot find book ${id}`));
  }
}

async function create(request, reply) {
  const attributes = {
    title: request.payload.book.title,
    author: request.payload.book.author,
  };
  const book = await Book.create(attributes);
  if (book) {
    reply({ book: book });
  } else {
    reply(Boom.badImplementation());
  }
}

async function update(request, reply) {
  const book = await Book.findById(request.params.id);
  if (!book) {
    reply.status(404);
    return;
  }

  const attributes = R.pick(['title', 'author'], request.payload.book);
  Object.assign(book, attributes);
  await book.save();
  reply({ book: book });
}

async function destroy(request, reply) {
  const book = await Book.findById(request.params.id);
  if (!book) {
    reply.status(404);
    return;
  }

  await book.destroy();
  reply({});
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
