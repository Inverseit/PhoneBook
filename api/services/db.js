const { Pool } = require("pg");
const config = require("../config");
const pool = new Pool(config.db);

async function query(query, params) {
  try {
    const res = await pool.query(query, params);
    return res;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  query,
  pool,
};
