import * as checker from './checker.js'

const $ = selector => document.querySelector(selector);

function processEntry(){
    // Retrieve data from textbox
    const input = $("#pseudocode_input").value;
    checker.readCode(input)
}


document.addEventListener("DOMContentLoaded", () => {
    // hook up click events for both buttons
    $("#check").addEventListener("click", processEntry);
});


