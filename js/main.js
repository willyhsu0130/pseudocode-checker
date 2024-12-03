import * as checker from './checker.js'

const $ = selector => document.querySelector(selector);

async function processEntry(){
    // Retrieve data from textbox
    const input = $("#pseudocode_input").value;
    try {
        // const mistakes = await checker.begin_checker(input);
        // Test array 
        const mistakes = [
        undefined,
        undefined,
        "Variable type doesn't match its value.",
        undefined,
        undefined,
        "Variable already declared previously.",
        "Variable has not been declared."
        ]
        // Display mistakes
        displayMistakes(mistakes)
        console.log(mistakes);
    } 
    catch (error) {
        console.error('Error:', error); // Logs any errors
    }
}

function displayMistakes(mistakes_array){
    const table = $("#errors");
    table.innerHTML = "";
    for (let i = 0; i < mistakes_array.length; i++) {
        if (mistakes_array[i] != undefined){
            const table_row = document.createElement("tr");
            const index = document.createElement("td");
            index.textContent = "At line " + i + ":";
            table_row.appendChild(index);

            const mistakes = document.createElement("td");
            mistakes.textContent = mistakes_array[i];
            table_row.appendChild(mistakes);

            table.appendChild(table_row);

        }
        
    }
}



document.addEventListener("DOMContentLoaded", () => {
    // hook up click events for both buttons
    $("#check").addEventListener("click", processEntry);
});


