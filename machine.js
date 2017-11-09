if (typeof process.argv[2] === 'undefined') {
    throwError('No code file provided', 5);
}

// Name of program to execute
var file = process.argv[2];
// Numbers to be passed to the program
var args = process.argv.slice(3);

try {
    var fs = require('fs');
    var input = fs.readFileSync(file, 'binary');
} catch (exception) {
    throwError('Exception occured while reading: ' + exception, 4);
}

// Split the code to memory cells
var code = input.split(/\s+/);

// Available commands
var commands = {
    0: 'ADD',
    1: 'JMP',
    2: 'JL',
    3: 'JG',
    4: 'JE',
    5: 'CMP',
    6: 'MOV',
    7: 'MUL',
    8: 'EXT',
    9: 'RD',
    10: 'WR'
};

// This cycle converts commands into their codes
var memory = convertCommandsIntoNumbers(code);

runProgram(memory, commands);

function runProgram(memory, commands) {
    // Init registers
    var ip = 0;
    var cmp = 0;
    // This will tell the number of argument to take
    var argsPointer = 0;

    while (true) {
        ip = Number(ip);
        if (ip > memory.length) {
            ip = 0;
        }
        var nextCommand = commands[memory[ip]];
        // Commands switch
        switch (nextCommand) {
            case 'ADD':
                // ADD command
                // Sums a with b and puts the result into register in third operand

                checkRegistersExistance(ip + 1, ip + 3);

                // Those arguments may be plain numbers or register references
                var a = getValueFromMemory(memory[ip + 1]);
                var b = getValueFromMemory(memory[ip + 2]);
                // This argument should be the number of another register
                failIfArgumentIsNotNumber(ip + 3);
                var destinationRegister = Number(memory[ip + 3]);

                memory[destinationRegister] = a + b;
                ip += 4;
                continue;
            case 'JMP':
                // JMP command
                // Moves instruction pointer to a specified register

                checkRegistersExistance(ip + 1, ip + 1);

                // This argument should be the number of another register
                failIfArgumentIsNotNumber(ip + 1);
                var destinationRegister = Number(memory[ip + 1]);

                ip = destinationRegister;
                continue;
            case 'JL':
                // JL command
                // Moves instruction pointer to a specified number if CMP is equal to 1

                checkRegistersExistance(ip + 1, ip + 1);

                // This argument should be the number of another register
                failIfArgumentIsNotNumber(ip + 1);
                var lessBranchInstruction = Number(memory[ip + 1]);

                if (cmp === 1) {
                    ip = lessBranchInstruction;
                } else {
                    ip += 2;
                }
                continue;
            case 'JG':
                // JG command
                // Moves instruction pointer to a specified number if CMP is equal to -1

                checkRegistersExistance(ip + 1, ip + 1);

                // This argument should be the number of another register
                failIfArgumentIsNotNumber(ip + 1);
                var greaterBranchInstruction = Number(memory[ip + 1]);

                if (cmp === -1) {
                    ip = greaterBranchInstruction;
                } else {
                    ip += 2;
                }
                continue;
            case 'JE':
                // JE command
                // Moves instruction pointer to a specified number if CMP is equal to 0

                checkRegistersExistance(ip + 1, ip + 1);

                // This argument should be the number of another register
                failIfArgumentIsNotNumber(ip + 1);
                var equalBranchInstruction = Number(memory[ip + 1]);

                if (cmp === 0) {
                    ip = equalBranchInstruction;
                } else {
                    ip += 2;
                }
                continue;
            case 'CMP':
                // CMP command
                // Updates the CMP register with new value using this rule:
                //    * a = b -> cmp = 0
                //    * a < b -> cmp = -1
                //    * a > b -> cmp = 1

                checkRegistersExistance(ip + 1, ip + 2);

                // Those arguments may be plain numbers or register references
                var a = getValueFromMemory(memory[ip + 1]);
                var b = getValueFromMemory(memory[ip + 2]);

                if (a < b) {
                    cmp = -1;
                } else if (a > b) {
                    cmp = 1;
                } else {
                    cmp = 0;
                }
                ip += 3;
                continue;
            case 'MOV':
                // MOV command
                // Puts a number or another register value into specified register

                checkRegistersExistance(ip + 1, ip + 1);

                // This argument may be plain number or register reference
                var valueToMove = getValueFromMemory(memory[ip + 1]);
                // This argument should be the number of another register
                failIfArgumentIsNotNumber(ip + 2);
                var destinationRegister = Number(memory[ip + 2]);

                memory[destinationRegister] = valueToMove;
                ip += 3;
                continue;
            case 'MUL':
                // MUL command
                // Multiplies a with b and puts the result into register in third operand

                checkRegistersExistance(ip + 1, ip + 2);

                // Those arguments may be plain numbers or register references
                var a = getValueFromMemory(memory[ip + 1]);
                var b = getValueFromMemory(memory[ip + 2]);
                // This argument should be the number of another register
                failIfArgumentIsNotNumber(ip + 3);
                var destinationRegister = Number(memory[ip + 3]);

                memory[destinationRegister] = a * b;
                ip += 4;
                continue;
            case 'EXT':
                // EXT command
                // Terminates the program
                return;
            case 'RD':
                // RD command
                // Reads the next argument and puts it into specified register

                checkRegistersExistance(ip + 1, ip + 1);

                // Tries to take the next argument. Terminates if there is no one left
                if (typeof args[argsPointer] === 'undefined') {
                    throwError('Not enough arguments', 2);
                }

                var inputData = args[argsPointer];

                // This argument should be the number of another register
                failIfArgumentIsNotNumber(ip + 1);
                var destinationRegister = Number(memory[ip + 1]);

                memory[destinationRegister] = Number(inputData);
                // Increments the arguments pointer
                argsPointer += 1;
                ip += 2;
                continue;
            case 'WR':
                // WR command
                // Writes the plain number or value from specified register

                checkRegistersExistance(ip + 1, ip + 1);

                // This argument may be plain number or register reference or string
                var outputData = getValueFromMemory(memory[ip + 1]);

                console.log(outputData);
                ip += 2;
                continue;
            default:
                // If the command is not found, terminate the program
                throwError('No such command', 1);
        }
    }
    return;
}

function getValueFromMemory(value) {
    // This will return plain number if value begins with &
    // Otherwise it returns the memory[value]

    if (value.startsWith('&&')) {
        return value.substring(2);
    } else if (value[0] === '&') {
        return Number(value.substring(1));
    } else {
        return Number(memory[value]);
    }
}

function isRegisterReference(value) {
    // This returns true if the supplied value is not a plain number
    return value[0] !== '&';
}

function failIfArgumentIsNotNumber(ip) {
    // Throws an error if a plain number is provided instead of
    // register reference
    if (!isRegisterReference(memory[ip])) {
        throwError('Should not be a number', 3);
    }
}

function checkRegistersExistance(from, to) {
    // Throws an error if there are not enough command arguments
    for (var i = from; i <= to; i++) {
        if (typeof memory[i] === 'undefined') {
            throwError('Not enough arguments', 2);
        }
    }
}

function convertCommandsIntoNumbers(code) {
    var codes = flipDictionary(commands);
    var memory = [];

    for (var i = 0; i < code.length; i++) {
        memory[i] = (code[i] in codes) ? codes[code[i]] : code[i];
    }

    return memory;
}

function flipDictionary(dictionary) {
    var result = {};

    Object.keys(dictionary).forEach(function (element, i) {
        result[dictionary[element]] = i;
    });

    return result;
}

function throwError(error, code) {
    throw new Error('Error ' + code + ': ' + error + '.');
}