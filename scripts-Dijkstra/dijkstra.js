if (typeof (process.argv[2]) === undefined) {
    throwError('Please provide the input', 1);
}
var operation = process.argv[2];

if (typeof (process.argv[3]) === undefined) {
    throwError('Expression not specified', 2);
}

var priorities = {
    '(': 0,
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3
};
var argumentIsRequired = false;

if (operation === 'in2post') {
    console.log(encode(process.argv[3]));
} else if (operation === 'post2in') {
    console.log(decode(process.argv[3]));
} else {
    throwError('Operation not found', 3);
}

function encode(data) {
    var stack = [];
    var answer = '';
    var pointer = 0;

    while (pointer < data.length) {
        var currentSymbol = data[pointer];
        if (currentSymbol === ')') {
            if (argumentIsRequired) {
                throwError('Not enough arguments', 4);
            }
            answer = processClosingParenthesis(stack, answer);
            pointer += 1;
        } else if (!(currentSymbol in priorities)) {
            answer += currentSymbol;
            pointer += 1;
            argumentIsRequired = false;
        } else {
            if (argumentIsRequired && currentSymbol !== '(') {
                throwError('Not enough arguments', 4);
            }
            answer = processOperation(currentSymbol, stack, answer);
            pointer += 1;
        }
    }

    while (stack.length > 0) {
        if (stack[stack.length - 1] === '(') {
            throwError('Incorrect parenthesis', 5);
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

    argumentIsRequired = true;
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

    throwError('Incorrect parenthesis', 5);
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
                throwError('Not enough operands', 6);
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
        throwError('Not enough operations', 7);
    }
    
    return stack.pop()[0];
}

function prioritize(element, currentOperation, isFirst) {
    var firstCondition = currentOperation === '^' && element[1] === priorities['^'] && !isFirst;
    var secondCondition = element[1] !== 0 && element[1] < priorities[currentOperation];
    var thirdCondition = currentOperation === '-' && isFirst && element[1] === 1;

    if (firstCondition || secondCondition || thirdCondition) {
        element[0] = '(' + element[0] + ')';
    }

    return element;
}

function throwError(error, code) {
    throw new Error('Error ' + code + ': ' + error + '.');
}