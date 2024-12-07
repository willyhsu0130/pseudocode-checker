import { begin_checker } from './checker.js'

const $ = selector => document.querySelector(selector);

const examples = {
    example1: `Main module ()
                Call getInputs 
               End Module`,

    example2: `Main module ()
                Call calculateAverage 
               End Module`
};

async function processEntry(){
    // Retrieve data from textbox
    const input = $("#pseudocode_input").value;
    try {
        // const mistakes = await checker.begin_checker(input);
        // Test array 
        let mistakes = begin_checker(input);
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

function clearContent (){
    $("#pseudocode_input").value = "";
    $("#errors").innerHTML = "";
    $("#message").textContent = "";
}

function copyContent() {
    const error = $("#errors")
    const input = $("#pseudocode_input");
    if (input.value.trim() === "") {
        error.textContent = "There is nothing to copy"
        return;
    }
    input.select();
    document.execCommand("copy");
    error.textContent = "Text copied!"
}


function loadExample() {
    const selectedExample = document.querySelector("#examples").value; 
    const pseudocodeInput = document.querySelector("#pseudocode_input");
    
    if (selectedExample) {
        pseudocodeInput.value = examples[selectedExample]; 
    } else {
        pseudocodeInput.value = ""; 
    }
    $("#pseudocode_input").focus()
}






document.addEventListener("DOMContentLoaded", () => {
    // hook up click events for both buttons
    $("#check").addEventListener("click", processEntry);
    $("#clear").addEventListener("click", clearContent);
    $("#copy").addEventListener("click", copyContent);
    $("#examples").addEventListener("change", loadExample);
});


