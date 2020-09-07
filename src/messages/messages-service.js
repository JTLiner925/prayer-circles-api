const MessagesService = {
  //service objects for messages
  //get all messages
  getAllMessages(knex) {
    return knex.select('*').from('messages');
  },

  addMessage(knex, newMessage) {
    //add new message
    return knex
      .insert(newMessage)
      .into('messages')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    //get message by id
    return knex
      .from('messages')
      .select('*')
      .where('user_id', id)
      .first();
  },

  deleteMessage(knex, id) {
    //delete message
    return knex('messages')
      .where({ id })
      .delete();
  },

  updateMessage(knex, id, newMessageLike) {
    //update message
    return knex('messages')
      .where({ id })
      .update(newMessageLike);
  },
};

module.exports = MessagesService;