function stringsAreEqual(a, b) {
    /*
    *   This will return true if strings a and b are equal
    */
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

function throwError(message, code) {
    throw new Error('Error ' + code + ': ' + message + '.');
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


module.exports.stringsAreEqual = stringsAreEqual;
module.exports.throwError = throwError;
module.exports.compareHashes = compareHashesAndUpdateAnswer;