const redis = require("redis");

const client = redis.createClient({
  host: "redis",
  port: 6379,
  password: "REDIS_PASSWORD",
});

client.on("error", (err) => {
  console.log("Error " + err);
  throw err;
});

client.on("connect", () => {
  console.log("Redis client is connected");
});

const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = { client, getAsync, setAsync };
