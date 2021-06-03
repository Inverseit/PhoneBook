const db = require("./services/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthenticated = require("./auth.js");

const resolvers = {
  Query: {
    getAllContacts: async (obj, args, context) => {
      try {
        const user = isAuthenticated(context);
        const { rows } = await db.query(
          "SELECT * FROM contacts where user_id = $1",
          [user.user_id]
        );
        console.log(rows);
        return rows;
      } catch (error) {
        throw error;
      }
    },
    login: async (_, { email, password }, context) => {
      try {
        const res = await db.query(
          "select user_id from users where email = $1 AND password=$2",
          [email, password]
        );
        if (res.rows.length != 1) {
          throw new Error("Login credentials error");
        }

        const user = res.rows[0];
        const token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });

        return {
          user_id: user.user_id,
          token: token,
          tokenExpiration: 2,
        };
      } catch (error) {
        console.log(error);
      }
    },
  },

  Mutation: {
    createContact: async (obj, args, context) => {
      console.log(obj, args, context);
      const name = args.name;
      const number = args.number;
      try {
        const user = isAuthenticated(context);
        const query = `insert into contacts(name, number, user_id) values ($1, $2, $3) returning *`;
        const response = await db.query(query, [name, number, user.user_id]);
        return response.rows[0];
      } catch (error) {
        throw error;
        // console.error(error);
      }
    },
    updateContact: async (_, { id, number, name }, context) => {
      try {
        const user = isAuthenticated(context);
        const query = `UPDATE contacts 
                       SET name = $1, number = $2
                       WHERE contact_id = $3 and user_id = $4
                       RETURNING contact_id, name, number;
                      `;
        const response = await db.query(query, [
          name,
          number,
          id,
          user.user_id,
        ]);
        console.log(response);
        return response.rows[0];
      } catch (error) {
        console.error("DB error");
        throw error;
      }
    },
    deleteContact: async (_, { id }, context) => {
      const user = isAuthenticated(context);
      try {
        const query = `DELETE FROM contacts WHERE contact_id=$1 and user_id = $2 RETURNING *;`;
        const response = await db.query(query, [id, user.user_id]);
        return response.rows[0];
      } catch (error) {
        throw error;
        console.error("DB error!", error);
      }
    },
    // createUser(email: String!, name: String!, password: String!, password2:String2): User
    signup: async (obj, { email, name, password, password2 }, ctx) => {
      // Validation
      try {
        if (password != password2) {
          throw new Error("passwords are not equal");
        }
        // email is unique
        const res = await db.query(
          "select user_id from users where email = $1",
          [email]
        );
        if (res.rows.length > 0) {
          throw new Error("email is already in the db");
        }
        const insertResponse = await db.query(
          "insert into users(email, password, name) values ($1, $2, $3) returning *",
          [email, password, name]
        );
        return insertResponse.rows[0];
      } catch (error) {
        console.error(error);
      }
    },
  },
};

module.exports = resolvers;
