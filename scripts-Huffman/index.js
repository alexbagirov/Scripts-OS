var fs = require('fs');

for (var i = 2; i < 6; i++) {
    if (typeof process.argv[i] === 'undefined') {
        console.log('error: not enough arguments.');
        pricess.exit(1);
    }
}
var operation = process.argv[2];
var inputFileName = process.argv[3];
var tableFileName = process.argv[4];
var outputFileName = process.argv[5];

var text = readFile(inputFileName).trim();

if (operation === 'encode') {
    var table = {};
    var results = encode(text);
    console.log(results.theoreticalSatae);
    console.log(results.actualSatae);
    writeFile(outputFileName, results.text);
    writeFile(tableFileName, results.table);
}
else if (operation === 'decode') {
    var table = readFile(tableFileName).trim();
    var result = decode(text);
    writeFile(outputFileName, result);
}
else {
    console.log('error: operation not found.');
    process.exit(1);
}

function encode(text) {
    var frequencies = countLetters(text);
    var nodes = [];

    for (var letter in frequencies) {
        nodes.push({
            left: null,
            right: null,
            weight: frequencies[letter],
            value: letter
        });
    }
    nodes.sort(function(a, b) {
        return b.weight - a.weight;
    });

    while (nodes.length > 1) {
        var nodeA = nodes.pop();
        var nodeB = nodes.pop();

        var newNodeIndex = 0;
        var newNodeWeigth = nodeA.weight + nodeB.weight;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].weight <= newNodeWeigth) {
                newNodeIndex = i;
                break;
            }
        }
        nodes.splice(newNodeIndex, 0, {
            left: nodeA,
            right: nodeB,
            weight: nodeA.weight + nodeB.weight,
            value: nodeA.value + nodeB.value
        });
    }

    buildTable(nodes[0], '');

    var encodedText = '';
    for (var i = 0; i < text.length; i++) {
        encodedText += table[text.charAt(i)];
    }

    var outputTable = tableToText();

    var nbOfTextBytes = text.length * 8;
    var results = {
        theoreticalSatae: (nbOfTextBytes / Math.max(countEntropy(frequencies, text.length), 1)).toFixed(2),
        actualSatae: (nbOfTextBytes / encodedText.length).toFixed(2),
        text: encodedText,
        table: outputTable
    };

    return results;
}

function countLetters(text) {
    var frequencies = {};
    for (var i = 0; i < text.length; i++) {
        if (text.charAt(i) in frequencies) {
            frequencies[text.charAt(i)]++;
        }
        else {
            frequencies[text.charAt(i)] = 1;
        }
    }
    return frequencies;
}

function buildTable(node, path) {
    if (node.left) {
        buildTable(node.left, path + '1');
    }
    else {
        table[node.value] = path;
        return;
    }
    if (node.right) {
        buildTable(node.right, path + '0');
    }
    else {
        table[node.value] = path;
        return;
    }
}

function decode(text) {
    var codes = parseTable();
    var buffer = 'c';
    var answer = '';
    for (var i = 0; i < text.length; i++) {
        buffer += text.charAt(i);
        if (buffer in codes) {
            answer += codes[buffer];
            buffer = 'c';
        }
    }
    if (buffer !== 'c') {
        console.log('error: unrecognized code.');
    }
    return answer;
}

function parseTable() {
    var codes = {};
    for (var node of table.split('|')) {
        codes['c' + node.slice(1)] = node.charAt(0);
    }
    return codes;
}

function tableToText() {
    var text = '';
    for (var letter in table) {
        text += letter + table[letter] + '|';
    }
    return text.slice(0, text.length - 1);
}

function readFile(fileName) {
    try {
        return fs.readFileSync(fileName, 'utf-8');
    }
    catch (exception) {
        console.log('error: reading file error.');
        process.exit(2);
    }
}

function writeFile(fileName, text) {
    try {
        fs.writeFileSync(fileName, text, 'utf-8');
    }
    catch (exception) {
        console.log('error: writing file error.');
        process.exit(3);
    }
}

function countEntropy(counters, sequenceLength){
    var entropy = 0;
    for (var counter in counters) {
        var probability = counters[counter] / sequenceLength;
        entropy += probability * Math.log2(probability);
    }

    return -entropy;
}