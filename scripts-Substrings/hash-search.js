var utilities = require('./utilities');

function searchUsingHash(text, substring, calculateSubstringHash, updateBufferHash, base) {
    var entries = [];
    var startupTime = Date.now();
    var collisions = 0;
    const BASE = base;
    var substringHash = calculateSubstringHash(substring, BASE);

    var bufferHash = calculateSubstringHash(text.substring(0, substring.length), BASE);
    var newAnswers = utilities.compareHashes(text.substring(0, substring.length), substring, 0, bufferHash, substringHash, entries, collisions);
    entries = newAnswers[0];
    collisions = newAnswers[1];

    var i = substring.length;
    while (i < text.length) {
        bufferHash = updateBufferHash(bufferHash, text, substring, i, base);
        newAnswers = utilities.compareHashes(text.substring(i - substring.length + 1, i + 1), substring, i - substring.length + 1, bufferHash, substringHash, entries, collisions);
        entries = newAnswers[0];
        collisions = newAnswers[1];
        i++;
    }

    var results = {
        entries: entries,
        collisions: collisions,
        time: Date.now() - startupTime
    };

    return results;
}

module.exports.search = searchUsingHash;