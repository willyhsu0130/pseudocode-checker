// Fix Module begin/end

// Include modules needed
import { identifyMistakes, identifyType } from './helpers.js';

// Read the txt file into an array
function readCode(input) {
  const code = input.split("\n");
  return code;
}

// Performs all the logical parts of checking
function validate(code) {
    let mistakes = [code.length];
    //intialize items in pseudocode
    let codeObjects = {
      variables: [],
      ifStack: [],
      loopStack: [],
      modules: []
    }

  // Loop through a single line, identify what this is 
  for (let i = 0; i < code.length; i++) {
    if(i == 5){
      debugger; 
    }
    let line = code[i];
    let token = identifyType(line);
    // verify if the token matches the line, where mistakes is an array
    mistakes[i] = identifyMistakes(codeObjects, token, line, code);
  }
  console.log(codeObjects);
  return mistakes;
}

// Main function. Async is used here because reading code from file is async so this must be used.
export function begin_checker(input) {
  try {
    const code = readCode(input);
    const mistakes = validate(code);
    printErrors(mistakes)
    return mistakes;
    
  }
  // If code can't be read, an error will show.
  catch (error) {
    return console.error(error)
  }
}

// Testing section:
function printErrors(array){
  for(let i = 0; i <= array.length; i++){
    if (array[i] != undefined){
      console.log("At line " + (i+1) + ": " + array[i])
    }
  }
}


const text = [
  "// Main module",
  "Module main()",
  "\tCall calculateAverage(one, two)",
  "Call calculateTip()",
  "\tCall test()",
  "End Module",
  "",
  "// Module to calculate the average cost of drinks",
  "Module calculateAverage(Real one, Real two)",
  "declare Real drink1 = 1.0",
  "\tDeclare Real drink2 = 2.0",
  "\tDeclare Real drink3 = 3.0",
  "\tDeclare Real average = 0.0",
  "\tDisplay “Enter the value of the first drink in dollars:”",
  "\tInput drink1",
  "\tDisplay “Enter the value of the second drink in dollars:”",
  "\tInput drink2",
  "\tDisplay “Enter the value of the third drink in dollars:”",
  "\tInput drink3",
  "\tSet average1111 = (drink1 + drink2 + drink3) / 3",
  "\tDisplay “The average price of the drinks is $”, average",
  "End Module",
  "",
  "// Module to calculate the total meal cost including tax and tip",
  "Module calculateTip()",
  "\tDeclare Real mealCost = 0.0",
  "\tDeclare Real tipAmount = 0.0",
  "\tDeclare Real totalCost = 0.0",
  "\tConst Real taxRate = 0.13",
  "\tSet taxRate = 0.23",
  "\tDisplay “How much did the meal cost?”",
  "\tInput mealCost",
  "\tDisplay “How much did you tip?”",
  "\tInput tipAmount",
  "\tSet totalCost = mealCost * (1 + taxRate) + tipAmount",
  "\tDisplay “Your total cost is $”, totalCost",
  "End Module"
];

printErrors(validate(text));
