export function findWordScore(filterWord, currentWordList) {
    const wordChecker = /^[A-Za-z]{5}$/
    if (!wordChecker.test(filterWord)) {
        throw new Error("Invalid word!");
    }
    return currentWordList.reduce((currentScore, currentWord) => {
        let thisScore = 0;
        for (let i = 0; i < filterWord.length; i++) {
            if (filterWord.charAt(i) === currentWord.charAt(i)) {
                thisScore += 5;
            } else if (currentWord.indexOf(filterWord.charAt(i)) !== -1) {
                thisScore += 1;
            }
        }
        return thisScore + currentScore;
    }, 0);
}

export function sortWords (currentWordList) {
    const scoredList = currentWordList.map(word =>
       ({word, score: findWordScore(word, currentWordList)})
    ).sort((a, b) => b.score - a.score);
    return scoredList;
}

// given a pattern of input from wordle, filter the list of possible words down to those that match
export function filterWords(validWords, matchPattern, notFound) {
    let filterRegex;

    let inexactMatches = matchPattern
        .split("")
        .filter(c => c.match(/[A-Z]/))
        .map(c => c.toLowerCase())
        .join("");

    // Deal with the case where we have at least two instances of the same letter
    // In at least one instance, it is inexact, and the others it is not a match at all
    notFound = notFound.split("").filter(letter =>
        // It's best to only consider the inexact matches in these cases, and forget
        // about the notFound cases. Yes, this means there will be some rare instances
        // when we suggest a word that couldn't fit due to a previously-excluded letter
        // position, but it's better than accidentally filtering out a valid option.
        (inexactMatches.indexOf(letter) === -1)
    ).join("");

    matchPattern = matchPattern.replaceAll(/([A-Z])/g, (result) => `[^${result.toLowerCase()}X]`);

    if (inexactMatches.length && notFound.length) {
        filterRegex = new RegExp(`^${matchPattern.replaceAll(".", `(?:[^${notFound}])`).replaceAll("X", `${notFound}`)}$`);
    } else if (!inexactMatches.length && notFound.length) {
        filterRegex = new RegExp(`^${matchPattern.replaceAll(".", `(?:[^${notFound}])`)}$`);
    } else if (inexactMatches.length && !notFound.length) {
        filterRegex = new RegExp(`^${matchPattern.replaceAll(".", `(?:[${inexactMatches}])`)}$`);
    } else {
        filterRegex = new RegExp(`^${matchPattern}$`);
    }
    
    return validWords.filter(word => 
        word.match(filterRegex) && 
            inexactMatches
            .split("")
            .reduce((result, letter) => result && word.match(letter), true)
    );
}