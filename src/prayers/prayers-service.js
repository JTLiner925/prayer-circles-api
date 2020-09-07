const PrayersService = {
  //service objects for prayers
  //get all prayers
  getAllPrayers(knex) {
    return knex.select('*').from('prayers');
  },

  addPrayer(knex, newPrayer) {
    //add prayer
    return knex
      .insert(newPrayer)
      .into('prayers')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    //get by id
    return knex
      .from('prayers')
      .select('prayer_body', 'prayer_type')
      .where('id', id)
      .first();
  },

  deletePrayer(knex, id) {
    //delete prayer
    return knex('prayers')
      .where({ id })
      .delete();
  },

  updatePrayer(knex, id, newPrayerLike) {
    //update prayer
    return knex('prayers')
      .where({ id })
      .update(newPrayerLike);
  },
};

module.exports = PrayersService;