const express = require('express');
const CursesService = require('./curses-service');
const { requireAuth } = require('../middleware/jwt-auth');
const { userFromAuth } = require('../middleware/user_from_auth');

const cursesRouter = express.Router();
const jsonBodyParser = express.json();

cursesRouter
  .route('/')
  .get(requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      let curse_id = await CursesService.getAllCurses(
        req.app.get('db'),
        req.user.user_id
      );

      const index = Math.floor(Math.random() * curse_id.length);

      const curse = { curse_id: curse_id[index].curse_id, curse: curse_id[index].curse };
      await CursesService.updateCursePulled(req.app.get('db'), curse.curse_id, req.user.user_id);
      return res.status(200).json(curse);

    } catch (error) {
      next(error);
    }

  })
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
  //Need to verify that the provided curse hasn't been blessed yet
  .patch(requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      const now = new Date;
      //1000 = 1 second, 86400 = 1 day (in seconds)
      //limiter is depeleted and last blessing was within 24 hours
      if (req.user.limiter === 0 && ((now - req.user.lastblessing) < 86400000)) {
        return res.status(403).json(`You're out of blessings`);
      } else {
        //limiter is less than max, but last blessing is over 24 hours ago
        if (req.user.limiter < 3 && ((now - req.user.lastblessing) > 86400000)) {
          await CursesService.resetUserLimit(req.app.get('db'), req.user.user_id);
        }
        await CursesService.blessCurse(req.app.get('db'), req.body.curse_id, req.body.blessing_id, req.user, now);

        return res.status(202).json(`Curse blessed with blessing ${req.body.blessing_id}!`);
      }
    } catch (error) {
      next(error);
    }
  });

module.exports = cursesRouter;