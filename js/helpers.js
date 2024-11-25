export function searchVariable(array, name) {
  return array.some(variable => variable.name === name)
}

export function clearBeginEnd(obj) {
  for (let key in obj) {
    if (key === 'begin' || key === 'end') {
      obj[key] = 0;
    }
  }
  return obj;
}

// Only identify which type of token it is, disregarding position, name, value etc.
export function identifyType(line) {
  //pureline is line without indentation and full out uppercase
  pureline = line.trim().toUpperCase()

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
  else if (ifToken(pureline, 'IF ')){
    token = 'if'
  }
  else if (ifToken(pureline, 'WHILE ')){
    token = 'if'
  }
  else if (ifToken(pureline, 'FOR ')){
    token = 'for'
  }
  else if (ifToken(pureline, 'DO ')){
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
export function identifyPosition(position, token, line){
  //Check if it's in a module
  if(token == 'module'){
    position.module = identifyModule(position, token, line)
  } else if(token )
}

function identifyModule(position){

}


export function identifyMistakes(level, token, line){
  if(token == 'comment'){
    return "";
  } else if(token == 'Declare')
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
    switch(variable[1]){
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
      default:{
        token.name = variable[1];
      }
    }
  }
}