try {
    if (typeof (process.argv[2]) === 'undefined') {
        throw new Error('Please provide operation.')
    }
    var operation = process.argv[2];
  
    if (typeof (process.argv[3]) === 'undefined') {
        throw new Error('Please provide output file name.')
    }
    var inputFileName = process.argv[3];

    if (typeof (process.argv[4]) === 'undefined') {
        throw new Error('Please provide output file name.')
    }
    var outputFileName = process.argv[4];
}
catch(exception) {
    console.log(exception.message);
    process.exit(1);
}

var fs = require('fs');
var text = fs.readFileSync(inputFileName, 'utf-8').toLowerCase().replace(/(?![a-z])./g, '').trim();

if (operation === 'encode') {
    fs.writeFileSync(outputFileName, encode(text), 'utf-8');
}
else if (operation === 'decode') {
    fs.writeFileSync(outputFileName, decode(text), 'utf-8');
}
else {
    console.log('Operation not found.');
}


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
        if (currentCharCodeShifted > 122) {
            currentCharCodeShifted -= 26;
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

    console.log(bestCodeWord);
    return outputText;

    function iterateThroughCombinations(arr, position) {
        if (typeof(arr[arr.length - 1]) !== 'undefined') {
            updateAnswer(text, arr.join(''));
            return;
        }
    
        for (var i = 97; i < 97 + 26; i++) {
            arr[position] = String.fromCharCode(i);
            iterateThroughCombinations(arr, position + 1);
        }
    }

    function updateAnswer(text, codeWord) {
        var shifts = countShifts(codeWord);

        var decodedText = '';
        for (var i = 0; i < text.length; i++) {
            var currentCharCodeShifted = text.charCodeAt(i) - shifts[i % codeWord.length];
            if (currentCharCodeShifted < 97) {
                currentCharCodeShifted += 26;
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
        distance += (decodedTextFrequeincies[letter] - 
            normalFrequencies[letter]) * (decodedTextFrequeincies[letter] - normalFrequencies[letter]);
    }

    return distance;
}

function countShifts(codeWord) {
    var shifts = {};
    for (var i = 0; i < codeWord.length; i++) {
        shifts[i] = codeWord.charCodeAt(i) % 97;
    }
    return shifts;
}