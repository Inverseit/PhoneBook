const resolvers = {
  Query: {
    users: async () => Object.values(users),
  },

  Mutation: {
    createUser: async (_, { name, number }) => {
      const user = {
        _id: Math.random().toString(),
        name: name,
        number: number,
      };
      await users.push(user);
      return user;
    },
  },
};

module.exports = resolvers;
