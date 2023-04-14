"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureCorrectUserOrAdmin, ensureLoggedIn } = require("../middleware/auth");
const Deck = require("../models/deck");

const deckNewSchema = require("../schemas/deckNew.json");

const router = new express.Router();


/** POST / { deck } =>  { deck }
 *
 * deck should be { archidekt_num, name }
 *
 * Returns { archidekt_num, name}
 *
 * Authorization required: correct user or Admin
 */

router.post("/", /*ensureLoggedIn,*/ async function (req, res, next) {
  try {
    console.log("Validator",validator.valid)
    console.log("res.locals", res.locals.user)
    const validator = jsonschema.validate(req.body, deckNewSchema);
if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const deck = await Deck.create(req.body);
    return res.status(201).json({ deck });
  } catch (err) {
    return next(err);
  }
});


/** GET /[archidekt_num]  =>  { deck }
 *
 *  Deck is { archidekt_num, name }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get("/:archidekt_num", async function (req, res, next) {
  try {
    const deck = await Deck.get(req.params.archidekt_num);
    return res.json({ deck });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[archidekt_num]  =>  { deleted: archidekt_num }
 *
 * Authorization: correct user or admin
 */

router.delete("/:archidekt_num", ensureLoggedIn, async function (req, res, next) {
  try {
    await Deck.remove(req.params.archidekt_num);
    return res.json({ deleted: req.params.archidekt_num });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
