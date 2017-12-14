try {
    for (var i = 2; i < 5; i++) {
        if (typeof (process.argv[i]) === 'undefined') {
            throw new Error('Not enough arguments.')
        }
    }
    var operation = process.argv[2];
    var inputFileName = process.argv[3];
    var outputFileName = process.argv[4];
}
catch(exception) {
    console.log(exception.message);
    process.exit(1);
}

var fs = require('fs');
try {
    var text = fs.readFileSync(inputFileName, 'utf-8').toLowerCase().replace(/(?![a-z])./g, '').trim();
}
catch(exception) {
    console.log('Error reading file.');
    process.exit(2);
}

if (operation === 'encode') {
    var result = encode(text);
}
else if (operation === 'decode') {
    var decodeResult = decode(text);
    console.log(decodeResult.codeWord);
    var result = decodeResult.decodedText;
}
else {
    console.log('Operation not found.');
    process.exit(3);
}
try {
    fs.writeFileSync(outputFileName, result, 'utf-8');
}
catch(exception) {
    console.log('Error writing answer.');
    process.exit(4);
}

var FIRST_LETTER_CODE = 97;
var LAST_LETTER_CODE = 122;
var ALPHABET_LENGTH = FIRST_LETTER_CODE - LAST_LETTER_CODE;


function encode(text) {
    try {
        if (typeof (process.argv[5]) === 'undefined') {
            throw new Error('Please provide code word.')
        }
        var codeWord = process.argv[5].toLowerCase().replace(/(?![a-z])./g, '');
    }
    catch(exception) {
        console.log(exception.message);
        process.exit(1);
    }

    var shifts = countShifts(codeWord);
    
    var answer = '';
    for (var i = 0; i < text.length; i++) {
        var currentCharCodeShifted = text.charCodeAt(i) + shifts[i % codeWord.length];
        if (currentCharCodeShifted > LAST_LETTER_CODE) {
            currentCharCodeShifted -= ALPHABET_LENGTH;
        }
        answer += String.fromCharCode(currentCharCodeShifted);
    }

    return answer;
}

function decode(text) {
    var englishFrequencies = {
        'a': 0.081279, 'b': 0.013687, 'c': 0.024337, 'd': 0.046716, 'e': 0.124495, 'f': 0.021681, 'g': 0.020271, 'h': 0.066113, 
        'i': 0.068829, 'j': 0.001017, 'k': 0.008069, 'l': 0.038121, 'm': 0.024346, 'n': 0.072735, 'o': 0.076174, 'p': 0.017982, 'q': 0.000921, 
        'r': 0.058619, 's': 0.064331, 't': 0.089414, 'u': 0.025842, 'v': 0.010697, 'w': 0.023383, 'x': 0.001731, 'y': 0.018271, 'z': 0.000943
    };

    var bestDistance = Number.MAX_VALUE;
    var bestCodeWord = '';
    var outputText = '';

    var maxCodeWordLength = Math.min(8, text.length);

    for (var i = 1; i < maxCodeWordLength; i++) {
        iterateThroughCombinations(new Array(i), 0);
    }

    var results = {
        codeWord: bestCodeWord,
        decodedText: outputText
    }
    return results;

    function iterateThroughCombinations(arr, position) {
        if (typeof(arr[arr.length - 1]) !== 'undefined') {
            updateAnswer(text, arr.join(''));
            return;
        }
    
        for (var i = FIRST_LETTER_CODE; i < LAST_LETTER_CODE; i++) {
            arr[position] = String.fromCharCode(i);
            iterateThroughCombinations(arr, position + 1);
        }
    }

    function updateAnswer(text, codeWord) {
        var shifts = countShifts(codeWord);

        var decodedText = '';
        for (var i = 0; i < text.length; i++) {
            var currentCharCodeShifted = text.charCodeAt(i) - shifts[i % codeWord.length];
            if (currentCharCodeShifted < FIRST_LETTER_CODE) {
                currentCharCodeShifted += ALPHABET_LENGTH;
            }
            decodedText += String.fromCharCode(currentCharCodeShifted);
        }

        var decodedTextFrequencies = countFrequencies(decodedText);
        var decodedTextDistance = countDistance(englishFrequencies, decodedTextFrequencies);

        if (decodedTextDistance < bestDistance) {
            bestDistance = decodedTextDistance;
            bestCodeWord = codeWord;
            outputText = decodedText;
        }
    }
}

function countFrequencies(text) {
    var frequencies = {};

    for (var i = 0; i < text.length; i++) {
        if (text.charAt(i) in frequencies) {
            frequencies[text.charAt(i)]++;
        }
        else {
            frequencies[text.charAt(i)] = 1;
        }
    }

    for (var letter in frequencies) {
        frequencies[letter] /= text.length;
    }

    return frequencies;
}

function countDistance(normalFrequencies, decodedTextFrequeincies) {
    var distance = 0;

    for (var letter in decodedTextFrequeincies) {
        var letterDistance = decodedTextFrequeincies[letter] - normalFrequencies[letter];
        distance += letterDistance * letterDistance;
    }

    return distance;
}

function countShifts(codeWord) {
    var shifts = {};
    for (var i = 0; i < codeWord.length; i++) {
        shifts[i] = codeWord.charCodeAt(i) % FIRST_LETTER_CODE;
    }
    return shifts;
}