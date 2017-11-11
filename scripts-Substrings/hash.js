var textFileName = process.argv[2];
var substringFileName = process.argv[3];

var fs = require('fs');
var bruteforce = require('./bruteforce');

try {
    var text = fs.readFileSync(textFileName, 'binary');
} catch (exception) {
    process.exit(1);
}
try {
    var substring = fs.readFileSync(substringFileName, 'binary');
} catch (exception) {
    process.exit(1);
}

