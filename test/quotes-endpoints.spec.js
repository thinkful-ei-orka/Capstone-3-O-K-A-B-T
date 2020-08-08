const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Blessings Endpoints', function () {
  let db;
  const { testQuotes } = helpers.makeFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/quotes/', () => {
    beforeEach('insert quotes', () => {
      helpers.seedQuotes(db, testQuotes);
    });

    it('responds 200 and a quote', () => {
      return supertest(app)
        .get('/api/quotes/')
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.property('quote');
          expect(res.body).to.have.property('source');
          expect(testQuotes.some(quote => quote.quote_text === res.body.quote));
          expect(testQuotes.some(quote => res.body.quote === quote.quote_text ? res.body.source === quote.quote_source : false));
        });
    });
  });

});