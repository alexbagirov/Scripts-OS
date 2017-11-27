function throwError(message) {
    console.log('Error: ' + message + '.');
    process.exit(1);
}

function processFlags(arguments) {
    var flags = {
        computeTime: false,
        numberOfResults: NaN
    };
    var additionalArgs = process.argv.slice(4);

    for (var i = 0; i < additionalArgs.length; i++) {
        switch (additionalArgs[i]) {
            case '-t':
                flags.computeTime = true;
                continue;
            case '-n':
                flags.numberOfResults = Number(additionalArgs[i + 1]);
                if (isNaN(flags.numberOfResults)) {
                    utilities.throwError('not enough arguments');
                }
                continue;
            default:
                continue;
        }
    }

    return flags;
}

module.exports.throwError = throwError;
module.exports.processFlags = processFlags;