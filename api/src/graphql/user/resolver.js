// const db = require("../../../services/db");
const bcrypt = require("bcryptjs");
const DAL = require("./DALuser.js");
const jwt = require("jsonwebtoken");
const { sendEmailCode } = require("../../../services/sendgrid");
require("dotenv").config();

const getRandomCode = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1) + min).toString(); //The maximum is inclusive and the minimum is inclusive
};

// Login resolver (email, password) => AuthInfo
const login = async (_, { email, password }, context) => {
  try {
    const res = await DAL.findEmail(context.db, email);
    if (res.rows.length != 1) {
      throw new Error("Login credentials error!");
    }
    const user_id = res.rows[0].user_id;
    const hashInDB = res.rows[0].password;
    const result = await bcrypt.compare(password, hashInDB);
    if (!result) throw new Error("Login credentials error!");
    // Generate and save a code to the redis
    const code = getRandomCode();
    const reply = await context.redis.setAsync(user_id, code);
    console.log(`${reply} for ${user_id} with code=${code}`);
    const resEmail = await sendEmailCode(email, code);
    context.redis.client.expire(user_id, 60);
    console.log(resEmail);

    // send email

    return user_id;
  } catch (error) {
    throw error;
  }
};

const tfa = async (_, { input: { user_id, code } }, context) => {
  try {
    // lookup redis and compare
    const reply = await context.redis.getAsync(user_id);
    if (reply != code) {
      throw new Error("Your TFA token is not valid or expired!");
    }
    // SUCCESS
    const payload = { user_id: user_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return {
      user_id: user_id,
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
    tfa,
  },
  Mutation: {
    signup,
    login,
  },
};
