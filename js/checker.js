// Fix Module begin/end

// Include modules needed
import { searchVariable, clearBeginEnd } from './helpers.js';


// Intialize global variables. Code is for the pseudocode text. Mistkaes array store all the mistakes 

// Provided a method for me to insert a mistake into an array if there are more than one mistakes in each line.
Array.prototype.append = function (index, text) {
  if (this[index] !== undefined) {
    this[index] += text; // Concatenate the existing string with the new text
  } else {
    this[index] = text;
  }
};

// Read the txt file into an array
function readCode(input) {
  return new Promise((resolve, reject) => {
    try {
      // Read the file synchronously: test.txt is the sample file for checking. 
      const data = input;

      // Split the data into an array by newline characters
      const code = data.split("\n");

      resolve(code);;
    } catch (error) {
      reject("Error reading code");
    }
  }
  )
}

// Performs all the logical parts of checking
function validate(code) {
  // Intialize the different objects that will be used later.
  let mistakes = [];
  let module = {
    value: 0,
    begin: 0,
    end: 0,
  }
  let forLoop = {
    value: 0,
    in: 0,
    begin: 0,
    end: 0
  };
  let comment = 0;
  let statement = {
    value: 0,
    type: "",
    variables: [],
  };
  let ifClause = {
    value: 0,
    in: 0,
    begin: 0,
    end: 0
  };

  // Loop through a single line, identify what this is 
  for (let i = 0; i < code.length; i++) {
    let line = code[i];
    // Trim the line and uppercase it so that the indentation doesn't matter.
    let pureLine = line.trim().toUpperCase();
    comment = 0;
    statement.value = 0;
    statement.type = "";
    // A comment
    if (line[0] == "/" && line[1] == "/") {
      comment = 1;
    }
    // A Module
    else if (line.toUpperCase().includes("MODULE")) {
      //Start Module
      if (line.toUpperCase().startsWith("MODULE")) {
        // Check if close previous module
        if (module.value == 1) {
          mistakes.append(i, "Previous module not closed. ")
        }
        module.value = 1;
        module.begin = 1;
      }
      //End Module
      if (line.toUpperCase().startsWith("END MODULE")) {
        module.value = 0;
        module.end = 1;
      }
    }
    // Statement divided into three types
    // ** pureLine is already in uppercase
    else if (pureLine.startsWith("DECLARE ") || pureLine.startsWith("SET ") || pureLine.startsWith("INPUT ") || pureLine.startsWith("CONST")) {
      // Statement is true
      statement.value = 1;
      let variable;
      // Check if it's a declare
      if (pureLine.startsWith("DECLARE ")) {
        statement.type = "Declare";
        // Make the variable into an array of its type and its name.
        // variable[0] = its type
        // variable[1] = its name
        variable = line.trim().split(/\s+/).slice(1, 3);
        // If this variable already has been declared, add this into the mistakes.
        if (searchVariable(statement.variables, variable[1])) {
          mistakes.append(i, "Declaring an already declared variable is not permitted. ")
        }
        // Insert the name, type, value, value into statment.variables
        // Check whether the variable is a "Real"
        if (variable[0].toUpperCase() == "REAL") {
          let insert = {
            type: "Real",
            name: variable[1],
            level: module.value
          };
          statement.variables.push(insert);
        }
        // Check whether the variable is an "Integer"
        else if (variable[0].toUpperCase() == "INTEGER") {
          let insert = {
            type: "Integer",
            name: variable[1],
            level: module.value
          };
          statement.variables.push(insert);
        }
        // Check whether the variable is a "Const"
        // If it's a const it shouldn't be accessed by declare nor set
        else if (variable[0].toUpperCase() == "STRING") {
          let insert = {
            type: "String",
            name: variable[1],
            level: module.value
          };
          statement.variables.push(insert);
        }
      }
      // Check if it's a "Set"
      else if (pureLine.toUpperCase().startsWith("SET")) {
        statement.type = "Set";
        variable = line.trim().split(/\s+/).slice(1, 2);
        // Check if it this variable already exists (It should)
        if (!searchVariable(statement.variables, variable[0])) {
          mistakes.append(i, "Set should only be used for existing variables. ")
        }
      }
      // Check if it's a "Const"
      else if (pureLine.toUpperCase().startsWith("CONST")) {
        statement.type = "Const";
        variable = line.trim().split(/\s+/).slice(1, 3);
        // Check if this vairable already exists(It shouldn't)
        if (searchVariable(statement.variables, variable[1])) {
          mistakes.append(i, "Declaring a constant variable that has been already declared variable is not permitted. ")
        }
      }
    }
    // Empty Line --> assume it's a comment so we ignore it 
    else if (line == "") {
      comment = 1;
    }
    checkSpelling(code, mistakes, i, module, forLoop, comment, statement, ifClause)
    forLoop = clearBeginEnd(forLoop);
    module = clearBeginEnd(module);
    ifClause = clearBeginEnd(ifClause);
  }
  return mistakes;
}

function checkSpelling(code, mistakes, lineNum, module, forLoop, comment, statement, ifClause) {
  // If it's a comment, ignore the spell check to move out the function.
  if (comment == 1) {
    return;
  }
  // Check begin of module
  if (module.begin == 1) {
    // Module not spelled correctly
    if (!code[lineNum].startsWith("Module ")) {
      mistakes.append(lineNum, "Module is not capitalized. ")
    }
  }
  // Check content of Module
  if (module.value == 1 && module.begin != 1 && module.end != 1) {
    // Module not indented 
    if (!code[lineNum].startsWith("\t")) {
      mistakes.append(lineNum, "Module content not indented. ")
    }
  }
  // Check end of Module
  if (module.end == 1) {
    if (!code[lineNum].startsWith("End Module")) {
      mistakes.append(lineNum, "End of module not spelled correctly. ");
    }
  }
  // Check if Declare is capitalized
  if (statement.type == "Declare") {
    // Check if declare is spelled correctly
    if (!code[lineNum].includes("Declare")) {
      mistakes.append(lineNum, "Declare is not capitalized. ")
    }
  }
  // Check if set is capitalized
  if (statement.type == "Set") {
    if (!code[lineNum].includes("Set")) {
      mistakes.append(lineNum, "Declare is not capitalized. ")
    }
  }
  // Check if Const is capitalized
  if (statement.type == "Const"){
    if(!code[lineNum].includes("Const")){
      mistakes.append(lineNum, "Const is not capitalized. ")
    }
  }
}

// Main function. Async is used here because reading code from file is async so this must be used.
export async function begin_checker(input) {
  try {
    // Load Code
    const code = await readCode(input);
    const mistakes = validate(code);
    return mistakes;
  }
    // If code can't be read, an error will show.
  catch (error) {
    return console.error(error)
  }
}

