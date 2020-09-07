const NeededService = {
  getAllNeeded(knex, eventId) {
    //service objects for needed items
    //get all needed items
    return knex.select('*').from('needed_items');
  },

  addItem(knex, newItem) {
    //add new item
    return knex
      .insert(newItem)
      .into('needed_items')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    //get item by id
    return knex
      .from('one_another_users')
      .select('first_name', 'last_name')
      .where('id', id)
      .first();
  },
  deleteItem(knex, id) {
    //delete item
    return knex('needed_items').where({ id }).delete();
  },

  updateItems(knex, id, newItemFields) {
    //update item
    return knex('needed_items').where({ id }).update(newItemFields);
  },
};

module.exports = NeededService;
