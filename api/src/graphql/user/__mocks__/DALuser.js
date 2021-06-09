module.exports = {
  findEmail: jest
    .fn()
    .mockReturnValue({ rows: [{ user_id: 1, password: "test_password" }] }),
  insertUser: jest.fn().mockReturnValue({
    rows: [{ email: "test_email", hash: "test_hash", name: "test_name" }],
  }),
};
