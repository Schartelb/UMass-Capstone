"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
      [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
    { username, password, firstName, lastName, email, isAdmin }) {
    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
      [
        username,
        hashedPassword,
        firstName,
        lastName,
        email,
        isAdmin,
      ],
    );

    const user = result.rows[0];

    return user;
  }


  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, deck }
   *   where deck is { archidekt_num, name }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    console.log("user model user.get")
    const userRes = await db.query(
      `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
      [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userDecksRes = await db.query(
      `SELECT ud.archidekt_num, dl.name
           FROM user_decks AS ud
           JOIN decks AS dl
           ON ud.archidekt_num = dl.archidekt_num
           WHERE ud.username = $1`, [username]);

    
    user.decks = userDecksRes.rows
    return user;
  }

  // /** Update user data with `data`.
  //  *
  //  * This is a "partial update" --- it's fine if data doesn't contain
  //  * all the fields; this only changes provided ones.
  //  *
  //  * Data can include:
  //  *   { firstName, lastName, password, email, isAdmin }
  //  *
  //  * Returns { username, firstName, lastName, email, isAdmin }
  //  *
  //  * Throws NotFoundError if not found.
  //  *
  //  * WARNING: this function can set a new password or make a user an admin.
  //  * Callers of this function must be certain they have validated inputs to this
  //  * or a serious security risks are opened.
  //  */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        firstName: "first_name",
        lastName: "last_name",
        isAdmin: "is_admin",
      });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  /** Add Deck to user: update db, returns undefined.
   *
   * - username: username adding Deck
   * - archidekt_num: archidekt url number
   **/

  static async addDecktoUser(username, archidekt_num) {
    const duplicateCheck = await db.query(
      `SELECT archidekt_num, username
           FROM user_decks
           WHERE archidekt_num = $1 AND username=$2`,
      [archidekt_num, username]);

    if (duplicateCheck.rows[0])
      return (duplicateCheck.rows[0]);

    const preCheck = await db.query(
      `SELECT archidekt_num
           FROM decks
           WHERE archidekt_num = $1`, [archidekt_num]);
    const deck = preCheck.rows[0];

    if (!deck) throw new NotFoundError(`No deck: ${archidekt_num}`);

    const preCheck2 = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`, [username]);
    const user = preCheck2.rows[0];

    if (!user) throw new NotFoundError(`No username: ${username}`);

    await db.query(
      `INSERT INTO user_decks (archidekt_num, username)
           VALUES ($1, $2)`,
      [archidekt_num, username]);
  }
}


module.exports = User;
