const PrayersService = {
  getAllPrayers(knex) {
    return knex.select('*').from('prayers');
  },

  addPrayer(knex, newPrayer) {
    return knex
      .insert(newPrayer)
      .into('prayers')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getByEmail(knex, email) {
    return knex
      .from('prayers')
      .select('*')
      .where('user_email', email)
      .first();
  },
  getById(knex, id) {
    return knex
      .from('prayers')
      .select('prayer_body', 'prayer_type')
      .where('id', id)
      .first();
  },

  deletePrayer(knex, id) {
    return knex('prayers')
      .where({ id })
      .delete();
  },

  updatePrayer(knex, id, newPrayerLike) {
    return knex('prayers')
      .where({ id })
      .update(newPrayerLike);
  },
};

module.exports = PrayersService;