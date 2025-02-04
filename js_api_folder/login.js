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
                        window.location.href = 'lottie.html';
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


// // login.js
// document.addEventListener("DOMContentLoaded", function () {
//     const APIKEY = "6787a92c77327a0a035a5437";
//     const loginForm = document.getElementById("form");
//     const errorMessage = document.getElementById("error-message");
    
//     if (loginForm) {
//         loginForm.addEventListener("submit", async function (e) {
//             e.preventDefault();
//             const email = document.getElementById("email-input").value;
//             const password = document.getElementById("password-input").value;
//             errorMessage.textContent = '';
//             errorMessage.style.color = 'red';
            
//             // loading animation
//             const loadingOverlay = document.createElement('div');
//             loadingOverlay.className = 'loading-overlay';
//             loadingOverlay.innerHTML = `<div class="loading-content">
//                 <div class="spinner"></div>
//                <p>Logging in...</p>
//                </div>`;
//             document.body.appendChild(loadingOverlay);
            
//             try {
//                 const settings = {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "x-apikey": APIKEY,
//                         "Cache-Control": "no-cache"
//                     }
//                 };
//                 const response = await fetch("https://evadatabase-f3b8.restdb.io/rest/accounts", settings);
//                 const accounts = await response.json();
                
//                 // Find matching account
//                 const account = accounts.find(acc => acc.email === email && acc.password === password);
               
//                 if (account) {
//                     localStorage.setItem('userEmail', account.email);
//                     localStorage.setItem('userName', account.name);
//                     loadingOverlay.querySelector('p').textContent = 'Login successful!';
                    
//                     // Show ad after successful login
//                     await displayLoginAd();
                 
//                     //after a short duration it will direct to browse page
//                     setTimeout(() => {
//                         window.location.href = 'lottie.html';
//                     }, 1500);
//                 } else {
//                     errorMessage.textContent = 'Invalid email or password';
//                     loadingOverlay.remove();
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//                 errorMessage.textContent = 'Error during login. Please try again.';
//                 loadingOverlay.remove();
//             }
//         });
//     }
// });

// // Function to display login ad
// async function displayLoginAd() {
//     const ADS_URL = "https://evadatabase-f3b8.restdb.io/rest/advertisements";
    
//     try {
//         const response = await fetch(ADS_URL, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-apikey": APIKEY,
//                 "Cache-Control": "no-cache"
//             }
//         });

//         if (!response.ok) throw new Error('Failed to fetch ads');
//         const ads = await response.json();

//         if (ads.length > 0) {
//             // Select random ad
//             const randomAd = ads[Math.floor(Math.random() * ads.length)];
            
//             // Create and show popup
//             const popup = document.createElement('div');
//             popup.style.cssText = `
//                 position: fixed;
//                 top: 0;
//                 left: 0;
//                 width: 100%;
//                 height: 100%;
//                 background: rgba(0,0,0,0.7);
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 z-index: 10000;
//             `;

//             const popupContent = document.createElement('div');
//             popupContent.style.cssText = `
//                 background: white;
//                 padding: 20px;
//                 border-radius: 8px;
//                 max-width: 500px;
//                 width: 90%;
//                 position: relative;
//             `;

//             popupContent.innerHTML = `
//                 <span style="position: absolute; right: 10px; top: 5px; cursor: pointer; font-size: 24px;">&times;</span>
//                 <img src="${randomAd.imageUrl || '/api/placeholder/600/400'}" 
//                      alt="${randomAd.title}"
//                      style="width: 100%; border-radius: 4px; margin-bottom: 15px;">
//                 <h2 style="margin-bottom: 10px;">${randomAd.title}</h2>
//                 <p>${randomAd.description}</p>
//             `;

//             popup.appendChild(popupContent);
//             document.body.appendChild(popup);

//             // Close button functionality
//             const closeBtn = popupContent.querySelector('span');
//             closeBtn.onclick = () => popup.remove();

//             // Close on outside click
//             popup.onclick = (e) => {
//                 if (e.target === popup) popup.remove();
//             };
//         }
//     } catch (error) {
//         console.error('Error displaying login ad:', error);
//     }
// }

// const styleSheet = document.createElement("style");
// styleSheet.textContent = styles;
// document.head.appendChild(styleSheet);