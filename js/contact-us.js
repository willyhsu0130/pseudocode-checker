"use strict";

$(document).ready(function () {
  $("#contactForm").on("submit", function (event) {
    let isValid = true;

    // Get form field values and trim whitespace
    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const message = $("#message").val().trim();

    // Clear any previous error messages
    $(".error-message").remove();

    // Validate Name
    if (name === "") {
      showError("#name", "Please enter your name.");
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      showError("#email", "Please enter a valid email address.");
      isValid = false;
    }

    // Validate Message
    if (message === "") {
      showError("#message", "Please enter a message.");
      isValid = false;
    }

    // If the form is invalid, prevent submission
    if (!isValid) {
      event.preventDefault();
    }
  });

  // Function to show error messages
  function showError(selector, message) {
    $(selector).after(`<div class="error-message" style="color: red;">${message}</div>`);
  }
  
  $("input, textarea").on("focus", function () {
    $(this).next(".error-message").remove();
  });
});