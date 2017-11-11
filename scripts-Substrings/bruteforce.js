var utilities = require('./utilities');

function bruteForce(text, substring) {
    /*
    *   Brute force substrings finding function.
    *   Iterates through each symbol of text and seeks for substring begginning.
    *   Once being found, check if other symbols of substring are there.
    *   This one works for O(n^2).
    *   Returns an array of intries' indexes.
    */
    var entries = [];
    
    var i = 0;
    while (i < text.length - substring.length + 1) {
        if (text[i] == substring[0]) {
            if (utilities.stringsAreEqual(text.substring(i, i + substring.length), substring)) {
                entries.push(i);
            }
        }

        i++;
    }
    
    return [entries, 0];
}

module.exports.find = bruteForce;