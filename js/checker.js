// Fix Module begin/end

// Include modules needed
import { searchVariable, clearBeginEnd, identifyType } from './helpers.js';

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
    let mistakes = [code.length]
    let position = {
      module: {
        level: 0,
        name: undefined,
        place: undefined
      },
      ifs: {
        level: 0,
        condition: undefined,
        place: undefined
      },
      loop: {
        // for, while, doWhile
        type: undefined,
        level: undefined,
        condition: undefined,
        place: undefined
      }
    }
  // Loop through a single line, identify what this is 
  for (let i = 0; i < code.length; i++) {
    let line = code[i];
    token = identifyType(line);
    position = identifyPosition(position, token, line)
    // verify if the token matches the line, where mistakes is an array
    mistakes[i] = identifyMistakes(level, token, line);
  }
  return mistakes;
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

