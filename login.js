// login.js
document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "6787a92c77327a0a035a5437";
    const loginForm = document.getElementById("form");
    const errorMessage = document.getElementById("error-message");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("email-input").value;
            const password = document.getElementById("password-input").value;


            errorMessage.textContent = '';
            errorMessage.style.color = 'red';

            // loading anmation
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = `<div class="loading-content">
                <div class="spinner"></div>
               <p>Logging in...</p>
               </div>`;
            document.body.appendChild(loadingOverlay);

            try {
                const settings = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": APIKEY,
                        "Cache-Control": "no-cache"
                    }
                };

                const response = await fetch("https://evadatabase-f3b8.restdb.io/rest/accounts", settings);
                const accounts = await response.json();

                // Find matching account
                const account = accounts.find(acc => acc.email === email && acc.password === password);

                if (account) {
                    localStorage.setItem('userEmail', account.email);
                    localStorage.setItem('userName', account.name);

                    loadingOverlay.querySelector('p').textContent = 'Login successful!';
                 
                    //after a short duratuion it will direct to browswe pag
                    setTimeout(() => {
                        window.location.href = 'browse.html';
                    }, 1500);
                } else {
                    errorMessage.textContent = 'Invalid email or password';
                    loadingOverlay.remove();
                }

            } catch (error) {
                console.error('Error:', error);
                errorMessage.textContent = 'Error during login. Please try again.';
                loadingOverlay.remove();
            }
        });
    }
});


const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);