const express = require('express');
const CursesService = require('./curses-service');
const { requireAuth } = require('../middleware/jwt-auth');
const { userFromAuth } = require('../middleware/user_from_auth');

const cursesRouter = express.Router();
const jsonBodyParser = express.json();

cursesRouter
  .route('/')
  .post(userFromAuth, jsonBodyParser, async (req, res, next) => {
    try {
      if (req.user.user_id !== null) {
        await CursesService.postCurse(req.app.get('db'), req.body.curse, req.user.user_id);

        return res.status(200).json({
          message: `Curse sent as '${req.user.username}'`,
          curse: req.body.curse,
          user: req.user.username
        });
      } else {
        await CursesService.postCurse(req.app.get('db'), req.body.curse);

        return res.status(200).json({
          message: 'Curse sent annonymously',
          curse: req.body.curse,
          user: null
        });
      }
    } catch (error) {
      next(error);
    }
  })
  .patch(requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      const now = new Date;
      //1000 = 1 second, 86400 = 1 day (in seconds)
      if (req.user.limiter < 1 && ((now - req.user.lastblessing) < 86400000)) {
        return res.status(403).json('Too many blessings');
      } else {
        await CursesService.blessCurse(req.app.get('db'), req.body.curse_id, req.body.blessing_id, req.user, now);

        console.log('end');
        return res.status(202).json({ mesage: `Curse blessed with blessing ${req.body.blessing_id}!` });
      }
    } catch (error) {
      next(error);
    }
  });

module.exports = cursesRouter;