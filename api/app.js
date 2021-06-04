const Fastify = require("fastify");
const mercurius = require("mercurius");
const db = require("./services/db");
const app = Fastify({ logger: true });

const { makeExecutableSchema } = require("graphql-tools");
const glue = require("schemaglue");

const { schema, resolver } = glue("src/graphql");

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver,
});
//ff
const graphqlOptions = {
  schema: executableSchema,
  graphiql: {
    endpoint: "/graphiql",
  },
  routes: true,
  context: (request, reply) => {
    return {
      db: db,
      token: request.headers["x-jwt-token"],
    };
  },
};

app.register(mercurius, graphqlOptions);

// app.post("/", async (req, reply) => {
//   const { query } = req.body;
//   return reply.graphql(query);
// });s

const start = async () => {
  await app.listen(3000, "0.0.0.0");
};

start();
