function stringsAreEqual(string, substring, startFrom) {
    /*
    *   This will return true if strings string from start index and substring are equal
    */
    for (var i = 0; i < substring.length; i++) {
        if (string[i + startFrom] !== substring[i]) {
            return false;
        }
    }

    return true;
}

function throwError(message) {
    console.log('Error: ' + message + '.');
    process.exit(1);
}

function compareHashesAndUpdateAnswer(a, b, index, firstHash, secondHash, entries, collisions) {
    /*
    *   Firstly compares two hashes. If they are equal, compares two substrings.
    *   If they are equal, adds new index to answer. Otherwise increments collisions counter.
    */
    if (firstHash === secondHash) {
        if (stringsAreEqual(a, b, 0)) {
            entries.push(index);
        }
        else {
            collisions++;
        }
    }

    return [entries, collisions];
}


module.exports.stringsAreEqual = stringsAreEqual;
module.exports.throwError = throwError;
module.exports.compareHashes = compareHashesAndUpdateAnswer;