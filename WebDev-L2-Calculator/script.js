const display = document.getElementById("display");
const expressionDisplay = document.getElementById("expression");

const numberButtons = document.querySelectorAll(".number-btn");
const operatorButtons = document.querySelectorAll(".operator-btn");

const clearButton = document.getElementById("clear");
const backspaceButton = document.getElementById("backspace");
const equalsButton = document.getElementById("equals");

let currentInput = "0";
let firstValue = null;
let currentOperator = null;
let waitingForSecondValue = false;
let expression = "";

function updateDisplay() {
    display.textContent = currentInput;
    expressionDisplay.textContent = expression;
}

function inputNumber(number) {
    if (waitingForSecondValue) {
        currentInput = number;
        waitingForSecondValue = false;
    } else {
        if (currentInput === "0" && number !== ".") {
            currentInput = number;
        } else {
            currentInput += number;
        }
    }

    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecondValue) {
        currentInput = "0.";
        waitingForSecondValue = false;
        updateDisplay();
        return;
    }

    if (!currentInput.includes(".")) {
        currentInput += ".";
        updateDisplay();
    }
}

function chooseOperator(operator) {
    const inputValue = parseFloat(currentInput);

    if (Number.isNaN(inputValue)) {
        showError();
        return;
    }

    if (firstValue !== null && currentOperator !== null && !waitingForSecondValue) {
        calculate();
    }

    firstValue = parseFloat(currentInput);
    currentOperator = operator;
    waitingForSecondValue = true;

    expression = `${formatNumber(firstValue)} ${operator}`;
    updateDisplay();
}

function calculate() {
    if (firstValue === null || currentOperator === null) {
        return;
    }

    const secondValue = parseFloat(currentInput);
    let result;

    if (Number.isNaN(secondValue)) {
        showError();
        return;
    }

    switch (currentOperator) {
        case "+":
            result = firstValue + secondValue;
            break;

        case "−":
            result = firstValue - secondValue;
            break;

        case "×":
            result = firstValue * secondValue;
            break;

        case "÷":
            if (secondValue === 0) {
                showError("Cannot divide by zero");
                return;
            }

            result = firstValue / secondValue;
            break;

        default:
            return;
    }

    result = Number(result.toFixed(10));

    expression = `${formatNumber(firstValue)} ${currentOperator} ${formatNumber(secondValue)} =`;
    currentInput = String(result);

    firstValue = null;
    currentOperator = null;
    waitingForSecondValue = true;

    updateDisplay();
}

function clearCalculator() {
    currentInput = "0";
    firstValue = null;
    currentOperator = null;
    waitingForSecondValue = false;
    expression = "";

    updateDisplay();
}

function deleteLastCharacter() {
    if (waitingForSecondValue) {
        return;
    }

    if (currentInput.length <= 1) {
        currentInput = "0";
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}

function showError(message = "Error") {
    currentInput = message;
    firstValue = null;
    currentOperator = null;
    waitingForSecondValue = true;
    expression = "";

    updateDisplay();
}

function formatNumber(number) {
    return Number(number).toLocaleString("en-US", {
        maximumFractionDigits: 10
    });
}

numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const number = button.dataset.number;

        if (number === ".") {
            inputDecimal();
        } else {
            inputNumber(number);
        }
    });
});

operatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

equalsButton.addEventListener("click", calculate);

clearButton.addEventListener("click", clearCalculator);

backspaceButton.addEventListener("click", deleteLastCharacter);
