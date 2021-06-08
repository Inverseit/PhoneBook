module.exports = {
  findByID: async (db, user_id) => {
    const response = await db.query(
      "SELECT * FROM contacts where user_id = $1",
      [user_id]
    );
    return response;
  },
  insertContacts: async (db, name, number, user_id) => {
    const query = `insert into contacts(name, number, user_id) values ($1, $2, $3) returning *`;
    const response = await db.query(query, [name, number, user_id]);
    return response;
  },
  updateContacts: async (db, name, number, user_id) => {
    const query = `UPDATE contacts
                       SET name = $1, number = $2
                       WHERE contact_id = $3 and user_id = $4
                       RETURNING contact_id, name, number;
                      `;
    const response = await db.query(query, [name, number, id, user_id]);
    return response;
  },
  deleteContactByID: async (db, id, user_id) => {
    const query = `DELETE FROM contacts WHERE contact_id=$1 and user_id = $2 RETURNING *;`;
    const response = await db.query(query, [id, user_id]);
    return response;
  },
};
