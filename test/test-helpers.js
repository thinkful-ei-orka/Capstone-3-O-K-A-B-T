/* eslint-disable quotes */
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('knex');


function makeUsersArray() {
  return [
    {
      user_id: 1,
      name: 'admin',
      username: 'admin',
      // password = 'pass',
      password:'$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      totalblessings: 10,
      lastblessing: new Date(),
      limiter: 3
    },
    {
      user_id: 2,
      name: 'outOfBlessings',
      username: 'outOfBlessings',
      //password = Password1!
      password:'$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      totalblessings: 5,
      lastblessing: new Date(),
      limiter: 0
    },
    {
      user_id: 3,
      name: 'needReplenishedBlessings',
      username: 'needReplenishedBlessings',
      //password = Password1!
      password: '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      totalblessings: 3,
      lastblessing: new Date(Date.now() - ((24 * 60 * 60 * 1000) + 1)),
      limiter: 0
    }
  ];
}
function makeBlessingsArray() {
  return [
    {
      blessing_id: 1,
      blessing: 'U+1F91F'
    },
    {
      blessing_id: 2,
      blessing: 'U+1F91E'
    },
    {
      blessing_id: 3,
      blessing: 'U+1F91D'
    }
  ];
}

function makeQuotesArray() {
  return [
    {
      quote_id: 1,
      quote_text: "Swearing is industry language. For as long as we're alive it's not going to change. You've got to be boisterous to get results",
      quote_source: 'Gordon Ramsay'
    },
    {
      quote_id: 2,
      quote_text: "Swearing's my release. Its the one weapon I have to defend myself against destiny when it elects to strike without pity",
      quote_source: 'Andrea Pirlo'
    },
    {
      quote_id: 3,
      quote_text: "My first outdoor cooking memories are full of erratic British summers, Dad swearing at a barbecue that he couldn't put together, and eventually eating charred sausages, feeling brilliant",
      quote_source: 'Jamie Oliver'
    },
    {
      quote_id: 4,
      quote_text: "There is no such thing as too much swearing. Swearing is just a piece of linguistic mechanics. The words in-between are the clever ones.",
      quote_source: 'Peter Capaldi'
    }, {
      quote_id: 5,
      quote_text: "We examined the relationship between the use of profanity and dishonesty and showed that profanity is positively correlated with honesty at an individual level and with integrity at a society level.",
      quote_source: 'Gilad Feldman, Huiwen Lian, Michal Kosinski, and David Stillwell "Frankly, We Do Give A Damn: The Relationship Between Profanity and Honesty"'
    },
    {
      quote_id: 6,
      quote_text: "Cursing activates the 'fight or flight' response, leading to a surge of adrenaline and corresponding analgesic effect.",
      quote_source: 'Neel Burton MD - Psychology Today'
    },
    {
      quote_id: 7,
      quote_text: 'Cursing can give us a greater sense of power and control over a bad situation. This can boost our confidence and self-esteem.',
      quote_source: 'Neel Burton MD - Psychology Today'
    },
    {
      quote_id: 8,
      quote_text: "When angry, count to four; When very angry, swear.",
      quote_source: 'Mark Twain'
    },
    {
      quote_id: 9,
      quote_text: 'Cursing enables us to get back at bad people or situations without having to resort to violence',
      quote_source: 'Nael Burton MD - Psychology Today'
    },
    {
      quote_id: 10,
      quote_text: "Searing can be a way of signaling we really mean somthing, or that it is really important to us. That's why swearing is so much a part of any sport",
      quote_source: 'Nael Burton MD - Psychology Today'
    },
    {
      quote_id: 11,
      quote_text: "Never user a big word when a little filthy one will do",
      quote_source: 'Johnny Carson'
    }
  ];
}

function makeCursesArray() {
  return [
    {
      curse_id: 1,
      curse: 'User',
      user_id: 1,
      blessed: false,
      blessing: null,
      pulled_by: null,
      pulled_time: new Date()
    },
    {
      curse_id: 2,
      curse: 'noUser',
      user_id: null,
      blessed: false,
      blessing: null,
      pulled_by: null,
      pulled_time: new Date()
    },
    {
      curse_id: 3,
      curse: 'pulled not blessed, not timed out',
      user_id: 1,
      blessed: false,
      blessing: null,
      pulled_by: 2,
      pulled_time: new Date(Date.now() - (1000 * 60))
    },
    {
      curse_id: 3,
      curse: 'pulled not blessed, timed out',
      user_id: 1,
      blessed: false,
      blessing: null,
      pulled_by: 2,
      pulled_time: new Date(Date.now() - ((1000 * 60 * 60) + 1))
    },
    {
      curse_id: 3,
      curse: 'pulled blessed, not timed out',
      user_id: 1,
      blessed: true,
      blessing: 1,
      pulled_by: 2,
      pulled_time: new Date(Date.now() - (1000 * 60))
    },
    {
      curse_id: 3,
      curse: 'pulled blessed, timed out',
      user_id: 1,
      blessed: true,
      blessing: 1,
      pulled_by: 2,
      pulled_time: new Date(Date.now() - ((1000 * 60 * 60) + 1))
    },
    {
      curse_id: 3,
      curse: 'not pulled, timed out (2-days)',
      user_id: 1,
      blessed: false,
      blessing: null,
      pulled_by: null,
      pulled_time: new Date(Date.now() - ((1000 * 60 * 60 * 24 * 2) + 1))
    }
  ];
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users,
      quotes,
      blessings,
      curses
      RESTART IDENTITY CASCADE`
  );
}

/*
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
      users,
      quotes,
      blessings,
      curses`
    )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE users_user_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE quotes_quote_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE blessings_blessing_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE curses_curse_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('user_user_id_seq',0)`),
          trx.raw(`SELECT setval('quotes_quote_id_seq',0)`),
          trx.raw(`SELECT setval('blessings_blessing_id_seq',0)`),
          trx.raw(`SELECT setval('curses_curse_id_seq',0)`),
        ])
      )
  );
}
*/
function seedBlessings(db, blessings) {
  return db.into('blessings').insert(blessings)
    .then(() =>
      db.raw(
        `SELECT setval('blessings_blessing_id_seq',?)`,
        [blessings[blessings.length - 1].blessing_id]
      )
    );
}

function seedUsers(db, users) {
  return db.into('users').insert(users)
    .then(() =>
      db.raw(
        `SELECT setval('users_user_id_seq',?)`,
        [users[users.length - 1].user_id]
      )
    );
}

function seedQuotes(db, quotes) {
  return db.into('quotes').insert(quotes)
    .then(() =>
      db.raw(
        `SELECT setval('quotes_quote_id_seq',?)`,
        [quotes[quotes.length - 1].quote_id]
      )
    );
}

function seedCurses(db, curses) {
  return db.into('curses').insert(curses)
    .then(() =>
      db.raw(
        `SELECT setval('curses_curse_id_seq',?)`,
        [curses[curses.length - 1].curse_id]
      )
    );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.user_id }, secret, {
    subject: user.username,
    algorithm: 'HS256'
  });
  return `${token}`;
}

function makeFixtures() {
  const testUsers = makeUsersArray();
  const testQuotes = makeQuotesArray();
  const testBlessings = makeBlessingsArray();
  const testCurses = makeCursesArray();
  return { testUsers, testQuotes, testBlessings, testCurses };
}

function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  });
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeQuotesArray,
  makeBlessingsArray,
  makeCursesArray,
  makeFixtures,

  cleanTables,
  seedUsers,
  seedBlessings,
  seedQuotes,
  seedCurses,
  makeAuthHeader,
};