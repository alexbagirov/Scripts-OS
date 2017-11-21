var priorities = {
    '(': 0,
    '+': 1,
    '-': 2,
    '*': 3,
    '/': 4,
    '^': 4
};

var argumentIsRequired = true;

var Errors = {
    InputNotSpecified: {
        code: 1,
        message: 'Input not specified'
    },
    ExpressionNotSpecified: {
        code: 2,
        message: 'Expression not specified'
    },
    OperationNotFound: {
        code: 3,
        message: 'Operation not found'
    },
    NotEnoughArguments: {
        code: 4,
        message: 'Not enough arguments'
    },
    IncorrectParenthesis: {
        code: 5,
        message: 'Incorrect parenthesis'
    },
    NotEnoughOperands: {
        code: 6,
        message: 'Not enough operands'
    },
    NotEnoughOperations: {
        code: 7,
        message: 'Not enough operations'
    },
    TooManyOperands: {
        code: 8,
        message: 'Too many operands'
    }
};

try {
  if (typeof (process.argv[2]) === 'undefined') {
      throwError(Errors.InputNotSpecified);
  }
  var operation = process.argv[2];

  if (typeof (process.argv[3]) === 'undefined') {
      throwError(Errors.ExpressionNotSpecified);
  }
}
catch(exception) {
  console.log(exception.message);
  process.exit(1);
}

try {
  if (operation === 'in2post') {
      console.log(encode(process.argv[3]));
  } else if (operation === 'post2in') {
      console.log(decode(process.argv[3]));
  } else {
      throwError(Errors.OperationNotFound);
  }
}
catch(exception) {
  console.log(exception.message);
  process.exit(2);
}

function encode(data) {
    var stack = [];
    var answer = '';
    var pointer = 0;

    while (pointer < data.length) {
        var currentSymbol = data[pointer];
        if (currentSymbol === ')') {
          if (argumentIsRequired) {
              throwError(Errors.NotEnoughArguments);
          }
          answer = processClosingParenthesis(stack, answer);
          pointer += 1;
        } else if (!(currentSymbol in priorities)) {
          if (!argumentIsRequired) {
            throwError(Errors.TooManyOperands);
          }
          answer += currentSymbol;
          pointer += 1;
          argumentIsRequired = false;
        } else {
          if (argumentIsRequired && currentSymbol !== '(') {
              throwError(Errors.NotEnoughArguments);
          }
          answer = processOperation(currentSymbol, stack, answer);
          pointer += 1;
        }
    }

    while (stack.length > 0) {
        if (stack[stack.length - 1] === '(') {
            throwError(Errors.IncorrectParenthesis);
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

    throwError(Errors.IncorrectParenthesis);
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
                throwError(Errors.NotEnoughOperands);
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
        throwError(Errors.NotEnoughOperations);
    }

    return stack.pop()[0];
}

function prioritize(element, currentOperation, isFirst) {
    var firstCondition = currentOperation === '^' && element[1] === priorities['^'] && !isFirst;
    var secondCondition = element[1] !== 0 && element[1] <= priorities[currentOperation] && isFirst;
    var thirdCondition = currentOperation === '-' && isFirst && element[1] === 1;

    if (firstCondition || secondCondition || thirdCondition) {
        element[0] = '(' + element[0] + ')';
    }

    return element;
}

function throwError(error) {
    throw new Error('Error: ' + error.message + '.');
}
