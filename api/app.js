const Fastify = require("fastify");
const mercurius = require("mercurius");
const db = require("./services/db");
const { client: redisClient, getAsync, setAsync } = require("./services/redis");
const app = Fastify({ logger: true });

const { makeExecutableSchema } = require("@graphql-tools/schema");
const glue = require("schemaglue");

const { schema, resolver } = glue("./src/graphql", {
  ignore: ["**/DAL*.js", "**/*.spec.js", "**/*.test.js"],
});

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver,
});

const graphqlOptions = {
  schema: executableSchema,
  graphiql: "playground",
  routes: true,
  context: (request, reply) => {
    return {
      db: db,
      token: request.headers["x-jwt-token"],
      redis: {
        client: redisClient,
        getAsync: getAsync,
        setAsync: setAsync,
      },
    };
  },
};

app.register(mercurius, graphqlOptions);

const start = async () => {
  await app.listen(3000, "0.0.0.0");
};

start();
