import { filterWords, sortWords } from "./words.js";

export const $id = (id) => document.getElementById(id);

export function displayCurrentWord(game) {
  const row = $id("words")
  .getElementsByTagName("tr")[game.currentGuess]
  .getElementsByTagName("td");
  for(let i = 0; i < 5; i++) {
    row[i].textContent = game.currentWord[i] || "";
  }
  $id('hiddeninput').focus();
}

export function updateWords(game, event) {
  if (event.key === "Backspace") {
    game.currentWord = game.currentWord.replace(/.$/, '');
  } else if (event.key.match(/^[A-Za-z]$/) && game.currentWord.length < 5) {
    game.currentWord += event.key.toLowerCase();
  } else if (event.key === "Enter") {
    guessNewWord(game);
  }
  displayCurrentWord(game);
}

export function toggleLetterState(game, event) {
  var cell = event.target;
  if (parseInt(cell.parentElement.getAttribute("guessNumber")) === game.currentGuess) {
    if (cell.classList[0] === "exact") {
      cell.className = "inexact";
    } else if (cell.classList[0] === "inexact") {
      cell.className = "";
    } else {
      cell.className = "exact";
    }
  }
}

export function getDetailsFromCurrentWordPattern(game) {
  var details = {
    matchPattern: "",
    notFound: ""
  };
  for (var i = 0; i < 5; i++) {
    var cell = $id("words")
    .getElementsByTagName("tr")[game.currentGuess]
    .getElementsByTagName("td")[i];
    
    if (cell.classList[0] === "exact") {
      details.matchPattern += cell.innerHTML;
    } else if (cell.classList[0] === "inexact") {
      details.matchPattern += cell.innerHTML.toUpperCase();
    } else {
      details.matchPattern += ".";
      details.notFound += cell.innerHTML;
    }
  }
  return details;
}

export function guessNewWord(game) {
  if (game.currentWord.length === 5) {
    var patternDetails = getDetailsFromCurrentWordPattern(game);
    if (patternDetails.matchPattern === ".....") {
      if (!confirm("Did you remember to click the letters that matched? Are you sure you didn't get any matches from Wordle?")) {
        return;
      }
    }
    
    game.validWords = sortWords(
      filterWords(game.validWords, patternDetails.matchPattern, patternDetails.notFound)
    )
    .map(wordObj => wordObj.word);
        
    if (game.validWords.length) {
      game.currentWord = game.validWords[0];
      
      $id("otherGuesses").value = JSON.stringify(game.validWords.slice(0,9), null, 4);
      $id('hiddeninput').value = game.currentWord;
      
      game.currentGuess++;
      $id("words").appendChild(document.createElement("tr"));
      
      $id("words")
      .getElementsByTagName("tr")[game.currentGuess]
      .setAttribute("guessNumber", game.currentGuess)
      
      for (let i = 0; i < 5; i++) {
        $id("words")
        .getElementsByTagName("tr")[game.currentGuess]
        .appendChild(document.createElement("td"));

        if (
          game.currentGuess > 0 && 
          $id("words")
          .getElementsByTagName("tr")[game.currentGuess-1]
          .getElementsByTagName("td")[i]
          .className === "exact"
        ) {
          $id("words")
          .getElementsByTagName("tr")[game.currentGuess]
          .getElementsByTagName("td")[i]
          .className = "exact";
        }
                    
      }
      displayCurrentWord(game);
    } else {
      alert("No matching words remaining");
    }
  } else {
    alert("Provide a current guess first");
  }
}