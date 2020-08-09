const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');

describe.only('Curses Endpoints', function () {
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

  describe('GET /api/curses/', () => {
    context('no available curses for blessing', () => {
      beforeEach('insert users', () => {
        helpers.seedUsers(db, testUsers);
      });
      after('cleanup', () => helpers.cleanTables(db));
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
      before('seed blessings/users/curses', () => {
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

      it('updates the curse in the database with the user_id and time of pull', () => {
        expect(editedCurse.pulled_by).to.eql(testUsers[1].user_id);
        expect(Date.now() - new Date(editedCurse.pulled_time) < 10000);
      });
    });
  });

  describe.only('POST /api/curses/', () => {
    context('user is anonymous', () => {
      it(`responds with 201 and 'Curse sent annonymously' and user:null`, () => {
        return supertest(app)
          .post('/api/curses/')
          .send({ curse: 'Testing for a valid curse' })
          .expect(201, { message: 'Curse sent annonymously', curse: 'Testing for a valid curse', user: null });
      });
    });

    context('user is signed in', () => {
      before('seed users', () => {
        helpers.seedUsers(db, testUsers);
      });
      context('no curse field in body', () => {
        it(`responds with 400 and "'curse' field is required in body"`, () => {
          return supertest(app)
            .post('/api/curses/')
            .set('Authorization', `Bearer ${helpers.makeAuthHeader(testUsers[0])}`)
            .send()
            .expect(400, `"'curse' field is required in body"`);
        });
      });
      context('input is empty', () => {
        it(`responds with 400 and 'Cannot send an empty curse'`, () => {
          return supertest(app)
            .post('/api/curses/')
            .set('Authorization', `Bearer ${helpers.makeAuthHeader(testUsers[0])}`)
            .send({ curse: "" })
            .expect(400, '"Cannot send an empty curse"');
        });
      });
      context('input is less than 15 characters', () => {
        it(`responds with 400 and 'Must be longer than 10 characters'`, () => {
          return supertest(app)
            .post('/api/curses/')
            .set('Authorization', `Bearer ${helpers.makeAuthHeader(testUsers[0])}`)
            .send({ curse: "Test" })
            .expect(400, '"Must be longer than 10 characters"');
        });
      });
      context('input is less than 3 words', () => {
        it(`responds with 400 and 'Must be longer than 3 words'`, () => {
          return supertest(app)
            .post('/api/curses/')
            .set('Authorization', `Bearer ${helpers.makeAuthHeader(testUsers[0])}`)
            .send({ curse: "Test curse" })
            .expect(400, '"Must be longer than 3 words"');
        });
      });
      context('input is more than 400 characters', () => {
        it(`responds with 400 and 'Must be less than 400 characters'`, () => {
          return supertest(app)
            .post('/api/curses/')
            .set('Authorization', `Bearer ${helpers.makeAuthHeader(testUsers[0])}`)
            .send({ curse: "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678 9 0 1" })
            .expect(400, '"Must be less than 400 characters"');
        });
      });
      context('input is valid', () => {
        it(`responds with 201, the curse, the username, and a message "Curse sent as 'username'"`, () => {
          return supertest(app)
            .post('/api/curses/')
            .set('Authorization', `Bearer ${helpers.makeAuthHeader(testUsers[0])}`)
            .send({ curse: "Testing string for a valid curse" })
            .expect(201, { curse: 'Testing string for a valid curse', user: testUsers[0].username, message: `Curse sent as '${testUsers[0].username}'` });
        });
      });
    });
  });
  describe.skip('PATCH /api/curses/', () => {

  });
  describe.skip('DELETE /api/curses/', () => {

  });
});