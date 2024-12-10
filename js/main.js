import { begin_checker } from './checker.js'

const $ = selector => document.querySelector(selector);

const examples = {
    example1: `Module main()
\tCall calculateArea()
End Module

Module calculateArea()
\tDeclare Real len = 0.0
\tDeclare Real width = 0.0
\tDeclare Real area = 0.0

\tDisplay "Enter the length of the rectangle:"
\tInput len
\tDisplay "Enter the width of the rectangle:"
\tInput width

\tSet area = len * width
\tDisplay "The area of the rectangle is: ", area
End Module`
}

async function processEntry() {
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

function displayMistakes(mistakes_array) {
    const table = $("#errors");
    if($("#pseudocode_input").value == ""){
        let content = "<tr><td>There is nothing to check here.<td><tr>"
        table.innerHTML = content;
    }
    else{
        
        table.innerHTML = "";
        for (let i = 0; i < mistakes_array.length; i++) {
            if (mistakes_array[i] != undefined) {
                const table_row = document.createElement("tr");
                const index = document.createElement("td");
                index.textContent = "At line " + (i+1) + ":";
                table_row.appendChild(index);
    
                const mistakes = document.createElement("td");
                mistakes.textContent = mistakes_array[i];
                table_row.appendChild(mistakes);
    
                table.appendChild(table_row);
            }
        }
        if(table.innerHTML == ""){
            let content = "<tr><td>Your pseudocode seems correct!<td><tr>"
            table.innerHTML = content;
        }
    }

}

function clearContent() {
    $("#pseudocode_input").value = ""; 
    $("#errors").innerHTML = ""; 
    $("#message").textContent = ""; 
    const lineNumbers = $("#line-numbers");
    lineNumbers.textContent = "1\n"; 
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
    updateLineNumbers();
}

function updateLineNumbers() {
    const pseudocodeInput = $("#pseudocode_input");
    const lineNumbers = $("#line-numbers");

    // Contar las líneas basándonos en los saltos de línea
    const totalLines = pseudocodeInput.value.split("\n").length;

    // Generar los números de línea
    let lineNumberText = "";
    for (let i = 1; i <= totalLines; i++) {
        lineNumberText += i + "\n";
    }

    lineNumbers.textContent = lineNumberText;


}

function tabkey(event, textarea) {
    if (event.key === "Tab") {
        event.preventDefault(); // Prevent the default tab behavior

        // Get cursor positions
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Insert the tab character (4 spaces)
        const tab = "\t";
        textarea.value = textarea.value.substring(0, start) + tab + textarea.value.substring(end);

        // Move the cursor to the end of the inserted tab
        textarea.selectionStart = textarea.selectionEnd = start + tab.length;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // hook up click events for both buttons
    $("#check").addEventListener("click", processEntry);
    $("#clear").addEventListener("click", clearContent);
    $("#copy").addEventListener("click", copyContent);
    $("#examples").addEventListener("change", loadExample);
    $("#pseudocode_input").addEventListener("input", updateLineNumbers);
    $("#pseudocode_input").addEventListener("scroll", () => {
        $("#line-numbers").scrollTop = $("#pseudocode_input").scrollTop;
    });
    $("#pseudocode_input").addEventListener("keydown", (event) => tabkey(event, event.target));

    updateLineNumbers();
});