require("dotenv").config();
const jwt = require("jsonwebtoken");

const isAuthenticated = (context) => {
  const token = context.reply.request.headers["x-jwt-token"];
  if (!token) {
    throw new Error("Token is invalid");
  }
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new Error(err);
    }
    return decoded;
  });
};

module.exports = isAuthenticated;
