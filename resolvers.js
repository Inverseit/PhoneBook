const db = require("./services/db");

const resolvers = {
  Query: {
    contacts: async () => {
      try {
        const { rows } = await db.query(
          "SELECT id, name, number FROM contacts",
          []
        );
        return rows;
      } catch (error) {
        console.error("DB error");
      }
    },
    one: async (_, { id }) => {
      try {
        const { rows } = await db.query(
          "SELECT * FROM contacts WHERE id = $1",
          [id]
        );
        return rows[0];
      } catch (error) {
        console.error("DB error");
      }
    },
  },

  Mutation: {
    createContact: async (_, { name, number }) => {
      try {
        const query = `INSERT INTO contacts VALUES ($1, $2) RETURNING id, name, number;`;
        const response = await db.query(query, [name, number]);
        return response.rows[0];
      } catch (error) {
        console.error(error);
      }
    },
    updateContact: async (_, { id, number, name }) => {
      try {
        const query = `UPDATE contacts 
                       SET name = $1, number = $2
                       WHERE id = $3
                       RETURNING id, name, number;
                      `;
        const response = await db.query(query, [name, number, id]);
        console.log(response);
        return response.rows[0];
      } catch (error) {
        console.error("DB error");
      }
    },
    deleteContact: async (_, { id }) => {
      try {
        const query = `DELETE FROM contacts WHERE id=$1 RETURNING *;`;
        const response = await db.query(query, [id]);
        return response.rows[0];
      } catch (error) {
        console.error("DB error!", error);
      }
    },
  },
};

module.exports = resolvers;
