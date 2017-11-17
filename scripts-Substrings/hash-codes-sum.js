var hashSearch = require('./hash-search');

function searchUsingHashSum(text, substring) {
    return hashSearch.search(text, substring, calculateSubstringHash, updateBufferHash, 1);
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

function updateBufferHash(bufferHash, text, substring, i) {
    bufferHash -= text.charCodeAt(i - substring.length);
    bufferHash += text.charCodeAt(i);
    return bufferHash;
}

module.exports.search = searchUsingHashSum;