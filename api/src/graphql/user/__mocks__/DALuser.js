module.exports = {
  findEmail: jest
    .fn()
    .mockReturnValue([{ user_id: 1, password: "test_password" }]),
  insertUser: jest
    .fn()
    .mockReturnValue([
      { email: "test_email", hash: "test_hash", name: "test_name" },
    ]),
  setRedis: jest.fn().mockReturnValue(true),

  getRedis: jest.fn().mockReturnValue("test_token"),
};
