// const { Pool } = require("pg");
const postgres = require("postgres");

const config = require("../config");
const sql = postgres({ ...config.db });

module.exports = {
  sql,
};
