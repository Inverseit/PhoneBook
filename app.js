const Fastify = require("fastify");
// const helmet = require("fastify-helmet");

const mercurius = require("mercurius");
const schema = require("./schema");
const resolvers = require("./resolvers");

const app = Fastify({ logger: true });
// app.register(helmet);

app.register(mercurius, {
  schema,
  resolvers,
  context: (request, reply) => ({ test: 1234 }),
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
