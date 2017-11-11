var utilities = require('./utilities');

function searchUsingHashSum(text, substring) {
    var entries = [];
    var startupTime = Date.now();
    var collisions = 0;
    var substringHash = calculateSubstringHash(substring);

    var bufferHash = calculateSubstringHash(text.substring(0, substring.length));
    var newAnswers = compareHashesAndUpdateAnswer(text.substring(0, substring.length), substring, 0, bufferHash, substringHash, entries, collisions);
    entries = newAnswers[0];
    collisions = newAnswers[1];

    var i = substring.length;
    while (i < text.length) {
        bufferHash -= text.charCodeAt(i - 1);
        bufferHash += text.charCodeAt(i);
        var newAnswers = compareHashesAndUpdateAnswer(text.substring(i - substring.length + 1, i + 1), substring, i - substring.length + 1, bufferHash, substringHash, entries, collisions);
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
        hash += substring.charCodeAt(i);
    }

    return hash;
}

function compareHashesAndUpdateAnswer(a, b, index, firstHash, secondHash, entries, collisions) {
    /*
    *   Firstly compares two hashes. If they are equal, compares two substrings.
    *   If they are equal, adds new index to answer. Otherwise increments collisions counter.
    */
    if (firstHash === secondHash) {
        if (utilities.stringsAreEqual(a, b)) {
            entries.push(index);
        }
        else {
            collisions++;
        }
    }

    return [entries, collisions];
}

module.exports.find = searchUsingHashSum;