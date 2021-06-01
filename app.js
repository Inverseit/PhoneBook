const Fastify = require("fastify");
const helmet = require("fastify-helmet");

const mercurius = require("mercurius");
const schema = require("./schema");
// const resolvers = require("./resolvers");

const db = require("./services/db");
const config = require("./config");

const resolvers = {
  Query: {
    users: async () => {
      try {
        const { rows } = await db.query(
          "SELECT id, name, number from users",
          []
        );
        return rows;
      } catch (error) {
        console.error("DB error");
      }
    },
  },

  Mutation: {
    createUser: async (_, { name, number }) => {
      try {
        query = `insert into users values ('${name}', '${number}') RETURNING id, name, number`;
        const user = await db.query(query, []);
        return user.rows[0];
      } catch (error) {
        console.error(error);
      }
    },
  },
};

const app = Fastify({ logger: true });
app.register(helmet);

app.register(mercurius, {
  schema,
  resolvers,
});

app.register(require("fastify-postgres"), {
  connectionString: "postgres://postgres@localhost/postgres",
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
