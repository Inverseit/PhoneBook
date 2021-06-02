const db = require("./services/db");

const resolvers = {
  Query: {
    users: async () => {
      try {
        const { rows } = await db.query(
          "SELECT id, name, number from users",
          []
        );
        return rows;
      } catch (error) {
        console.error("DB error");
      }
    },
    one: async (_, { id }) => {
      try {
        const { rows } = await db.query("SELECT * from users where id = $1", [
          id,
        ]);
        return rows[0];
      } catch (error) {
        console.error("DB error");
      }
    },
  },

  Mutation: {
    createUser: async (_, { name, number }) => {
      try {
        const query = `insert into users values ($1, $2) RETURNING id, name, number;`;
        const response = await db.query(query, [name, number]);
        return response.rows[0];
      } catch (error) {
        console.error(error);
      }
    },
    updateUser: async (_, { id, number, name }) => {
      try {
        const query = `UPDATE users 
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
    deleteUser: async (_, { id }) => {
      try {
        const query = `DELETE FROM users WHERE id=$1 RETURNING *;`;
        const response = await db.query(query, [id]);
        return response.rows[0];
      } catch (error) {
        console.error("DB error!", error);
      }
    },
  },
};

module.exports = resolvers;
