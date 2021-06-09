const { resolver } = require("./resolver");

jest.mock("./DALuser.js", () => require("./__mocks__/DALuser"));

jest.mock("bcryptjs");
const bcrypt = require("bcryptjs");
bcrypt.genSalt.mockReturnValue("test_salt");
bcrypt.hash.mockReturnValue("test_hash");
bcrypt.compare.mockReturnValue(true);

jest.mock("jsonwebtoken");
const jwt = require("jsonwebtoken");
jwt.sign.mockReturnValue("test_token");

jest.mock("../../../midlewares/isAuthenticated", () =>
  require("../../../midlewares/__mocks__/isAuthenticated")
);
const isAuthenticated = require("../../../midlewares/isAuthenticated");

const user = { user_id: 1, email: "test_email", password: "test_password" };
const input = {
  email: "test_email",
  name: "test_name",
  password: "test_password",
  password2: "test_password",
};

describe("Login", () => {
  const login = resolver.Query.login;
  let {
    findEmail: mockedFindEmail,
    insertUser: mockedInsertUser,
  } = require("./DALuser.js");

  test("No such email in login", async () => {
    mockedFindEmail.mockReturnValueOnce({ rows: [] });
    await expect(login(undefined, user, {})).rejects.toThrow(
      "Login credentials error!"
    );
  });

  test("Wrong password case", async () => {
    bcrypt.compare.mockReturnValue(false);
    await expect(login(undefined, user, {})).rejects.toThrow(
      "Login credentials error!"
    );
  });

  test("Correct password case", async () => {
    bcrypt.compare.mockReturnValue(true);
    const res = await login({}, user, {});
    expect(res).toEqual({
      user_id: 1,
      token: "test_token",
      tokenExpiration: 2,
    });
  });
});

describe("Sign Up", () => {
  const signup = resolver.Mutation.signup;
  let {
    findEmail: mockedFindEmail,
    insertUser: mockedInsertUser,
  } = require("./DALuser.js");
  test("Password verification error", async () => {
    await expect(
      signup(
        {},
        {
          input: {
            ...input,
            password: "123456789",
            password2: "12345678",
          },
        },
        {}
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
            ...input,
            password: "--11",
            password2: "--11",
          },
        },
        {}
      )
    ).rejects.toThrow("Password is too short");

    // EDGE
    await expect(
      signup(
        undefined,
        {
          input: {
            ...input,
            password: "",
            password2: "",
          },
        },
        {}
      )
    ).rejects.toThrow("Password is too short");

    // EDGE
    await expect(
      signup(
        {},
        {
          input: {
            ...input,
            password: "12345",
            password2: "12345",
          },
        },
        {}
      )
    ).rejects.toThrow("Password is too short");
  });
  test("Email is in use", async () => {
    mockedFindEmail.mockReturnValueOnce({ rows: [user] });
    await expect(
      signup(
        {},
        {
          input,
        },
        {}
      )
    ).rejects.toThrow("Email is already in use");

    mockedFindEmail.mockReturnValueOnce({ rows: [user, user] });
    await expect(
      signup(
        undefined,
        {
          input,
        },
        {}
      )
    ).rejects.toThrow("Email is already in use");
  });

  test("Correct signup", async () => {
    mockedFindEmail.mockReturnValueOnce({ rows: [] });
    mockedFindEmail.mockReturnValueOnce({ rows: [user] });
    const res = await signup(
      undefined,
      {
        input,
      },
      {}
    );
    expect(res).toEqual({
      email: "test_email",
      hash: "test_hash",
      name: "test_name",
    });
  });
});
