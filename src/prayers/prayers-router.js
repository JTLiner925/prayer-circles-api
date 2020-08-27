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

prayersRouter.route('/', isAuth).get((req, res, next) => {
  const knexInstance = req.app.get('db');
  PrayersService.getAllPrayers(knexInstance)
    .then((prayers) => {
      res.json(prayers.map(serializePrayer));
    })
    .catch(next);
});

prayersRouter.route('/send-prayer', isAuth).post((req, res, next) => {
  const knexInstance = req.app.get('db');
  const {
    prayer_type,
    prayer_time,
    prayer_body,
    prayer_like,
    prayer_likes,
    group_prayer,
    user_id,
  } = req.body;
  let newPrayerData = {
    prayer_type,
    prayer_time,
    prayer_body,
    prayer_like,
    prayer_likes,
    group_prayer,
    user_id,
  };
  console.log(newPrayerData);
  PrayersService.addPrayer(knexInstance, newPrayerData)
    .then((prayer) => {
      res.status(201).json({ prayer });
    })
    .catch((error) => {
      console.log(error);
    });
});
// messagesRouter.route('/update-like', isAuth).post((req, res, next) => {
//   const knexInstance = req.app.get('db');
//   const {
//     id,
//     message_type,
//     message_time,
//     message_body,
//     message_like,
//     message_likes,
//     group_chat,
//     user_id,
//   } = req.body;
//   let newMessageData = {
//     id,
//     message_type,
//     message_time,
//     message_body,
//     message_like,
//     message_likes,
//     group_chat,
//     user_id,
//   };
//   let newLike = 
//   MessagesService.addMessage(knexInstance, id,  newLike)
//     .then((message) => {
//       res.status(201).json({ message });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

module.exports = prayersRouter;
