"use strict";
const db = require("../services/db");

module.exports.up = function (next) {
  db.pool.query(
    `drop table IF EXISTS users; CREATE TABLE users
(
    user_id serial,
    email character varying(60) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name character varying(60) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (user_id)
);

ALTER TABLE users
    OWNER to postgres;

CREATE TABLE contacts
(
    contact_id serial,
    name character varying(60) COLLATE pg_catalog."default" NOT NULL,
    "number" character varying(60) COLLATE pg_catalog."default" NOT NULL,
    user_id serial,
    CONSTRAINT contacts_pkey PRIMARY KEY (contact_id),
    CONSTRAINT "USER" FOREIGN KEY (user_id)
        REFERENCES users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
ALTER TABLE contacts
    OWNER to postgres;`,
    [],
    (err, res) => {
      if (err) {
        throw err;
      }
      console.log("done");
      next();
    }
  );
};

module.exports.down = async function (next) {
  await db.query("DROP TABLE users", []);
  await db.query("DROP TABLE contacts", []);
  next();
};
