var utilities = require('./utilities');

function searchUsingHashSumOfSquares(text, substring) {
    var entries = [];
    var startupTime = Date.now();
    var collisions = 0;
    var substringHash = calculateSubstringHash(substring);

    var bufferHash = calculateSubstringHash(text.substring(0, substring.length));
    var newAnswers = utilities.compareHashes(text.substring(0, substring.length), substring, 0, bufferHash, substringHash, entries, collisions);
    entries = newAnswers[0];
    collisions = newAnswers[1];

    var i = substring.length;
    while (i < text.length) {
        var previousCharCode = text.charCodeAt(i - 1);
        var currentCharCode = text.charCodeAt(i)
        bufferHash -= previousCharCode * previousCharCode;
        bufferHash += currentCharCode * currentCharCode;
        var newAnswers = utilities.compareHashes(text.substring(i - substring.length + 1, i + 1), substring, i - substring.length + 1, bufferHash, substringHash, entries, collisions);
        entries = newAnswers[0];
        collisions = newAnswers[1];
        i++;
    }

    var completionTime = Date.now();

    return [entries, collisions, completionTime - startupTime];
}

function calculateSubstringHash(substring) {
    /*
    *   Returns hash sum of provided string.
    */
    var hash = 0;

    for (var i = 0; i < substring.length; i++) {
        var charCode = substring.charCodeAt(i);
        hash += charCode * charCode;
    }

    return hash;
}

module.exports.find = searchUsingHashSumOfSquares;