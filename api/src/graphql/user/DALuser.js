const jwt = require("jsonwebtoken");
module.exports = {
  findEmail: async (db, email) => {
    try {
      const response = await db.query(
        "select user_id, password from users where email = $1",
        [email]
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  insertUser: async (db, email, hash, name) => {
    try {
      const response = await db.query(
        "insert into users(email, password, name) values ($1, $2, $3) returning email",
        [email, hash, name]
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  setRedis: async (redis, { user_id, code }) => {
    try {
      await redis.setAsync(user_id, code);
      redis.client.expire(user_id, 60);
    } catch (error) {}
  },

  getRedis: async (redis, { user_id }) => {
    const reply = await redis.getAsync(user_id);
    return reply;
  },
};
