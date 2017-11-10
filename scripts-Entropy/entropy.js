var sequence = process.argv[2];
var letters = []

for (var i = 0; i < sequence.length; i++) {
    letters[sequence[i]] = 0;
}
for (var i = 0; i < sequence.length; i++) {
    letters[sequence[i]]++;
}

var answer = 0;
for (var letter in letters) {
    var probability = letters[letter] / sequence.length;
    answer += probability * Math.log2(probability);
}

console.log(-answer.toFixed(2));