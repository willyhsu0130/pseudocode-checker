export function identifyMistakes(codeObjects, token, line) {
  switch (token) {
    case 'comment':
      return undefined;
    case 'declare':
      return addVariable(codeObjects.variables, line, false);
    case 'const':
      return addVariable(codeObjects.variables, line, true)
    case 'set':
      return updateVariable(codeObjects.variables, line)
    case 'module':
      return addModule(codeObjects.module);
    default:
      return undefined; // Handle unexpected tokens if needed
  }
}
// General Functions

function addError(error, message) {
  if (message == undefined) {
    return error;
  }
  // Remove the undefined at the beginning.
  error = "";
  return `${error} ${message}`
}

// Token Type Validation
export function identifyType(line) {
  //pureline is line without indentation and full out uppercase
  let pureline = line.trim().toUpperCase()

  //initialize return obj
  let token;

  // Go through all types
  if (ifToken(pureline, '//')) {
    token = 'comment';
  }
  else if (ifToken(pureline, 'MODULE ')) {
    token = 'module'
  }
  else if (ifToken(pureline, 'DECLARE ')) {
    token = 'declare'
  }
  else if (ifToken(pureline, 'CONST ')) {
    token = 'const'
  }
  else if (ifToken(pureline, 'SET ')) {
    token = 'set'
  }
  else if (ifToken(pureline, 'IF ')) {
    token = 'if'
  }
  else if (ifToken(pureline, 'WHILE ')) {
    token = 'if'
  }
  else if (ifToken(pureline, 'FOR ')) {
    token = 'for'
  }
  else if (ifToken(pureline, 'DO ')) {
    token = 'doWhile'
  }
  else token = undefined;
  return token;
}

function ifToken(pureline, type) {
  if (pureline.includes(type)) {
    return true;
  }
  return false;
}

// Variable Validation
function checkCodeVariableType(value) {
  if (/^-?\d+$/.test(value)) {
    return "INTEGER";
  } else if (/^-?\d+\.\d+$/.test(value)) {
    return "REAL";
  } else {
    return "STRING";
  }
}

function checkVariableValue(type, lineArray) {
  let upperType = type.toUpperCase();
  // Check if a value is intiailized
  if (lineArray[3] == '=') {
    // Initialized so check for what type of value it is:
    let codeVariableType = checkCodeVariableType(lineArray[4]);
    // Check if the real type and the supposed type matches
    if (upperType != codeVariableType) {
      return "Variable type doesn't match its value."
    }
    // Value is not intialized
  } else if (lineArray.length == 3) {
    return undefined;
  } else {
    return 'Incomplete declaration'
  }
}

function addVariable(variables, line, constant) {
  let errors = undefined;
  let variableTypes = ['REAL', 'INT', 'STRING'];
  let lineArray = line.trim().split(/\s+/);
  if (lineArray.length < 2) {
    errors = addError(errors, 'Incomplete declaration.');
  }
  if (!variableTypes.includes(lineArray[1].toUpperCase())) {
    errors = addError(errors, 'Variable type is not declared');
  }

  let variableName = lineArray[2];
  let variableType = lineArray[1]

  // Check if the variable type fits the value:
  errors = addError(errors, checkVariableValue(variableType, lineArray));

  // Check if the variable name already exists in codeObjects in the same module
  if (variableName in variables) {
    errors = addError(errors, 'Variable already declared previously.')
  }

  // Once logic is checked, check for capitalization
  errors = addError(errors, checkCapitalization(lineArray));


  // Add the variable to the codeObjects if no errors
  if (errors == undefined) {
    variables[variableName] = {
      value: lineArray[4],
      type: variableType,
      constant: constant
    }
  }
  return errors;
}

function updateVariable(variables, line) {
  let errors = undefined;
  let lineArray = line.trim().split(/\s+/);
  let variableName = lineArray[1];
  let variableValue = undefined;
  // Check if set is declared properly
  if (lineArray.length < 4) {
    errors = addError(errors, 'Incomplete declaration of SET.');
  }
  // Check if the variable exists.
  if (!(variableName in variables)) {
    errors = addError(errors, 'Variable has not been declared.')
    // Doesn't exist so just exit the function.
    return errors;
  }

  // Check if the variable is a constant
  if (variables[variableName].constant == true){
    errors = addError(errors, 'Value of constant shall not be modified.')
  }

  // Solve mathematically the value of the SET
  // Find last part of the SET 
  let expression = lineArray.slice(3);

  // Evaluate the function
  variableValue = evaluateExpression(expression, variables);

  // Check if code value type matches the supposed type

  // Only update the variables if there are no errors in the expression
  if (errors == undefined) {
    variables[variableName].value = variableValue
  }
  return errors;
}

function evaluateExpression(expression, variables) {
  // Replace any variable references in the expression with their values
  for (let i = 0; i < expression.length; i++) {
    if (expression[i] in variables) {
      expression[i] = variables[expression[i]].value;
    }
  }

  // Join the expression into a string and safely evaluate it
  try {
    return Function(`'use strict'; return (${expression.join(" ")});`)();
  } catch (error) {
    console.error("Error evaluating expression:", error);
    return null; // Handle the error gracefully
  }
}

// Modules Validation
function addModule(modules, line) {
  return undefined;
}
function checkCapitalization(lineArray) {

}



