document.addEventListener("DOMContentLoaded", function() {
    // Get form elements
    const form = document.getElementById("add-contact-form");
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const passwordInput = document.getElementById("contact-password");
    const repeatPasswordInput = document.getElementById("repeat-password-input");
    const errorMessage = document.getElementById("error-message");
const MAX_PASSWORD_LENGTH = 20;

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.color = 'red';
    }

    function clearError() {
        errorMessage.textContent = '';
    }

    // Name validation
    nameInput.addEventListener('input', function() {
        const nameValue = this.value.trim();
        
        if (nameValue.length < 2) {
            showError('Name must be at least 2 characters long');
        } else if (!/^[a-zA-Z\s]*$/.test(nameValue)) {
            showError('Name can only contain letters and spaces');
        } else {
            clearError();
        }
    });

    // Email validation
    emailInput.addEventListener('input', function() {
        const emailValue = this.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailPattern.test(emailValue)) {
            showError('Please enter a valid email address');
        } else {
            clearError();
        }
    });

    // Password validation
    passwordInput.addEventListener('input', function() {
        const passwordValue = this.value;
        
        if (passwordValue.length < 8) {
            showError('Password must be at least 8 characters long');
        } else if (passwordValue.length > MAX_PASSWORD_LENGTH) {
            showError(`Password cannot be longer than ${MAX_PASSWORD_LENGTH} characters`);
        } else if (!/[A-Z]/.test(passwordValue)) {
            showError('Password must contain at least one uppercase letter');
        } else if (!/[a-z]/.test(passwordValue)) {
            showError('Password must contain at least one lowercase letter');
        } else if (!/[0-9]/.test(passwordValue)) {
            showError('Password must contain at least one number');
        } else if (!/[!@#$%^&*]/.test(passwordValue)) {
            showError('Password must contain at least one special character (!@#$%^&*)');
        } else {
            clearError();
        }

        // Check repeat password if it has a value
        if (repeatPasswordInput.value) {
            checkPasswordsMatch();
        }
    });

    // Prevent pasting into repeat password field
    repeatPasswordInput.addEventListener('paste', function(e) {
        e.preventDefault();
        showError('Please type the password again manually');
    });

    // Confirm password validation
    function checkPasswordsMatch() {
        if (passwordInput.value !== repeatPasswordInput.value) {
            showError('Passwords do not match');
            return false;
        } else {
            clearError();
            return true;
        }
    }

    repeatPasswordInput.addEventListener('input', checkPasswordsMatch);

    // Form submission validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Check if any field is empty
        if (!nameInput.value.trim() || !emailInput.value.trim() || 
            !passwordInput.value || !repeatPasswordInput.value) {
            showError('All fields are required');
            return;
        }

        // Validate name
        if (nameInput.value.trim().length < 2 || !/^[a-zA-Z\s]*$/.test(nameInput.value.trim())) {
            showError('Please enter a valid name');
            return;
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            showError('Please enter a valid email address');
            return;
        }

        // Validate password
        const passwordValue = passwordInput.value;
        if (passwordValue.length < 8 || passwordValue.length > MAX_PASSWORD_LENGTH ||
            !/[A-Z]/.test(passwordValue) || 
            !/[a-z]/.test(passwordValue) || 
            !/[0-9]/.test(passwordValue) || 
            !/[!@#$%^&*]/.test(passwordValue)) {
            showError(`Password must be 8-${MAX_PASSWORD_LENGTH} characters and meet all requirements`);
            return;
        }

        // Check if passwords match
        if (!checkPasswordsMatch()) {
            return;
        }

        // If all validations pass, allow the form to submit
        // Your existing API call code will handle the actual submission
    });
});