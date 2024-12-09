import { begin_checker } from './checker.js'

const $ = selector => document.querySelector(selector);

const examples = {
    example1: `Main Module ()
    Call calculateArea()
End Module

Module calculateArea()
    Declare Real length
    Declare Real width
    Declare Real area

    Display "Enter the length of the rectangle:"
    Input length
    Display "Enter the width of the rectangle:"
    Input width

    Set area = length * width
    Display "The area of the rectangle is: ", area
End Module`,

    example2: `Main Module ()
    Const Int SIZE = 3
    Declare Int numbers[SIZE]
    Declare Int searchValue
    Declare Int i

    For i = 0 To SIZE - 1
        Display "Enter a number:"
        Input numbers[i]
    End For

    Display "Enter the value to search:"
    Input searchValue

    Call Search(numbers, SIZE, searchValue)
End Module

Module Search(Int numbers[ ], Int SIZE, Int searchValue)
    Declare Int i
    Declare found = false

    For i = 0 To SIZE - 1
        If numbers[i] == searchValue Then
            Set found = true
            Exit For
        End If
    End For

    If found == true Then
        Display "Value found in the array."
    Else
        Display "Value not found in the array."
    End If
End Module`
};

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