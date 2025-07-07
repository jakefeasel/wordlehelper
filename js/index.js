import * as gui from "./gui.js";

fetch("five_letter_words.txt")
.then(res => res.text())
.then(text => text.split("\n"))
.then(words => {
  const Game = {
    validWords: words,
    currentGuess: 0,
    currentWord: ""
  };

  window.addEventListener("load", () => gui.displayCurrentWord(Game));
  window.addEventListener("keydown", e => gui.updateWords(Game, e));

  gui.$id("words").addEventListener("click", (e) => gui.toggleLetterState(Game, e));
  gui.$id("guessButton").addEventListener("click", (e) => gui.guessNewWord(Game));
})