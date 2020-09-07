const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const EventsService = require('./events-service');
const isAuth = require('../middleware/auth');

const eventsRouter = express.Router();

const serializeEvent = (event) => ({
  id: event.id,
  announcements: xss(event.announcements),
  needed_items: event.needed_items.map(xss),
  event_date: xss(event.event_date),
  event_time: xss(event.event_time),
  lesson_title: xss(event.lesson_title),
  bible_passage: xss(event.bible_passage),
  question: event.question.map(xss),
  event_leader: event.event_leader,
  group_event: event.group_event,
});
//GET all events 
eventsRouter.route('/').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  EventsService.getAllEvents(knexInstance)
    .then((events) => {
      res.json(events.map(serializeEvent));
    })
    .catch(next);
});

//POST new event for specific group
eventsRouter.route('/createevent', isAuth).post((req, res, next) => {
  for (const field of [
    'groupid',
    'event_date',
    'event_time',
    'lesson_title',
    'bible_passage',
    'question'
  ]) {
    if (!req.body.groupid) {
      logger.error(`${field} is required`);
      return res.status(400).send({
        error: { message: 'Must select GROUP' },
      });
    }
    if (!req.body.event_date) {
      logger.error(`${field} is required`);
      return res.status(400).send({
        error: { message: 'Must select DATE' },
      });
    }
    if (!req.body.event_time) {
      logger.error(`${field} is required`);
      return res.status(400).send({
        error: { message: 'Must select TIME' },
      });
    }
    if (!req.body.lesson_title) {
      logger.error(`${field} is required`);
      return res.status(400).send({
        error: { message: 'Must select LESSON TITLE' },
      });
    }
    if (!req.body.bible_passage) {
      logger.error(`${field} is required`);
      return res.status(400).send({
        error: { message: 'Must select BIBLE PASSAGE' },
      });
    }
  }
  const knexInstance = req.app.get('db');
  const {
    announcements,
    needed_items,
    event_date,
    event_time,
    lesson_title,
    bible_passage,
    question,
    groupid,
  } = req.body;
  let userId = req.userId;

  let eventData = {
    announcements,
    needed_items: needed_items.join(',').split(','),
    event_date,
    event_time,
    lesson_title,
    bible_passage,
    question: question.join(',').split(','),
    group_event: groupid,
    event_leader: userId,
  };
  EventsService.addEvent(knexInstance, eventData)
    .then((event) => {
      if (event) {
        logger.info(`Event with id ${event.id} created`);
        res.status(201)
          .json({ 
            message: 'Event created successfully!',
            eventId: event.id
          });
      } else {
        res.status(400).send({
          error: { message: `Missing ${event.field} is required` },
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        error: { message: error.message },
      });
    });
});
module.exports = eventsRouter;
