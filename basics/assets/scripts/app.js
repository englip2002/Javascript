let currentResult = 0;
let calculationDescription = "Description"
let logs = [];

addBtn.addEventListener('click', calculate.bind(this, 'ADD'))
subtractBtn.addEventListener('click', calculate.bind(this, 'SUBTRACT'))
multiplyBtn.addEventListener('click', calculate.bind(this, 'MULTIPLY'))
divideBtn.addEventListener('click', calculate.bind(this, 'DIVIDE'))

outputResult(currentResult, calculationDescription);

function getUserInput() {
    return parseInt(userInput.value);
}

function createAndWriteOutput(operator, previousResult, calNumber) {
    const description = `${previousResult} ${operator} ${calNumber}`
    outputResult(currentResult, description);
}

function writeToLog(operationIdentifier, prevResult, operationNumber, newResult) {
    const logEntry = {
        operation: operationIdentifier,
        previousResult: prevResult,
        number: operationNumber,
        result: newResult
    }
    logs.push(logEntry);
    console.log(logs);
}

// function add() {
//     const enteredNumber = getUserInput();
//     const initialResult = currentResult;
//     currentResult += parseInt(enteredNumber);
//     createAndWriteOutput('+', initialResult, enteredNumber);
//     writeToLog('ADD', initialResult, enteredNumber, currentResult);
// }

// function subtract() {
//     const enteredNumber = getUserInput();
//     const initialResult = currentResult;
//     currentResult -= parseInt(enteredNumber);

//     createAndWriteOutput('-', initialResult, enteredNumber);
//     writeToLog('SUBTRACT', initialResult, enteredNumber, currentResult);
// }

// function multiple() {
//     const enteredNumber = getUserInput();
//     const initialResult = currentResult;
//     currentResult *= parseInt(enteredNumber);

//     createAndWriteOutput('*', initialResult, enteredNumber);
//     writeToLog('MULTIPLY', initialResult, enteredNumber, currentResult);
// }

// function divide() {
//     const enteredNumber = getUserInput();
//     const initialResult = currentResult;
//     currentResult /= parseInt(enteredNumber);

//     createAndWriteOutput('/', initialResult, enteredNumber);
//     writeToLog('DIVIDE', initialResult, enteredNumber, currentResult);
// }

function calculate(operation) {
    const enteredNumber = getUserInput();
    const initialResult = currentResult;
    let operator;

    if (operation == 'ADD') {
        currentResult += parseInt(enteredNumber);
        operator = '+';
    }
    else if (operation == 'SUBTRACT') {
        currentResult -= parseInt(enteredNumber);
        operator = '-';
    }
    else if (operation == 'MULTIPLY') {
        currentResult *= parseInt(enteredNumber);
        operator = '*';
    }
    else {
        currentResult /= parseInt(enteredNumber);
        operator = '/';
    }

    createAndWriteOutput(operator, initialResult, enteredNumber);
    writeToLog(operation, initialResult, enteredNumber, currentResult);
}