document.addEventListener('DOMContentLoaded', function() {
    const userDisplay = document.getElementById('userDisplay');
    const userName = localStorage.getItem('userName');
    
    if (userName) {
        // Capitalize first letter of name
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
        userDisplay.textContent = `Welcome, ${formattedName}`;
    }
});