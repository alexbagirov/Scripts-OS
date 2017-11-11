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

module.exports.stringsAreEqual = stringsAreEqual;
module.exports.throwError = throwError;