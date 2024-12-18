export function identifyMistakes(codeObjects, token, line, code) {
  switch (token) {
    case 'comment':
      return undefined;
    case 'declare':
      return addVariable(codeObjects, line, false);
    case 'const':
      return addVariable(codeObjects, line, true)
    case 'set':
      return updateVariable(codeObjects, line)
    case 'module':
      return updateModule(codeObjects, line, code);
    default:
      return undefined; // Handle unexpected tokens if needed
  }
}

// General Functions

// Allow all the functions to append errors to an string inside an array.
function addError(errors, message) {
  // Remove undefined if it's the first time.
  if(errors == undefined){
    return message;
  }
  else{
    if(message != undefined){
      return errors + " " + message;
    }
    else{
      return errors;
    }
  }
  // It's not the first timd so 
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
  else if (ifToken(pureline, 'MODULE ') || ifToken(pureline, 'CALL ') || ifToken(pureline, 'END MODULE')) {
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

// A helper function for identifyType
function ifToken(pureline, type) {
  if (pureline.includes(type)) {
    return true;
  }
  return false;
}

// Variable Validation

// Checks what type of variable is declared, INT, STRING, REAL?
function checkCodeVariableType(value) {
  if (/^-?\d+$/.test(value)) {
    return "INTEGER";
  } else if (/^-?\d+\.\d+$/.test(value)) {
    return "REAL";
  } else {
    return "STRING";
  }
}

// Checks if the assigned value and type  of the variable matches the given type
function checkVariableValue(type, lineArray) {
  let upperType = type.toUpperCase();
  // Check if a value is intiailized
  if (lineArray[3] == '=') {
    // Initialized so check for what type of value it is:
    let codeVariableType = checkCodeVariableType(lineArray[4]);
    // Check if the real type and the supposed type matches
    if (upperType != codeVariableType) {
      return "Variable type doesn't match its initialized value."
    }
    // Value is not intialized
  } else if (lineArray.length == 3) {
    return undefined;
  } else {
    return 'Incomplete declaration'
  }
}

function addVariable(codeObjects, line, constant) {
  let variables = codeObjects.variables;
  let errors = undefined;
  let variableTypes = ['REAL', 'INT', 'STRING'];
  let lineArray = line.trim().split(/\s+/);
  if (lineArray.length < 2) {
    errors = addError(errors, 'Incomplete declaration.');
  }
  if (!variableTypes.includes(lineArray[1].toUpperCase())) {
    errors = addError(errors, 'Variable type is not declared.');
  }

  let variableName = lineArray[2];
  let variableType = lineArray[1]

  // Check if the variable type fits the value:
  errors = addError(errors, checkVariableValue(variableType, lineArray));

  // Check if the variable name already exists in codeObjects in the same module
  if (variableName in variables) {
    errors = addError(errors, 'Variable already declared previously.')
  }

  // Add the variable to the codeObjects if no errors
  if (errors == undefined) {
    variables[variableName] = {
      value: lineArray[4],
      type: variableType,
      constant: constant
    }
  }
  // The third argument is passed in a function to check if it's a const or a declare
  if(constant === true){
    errors = errors = addError(errors, checkVariablesGrammar(codeObjects, line, 'Const'));
  }else{
    errors = errors = addError(errors, checkVariablesGrammar(codeObjects, line, 'Declare'));
  }

  return errors;
}

function updateVariable(codeObjects, line) {
  let variables = codeObjects.variables;
  let errors = undefined;
  let lineArray = line.trim().split(/\s+/);
  let variableName = lineArray[1];
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
  let variableValue = evaluateExpression(expression, variables);

  // Check if code value type matches the supposed type

  // Only update the variables if there are no errors in the expression
  if (errors != undefined) {
    variables[variableName].value = variableValue
  }

  // Grammar check
  errors = addError(errors, checkVariablesGrammar(codeObjects, line, 'Set'))
  return errors;
}

function evaluateExpression(expression, variables) {
  // Turn expression array into a string
  let expressionString = expression.join(' ');

  // Tokenize the expression string:
  const regex = /[\w\.]+|[+\-*/()]/g;
  let tokenedExpression = expressionString.match(regex);

  // Replace any variable references in the expression with their values
  for (let i = 0; i < tokenedExpression.length; i++) {
    if (tokenedExpression[i] in variables) {
      tokenedExpression[i] = variables[tokenedExpression[i]].value;
    }
  }
  let tokenedString = tokenedExpression.join(' ')
  try {
    // Attempt to evaluate the expression
    return eval(tokenedString);
  } catch (error) {
    // If eval fails, handle the error
    console.error('Error evaluating expression:', error);
    return null;  // Or you could return some other value to indicate failure
  }
}

function checkVariablesGrammar(codeObjects, line, type){
  let trimmedLine = line.trim();
  let mistakes = undefined;
  if(type == 'Set' && !trimmedLine.startsWith('Set')){
    mistakes = addError(mistakes, "'Set' should be capitalized with remaining letters lowercase. ") 
  }
  if(type == 'Declare' && !trimmedLine.startsWith('Declare')){
    mistakes = addError(mistakes, "'Declare' should be capitalized with remaining letters lowercase. ");
  }
  if(type == 'Set' && !trimmedLine.startsWith('Set')){
    mistakes = addError(mistakes, "'Set' should be capitalized with remaining letters loweracase. ")
  }
  if(type == 'Const' && !(trimmedLine.startsWith('Const') || trimmedLine.startsWith('CONST'))){
    mistakes = addError(mistakes, "'Const' consists of capitalizaiton errors.")
  }
  //Check Indentation
  mistakes = addError(mistakes, checkIndentation(codeObjects, line));
  return mistakes
}

// Modules Validation
function updateModule(codeObjects, line, code) {
  let modules = codeObjects.modules;
  let errors = undefined;
  let lineArray = line.trim().split(/\s+/);
  // Find out if it's the start or the end
  let moduleType = checkModuleType(lineArray);
  if (moduleType == null){
    errors = addError(errors, 'Incorrect usage of modules.')
    return errors;
  }
  // Get the name of the module
  let moduleName = getModuleName(line);
  // If it's null, stop the function
  if (moduleName == null){
    errors = addError(errors, 'Syntax error in module statement.')
    return errors;
  }
  // Check if the called module exists
  if(moduleType == 'Call'){
    errors = addError(errors, findModule(moduleName, code))
    // Check if module arguments are valid
    let tokenedModule = tokenizeModule(line);
    // Stop function if there are no arguments to the call
    if (tokenedModule.length == 2){
      return errors;
    }

    let moduleArgs = findModuleArguments(tokenedModule);
    for(let moduleArg of moduleArgs){
      if(!(moduleArg in codeObjects.variables)){
        errors = addError(errors, `The argument '${moduleArg}' is not defined in the module.`)
      }
    }
  } 
  // Check if previous module has been closed when declaring a new one.
  else if(moduleType == 'Module'){
    // Check if previuos module is closed
    if(modules.length > 1){
      errors = addError(errors, 'Previous module has not been closed.' )
    }
    // Check if the parameter type matches the argument type
    let tokenedModule = tokenizeModule(line);
    let moduleArgs = findModuleArguments(tokenedModule);
    console.log(moduleArgs);

    // errors = addError(errors, checkModuleParameterTypes(moduleArgs))

    // Add module to modules
    modules.push(moduleName);
  }
  // Remove the most recent module
  else if(moduleType == 'End'){
    modules.pop();
  }
  errors = addError(errors, checkModuleGrammar(codeObjects, line, moduleType))
  return errors;
}

function checkModuleType(lineArray){
  let capArray = lineArray.map(str => str.toUpperCase());
  if(capArray[0].toUpperCase() == 'MODULE'){
    return 'Module'
  }
  else if(capArray[0] == 'END' && capArray[1] == 'MODULE'){
    return 'End'
  }
  else if(capArray[0] == 'CALL'){
    return 'Call'
  }
  else{
    return null;
  }
}

function findModule(moduleName, code){
  for (let i = 0; i < code.length; i++){
    // Tokenize the module if it's a module
    if(code[i].toUpperCase().includes('MODULE')){
      let tokenedModule = tokenizeModule(code[i])
      let end = tokenedModule.indexOf("(");
      // After 
      if(code[i] == `Module ${moduleName}()` ){
        return undefined
      }
    }
  }
  return `Module ${moduleName} not found.`
}

function tokenizeModule(line){
  const regex = /[\w\.]+|[+\-*/()]/g;
  return line.match(regex);
}

function getModuleName(line){
  try{
    let tokenedLine = tokenizeModule(line);
    return tokenedLine[1];
  }catch(error){
    return null;
  }
}

function findModuleArguments(tokenedModule){
  let start = tokenedModule.indexOf("(") + 1; // Find the position after "("
  let end = tokenedModule.indexOf(")");      // Find the position of ")"
  return tokenedModule.slice(start, end); // Extract elements between "(" and ")"
}

function checkModuleParameterTypes(moduleArgs){
   // Iterate each parameter
   return ''
}

function checkModuleGrammar(codeObjects, line, type){
  let trimmedLine = line.trim();
  let mistakes = undefined;
  if(type == 'Module' && !line.startsWith('Module')){
    mistakes = addError(mistakes, "'Module' should be capitalized. ")
  }
  if(type == 'End' && !line.startsWith('End Module')){
    mistakes = addError(mistakes, "'End' and 'Module' should be capitalized. ");
  }
  if(type == 'Call'){
    mistakes = addError(mistakes, checkIndentation(codeObjects, line));
    if(!trimmedLine == 'Call'){
      mistakes = addError(mistakes, "'Call' should be capitalized. " );
    }
  }
  return mistakes
}

function checkIndentation(codeObjects, line){
  if(!line.startsWith('\t') && codeObjects.modules.length > 0){
    return 'Contents inside a module should be indented. '
  }
  return undefined; 
}