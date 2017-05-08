process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../src/server');
const { resetDatabase, Book } = require('../src/models');

chai.use(chaiHttp);

describe('/books requests', function() {
  const listener = server.listener;

  beforeEach(resetDatabase);

  describe('GET /books', function() {
    beforeEach(async function() {
      await Book.create({ title: 'Some title', author: 'Algun author' });
    });

    it('works', async function() {
      const response = await chai.request(listener).get('/books');
      expect(response.body.books).to.deep.equal([
        {
          id: 4,
          title: 'Some title',
          author: 'Algun author',
        },
      ]);
    });
  });

  describe('GET /books/:id', function() {
    beforeEach(async function() {
      this.book = await Book.create({
        title: 'Other title',
        author: 'Other author',
      });
    });

    it('works', async function() {
      const response = await chai.request(listener)
        .get(`/books/${this.book.id}`);
      expect(response.body.book).to.deep.equal({
        id: 5,
        title: 'Other title',
        author: 'Other author',
      });
    });

    it('returns status 404 when not found', function(done) {
      chai.request(listener).get('/books/12345').end(function(error, response) {
        expect(response.body).to.deep.equal({
          error: 'Not Found',
          message: 'Cannot find book 12345',
          statusCode: 404,
        });
        expect(response.status).to.equal(404);
        done();
      });
    });
  });

  describe('POST /books (= create)', function() {
    it('works', async function() {
      const response = await chai
        .request(listener)
        .post('/books')
        .send({ book: { title: 'Creator title', author: 'Creator author' } });
      expect(response.body.book.id).not.to.be.null;
      expect(response.body.book).to.deep.include({
        title: 'Creator title',
        author: 'Creator author',
      });
      const loadedBook = await Book.findById(response.body.book.id);
      expect(loadedBook).to.deep.include({
        title: 'Creator title',
        author: 'Creator author',
      });
    });
  });

  describe('PATCH /books/:id (= update)', function() {
    beforeEach(async function() {
      this.book = await Book.create({
        title: 'Original title',
        author: 'Original author',
      });
    });

    it('works', async function() {
      const response = await chai
        .request(listener)
        .patch(`/books/${this.book.id}`)
        .send({ book: { title: 'Updated title' } });
      expect(response.status).to.equal(200);
      expect(response.body.book).to.deep.include({
        title: 'Updated title',
        author: 'Original author',
      });
      await this.book.reload();
      expect(this.book).to.deep.include({
        title: 'Updated title',
        author: 'Original author',
      });
    });
  });

  describe('DELETE /books/:id (= destroy)', function() {
    beforeEach(async function() {
      this.book = await Book.create({
        title: 'Original title',
        author: 'Original author',
      });
    });

    it('works', async function() {
      const response = await chai
        .request(listener)
        .delete(`/books/${this.book.id}`)
        .send({ book: { title: 'Updated title' } });
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({});
      const loadedBook = await Book.findById(this.book.id);
      expect(loadedBook).to.be.null;
    });
  });
});
