const CursesService = {
  postCurse(db, curse, user_id = null) {
    return db
      .insert({ curse, user_id })
      .into('curses')
      .returning('*')
      .then(([curse]) => curse);
  },
  incrementBlessingCount(db, user, time) {
    return db
      .from('users')
      .update({
        totalblessings: user.totalblessings + 1,
        lastblessing: time,
        limiter: user.limiter - 1
      })
      .where('user_id', user.user_id);
  },

  async blessCurse(db, curseId, blessingId, user, time) {
    await this.incrementBlessingCount(db, user, time);
    return db
      .from('curses')
      .update({
        blessed: true,
        blessing: blessingId
      })
      .where('curse_id', curseId);
  },

  resetUserLimit(db, user_id) {
    return db
      .from('users')
      .update({
        limiter: 3
      })
      .where('user_id', user_id);
  },

  getAllCurses(db, user_id) {
    return db
      .from('curses')
      .select('*')
      .whereNot("user_id", user_id)
      .where("pulled_by", null);
  },

  getCurseById(db, curse_id) {
    return db
      .from('curses')
      .select('*')
      .where('curse_id', curse_id)
      .first();
  },

  updateCursePulled(db, curse_id, user_id) {
    return db
      .from('curses')
      .update({
        pulled_by: user_id,
        pulled_time: new Date()
      })
      .where("curse_id", curse_id);
  },
  deleteBlessedCurse(db, curse_id) {
    return db
      .from('curses')
      .where('curse_id', curse_id)
      .del();
  },
  getUserById(db, user_id) {
    return db
      .select()
      .from('users')
      .where('user_id', user_id)
      .first();
  }
};

module.exports = CursesService;