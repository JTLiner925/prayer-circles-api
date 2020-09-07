const GroupsService = {
  //service objects for groups
  //get all groups
  getAllGroups(knex) {
    return knex.select('*').from('one_another_groups');
  },

  addGroup(knex, newGroup) {
    //add new group
    return knex
      .insert(newGroup)
      .into('one_another_groups')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    //get group by id
    return knex.from('one_another_groups').select('*').where('id', id).first();
  },

  deleteGroup(knex, id) {
    //delete group
    return knex('one_another_groups').where({ id }).delete();
  },

  updateGroup(knex, ids, groupName) {
    //update group
    return knex('one_another_groups')
      .where('group_name', '=', groupName)
      .update({ user_ids: ids });
  },
};

module.exports = GroupsService;
