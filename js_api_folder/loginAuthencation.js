// auth.js
function checkloginAuthencation() {
    const userName = localStorage.getItem('userName');
    if (!userName) {
        window.location.href = 'index.html';
        return;
    }
    
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    if (userDisplay && logoutBtn) {
        userDisplay.textContent = `Welcome, ${userName}!`;
        userDisplay.style.color = '#fff';
        userDisplay.style.padding = '0 15px';
        logoutBtn.style.display = 'block';
    }
}

// // log ouut 
// function logout() {
//     localStorage.removeItem('userName');
//     localStorage.removeItem('userEmail');
//     window.location.href = 'index.html';
// }

// Check auth on page load
document.addEventListener('DOMContentLoaded', checkloginAuthencation);




// In your login function after successful login
localStorage.setItem('userEmail', email);
// Add this line:
checkLoginStatus(); // This will trigger the popup ad