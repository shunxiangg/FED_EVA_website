// document.addEventListener("DOMContentLoaded", function () {
//     const APIKEY = "6787a92c77327a0a035a5437";
  
//     document.getElementById("add-contact-form").addEventListener("submit", function (e) {
//       e.preventDefault();
  
//       // Get form data
//       let contactName = document.getElementById("contact-name").value;
//       let contactEmail = document.getElementById("contact-email").value;
//       let contactPassword = document.getElementById("contact-password").value;
  
//       // Client-side validation
//       if (contactName === "" || contactEmail === "" || contactPassword === "") {
//         alert("All fields are required!");
//         return;
//       }
  
//       // Simple email validation
//       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//       if (!emailRegex.test(contactEmail)) {
//         alert("Please enter a valid email address.");
//         return;
//       }
  
//       // Password validation (at least 6 characters)
//       if (contactPassword.length < 6) {
//         alert("Password must be at least 6 characters long.");
//         return;
//       }
  
//       // All fields are valid, proceed with the submission
//       let jsondata = {
//         "name": contactName,
//         "email": contactEmail,
//         "password": contactPassword
//       };
  
//       let settings = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-apikey": APIKEY,
//           "Cache-Control": "no-cache"
//         },
//         body: JSON.stringify(jsondata),
//       };
  
//       fetch("https://evadatabase-f3b8.restdb.io/rest/accounts", settings)
//         .then(response => response.json())
//         .then(data => {
//           console.log(data);
  
//           // Show success message
//           document.getElementById("add-update-msg").style.display = "block";
//           setTimeout(function () {
//             document.getElementById("add-update-msg").style.display = "none";
//           }, 3000);
  
//           // Redirect to contacts page after submission
//           window.location.href = "contacts.html";
//         });
//     });
//   });
  

// Form validation script
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("add-contact-form");
    const passwordInput = document.getElementById("contact-password");
    const repeatPasswordInput = document.getElementById("repeat-password-input");
    const errorMessage = document.getElementById("error-message");

    // Function to show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.color = "red";
    }

    // Function to clear error message
    function clearError() {
        errorMessage.textContent = "";
    }

    // Validate password strength
    function validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    // Check if passwords match
    function passwordsMatch() {
        return passwordInput.value === repeatPasswordInput.value;
    }

    // Validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Add form submission validation
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            clearError();

            const name = document.getElementById("contact-name").value;
            const email = document.getElementById("contact-email").value;
            const password = passwordInput.value;

            // Validate name
            if (name.length < 2) {
                showError("Name must be at least 2 characters long");
                return;
            }

            // Validate email
            if (!validateEmail(email)) {
                showError("Please enter a valid email address");
                return;
            }

            // Validate password strength
            if (!validatePassword(password)) {
                showError("Password must be at least 8 characters long and contain uppercase, lowercase, and numbers");
                return;
            }

            // Check if passwords match
            if (!passwordsMatch()) {
                showError("Passwords do not match");
                return;
            }

            // If all validations pass, submit the form
            // The form submission is handled by the existing code in api.js
            // This will trigger the click event listener on contact-submit
            document.getElementById("contact-submit").click();
        });
    }

    // Real-time password matching validation
    if (repeatPasswordInput) {
        repeatPasswordInput.addEventListener("input", function() {
            if (!passwordsMatch()) {
                repeatPasswordInput.style.borderColor = "red";
                showError("Passwords do not match");
            } else {
                repeatPasswordInput.style.borderColor = "green";
                clearError();
            }
        });
    }

    // Real-time password strength indicator
    if (passwordInput) {
        passwordInput.addEventListener("input", function() {
            if (!validatePassword(passwordInput.value)) {
                passwordInput.style.borderColor = "red";
            } else {
                passwordInput.style.borderColor = "green";
            }
        });
    }
});