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

module.exports.stringsAreEqual = stringsAreEqual;