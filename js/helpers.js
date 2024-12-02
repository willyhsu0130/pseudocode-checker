export function clearBeginEnd(obj) {
  for (let key in obj) {
    if (key === 'begin' || key === 'end') {
      obj[key] = 0;
    }
  }
  return obj;
}
function ifToken(pureline, type) {
  if (pureline.includes(type)) {
    return true;
  }
  return false;
}
function addError(error, message) {
  if(message == undefined){
    return error;
  }
  return `${error} ${message}`
}

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

function checkCapitalization(lineArray) {

}
// Only identify which type of token it is, disregarding position, name, value etc.
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

function addVariable(variables, line) {
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
  if (variables.includes(variableName)) {
    errors = addError(errors, 'Variable already declared previously')
  }

  // Once logic is checked, check for capitalization
  errors = addError(errors, checkCapitalization(lineArray));

  // Add the variable to the codeObjects if no errors
  if (errors == undefined) {
    variables[variableName] = {
      value: lineArray[4],
      type: variableType
    }
  }
  return errors;
}




export function identifyMistakes(codeObjects, token, line) {
  if (token == 'comment') {
    return undefined;
  } else if (token == 'declare') {
    return addVariable(codeObjects.variables, line)
  }
}


function identifyModule(position, line) {
  //remove the 
  let lineArray = line.trims.split(/\s+/);
  //clone the module from position
  let module = position.module;
  // identify if it's the end or the beginning
  if (lineArray[0].toUpperCase() == 'MODULE') {


  } else if (lineArray[1].toUpperCase() == 'MODULE') {
    module = {
      level: position.module.level - 1,
      name: position.module.level
    }
  }
}



function checkVariableName(line, type) {
  let token;
  // check declare name
  if (type == 'declare') {
    let variable = line.trim().split(/\s+/).slice(1, 3);
    token = {
      type: 'declare',
      variableType: undefined,
      name: undefined,
      array: 0
    }
    switch (variable[1]) {
      case 'Real': {
        token.variableType = 'real'
        token.name = variable[2];
        break;
      }
      case 'Int': {
        token.variableType = 'integer'
        token.name = variable[2];
        break;
      }
      case 'String': {
        token.variableType = 'string'
        token.name = variable[2];
        break;
      }
      default: {
        token.name = variable[1];
      }
    }
  }
}