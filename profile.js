document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // updates the information on display 
    document.getElementById('displayName').textContent = document.getElementById('name').value;
    document.getElementById('displayGender').textContent = document.getElementById('gender').value;
    document.getElementById('displayEmail').textContent = document.getElementById('email').value;
    document.getElementById('displayContact').textContent = document.getElementById('contact').value;
});

// logging user out
function logout() {
    alert('Logging out...');
    window.location.href = 'login.html'; 
}