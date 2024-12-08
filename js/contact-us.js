"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");

    contactForm.addEventListener("submit", (event) => {
        let isValid = true;

        // Get form field values and trim whitespace
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validate Name
        if (name === "") {
            alert("Please enter your name.");
            isValid = false;
        }

        // Validate Email
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            isValid = false;
        }

        // Validate Message
        if (message === "") {
            alert("Please enter a message.");
            isValid = false;
        }

        // If the form is invalid, prevent submission
        if (!isValid) {
            event.preventDefault();
        }
    });
});
