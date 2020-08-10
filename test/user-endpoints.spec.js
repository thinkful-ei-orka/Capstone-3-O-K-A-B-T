const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');
const bcrypt = require('bcryptjs');
const { getBlessedCurses } = require('./test-helpers');


describe('User Endpoints', function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', async () => await db.destroy());

  before('cleanup', async () => await helpers.cleanTables(db));

  afterEach('cleanup', async () => await helpers.cleanTables(db));

  /**
   * @description Register a user and populate their fields
   **/
  describe(`POST /api/user`, () => {
    beforeEach('insert users', async () => await helpers.seedUsers(db, testUsers));

    const requiredFields = ['username', 'password', 'name'];

    requiredFields.forEach(field => {
      const registerAttemptBody = {
        username: 'test username',
        password: 'test password',
        name: 'test name',
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete registerAttemptBody[field];

        return supertest(app)
          .post('/api/user')
          .send(registerAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
      const userShortPassword = {
        username: 'test username',
        password: '1234567',
        name: 'test name',
      };
      return supertest(app)
        .post('/api/user')
        .send(userShortPassword)
        .expect(400, { error: `Password be longer than 8 characters` });
    });

    it(`responds 400 'Password be less than 72 characters' when long password`, () => {
      const userLongPassword = {
        username: 'test username',
        password: '*'.repeat(73),
        name: 'test name',
      };
      return supertest(app)
        .post('/api/user')
        .send(userLongPassword)
        .expect(400, { error: `Password be less than 72 characters` });
    });

    it(`responds 400 error when password starts with spaces`, () => {
      const userPasswordStartsSpaces = {
        username: 'test username',
        password: ' 1Aa!2Bb@',
        name: 'test name',
      };
      return supertest(app)
        .post('/api/user')
        .send(userPasswordStartsSpaces)
        .expect(400, { error: `Password must not start or end with empty spaces` });
    });

    it(`responds 400 error when password ends with spaces`, () => {
      const userPasswordEndsSpaces = {
        username: 'test username',
        password: '1Aa!2Bb@ ',
        name: 'test name',
      };
      return supertest(app)
        .post('/api/user')
        .send(userPasswordEndsSpaces)
        .expect(400, { error: `Password must not start or end with empty spaces` });
    });

    it(`responds 400 error when password isn't complex enough`, () => {
      const userPasswordNotComplex = {
        username: 'test username',
        password: '11AAaabb',
        name: 'test name',
      };
      return supertest(app)
        .post('/api/user')
        .send(userPasswordNotComplex)
        .expect(400, { error: `Password must contain one upper case, lower case, number and special character` });
    });

    it(`responds 400 'User name already taken' when username isn't unique`, () => {
      const duplicateUser = {
        username: testUser.username,
        password: '11AAaa!!',
        name: 'test name',
      };
      return supertest(app)
        .post('/api/user')
        .send(duplicateUser)
        .expect(400, { error: `Username already taken` });
    });

    describe(`Given a valid user`, () => {
      it(`responds 201, serialized user with no password`, () => {
        const newUser = {
          username: 'test username',
          password: '11AAaa!!',
          name: 'test name',
        };
        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body.username).to.eql(newUser.username);
            expect(res.body.name).to.eql(newUser.name);
            expect(res.body).to.not.have.property('password');
          });
      });

      it(`stores the new user in db with bcryped password`, () => {
        const newUser = {
          username: 'test username',
          password: '11AAaa!!',
          name: 'test name',
          
        };
        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(res => {
            return db
              .from('users')
              .select('*')
              .where( 'username', res.body.username )
              .first()
              .then(row => {
                expect(row.username).to.eql(newUser.username);
                expect(row.name).to.eql(newUser.name);

                return bcrypt.compare(newUser.password, row.password);
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true;
              })}
          );
      });
    })
  });

  describe(`GET /api/user`, () => {
    beforeEach('insert users', async () => await helpers.seedUsers(db, testUsers));
    it(`returns 200 and name, username, totalblessings, lastblessing, limiter, and blessedCurses`, async () => {

      const user = await helpers.getUserById(db, 1)

      const blessing = await helpers.getBlessedCurses(db, 1)

      //get call to test user db to grab info and await 
      
      
      return supertest(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${helpers.makeAuthHeader(testUsers[0])}`)
        .expect(200)
        .expect(res => {
          expect(res.body.user.username).to.eql(user.username);
          expect(res.body.user.name).to.eql(user.name);
          expect(res.body.user.totalblessings).to.eql(user.totalblessings);
          expect(res.body.user.lastblessing).to.eql(user.lastblessing.toISOString())
          expect(res.body.user.limiter).to.eql(user.limiter)
          expect(res.body.blessedCurses).to.eql(blessing)
        })

    });
  });

})

