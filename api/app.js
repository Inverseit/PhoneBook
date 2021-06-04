const Fastify = require("fastify");
const mercurius = require("mercurius");

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
    console.log("context is running");
    return {
      user_id: "6",
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
