const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Blessings Endpoints', function () {
  let db;
  const { testBlessings } = helpers.makeFixtures();

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

  describe('GET /api/blessings/', () => {
    beforeEach('insert blessings', () => {
      helpers.seedBlessings(db, testBlessings);
    });

    it('responds 200 and all available blessing responses', () => {
      return supertest(app)
        .get('/api/blessings/')
        .expect(200)
        .expect(res => {
          expect(res.body).to.eql(testBlessings);
        });
    });
  });

});