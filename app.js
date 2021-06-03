const Fastify = require("fastify");
const mercurius = require("mercurius");
const schema = require("./schema");
const resolvers = require("./resolvers");

const app = Fastify({ logger: true });

app.register(mercurius, {
  schema,
  resolvers,
});

app.post("/", async (req, reply) => {
  const { query } = req.body;
  return reply.graphql(query);
});

const start = async () => {
  await app.listen(3000);
};

start();
