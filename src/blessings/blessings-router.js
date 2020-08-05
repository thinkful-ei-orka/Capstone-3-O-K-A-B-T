const express = require('express');
const BlessService = require('./blessings-service');
// const { requireAuth } = require('../middleware/jwt-auth')

const blessingsRouter = express.Router();
const jsonBodyParser = express.json();

blessingsRouter
  .route('/')
  .get(jsonBodyParser, async (req, res, next) => {
    try {
      const blessing = await BlessService.getAllBlessings(
        req.app.get('db')
      );
      return res.json(blessing);
    } catch (error) {
      next(error);
    }
  });

module.exports = blessingsRouter;