/* eslint-disable quotes */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');
// const jwt = require('jsonwebtoken');


describe('Auth Endpoints', function () {
  let db;

  const { testUsers } = helpers.makeFixtures();
  const testUser = testUsers[0];

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

  /**
   * @description Get token for login
   **/
  describe(`POST /api/auth/token`, () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(db, testUsers)
    );

    const requiredFields = ['username', 'password'];

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/api/auth/token')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    it(`responds 400 'invalid username or password' when bad username`, () => {
      const userInvalidUser = { username: 'user-not', password: 'existy' };
      return supertest(app)
        .post('/api/auth/token')
        .send(userInvalidUser)
        .expect(400, { error: `Incorrect username or password` });
    });

    it(`responds 400 'invalid username or password' when bad password`, () => {
      const userInvalidPass = { username: testUser.username, password: 'incorrect' };
      return supertest(app)
        .post('/api/auth/token')
        .send(userInvalidPass)
        .expect(400, { error: `Incorrect username or password` });
    });

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {

      const userValidCreds = {
        username: testUser.username,
        password: 'pass',
      };
      // const expectedToken = jwt.sign(
      //   { user_id: testUser.user_id, name: testUser.name },
      //   process.env.JWT_SECRET,
      //   {
      //     subject: testUser.username,
      //     algorithm: 'HS256',
      //   }
      // );
      return supertest(app)
        .post('/api/auth/token')
        .send(userValidCreds)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.property('authToken');
        });
    });
  });
});
