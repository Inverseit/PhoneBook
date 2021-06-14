// const db = require("../../../services/db");
const isAuthenticated = require('../../../midlewares/isAuthenticated');
const DAL = require('./DALcontact');
require('dotenv').config();

const getAllContacts = async (_, args, context) => {
  try {
    const user = await isAuthenticated(context.token);
    const response = await DAL.findByID(context.db, user.user_id);
    return response;
  } catch (error) {
    throw error;
  }
};

const createContact = async (obj, { name, number }, context) => {
  try {
    const user = isAuthenticated(context.token);
    const response = await DAL.insertContacts(
      context.db,
      name,
      number,
      user.user_id
    );
    return response[0];
  } catch (error) {
    throw error;
  }
};

const updateContact = async (_, { id, number, name }, context) => {
  try {
    const db = context.db;
    const user = isAuthenticated(context.token);
    const response = await DAL.updateContacts(
      db,
      name,
      number,
      user.user_id,
      id
    );
    return response[0];
  } catch (error) {
    throw error;
  }
};

const deleteContact = async (_, { id }, context) => {
  const user = isAuthenticated(context.token);
  try {
    const response = await DAL.deleteContactByID(context.db, id, user.user_id);
    return response[0];
  } catch (error) {
    throw error;
  }
};

exports.resolver = {
  Query: { getAllContacts },
  Mutation: { createContact, updateContact, deleteContact },
};
