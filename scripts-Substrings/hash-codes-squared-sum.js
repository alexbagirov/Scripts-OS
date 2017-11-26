var hashSearch = require('./hash-search');

var squares = {};

function searchUsingHashSumOfSquares(text, substring) {
    return hashSearch.search(text, substring, calculateSubstringHash, updateBufferHash, 1);
}

function calculateSubstringHash(substring) {
    /*
    *   Returns hash sum of provided string.
    */
    var hash = 0;

    for (var i = 0; i < substring.length; i++) {
        var charCode = substring.charCodeAt(i);
        hash += charCode * charCode;
    }

    return hash;
}

function updateBufferHash(bufferHash, text, substring, i) {
    var firstBufferCharCode = text.charCodeAt(i - substring.length);
    var newBufferCharCode = text.charCodeAt(i);
    
    if (!(firstBufferCharCode in squares)) {
        squares[firstBufferCharCode] = firstBufferCharCode * firstBufferCharCode;
    }
    bufferHash -= squares[firstBufferCharCode];
    if (!(newBufferCharCode in squares)) {
        squares[newBufferCharCode] = newBufferCharCode * newBufferCharCode;
    }
    bufferHash += squares[newBufferCharCode];

    return bufferHash;
}

module.exports.search = searchUsingHashSumOfSquares;