const QuotesService = {
  getQuotes(db) {
    return db('quotes')
      .select();
  },
  serializeQuote(entry) {
    return {
      quote: entry.quote_text,
      source: entry.quote_source
    };
  }


};
module.exports = QuotesService;