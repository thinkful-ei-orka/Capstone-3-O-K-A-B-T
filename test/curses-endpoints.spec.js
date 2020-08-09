const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Curses Endpoints', function () {
  let db;
  const { testCurses, testUsers, testBlessings } = helpers.makeFixtures();

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

  describe.skip('GET /api/curses/', () => {
    context('no available curses for blessing', () => {
      beforeEach('insert users', () => {
        helpers.seedUsers(db, testUsers);
      });
      it(`responds with 200 and "No available curses"`, () => {
        return supertest(app)
          .get('/api/curses/')
          .set('Authorization', `Bearer ${helpers.makeAuthHeader(testUsers[0])}`)
          .expect(200)
          .expect(res => expect(res.body).to.eql('No available curses'));
      });
    });

    context('no user is logged in', () => {
      it('responds with 401  and {error: "Missing bearer token"}', () => {
        return supertest(app)
          .get('/api/curses/')
          .expect(401)
          .expect(res => expect(res.body).to.eql({ error: 'Missing bearer token' }));
      });
    });

    context('curses available for blessing', () => {
      let pulledCurse;
      let editedCurse;
      before('seed curses/users', () => {
        helpers.seedBlessings(db, testBlessings);
        helpers.seedUsers(db, testUsers);
        helpers.seedCurses(db, testCurses);
      });
      it('responds with 200 and the curse information for blessing', () => {
        this.retries(2);
        return supertest(app)
          .get('/api/curses/')
          .set('Authorization', `Bearer ${helpers.makeAuthHeader(testUsers[1])}`)
          .expect(200)
          .expect(async res => {
            pulledCurse = res.body.curse_id;
            expect(res.body).to.have.property('curse_id');
            expect(res.body).to.have.property('curse');
            editedCurse = await helpers.getCurseById(db, res.body.curse_id);
          });
      });

      it('updates the curse in the database with the user_id and time of pull', async () => {
        expect(editedCurse.pulled_by).to.eql(testUsers[1].user_id);
        expect(Date.now() - new Date(editedCurse.pulled_time) < 10000);
      });
    });
  });

  describe('POST /api/curses/', () => {

  });
  describe.skip('PATCH /api/curses/', () => {

  });
  describe.skip('DELETE /api/curses/', () => {

  });
});
