const Fastify = require("fastify");
const helmet = require("fastify-helmet");

const mercurius = require("mercurius");
const schema = require("./schema");
// const resolvers = require("./resolvers");

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

const users = [];

const app = Fastify({ logger: true });
app.register(helmet);

app.register(mercurius, {
  schema,
  resolvers,
});

app.post("/", async (req, reply) => {
  const { query } = req.body;
  return reply.graphql(query);
});

const start = async () => {
  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
  }
};

start();
