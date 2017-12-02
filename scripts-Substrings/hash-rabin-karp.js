var hashSearch = require('./hash-search');

function searchUsingRabinKarp(text, substring) {
    return hashSearch.search(text, substring, calculateSubstringHash, updateBufferHash, 2);
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

function updateBufferHash(bufferHash, text, substring, i, base) {
    bufferHash = (bufferHash - text.charCodeAt(i - substring.length)) / 2;
    bufferHash += text.charCodeAt(i) * Math.pow(base, substring.length - 1);
    return bufferHash;
}

module.exports.search = searchUsingRabinKarp;