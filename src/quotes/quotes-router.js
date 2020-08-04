const express = require('express');
const QuotesService = require('./quotes-service');

const quotesRouter = express.Router();

quotesRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const quotes = await QuotesService.getQuotes(req.app.get('db'));

      let index = Math.floor(Math.random() * quotes.length);
      index === quotes.length ? index = index - 1 : null;

      res.status(200).json(
        QuotesService.serializeQuote(quotes[index])
      );


    } catch (error) {
      next(error);
    }
  });

module.exports = quotesRouter;