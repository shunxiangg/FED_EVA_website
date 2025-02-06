const APIKEY = "6787a92c77327a0a035a5437";

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('edit-modal');
    const editBtn = document.getElementById('edit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const editForm = document.getElementById('edit-form');
    
    let currentUser = null;

    async function fetchAndDisplayUser() {
        try {
            const response = await fetch("https://evadatabase-f3b8.restdb.io/rest/accounts", {
                headers: {
                    "x-apikey": APIKEY,
                    "Cache-Control": "no-cache"
                }
            });
            const data = await response.json();
            if (data.length > 0) {
                currentUser = data[0];
                displayUserInfo(currentUser);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displayUserInfo(user) {
        document.getElementById('display-name').textContent = user.name || 'Not set';
        document.getElementById('display-email').textContent = user.email || 'Not set';
        document.getElementById('display-gender').textContent = user.userGender || 'Not set';
        document.getElementById('display-phone').textContent = user.userPhone || 'Not set';
    }

    function populateEditForm(user) {
        document.getElementById('edit-name').value = user.name || '';
        document.getElementById('edit-email').value = user.email || '';
        document.getElementById('edit-gender').value = user.userGender || '';
        document.getElementById('edit-phone').value = user.userPhone || '';
    }

    editBtn.onclick = function() {
        populateEditForm(currentUser);
        modal.style.display = 'block';
    }

    cancelBtn.onclick = function() {
        modal.style.display = 'none';
    }

    editForm.onsubmit = async function(e) {
        e.preventDefault();
        
        const updatedUser = {
            ...currentUser,
            name: document.getElementById('edit-name').value,
            email: document.getElementById('edit-email').value,
            userGender: document.getElementById('edit-gender').value,
            userPhone: document.getElementById('edit-phone').value
        };

        try {
            const response = await fetch(`https://evadatabase-f3b8.restdb.io/rest/accounts/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                currentUser = await response.json();
                displayUserInfo(currentUser);
                modal.style.display = 'none';
                alert('Profile updated successfully');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating profile');
        }
    }

    window.onclick = function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    }

    fetchAndDisplayUser();
});

document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    const userDisplay = document.getElementById('userDisplay');
    
    // Show username if logged in
    const userName = localStorage.getItem('userName');
    if (userName) {
        userDisplay.textContent = `Welcome, ${userName}!`;
        logoutBtn.style.display = 'block';
    }
    
    // Logout functionality
    window.logout = function() {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    };
});