document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("add-contact-form");
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const passwordInput = document.getElementById("contact-password");
    const repeatPasswordInput = document.getElementById("repeat-password-input");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Reset error message
        errorMessage.textContent = "";
        errorMessage.style.color = "red";

        // Validate name
        if (!validateName(nameInput.value)) {
            errorMessage.textContent = "Name must be at least 2 characters long and contain only letters";
            nameInput.focus();
            return;
        }

        // Validate email
        if (!validateEmail(emailInput.value)) {
            errorMessage.textContent = "Please enter a valid email address";
            emailInput.focus();
            return;
        }

        // Validate password
        if (!validatePassword(passwordInput.value)) {
            errorMessage.textContent = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number";
            passwordInput.focus();
            return;
        }

        // Validate repeat password
        if (passwordInput.value !== repeatPasswordInput.value) {
            errorMessage.textContent = "Passwords do not match";
            repeatPasswordInput.focus();
            return;
        }

        // If all validations pass, allow the form to submit
        // The actual submission is handled by api.js
    });

    // Real-time validation
    nameInput.addEventListener("input", function() {
        if (validateName(this.value)) {
            this.style.borderColor = "green";
        } else {
            this.style.borderColor = "red";
        }
    });

    emailInput.addEventListener("input", function() {
        if (validateEmail(this.value)) {
            this.style.borderColor = "green";
        } else {
            this.style.borderColor = "red";
        }
    });

    passwordInput.addEventListener("input", function() {
        if (validatePassword(this.value)) {
            this.style.borderColor = "green";
        } else {
            this.style.borderColor = "red";
        }
    });

    repeatPasswordInput.addEventListener("input", function() {
        if (this.value === passwordInput.value && this.value !== "") {
            this.style.borderColor = "green";
        } else {
            this.style.borderColor = "red";
        }
    });

    // Validation helper functions
    function validateName(name) {
        const nameRegex = /^[A-Za-z]{2,}$/;
        return nameRegex.test(name.trim());
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    // Optional: Add password strength indicator
    passwordInput.addEventListener("input", function() {
        const password = this.value;
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^A-Za-z0-9]/)) strength++;

        switch (strength) {
            case 0:
            case 1:
                this.style.borderColor = "red";
                break;
            case 2:
                this.style.borderColor = "orange";
                break;
            case 3:
                this.style.borderColor = "yellow";
                break;
            case 4:
            case 5:
                this.style.borderColor = "green";
                break;
        }
    });
});