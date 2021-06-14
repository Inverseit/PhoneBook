const jwt = require('jsonwebtoken');
module.exports = {
  findEmail: async (db, email) => {
    const sql = db.sql;
    try {
      const response = await db.sql`
        select user_id, password from users where email = ${email}
      `;
      // const res = { rows: response };
      return response;
    } catch (error) {
      throw error;
    }
  },

  insertUser: async (db, email, hash, name) => {
    try {
      const sql = db.sql;
      user = { email, password: hash, name };
      // const response = await db.sql`
      //   insert into users ${sql(user, 'email', 'password', 'name')} returning email
      // `;
      const response =
        await db.sql`insert into users (email, password, name) values (${email}, ${hash}, ${name}) returning *`;
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
