const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const UsersService = require('./users-service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { error } = require('winston');

const usersRouter = express.Router();

const serializeUser = (user) => ({
  id: user.id,
  user_email: xss(user.user_email),
  user_password: xss(user.user_password),
  first_name: xss(user.first_name),
  last_name: xss(user.last_name),
  user_address: xss(user.user_address),
  user_bio: xss(user.user_bio),
});

usersRouter.route('/').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  UsersService.getAllUsers(knexInstance)
    .then((users) => {
      res.json(users.map(serializeUser));
    })
    .catch(next);
});

usersRouter.route('/login').post((req, res, next) => {
  for (const field of ['user_email', 'user_password']) {
    if (!req.body[field]) {
      logger.error(`${field} is required`);
      return res.status(400).send({
        error: { message: `'${field}' is required` },
      });
    }
  }

  const knexInstance = req.app.get('db');
  const { user_email, user_password } = req.body;
  let loadedUser;
  UsersService.getByEmail(knexInstance, user_email)
    .then((user) => {
      loadedUser = user;
      return bcrypt.compare(user_password, user.user_password);
    })
    .then((matched) => {
      if (matched) {
        const token = jwt.sign(
          {
            user_email: loadedUser.user_email,
            id: loadedUser.id,
          },
          'djahslkdjfhalksjdfhiwuuibbvujdksjdhf'
        );
        logger.info(`User with id ${loadedUser.id} signed in.`);
        res.status(200).json({ token, userName: loadedUser.first_name });
      } else {
        res.status(401).send({
          error: { message: 'Invalid username and password combination' },
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        error: { message: error.message },
      });
    });
});

usersRouter.route('/signup').post((req, res, next) => {
  for (const field of ['user_email', 'user_password', 'first_name']) {
    if (!req.body[field]) {
      logger.error(`${field} is required`);
      return res.status(400).send({
        error: { message: `'${field}' is required` },
      });
    }
  }

  const knexInstance = req.app.get('db');
  const {
    user_address,
    user_bio,
    user_email,
    user_password,
    first_name,
    last_name,
  } = req.body;

  bcrypt.hash(user_password, 12).then((hashedPassword) => {
    let userData = {
      user_address,
      user_bio,
      user_email,
      user_password: hashedPassword,
      first_name,
      last_name,
    };
    UsersService.addUser(knexInstance, userData)
      .then((user) => {
        logger.info(`User with id ${user.id} created.`);
        res.status(201).json({ message: 'User created successfully' });
      })
      .catch((error) => {
        console.log(error);
      });
  });
});


module.exports = usersRouter;
