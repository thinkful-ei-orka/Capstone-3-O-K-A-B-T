const CursesService = {
  postCurse(db, curse, user_refid = null) {
    return db
      .insert({ curse, user_refid })
      .into('curses')
      .returning('*')
      .then(([curse]) => curse);
  },
  incrementBlessingCount(db, user, time) {
    return db
      .from('users')
      .update({
        totalblessings: user.totalblessings+1,
        lastblessing: time,
        limiter: user.limiter-1
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
  }
};

module.exports = CursesService;