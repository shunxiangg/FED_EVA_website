document.addEventListener('DOMContentLoaded', function() {
    const userDisplay = document.getElementById('userDisplay');
    const userName = localStorage.getItem('userName');
    
    if (userName && userDisplay) {
        userDisplay.textContent = `Welcome, ${userName}`;
        userDisplay.style.color = '#fff';
        userDisplay.style.margin = '0 15px';
    }
});