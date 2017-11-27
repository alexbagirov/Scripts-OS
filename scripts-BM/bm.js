function boyerMooreSearch(str, pattern, numberOfResults) {
    var stopTable = buildTable(pattern);
    var index = pattern.length - 1;
    var entries = [];
    var startupTime = Date.now();

    while (index < str.length) {
        var shift = findShift(str, pattern, index - pattern.length + 1, stopTable);
        if (isNaN(shift)) {
            entries.push(index - pattern.length + 1);
            if (entries.length === numberOfResults) {
                return entries;
            }
            index++;
        }
        else {
            index += pattern.length - shift - 1;
        }
    }

    var results = {
        entries: entries,
        time: Date.now() - startupTime
    }
    return results;
}

function buildTable(str) {
    var table = {};

    for (var i = 0; i < str.length - 1; i++) {
        table[str.charAt(i)] = i;
    }

    return table;
}

function findShift(str, substring, startIndex, table) {
    for (var i = substring.length - 1; i >= 0; i--) {
        if (str.charAt(i + startIndex) !== substring.charAt(i)) {
            if (str.charAt(i + startIndex) in table) {
                return table[str.charAt(i + startIndex)];
            }
            else {
                return -1;
            }
        }
    }

    return NaN;
}

module.exports.boyerMooreSearch = boyerMooreSearch;