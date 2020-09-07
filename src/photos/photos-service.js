const PhotosService = {
  //service objects for photos
  //get all photos
  getAllphotos(knex) {
    return knex.select('*').from('one_another_users');
  },

  addUser(knex, newUser) {
    //add new photo for user
    return knex
      .insert(newUser)
      .into('one_another_users')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    //get photo by id
    return knex
      .from('one_another_users')
      .select('first_name', 'last_name')
      .where('id', id)
      .first();
  },

  deleteUser(knex, id) {
    //delete photo
    return knex('one_another_users')
      .where({ id })
      .delete();
  },

  updateUser(knex, id, newUserFields) {
    //update photo
    return knex('one_another_users')
      .where({ id })
      .update(newUserFields);
  },
};

module.exports = PhotosService;