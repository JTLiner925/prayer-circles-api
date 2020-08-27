const MessagesService = {
  getAllMessages(knex) {
    return knex.select('*').from('messages');
  },

  addMessage(knex, newMessage) {
    return knex
      .insert(newMessage)
      .into('messages')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getByEmail(knex, email) {
    return knex
      .from('messages')
      .select('*')
      .where('user_email', email)
      .first();
  },
  getById(knex, id) {
    return knex
      .from('messages')
      .select('message_body', 'message_type')
      .where('id', id)
      .first();
  },

  deleteMessage(knex, id) {
    return knex('messages')
      .where({ id })
      .delete();
  },

  updateMessage(knex, id, newMessageLike) {
    return knex('messages')
      .where({ id })
      .update(newMessageLike);
  },
};

module.exports = MessagesService;