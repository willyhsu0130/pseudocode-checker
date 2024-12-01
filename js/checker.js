// Fix Module begin/end

// Include modules needed
import { identifyMistakes, clearBeginEnd, identifyType } from './helpers.js';

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
    let mistakes = [code.length];
    //intialize items in psedocode
    let codeObjects = {
      variables: [],
      ifStack: [],
      loopStack: []
    }

  // Loop through a single line, identify what this is 
  for (let i = 0; i < code.length; i++) {
    let line = code[i];
    let token = identifyType(line);
    // verify if the token matches the line, where mistakes is an array
    mistakes[i] = identifyMistakes(codeObjects, token, line);
  }
  return mistakes;
}

// Main function. Async is used here because reading code from file is async so this must be used.
export async function begin_checker(input) {
  try {
    // Load Code
    // const code = await readCode(input);
    const mistakes = validate(input);
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
    console.log("At line " + i + " " + array[i])
  }
}


const text = [
  "// Main module",
  "Module main()",
  "\tCall calculateAverage()",
  "\tCall calculateTip()",
  "End Module",
  "",
  "// Module to calculate the average cost of drinks",
  "Module calculateAverage()",
  "\tDeclare Real drink1 = hi",
  "\tDeclare Real drink2 = 0.0",
  "\tDeclare Real drink3 = 0.0",
  "\tDeclare Real average = 0.0",
  "\tDisplay “Enter the value of the first drink in dollars:”",
  "\tInput drink1",
  "\tDisplay “Enter the value of the second drink in dollars:”",
  "\tInput drink2",
  "\tDisplay “Enter the value of the third drink in dollars:”",
  "\tInput drink3",
  "\tSet average = (drink1 + drink2 + drink3) / 3",
  "\tDisplay “The average price of the drinks is $”, average",
  "End Module",
  "",
  "// Module to calculate the total meal cost including tax and tip",
  "Module calculateTip()",
  "\tDeclare Real mealCost = 0.0",
  "\tDeclare Real tipAmount = 0.0",
  "\tDeclare Real totalCost = 0.0",
  "\tConst Real taxRate = 0.13",
  "\tDisplay “How much did the meal cost?”",
  "\tInput mealCost",
  "\tDisplay “How much did you tip?”",
  "\tInput tipAmount",
  "\tSet totalCost = mealCost * (1 + taxRate) + tipAmount",
  "\tDisplay “Your total cost is $”, totalCost",
  "End Module"
];


begin_checker(text);
