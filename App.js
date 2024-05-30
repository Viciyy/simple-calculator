const screenInput = document.getElementById('screen');
const operators = ['+', '-', '*', '/'];

// Clear the latest character from the screen
const clearLatest = () => {
  screenInput.value = screenInput.value.slice(0, -1);
}

// Clear everything from the screen
const clearAll = () => {
  screenInput.value = "";
}

/**
 * Check if a value already has a decimal point after the last operator
 * @param {*} val Input value
 * @returns True if value has a decimal, false if not
 */
const hasDecimal = (val) => {
  // Loop through the value from end to start
  for (let i = val.length - 1; i >= 0; i--) {
    if (operators.includes(val[i])) {
      // If we reach an operator, return false
      return false;
    }
    if (val[i] === '.') {
      // If we reach a decimal, return true
      return true;
    }
  }

  return false;
}

/**
 * Function that performs the calculation operations
 * @param {*} a First value
 * @param {*} b Second value
 * @param {*} operator Current operator
 * @returns Operated/calculated value
 */
const operate = (a, b, operator) => {
  switch (operator) {
    // If the operator is '+', return the sum of a and b
    case '+': return a + b;
    // If the operator is '-', return the difference of a and b
    case '-': return a - b;
    // If the operator is '*', return the multiplication of a and b
    case '*': return a * b;
    // If the operator is '/', check if b is not zero and return the division of a and b
    case '/':
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
    // If the operator is not recognized, throw an error
    default: throw new Error('Invalid operator');
  }
}

/**
 * Function to parse the values from the screen and calculate them.
 * Sets the calculated result to the screen.
 * Could also use eval(), but it's not secure without validation.
 */
const parseAndCalculate = () => {
  // Split the expression into tokens (numbers and operators) using regex and filter out empty strings
  const tokens = screenInput.value.split(/([\+\-\*\/])/).filter(Boolean);

  let result = 0;
  let currentOperator = '+';

  try {
    // Loop through the tokens 
    for (let token of tokens) {
      // If token is an operator, place it as current operator
      if (operators.includes(token)) {
        currentOperator = token;
      } else {
        // If token is not an operator, do the calculation between the existing result and token using current operator
        result = operate(result, parseFloat(token), currentOperator);
      }
    }
  } catch (error) {
    // On error, set the result and log the error to console
    result = 'Error';
    console.error(error);
  }

  screenInput.value = result;
}

/**
 * Function to add a new charater to the screen
 * Does multiple validations for what is allowed to input and when
 * @param {*} char Clicked character
 */
const addCharacter = char => {
  const currentValue = screenInput.value;

  if (currentValue === '' && ['*', '/'].includes(char)) {
    // Do not allow * or / if the screen is empty
    return;
  } else if (currentValue.slice(-1) === '.' && operators.includes(char)) {
    // If the last value on the screen is a decimal, operator is not allowed
    return;
  } else if (operators.includes(char) && operators.includes(currentValue.slice(-1))) {
    // If char is an operator and the last character of the current value is also an operator
    // Replace the last character with the new one
    clearLatest();
    screenInput.value += char;
  } else if (char === '.' && !hasDecimal(currentValue)) {
    // Allow decimal if the last value does not have one yet
    screenInput.value += char;
  } else if (char !== '.' || !currentValue.includes('.')) {
    // Default case
    if (screenInput.value.split(/[\+\-\*\/]/).filter(Boolean).length === 2 && operators.includes(char)) {
      // If char is an operator and there is already two values and operator on the screen,
      // calculate the result before adding the operator
      parseAndCalculate();
    }
    screenInput.value += char;
  }
}