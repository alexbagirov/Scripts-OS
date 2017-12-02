var fs = require('fs');
var bruteforce = require('./bruteforce');
var hashCodesSum = require('./hash-codes-sum');
var hashCodesSumOfSquares = require('./hash-codes-squared-sum');
var hashRabinKarp = require('./hash-rabin-karp');
var utilities = require('./utilities')

if (typeof process.argv[2] === 'undefined') {
    utilities.throwError('Please provide text file name');
}
var textFileName = process.argv[2];
if (typeof process.argv[3] === 'undefined') {
    utilities.throwError('Please provide substring file name');
}
var substringFileName = process.argv[3];

try {
    var text = fs.readFileSync(textFileName, 'utf-8').trim();
} catch (exception) {
    utilities.throwError('Text reading exception: ' + exception);
}
try {
    var substring = fs.readFileSync(substringFileName, 'utf-8').trim();
} catch (exception) {
    utilities.throwError('Substring reading exception: ' + exception);
}

var flags = processFlags(process.argv);

if (flags.bruteforce) {
    console.log(makeAnswer(bruteforce.search(text, substring), flags, false));
}
if (flags.hashSums) {
    console.log(makeAnswer(hashCodesSum.search(text, substring), flags, true));
}
if (flags.hashSumsOfSquares) {
    console.log(makeAnswer(hashCodesSumOfSquares.search(text, substring), flags, true));
}
if (flags.rabinKarp) {
    console.log(makeAnswer(hashRabinKarp.search(text, substring), flags, true));
}

function processFlags(arguments) {
    var flags = {
        computeTime: false,
        bruteforce: false,
        hashSums: false,
        hashSumsOfSquares: false,
        rabinKarp: false,
        numberOfResults: false
    };
    var additionalArgs = process.argv.slice(4);

    for (var i = 0; i < additionalArgs.length; i++) {
        switch (additionalArgs[i]) {
            case '-t':
                flags.computeTime = true;
                continue;
            case '-b':
                flags.bruteforce = true;
                continue;
            case '--h1':
                flags.hashSums = true;
                continue;
            case '--h2':
                flags.hashSumsOfSquares = true;
                continue;
            case '--h3':
                flags.rabinKarp = true;
                continue;
            case '-n':
                    flags.numberOfResults = Number(additionalArgs[i + 1]);
                    if (isNaN(flags.numberOfResults)) {
                        utilities.throwError('not enough arguments');
                    }
                    continue;
            default:
                continue;
        }
    }

    return flags;
}

function makeAnswer(results, flags, collision) {
    var answer = '';

    if (flags.numberOfResults) {
        results.entries = results['entries'].slice(0, flags.numberOfResults);
    }

    answer += results['entries'].join(', ') + '\r\n';

    if (collision) {
        answer += 'Collisions: ' + String(results.collisions) + '\r\n';
    }

    if (flags.computeTime) {
        answer += 'Time: ' + String(results.time) + 'ms\r\n'
    }

    return answer;
}