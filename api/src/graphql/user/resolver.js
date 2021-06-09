// const db = require("../../../services/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DAL = require("./DALuser.js");
require("dotenv").config();

// Login resolver (email, password) => AuthInfo
const login = async (_, { email, password }, context) => {
  try {
    const res = await DAL.findEmail(context.db, email);
    if (res.rows.length != 1) {
      throw new Error("Login credentials error!");
    }
    const hashInDB = res.rows[0].password;
    const result = await bcrypt.compare(password, hashInDB);
    if (!result) throw new Error("Login credentials error!");

    const user = res.rows[0];
    const payload = { user_id: user.user_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return {
      user_id: user.user_id,
      token: token,
      tokenExpiration: 2,
    };
  } catch (error) {
    throw error;
  }
};

// signup resolver (reg data) => new user data
const signup = async (
  obj,
  { input: { email, name, password, password2 } },
  context
) => {
  // Validation
  try {
    if (password != password2) {
      throw new Error("Passwords are not equal");
    }
    if (!password || password.length < 6) {
      throw new Error("Password is too short");
    }
    // email is unique
    const res = await DAL.findEmail(context.db, email);

    if (res.rows.length > 0) throw new Error("Email is already in use");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const insertResponse = await DAL.insertUser(context.db, email, hash, name);
    return insertResponse.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.resolver = {
  Query: {
    login,
  },
  Mutation: {
    signup,
  },
};
