const knex = require('knex');
const supertest = require('supertest');
const fixtures = require('./user-fixtures');
const app = require('../src/app');

describe('oneAnother Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () =>
  
    db.raw(
      'TRUNCATE one_another_users, one_another_groups, create_event, messages, prayers RESTART IDENTITY CASCADE'
    )
  );
  afterEach('cleanup', () =>
    db.raw(
      'TRUNCATE one_another_users, one_another_groups, create_event, messages, prayers RESTART IDENTITY CASCADE'
    )
  );

  describe('Unauthorized requests', () => {
    const testUsers = fixtures.makeUsersArray();
    const testGroups = fixtures.makeGroupsArray();
    const testEvents = fixtures.makeEventsArray();
    
    beforeEach('insert user', () => {
      return db.into('one_another_users').insert(testUsers);
    });

    it('responds with 500 Unauthorized for POST /api/users/register', () => {
      return supertest(app)
        .post('/api/users/')
        .send({
          user_email: 'test@gmail.com',
          user_password: 'password123',
          first_name: 'Rex',
        })
        .expect(500, {
          message: 'Unauthorized request',
          error: { statusCode: 401 },
        });
    });

    beforeEach('insert group', () => {
      return db.into('one_another_groups').insert(testGroups);
    });

    it('responds with 500 Unauthorized for POST /api/groups/creategroup', () => {
      return supertest(app)
        .post('/api/groups/')
        .send({
          group_name: 'Cheese',
          leader_phone: '512-654-9090',
          group_location: 'my house',
          time_date: 'Tuesdays at 6pm',
        })
        .expect(500, {
          message: 'Unauthorized request',
          error: { statusCode: 401 },
        });
    });
    beforeEach('insert event', () => {
      return db.into('create_event').insert(testEvents);
    });

    it('responds with 500 Unauthorized for POST /api/groups/createevent', () => {
      return supertest(app)
        .post('/api/events/')
        .send({
          event_date: 'july 12th',
          event_time: '5pm',
          lesson_title: 'The Great Commission',
          bible_passage: 'Matthew 28:18-20',
          question: [
            'What grabbed your attention?',
            'What did you like/dislike about the passage?',
            'What does this passage say about God/people?',
            'How can you apply this passage to your life?',
          ],
        })
        .expect(500, {
          message: 'Unauthorized request',
          error: { statusCode: 401 },
        });
    });
  });

  describe('GET /api/users', () => {
    const testUsers = fixtures.makeUsersArray();

    context('Given no users', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app).get('/api/users').expect(200, []);
      });
    });

    describe('GET /api/users', () => {
      context('Given there are users in the database', () => {
        beforeEach('insert users', () => {
          return db.into('one_another_users').insert(testUsers);
        });

        it('responds with 200 and all of the users', () => {
          return supertest(app).get('/api/users').expect(200, testUsers);
        });
      });
    });
  });

  describe('POST /api/users', () => {
    const testUsers = fixtures.makeUsersArray();
    it('Must enter EMAIL', () => {
      const newUser = {
        id: 4,
        // user_email: 'djmbush@yahoo.com',
        user_password: 'ggggggggg',
        first_name: 'Jared',
        last_name: 'Bush',
        user_address: '309 Tallwood Dr',
        user_bio:
          'I am currently an unemployed ESL teacher living with some friends. I am looking for community and tacos!',
      };
      return supertest(app)
        .post('/api/users/register')
        .send(newUser)
        .expect(400, {
          error: {
            message: 'Must enter EMAIL',
          },
        });
    });

    it('Must enter PASSWORD', () => {
      const newUser = {
        id: 4,
        user_email: 'djmbush@yahoo.com',
        // user_password: 'ggggggggg',
        first_name: 'Jared',
        last_name: 'Bush',
        user_address: '309 Tallwood Dr',
        user_bio:
          'I am currently an unemployed ESL teacher living with some friends. I am looking for community and tacos!',
      };
      return supertest(app)
        .post('/api/users/register')
        .send(newUser)
        .expect(400, {
          error: {
            message: 'Must enter PASSWORD',
          },
        });
    });

    it('Must enter FIRST NAME', () => {
      const newUser = {
        id: 4,
        user_email: 'djmbush@yahoo.com',
        user_password: 'ggggggggg',
        // first_name: 'Jared',
        last_name: 'Bush',
        user_address: '309 Tallwood Dr',
        user_bio:
          'I am currently an unemployed ESL teacher living with some friends. I am looking for community and tacos!',
      };
      return supertest(app)
        .post('/api/users/register')
        .send(newUser)
        .expect(400, {
          error: {
            message: 'Must enter FIRST NAME',
          },
        });
    });
  });

  describe('GET /api/groups', () => {
    context('Given no groups', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/groups')
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoianRsaW5lcjkyNUBnbWFpbC5jb20iLCJpZCI6MSwiaWF0IjoxNTk0MzM2NjczfQ.oZ-0VaXYxOPWcO4N-DHxBvEhWQMYOjrYc9yd9QqV6bM'
          )
          .expect(200, []);
      });
    });

    describe('GET /api/groups', () => {
      context('Given there are groups in the database', () => {
        const testGroups = fixtures.makeGroupsArray();

        beforeEach('insert groups', () => {
          return db.into('one_another_groups').insert(testGroups);
        });

        it('responds with 200 and all of the groups', () => {
          return supertest(app)
            .get('/api/groups')
            .set(
              'Authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoianRsaW5lcjkyNUBnbWFpbC5jb20iLCJpZCI6MSwiaWF0IjoxNTk0MzM2NjczfQ.oZ-0VaXYxOPWcO4N-DHxBvEhWQMYOjrYc9yd9QqV6bM'
            )
            .expect(200, testGroups);
        });
      });
    });
  });

  describe('GET /api/events', () => {
    context('Given no events', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/events')
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoianRsaW5lcjkyNUBnbWFpbC5jb20iLCJpZCI6MSwiaWF0IjoxNTk0MzM2NjczfQ.oZ-0VaXYxOPWcO4N-DHxBvEhWQMYOjrYc9yd9QqV6bM'
          )
          .expect(200, []);
      });
    });

    describe('GET /api/events', () => {
      context('Given there are events in the database', () => {
        const testEvents = fixtures.makeEventsArray();

        beforeEach('insert events', () => {
          return db.into('create_event').insert(testEvents);
        });

        it('responds with 200 and all of the events', () => {
          return supertest(app)
            .get('/api/events')
            .set(
              'Authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoianRsaW5lcjkyNUBnbWFpbC5jb20iLCJpZCI6MSwiaWF0IjoxNTk0MzM2NjczfQ.oZ-0VaXYxOPWcO4N-DHxBvEhWQMYOjrYc9yd9QqV6bM'
            )
            .expect(200, testEvents);
        });
      });
    });
  });

  describe('GET /api/messages', () => {
    context('Given no messages', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/messages')
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoianRsaW5lcjkyNUBnbWFpbC5jb20iLCJpZCI6MSwiaWF0IjoxNTk0MzM2NjczfQ.oZ-0VaXYxOPWcO4N-DHxBvEhWQMYOjrYc9yd9QqV6bM'
          )
          .expect(200, []);
      });
    });

    describe('GET /api/messages', () => {
      context('Given there are messages in the database', () => {
        const testMessages = fixtures.makeMessagesArray();

        beforeEach('insert message', () => {
          return db.into('messages').insert(testMessages);
        });

        it('responds with 200 and all of the messages', () => {
          return supertest(app)
            .get('/api/messages')
            .set(
              'Authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoianRsaW5lcjkyNUBnbWFpbC5jb20iLCJpZCI6MSwiaWF0IjoxNTk0MzM2NjczfQ.oZ-0VaXYxOPWcO4N-DHxBvEhWQMYOjrYc9yd9QqV6bM'
            )
            .expect(200, testMessages);
        });
      });
    });
  });

  describe('GET /api/prayers', () => {
    context('Given no prayers', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/prayers')
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoianRsaW5lcjkyNUBnbWFpbC5jb20iLCJpZCI6MSwiaWF0IjoxNTk0MzM2NjczfQ.oZ-0VaXYxOPWcO4N-DHxBvEhWQMYOjrYc9yd9QqV6bM'
          )
          .expect(200, []);
      });
    });

    describe('GET /api/prayers', () => {
      context('Given there are prayers in the database', () => {
        const testPrayers = fixtures.makePrayersArray();


        beforeEach('insert prayers', () => {
          return db.into('prayers').insert(testPrayers);
        });

        it('responds with 200 and all of the prayers', () => {
          return supertest(app)
            .get('/api/prayers')
            .set(
              'Authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoianRsaW5lcjkyNUBnbWFpbC5jb20iLCJpZCI6MSwiaWF0IjoxNTk0MzM2NjczfQ.oZ-0VaXYxOPWcO4N-DHxBvEhWQMYOjrYc9yd9QqV6bM'
            )
            .expect(200, testPrayers);
        });
      });
    });
  });

});
