const { login, signup } = require("./resolvers/auth");

const {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
} = require("./resolvers/contact");

const resolvers = {
  Query: {
    getAllContacts,
    login,
  },

  Mutation: {
    createContact,
    updateContact,
    deleteContact,
    signup,
  },
};

module.exports = resolvers;
