const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const PrayersService = require('./prayers-service');
const isAuth = require('../middleware/auth');

const prayersRouter = express.Router();

const serializePrayer = (prayer) => ({
  id: prayer.id,
  prayer_type: prayer.prayer_type,
  prayer_time: prayer.prayer_time,
  prayer_body: xss(prayer.prayer_body),
  prayer_like: prayer.prayer_like,
  prayer_likes: prayer.prayer_likes,
  group_prayer: prayer.group_prayer,
  user_id: prayer.user_id,
});

//GET all prayers
prayersRouter.route('/', isAuth).get((req, res, next) => {
  const knexInstance = req.app.get('db');
  PrayersService.getAllPrayers(knexInstance)
    .then((prayers) => {
      res.json(prayers.map(serializePrayer));
    })
    .catch(next);
});

//POST new prayer
prayersRouter.route('/send-prayer', isAuth).post((req, res, next) => {
  const knexInstance = req.app.get('db');
  for (const field of [
    'groupid',
    'prayer_body',
    'prayer_type'
  ]) {
    if (!req.body[field]) {
      logger.error(`${field} is required`);
      return res.status(400).send({
        error: { message: `'${field}' is required` },
      });
    }
  }
  const {
    prayer_type,
    prayer_time,
    prayer_body,
    prayer_like,
    prayer_likes,
    groupid,
    user_id,
  } = req.body;
  let newPrayerData = {
    prayer_type,
    prayer_time,
    prayer_body,
    prayer_like,
    prayer_likes,
    group_prayer: groupid,
    user_id,
  };
 
  PrayersService.addPrayer(knexInstance, newPrayerData)
    .then((prayer) => {
      if (prayer) {
        logger.info(`Group with name ${prayer.prayer_body} created.`);
        res
          .status(201)
          .json({ message: `Prayer with name ${prayer.prayer_body} created.`, prayer });
      } else {
        res.status(400).send({
          error: { message: `Missing ${prayer.field} is required` },
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        error: { message: error.message },
      });
    });
});
module.exports = prayersRouter;
