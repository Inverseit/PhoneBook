const db = require("../../../services/db");
const isAuthenticated = require("../../../midlewares/isAuthenticated");
require("dotenv").config();

const getAllContacts = async (_, args, context) => {
  try {
    console.log("---", context.user_id);
    const user = isAuthenticated(context);
    const { rows } = await db.query(
      "SELECT * FROM contacts where user_id = $1",
      [user.user_id]
    );
    console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createContact = async (obj, { name, number }, context) => {
  try {
    const user = isAuthenticated(context);
    const query = `insert into contacts(name, number, user_id) values ($1, $2, $3) returning *`;
    const response = await db.query(query, [name, number, user.user_id]);
    return response.rows[0];
  } catch (error) {
    throw error;
  }
};

const updateContact = async (_, { id, number, name }, context) => {
  try {
    const user = isAuthenticated(context);
    const query = `UPDATE contacts 
                       SET name = $1, number = $2
                       WHERE contact_id = $3 and user_id = $4
                       RETURNING contact_id, name, number;
                      `;
    const response = await db.query(query, [name, number, id, user.user_id]);
    return response.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteContact = async (_, { id }, context) => {
  const user = isAuthenticated(context);
  try {
    const query = `DELETE FROM contacts WHERE contact_id=$1 and user_id = $2 RETURNING *;`;
    const response = await db.query(query, [id, user.user_id]);
    return response.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.resolver = {
  Query: { getAllContacts },
  Mutation: { createContact, updateContact, deleteContact },
};
