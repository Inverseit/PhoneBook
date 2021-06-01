const { Pool } = require("pg");
const config = require("../config");
const pool = new Pool(config.db);

async function query(query, params) {
  const res = await pool.query(query, params);

  return res;
}

module.exports = {
  query,
};
