"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Deck = require("./deck.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newDeck = {
    archidekt_num: 2182927,
    name: "New",
    commander: "Some Guy",
    commanderUrl: "http://new.img",
  };

  test("works", async function () {
    let deck = await Deck.create(newDeck);
    expect(deck).toEqual(newDeck);

    const result = await db.query(
      `SELECT archidekt_num, name, commander,commander_url
           FROM decks
           WHERE name = 'New'`);
    expect(result.rows).toEqual([
      {
        archidekt_num: 2182927,
        name: "New",
        commander: "Some Guy",
        commanderUrl: "http://new.img",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Deck.create(newDeck);
      await Deck.create(newDeck);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});


/************************************** get */

describe("get", function () {
  test("works", async function () {
    let deck = await Deck.get("c1");
    expect(deck).toEqual({
      handle: "c1",
      name: "C1",
      description: "Desc1",
      logoUrl: "http://c1.img",
      jobs: [
        { id: testJobIds[0], title: "Job1", salary: 100, equity: "0.1" },
        { id: testJobIds[1], title: "Job2", salary: 200, equity: "0.2" },
        { id: testJobIds[2], title: "Job3", salary: 300, equity: "0" },
        { id: testJobIds[3], title: "Job4", salary: null, equity: null },
      ],
    });
  });

  test("not found if no such deck", async function () {
    try {
      await Deck.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** update */

// describe("update", function () {
//   const updateData = {
//     name: "New",
//     description: "New Description",
//     numEmployees: 10,
//     logoUrl: "http://new.img",
//   };

//   test("works", async function () {
//     let deck = await Deck.update("c1", updateData);
//     expect(deck).toEqual({
//       handle: "c1",
//       ...updateData,
//     });

//     const result = await db.query(
//       `SELECT handle, name, description, num_employees, logo_url
//            FROM decks
//            WHERE handle = 'c1'`);
//     expect(result.rows).toEqual([{
//       handle: "c1",
//       name: "New",
//       description: "New Description",
//       num_employees: 10,
//       logo_url: "http://new.img",
//     }]);
//   });

//   test("works: null fields", async function () {
//     const updateDataSetNulls = {
//       name: "New",
//       description: "New Description",
//       numEmployees: null,
//       logoUrl: null,
//     };

//     let deck = await Deck.update("c1", updateDataSetNulls);
//     expect(deck).toEqual({
//       handle: "c1",
//       ...updateDataSetNulls,
//     });

//     const result = await db.query(
//       `SELECT handle, name, description, num_employees, logo_url
//            FROM decks
//            WHERE handle = 'c1'`);
//     expect(result.rows).toEqual([{
//       handle: "c1",
//       name: "New",
//       description: "New Description",
//       num_employees: null,
//       logo_url: null,
//     }]);
//   });

//   test("not found if no such deck", async function () {
//     try {
//       await Deck.update("nope", updateData);
//       fail();
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });

//   test("bad request with no data", async function () {
//     try {
//       await Deck.update("c1", {});
//       fail();
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });
// });

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Deck.remove("1");
    const res = await db.query(
      "SELECT archidekt_num FROM decks WHERE archidekt_num='1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such deck", async function () {
    try {
      await Deck.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
