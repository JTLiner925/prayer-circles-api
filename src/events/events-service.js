const EventsService = {
  //service objects for events
  //get all events
  getAllEvents(knex) {
    return knex.select('*').from('create_event');
  },

  addEvent(knex, newEvent) {
    //add event
    return knex
      .insert(newEvent)
      .into('create_event')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    //get event by id
    return knex.from('create_event').select('*').where('id', id).first();
  },

  deleteEvent(knex, id) {
    //delete event
    return knex('create_event').where({ id }).delete();
  },

  updateEvent(knex, id, newEventFields) {
    //update event
    return knex('create_event').where({ id }).update(newEventFields);
  },
};

module.exports = EventsService;
