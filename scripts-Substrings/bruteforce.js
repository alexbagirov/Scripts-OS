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
    while (i < text.length - substring.length) {
        if (text[i] == substring[0]) {
            if (stringsAreEqual(text.substring(i, i + substring.length), substring)) {
                entries.push(i);
            }
        }

        i++;
    }
    
    return entries;
}

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

module.exports.find = bruteForce;