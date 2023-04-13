"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for Decks. */

class Deck {
  /** Create a deck (from data), update db, return new deck data.
   *
   * data should be { archidekt_num, name, commander,commander_url }
   *
   * Returns { archidekt_num, name, commander,commander_url }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ archidekt_num, name, commander,commander_url }) {
    const duplicateCheck = await db.query(
          `SELECT archidekt_num
           FROM decks
           WHERE archidekt_num = $1`,
        [archidekt_num]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate company: ${archidekt_num}`);

    const result = await db.query(
          `INSERT INTO decks
           (archidekt_num, name, commander,commander_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING archidekt_num, name, commander,commander_url AS "commanderUrl"`,
        [
          archidekt_num,
          name,
          commander,
          commander_url,
        ],
    );
    const deck = result.rows[0];

    return deck;
  }


  /** Given a deck archidekt number, return data about deck.
   *
   * Returns { archidekt_num, name, commander,commander_url }
   *  *
   * Throws NotFoundError if not found.
   **/

  static async get(archidekt_num) {
    const deckRes = await db.query(
          `SELECT archidekt_num,
                  name,
                  commander,
                  commander_url AS "commanderUrl"
           FROM decks
           WHERE archidekt_num = $1`,
        [archidekt_num]);

    const deck = deckRes.rows[0];

    if (!deck) throw new NotFoundError(`No deck: ${archidekt_num}`);

    return deck;
  }

 

  /** Delete given Deck from database; returns undefined.
   *
   * Throws NotFoundError if Deck not found.
   **/

  static async remove(archidekt_num) {
    const result = await db.query(
          `DELETE
           FROM decks
           WHERE archidekt_num = $1
           RETURNING archidekt_num`,
        [archidekt_num]);
    const deck = result.rows[0];

    if (!deck) throw new NotFoundError(`No Deck: ${archidekt_num}`);
  }
}


module.exports = Deck;
