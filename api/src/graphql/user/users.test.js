const { resolver } = require("./resolver");

jest.mock("./DALuser.js", () => require("./__mocks__/DALuser"));

jest.mock("bcryptjs");

jest.mock("@sendgrid/mail");
jest.mock("../../../services/sendgrid");
const { sendEmailCode } = require("../../../services/sendgrid");
sendEmailCode.mockReturnValue(true);

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

const context = {
  db: undefined,
  redis: undefined,
};

describe("Login", () => {
  const login = resolver.Mutation.login;
  let {
    findEmail: mockedFindEmail,
    insertUser: mockedInsertUser,
  } = require("./DALuser.js");

  test("No such email in login", async () => {
    mockedFindEmail.mockReturnValue({ rows: [] });
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
    mockedFindEmail.mockReturnValue({ rows: [{ user }] });
    const res = await login({}, user, {});
    expect(res).toEqual(user.email);
  });
});

describe("Sign Up", () => {
  const signup = resolver.Mutation.signup;
  let {
    findEmail: mockedFindEmail,
    insertUser: mockedInsertUser,
  } = require("./DALuser.js");

  mockedFindEmail.mockReturnValue({ rows: [] });

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
    mockedFindEmail.mockReturnValue({ rows: [user] });
    await expect(
      signup(
        {},
        {
          input,
        },
        {}
      )
    ).rejects.toThrow("Email is already in use");

    mockedFindEmail.mockReturnValue({ rows: [user, user] });
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
    mockedFindEmail.mockReturnValue({ rows: [] });
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

describe("TFA", () => {
  let {
    findEmail: mockedFindEmail,
    insertUser: mockedInsertUser,
    getRedis,
  } = require("./DALuser.js");

  const input = { email: "email", code: "test_token" };
  const tfa = resolver.Query.tfa;

  test("should fail with email error", async () => {
    mockedFindEmail.mockReturnValue({ rows: [] });
    await expect(
      tfa(
        undefined,
        {
          input,
        },
        context
      )
    ).rejects.toThrow("Email error!");
  });

  test("wrong token", async () => {
    mockedFindEmail.mockReturnValue({ rows: [user] });
    getRedis.mockReturnValue("wrong-code");
    // correct code is test_token
    await expect(
      tfa(
        undefined,
        {
          input,
        },
        { context }
      )
    ).rejects.toThrow("Your TFA token is not valid or expired!");
  });

  test("correct token", async () => {
    mockedFindEmail.mockReturnValue({ rows: [user] });
    getRedis.mockReturnValue("test_token");
    // correct code is test_token'
    const res = await tfa(
      undefined,
      {
        input,
      },
      { context }
    );
    await expect(res).toEqual({
      token: "test_token",
      tokenExpiration: 2,
      user_id: 1,
    });
  });
});
