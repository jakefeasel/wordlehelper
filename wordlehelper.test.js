"use strict";
import { describe, it } from "node:test";
import * as assert from "node:assert";
import * as wordleHelper from "./js/words.js";

/*
findWordScore("aglet", ["adieu"]) => 10
findWordScore("aglet", ["about"]) => 10
findWordScore("aglet", ["axiom"]) => 5
findWordScore("aglet", ["axiom","avoid"]) => 10
findWordScore("aglet", ["treat"]) => 7
*/
describe("findWordScore() test suite", () => {
  it("adds 5 to its return value when x[i] and y[i] are the same letter", () => {
    assert.strictEqual(wordleHelper.findWordScore("aglet", ["axiom"]), 5);
    assert.strictEqual(wordleHelper.findWordScore("aglet", ["axiom","avoid"]), 10);
  });
  it("adds 1 to its return value when x[i] !== y[i] but y[i] is in x", () => {
    assert.strictEqual(wordleHelper.findWordScore("horse", ["hosed"]), 12);
  });
  it("only accepts alphabetical strings containing five letters", () => {
    assert.throws(() => {
      wordleHelper.findWordScore("l@ser", ["laser"]);
      wordleHelper.findWordScore("l0ser", ["loser"]);
      wordleHelper.findWordScore("four", ["four"]);
    }, Error);
  });
});

// return a list of words sorted by whichever word will provide the most useful subset of what is provided
// What is considered useful? A word with the highest "score", meaning it has the most impact on subsequent
// guesses
describe("sortWords() test suite", () => {
  it("sorts words based on their usefulness score", () => {
    assert.deepStrictEqual(
      wordleHelper.sortWords(["house", "horse", "neigh"]),
      [
        { word: 'house', score: 47 },
        { word: 'horse', score: 47 },
        { word: 'neigh', score: 29 }
      ]
    );
  })
});