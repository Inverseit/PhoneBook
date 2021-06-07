jest.mock("jsonwebtoken");
const jwt = require("jsonwebtoken");
jwt.sign.mockReturnValue("testtest");

module.exports = {
  jwt,
};
