var utilities = require('./utilities');

function searchUsingRabinKarp(text, substring) {
    var entries = [];
    var stratupTime = Date.now();
    var collisions = 0;
    const BASE = 2;
    var substringHash = calculateSubstringHash(substring, BASE);
    
    var bufferHash = calculateSubstringHash(text.substring(0, substring.length), BASE);
    var newAnswers = utilities.compareHashes(text.substring(0, substring.length), substring, 0, bufferHash, substringHash, entries, collisions);
    entries = newAnswers[0];
    collisions = newAnswers[1];

    var i = substring.length;
    while (i < text.length) {
        bufferHash -= text.charCodeAt(i - 1) * Math.pow(base, i - 1);
        bufferHash += text.charCodeAt(i) * Math.pow(base, i);
        var newAnswers = utilities.compareHashes(text.substring(i - substring.length + 1, i + 1), substring, i - substring.length + 1, bufferHash, substringHash, entries, collisions);
        entries = newAnswers[0];
        collisions = newAnswers[1];
        i++;
    }

    var completionTime = Date.now();

    return [entries, collisions, completionTime - startupTime];
}

function calculateSubstringHash(substring, base) {
    /*
    *   Returns hash sum of provided string.
    */
    var hash = 0;

    for (var i = 0; i < substring.length; i++) {
        hash += substring.charCodeAt(i) * Math.pow(base, i);
    }

    return hash;
}

module.exports.find = searchUsingRabinKarp;