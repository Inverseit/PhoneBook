const db = require("../services/db");
db.query = jest.fn();
db.query
  .mockReturnValueOnce({ rows: [] })
  .mockReturnValueOnce({ rows: [{ user_id: 1, password: "test" }] })
  .mockReturnValueOnce({ rows: [{ user_id: 2, password: "test" }] })
  .mockReturnValue({ rows: [{ user_id: 1, password: "testpassword" }] });

jest.mock("bcryptjs");
const bcrypt = require("bcryptjs");
bcrypt.genSalt.mockReturnValue("salttest");
bcrypt.hash.mockReturnValue("hashtest");
bcrypt.compare.mockReturnValueOnce(false).mockReturnValue(true);

jest.mock("jsonwebtoken");
const jwt = require("jsonwebtoken");
jwt.sign.mockReturnValue("testtest");

const { resolver } = require("../src/graphql/user/resolver");
const login = resolver.Query.login;
const signup = resolver.Mutation.signup;

describe("Login", () => {
  test("No such email in login", async () => {
    await expect(
      login(undefined, { email: undefined, password: undefined }, { db })
    ).rejects.toThrow("Login credentials error!");
  });

  test("Wrong password case", async () => {
    await expect(
      login(undefined, { email: undefined, password: undefined }, { db })
    ).rejects.toThrow("Login credentials error!");
  });

  test("Correct password case", async () => {
    const res = await login(
      undefined,
      { email: undefined, password: undefined },
      { db }
    );
    expect(res).toEqual({ user_id: 2, token: "testtest", tokenExpiration: 2 });
    const res2 = await login(
      undefined,
      { email: undefined, password: undefined },
      { db }
    );
    expect(res2).toEqual({
      user_id: 1,
      token: "testtest",
      tokenExpiration: 2,
    });
  });
});

describe("Sign Up", () => {
  test("Password verification error", async () => {
    await expect(
      signup(
        undefined,
        {
          input: {
            email: undefined,
            name: undefined,
            password: "123456789",
            password2: "12345678",
          },
        },
        { db }
      )
    ).rejects.toThrow("Passwords are not equal");
  });
  test("Password to short error", async () => {
    // RANDOM
    await expect(
      signup(
        undefined,
        {
          input: {
            email: undefined,
            name: undefined,
            password: "--11",
            password2: "--11",
          },
        },
        { db }
      )
    ).rejects.toThrow("Password is too short");

    // EDGE
    await expect(
      signup(
        undefined,
        {
          input: {
            email: undefined,
            name: undefined,
            password: "",
            password2: "",
          },
        },
        { db }
      )
    ).rejects.toThrow("Password is too short");

    // EDGE
    await expect(
      signup(
        undefined,
        {
          input: {
            email: undefined,
            name: undefined,
            password: "12345",
            password2: "12345",
          },
        },
        { db }
      )
    ).rejects.toThrow("Password is too short");
  });
  test("Email is in use", async () => {
    db.query.mockReturnValueOnce({ rows: [1] });
    await expect(
      signup(
        undefined,
        {
          input: {
            email: undefined,
            name: undefined,
            password: "123456789",
            password2: "123456789",
          },
        },
        { db }
      )
    ).rejects.toThrow("Email is already in use");

    db.query.mockReturnValueOnce({ rows: [1, 2] });
    await expect(
      signup(
        undefined,
        {
          input: {
            email: undefined,
            name: undefined,
            password: "123456789",
            password2: "123456789",
          },
        },
        { db }
      )
    ).rejects.toThrow("Email is already in use");
  });

  test("Correct signup", async () => {
    db.query.mockReturnValueOnce({ rows: [] });
    db.query.mockReturnValueOnce({
      rows: [{ email: "testemail" }],
    });
    const res = await signup(
      undefined,
      {
        input: {
          email: "testemail",
          name: "testname",
          password: "lol123456789",
          password2: "lol123456789",
        },
      },
      { kek: db }
    );
    expect(res).toEqual({
      email: "testemail",
    });
  });
});
