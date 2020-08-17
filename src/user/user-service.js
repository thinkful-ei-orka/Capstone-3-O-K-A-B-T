const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[\S]+/;

const UserService = {
  hasUserWithUserName(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
    };
  },

  blessedCurses(db, user_id) {
    return db
      .select('curse_id', 'curse', 'blessing')
      .from('curses')
      .whereRaw("(user_id = ? and blessed = TRUE)", [user_id]);
  },

  oldCurseResponse(db, user_id) {
    return db
      .from('curses')
      .update({
        blessed: true,
        blessing: 1,
      })
      .whereRaw("user_id = ? and ((pulled_by ISNULL and pulled_time < now() - interval '2 days') or (pulled_by NOTNULL and pulled_time < now() - interval '1 hour'))", [user_id]);
  },

  getUserFromCurseId(db, curse_id) {
    return db
      .select('user_id')
      .from('curses')
      .where('curse_id', curse_id)
      .first();
  },

  getBlocklist(db, user_id) {
    return db
      .select('blocklist')
      .from('users')
      .where('user_id', user_id)
      .first();
  },

  async updateBlocklist(db, user_id, blocked_id) {
    let oldBlocklist = await this.getBlocklist(db, user_id);
    oldBlocklist.blocklist === null ? oldBlocklist = [] : oldBlocklist = oldBlocklist.blocklist;
    let updatedBlocklist = [...oldBlocklist, blocked_id].sort();
    updatedBlocklist = Array.from(new Set(updatedBlocklist));
    return db
      .from('users')
      .update({ 'blocklist': updatedBlocklist })
      .where('user_id', user_id);
  }

};

module.exports = UserService;
