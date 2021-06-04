require("dotenv").config();
const jwt = require("jsonwebtoken");

const isAuthenticated = (token) => {
  if (!token) {
    throw new Error("Token is invalid");
  }
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new Error("Your authorization token is not valid or expired!", err);
    }
    return decoded;
  });
};

module.exports = isAuthenticated;
