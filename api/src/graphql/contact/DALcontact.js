module.exports = {
  findByID: async (db, user_id) => {
    const sql = db.sql;
    try {
      const response =
        await db.sql`SELECT * FROM contacts where user_id = ${user_id}`;
      return response;
    } catch (error) {
      throw error;
    }
  },
  insertContacts: async (db, name, number, user_id) => {
    try {
      const sql = db.sql;
      // const query = `insert into contacts(name, number, user_id) values ($1, $2, $3) returning *`;
      // const response = await db.query(query, [name, number, user_id]);
      const user = { name, number, user_id };
      const response = await db.sql`
        insert into contacts(name, number, user_id) values (${name}, ${number}, ${user_id})
        returning *
      `;
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateContacts: async (db, name, number, user_id, id) => {
    try {
      const sql = db.sql;
      const user = { name, number, user_id };
      const response = await db.sql`
        update contacts set ${sql(
          user,
          'name',
          'number'
        )}  WHERE contact_id = ${id} and user_id = ${user_id}
        RETURNING contact_id, name, number;
      `;
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteContactByID: async (db, id, user_id) => {
    try {
      const sql = db.sql;
      const response =
        await db.sql`DELETE FROM contacts WHERE contact_id=${id} and user_id = ${user_id} RETURNING *;`;
      return response;
    } catch (error) {
      throw error;
    }
  },
};
