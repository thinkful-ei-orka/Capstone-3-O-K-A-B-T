const BlessingsService = {
  getAllBlessings(db) {
    return db
      .from('blessings')
      .select(
        'blessing',
        'blessing_id'
      );
  }
};

module.exports = BlessingsService;