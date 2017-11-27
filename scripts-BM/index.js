var fs = require('fs');
var bm = require('./bm');
var utilities = require('./utilities');

if (typeof process.argv[2] === 'undefined') {
    utilities.throwError('Please provide text file name');
}
var textFileName = process.argv[2];
if (typeof process.argv[3] === 'undefined') {
    utilities.throwError('Please provide substring file name');
}
var substringFileName = process.argv[3];

try {
    var text = fs.readFileSync(textFileName, 'utf-8');
} catch (exception) {
    utilities.throwError('Text reading exception: ' + exception);
}
try {
    var substring = fs.readFileSync(substringFileName, 'utf-8');
} catch (exception) {
    utilities.throwError('Substring reading exception: ' + exception);
}

var flags = utilities.processFlags(process.argv);
var results = bm.boyerMooreSearch(text, substring, flags.numberOfResults);

console.log(results['entries'].join(', ') + '\t\n');

if (flags.computeTime) {
    console.log(results.time);
}