if (typeof (process.argv[2]) === undefined) {
    console.log('Please provide the input.');
    process.exit(6);
}
var operation = process.argv[2];

if (typeof (process.argv[3]) === undefined) {
    console.log('Expression not specified.');
    process.exit(7);
}

var priorities = {
    '(': 0,
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3
};

if (operation === 'in2post') {
    console.log(encode(process.argv[3]));
    process.exit(0);
} else if (operation === 'post2in') {
    console.log(decode(process.argv[3]));
    process.exit(0);
} else {
    console.log('Operation not found.');
    process.exit(2);
}

function encode(data) {
    var stack = [];
    var answer = '';
    var pointer = 0;

    while (pointer < data.length) {
        var currentSymbol = data[pointer];
        if (currentSymbol === ')') {
            answer = processClosingParenthesis(stack, answer);
            pointer += 1;
        } else if (!(currentSymbol in priorities)) {
            answer += currentSymbol;
            pointer += 1;
        } else {
            answer = processOperation(currentSymbol, stack, answer);
            pointer += 1;
        }
    }

    while (stack.length > 0) {
        if (stack[stack.length - 1] === '(') {
            console.log('Error: incorrect parenthesis.'); // throw
            process.exit(2);
        }
        answer += stack[stack.length - 1];
        stack.pop();
    }

    return answer;
}

function processOperation(symbol, stack, answer) {
    if (symbol === '(') {
        stack.push(symbol);
        return answer;
    }
    
    if (symbol !== '^') {
        while (stack.length > 0 && priorities[symbol] <= priorities[stack[stack.length - 1]]) {
            if (stack[stack.length - 1] !== '(') {
                answer += stack[stack.length - 1];
            }
            stack.pop();
        }
    }
    else {
        while (stack.length > 0 && priorities[symbol] < priorities[stack[stack.length - 1]]) {
            if (stack[stack.length - 1] !== '(') {
                answer += stack[stack.length - 1];
            }
            stack.pop();
        }
    }

    stack.push(symbol);
    return answer;
}

function processClosingParenthesis(stack, answer) {
    while (stack.length > 0) {
        var topStackSymbol = stack.pop();
        if (topStackSymbol === '(') {
            return answer;
        }

        answer += topStackSymbol;
    }

    console.log('Error: incorrect parenthesis.');
    process.exit(2);
}

function decode(data) {
    var stack = [];
    var pointer = 0;

    while (pointer < data.length) {
        var currentSymbol = data[pointer];

        if (!(currentSymbol in priorities)) {
            stack.push([currentSymbol, 0]);
            pointer += 1;
        } else {
            if (stack.length < 2) {
                console.log('Error: not enough operands.');
                process.exit(5);
            }
            var firstElement = stack.pop();
            var secondElement = stack.pop();

            firstElement = prioritize(firstElement, currentSymbol, true);
            secondElement = prioritize(secondElement, currentSymbol, false);

            stack.push([secondElement[0] + currentSymbol + firstElement[0], priorities[currentSymbol]]);

            pointer += 1;
        }
    }

    if (stack.length > 1) {
        console.log('Error: not enough operations.');
        process.exit(3);
    }
    return stack.pop()[0];
}

function prioritize(element, currentOperation, isFirst) {
    if (element[1] !== 0 && element[1] < priorities[currentOperation]) {
        element[0] = '(' + element[0] + ')';
    }
    if (currentOperation === '-' && isFirst && element[1] === 1) {
        element[0] = '(' + element[0] + ')';
    }

    return element;
}