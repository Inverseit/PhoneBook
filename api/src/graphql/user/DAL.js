const findEmail = jest.mock();

module.exports = {
  findEmail: async (db, email) => {
    const response = await db.query(
      "select user_id, password from users where email = $1",
      [email]
    );
    return response;
  },

  insertUser: async (db, email, hash, name) => {
    const response = await db.query(
      "insert into users(email, password, name) values ($1, $2, $3) returning email",
      [email, hash, name]
    );
    return response;
  },
};
