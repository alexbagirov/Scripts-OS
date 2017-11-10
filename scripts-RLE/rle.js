var operation = process.argv[2];
var input = process.argv[3];
var output = process.argv[4];

var fs = require('fs');

fs.readFile(input, { encoding: 'utf-8' }, function (err, data) {
    if (!err) {
        if (operation == 'encode') encodeText(data);
        else decodeText(data);
    } else {
        console.log(err);
    }
});

function encodeText(text) {
    var answer = '';
    var differentLettersCounter = 0;

    for (var i = 0; i < text.length; i++) {
        var similarLettersCounter = 0;
        while (text[i] == text[similarLettersCounter + i] && similarLettersCounter < 127) similarLettersCounter++;
        if (similarLettersCounter == 1) {
            differentLettersCounter++;
            if (differentLettersCounter == 128 || i == text.length - 1) {
                answer += String.fromCharCode(differentLettersCounter) + text.substr(i - differentLettersCounter + 1, differentLettersCounter);
                differentLettersCounter = 0;
            }
        }
        else {
            if (differentLettersCounter != 0) {
                answer += String.fromCharCode(differentLettersCounter) + text.substr(i - differentLettersCounter, differentLettersCounter);
                differentLettersCounter = 0;
            }
            answer += String.fromCharCode(similarLettersCounter + 128) + text[i];
            i = i + similarLettersCounter - 1;
        }
    }

    writeAnswer(answer, output);
}

function decodeText(text) {
    var answer = '';

    for (var i = 0; i < text.length; i++) {
        if (text.charCodeAt(i) < 129) {
            answer += text.substr(i + 1, text.charCodeAt(i));
            i += answer.charCodeAt(i);
        }
        else {
            for (var j = 0; j < text.charCodeAt(i) - 128; j++) answer += text.substr(i + 1, 1);
            i++;
        }
    }

    writeAnswer(answer, output);
}

function writeAnswer(text, output) {
    var fs = require('fs');
    fs.writeFile(output, text, function (err) {
        if (err) console.log(err);
    });
}