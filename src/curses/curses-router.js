const express = require('express');
const CursesService = require('./curses-service');
const { requireAuth } = require('../middleware/jwt-auth');
const { userFromAuth } = require('../middleware/user_from_auth');

const cursesRouter = express.Router();
const jsonBodyParser = express.json();

cursesRouter
  .route('/')
  //Grabbing a random curse and updating the database
  .get(requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      let curse_id = await CursesService.getAllCurses(
        req.app.get('db'),
        req.user.user_id
      );
      if (!curse_id[0]) {
        return res.status('200').json('No available curses');
      } else {
        const index = Math.floor(Math.random() * curse_id.length);

        const curse = { curse_id: curse_id[index].curse_id, curse: curse_id[index].curse };
        await CursesService.updateCursePulled(req.app.get('db'), curse.curse_id, req.user.user_id);
        return res.status(200).json(curse);
      }
    } catch (error) {
      next(error);
    }

  })
  //Add a new curse to the database
  .post(userFromAuth, jsonBodyParser, async (req, res, next) => {
    try {
      if (req.body.curse === "") {
        return res.status(400).json('Cannot send an empty curse');
      }
      if (!req.body.curse) {
        return res.status(400).json(`'curse' field is required in body`);
      }
      if (req.body.curse.length < 10) {
        return res.status(400).json('Must be longer than 10 characters');
      }
      if (req.body.curse.split(' ').length < 4) {
        return res.status(400).json('Must be longer than 3 words');
      }
      if (req.body.curse.length > 400) {
        return res.status(400).json('Must be less than 400 characters');
      }
      if (req.user.user_id !== null) {
        await CursesService.postCurse(req.app.get('db'), req.body.curse, req.user.user_id);

        return res.status(201).json({
          message: `Curse sent as '${req.user.username}'`,
          curse: req.body.curse,
          user: req.user.username
        });
      } else {
        await CursesService.postCurse(req.app.get('db'), req.body.curse);

        return res.status(201).json({
          message: 'Curse sent annonymously',
          curse: req.body.curse,
          user: null
        });
      }
    } catch (error) {
      next(error);
    }
  })
  //Bless an existing curse and update db
  .patch(requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      if (!req.body.blessing_id) {
        return res.status(400).json('Missing blessing_id in body');
      }
      if (!req.body.curse_id) {
        return res.status(400).json('Missing curse_id in body');
      }
      const now = new Date;
      //1000 = 1 second, 86400 = 1 day (in seconds)
      //limiter is depeleted and last blessing was within 3 hours
      if (req.user.limiter === 0 && ((now - req.user.lastblessing) < 10800000)) {
        return res.status(403).json(`You're out of blessings`);
      } else {
        //limiter is less than max, but last blessing is over 3 hours ago
        if (req.user.limiter < 3 && ((now - req.user.lastblessing) > 10800000)) {
          await CursesService.resetUserLimit(req.app.get('db'), req.user.user_id);
          const person = await CursesService.getUserById(req.app.get('db'), req.user.user_id);
          req.user = person;
        }
        await CursesService.blessCurse(req.app.get('db'), req.body.curse_id, req.body.blessing_id, req.user, now);

        return res.status(202).json(`Curse blessed with blessing ${req.body.blessing_id}!`);
      }
    } catch (error) {
      next(error);
    }
  })
  //Remove curse and respond with removed curse
  .delete(jsonBodyParser, requireAuth, async (req, res, next) => {
    try {
      if (!req.body.curse_id) { return res.status(400).json('body does not contain curse_id for deletion'); }

      const deletedCurse = await CursesService.getCurseById(req.app.get('db'), req.body.curse_id);

      const isCurseOwner = deletedCurse.user_id === req.user.user_id;

      if (isCurseOwner) {
        await CursesService.deleteBlessedCurse(req.app.get('db'), req.body.curse_id);
        return res.status(200).json({ deletedCurse: deletedCurse });
      } else {
        return res.status(403).json('User is not the owner of provided curse');
      }

    } catch (error) {
      next(error);
    }
  });

module.exports = cursesRouter;