const UsersService = {
  //service objects for users
  //get all users
  getAllUsers(knex) {
    return knex.select('*').from('one_another_users');
  },

  addUser(knex, newUser) {
    //add new user
    return knex
      .insert(newUser)
      .into('one_another_users')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getByEmail(knex, email) {
    //get by email
    return knex
      .from('one_another_users')
      .select('*')
      .where('user_email', email)
      .first();
  },
  getById(knex, id) {
    //get by id
    return knex
      .from('one_another_users')
      .select('first_name', 'last_name')
      .where('id', id)
      .first();
  },

  deleteUser(knex, id) {
    //delete user
    return knex('one_another_users')
      .where({ id })
      .delete();
  },

  updateUser(knex, id, newUserFields) {
    //update user
    return knex('one_another_users')
      .where({ id })
      .update(newUserFields);
  },
};

module.exports = UsersService;