const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const MessagesService = require('./messages-service');
const isAuth = require('../middleware/auth');

const messagesRouter = express.Router();

const serializeMessage = (message) => ({
  id: message.id,
  message_type: message.message_type,
  message_time: message.message_time,
  message_body: xss(message.message_body),
  message_like: message.message_like,
  message_likes: message.message_likes,
  group_chat: message.group_chat,
  user_id: message.user_id,
});

messagesRouter.route('/', isAuth).get((req, res, next) => {
  const knexInstance = req.app.get('db');
  MessagesService.getAllMessages(knexInstance)
    .then((messages) => {
      res.json(messages.map(serializeMessage));
    })
    .catch(next);
});

messagesRouter.route('/send-message', isAuth).post((req, res, next) => {
  const knexInstance = req.app.get('db');
  const {
    message_type,
    message_time,
    message_body,
    message_like,
    message_likes,
    group_chat,
    user_id,
  } = req.body;
  let newMessageData = {
    message_type,
    message_time,
    message_body,
    message_like,
    message_likes,
    group_chat,
    user_id,
  };
  MessagesService.addMessage(knexInstance, newMessageData)
    .then((message) => {
      res.status(201).json({ message });
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

module.exports = messagesRouter;