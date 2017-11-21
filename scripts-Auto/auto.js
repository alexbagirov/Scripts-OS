var textFileName = process.argv[2];
var substrFileName = process.argv[3];

var text = readFile(textFileName);
var substr = readFile(substrFileName);

var additionalArguments = process.argv.slice(4);

var keys = {
    showTime: false,
    showTable: false,
    numberOfResults: NaN
};

for (var i = 0; i < additionalArguments.length; i++) {
    switch(additionalArguments[i]) {
        case '-t':
            keys.showTime = true;
            continue;
        case '-s':
            keys.showTable = true;
            continue;
        case '-n':
            try {
                keys.numberOfResults = Number(additionalArguments[i + 1]);
            } catch (exception) {
                console.log('An error occured while reading -n key.');
                process.exit(2);
            }
            continue;
    }
}

var searchResults = searchUsingAutomation(text, substr, keys.numberOfResults);

console.log(searchResults['entries'].join(', '));
if (keys.showTime) {
    console.log('Time: ' + String(searchResults.time) + 'ms');
}
if (keys.showTable) {
    printAutomaton(searchResults.automaton);
}

function searchUsingAutomation(text, substr, numberOfResults) {
    var startTime = Date.now();
    var auto = createAutomaton(substr);
    var state = 0;
    var entries = [];
    
    for (var i = 0; i < text.length; i++) {
        if (text.charAt(i) in auto[state]) {
            state = auto[state][text.charAt(i)];
        }
        else {
            state = 0;
        }

        if (state === substr.length) {
            entries.push(i - substr.length + 1);
            if (entries.length === numberOfResults) {
                break;
            }
        }
    }

    var results = {
        entries: entries,
        time: Date.now() - startTime,
        automaton: auto
    };

    return results;
}

function createAutomaton(str) {
    var alphabet = [],
        automaton = [];
    for (var i = 0; i < str.length; i++) {
        alphabet[str.charAt(i)] = 1;
        automaton[i] = [];
    }
    automaton[str.length] = [];

    for (var letter in alphabet)
        automaton[0][letter] = 0;

    for (var state = 0; state < str.length; state++) {
        var prev = automaton[state][str.charAt(state)];
        automaton[state][str.charAt(state)] = state + 1;
        for (var letter in alphabet)
            automaton[state + 1][letter] = automaton[prev][letter];
    }
    return automaton;
}

function printAutomaton(automaton) {
    var alphabet = Object.keys(automaton[0]);
    console.log('=============' + '='.repeat(alphabet.length * 5));
    console.log('|' +  '  state    ' + '| ' + alphabet.join('  | ') + '  |');

    for (var i = 0; i < automaton.length; i++) {
        var line = '';
        if (i < 10) {
            line += '|' + ' '.repeat(4) + String(i) + ' '.repeat(6) + '|';
        }
        else {
            line += '|' + ' '.repeat(4) + String(i) + ' '.repeat(5) + '|';
        }

        for (var num in automaton[i]) {
            line += ' ' + String(automaton[i][num]);
            if (String(automaton[i][num]).length === 1) {
                line += '  ';
            } 
            else {
                line += ' ';
            }
            line += '|';
        }
        console.log('-'.repeat(13 + 5 * alphabet.length));
        console.log(line);
    }

    console.log('='.repeat(13 + 5 * alphabet.length));
}

function readFile(fileName) {
    var fs = require('fs');

    try {
        return fs.readFileSync(fileName, 'utf-8').trim();
    } catch (exception) {
        console.log('Error reading file.');
        process.exit(1);
    }
}