const $ = selector => { document.querySelector(selector);}

function processEntry(){
    // Retrieve data from textbox
    const input = $("#pseudocode_input").value;
    console.log(input);
}


document.addEventListener("DOMContentLoaded", () => {
    // hook up click events for both buttons
    $("#check").addEventListener("click", processEntry);
});
