const APIKEY = "6787a92c77327a0a035a5437";
const ADS_URL = "https://evadatabase-f3b8.restdb.io/rest/advertisements";

// ============= Home Page Ad Display Functions =============

// Function to display a random ad
async function displayRandomAd() {
    try {
        const adContainer = document.getElementById('ad-container');
        if (!adContainer) return;

        const response = await fetch(ADS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            }
        });

        if (!response.ok) throw new Error('Failed to fetch ads');
        const ads = await response.json();

        if (ads.length === 0) {
            adContainer.innerHTML = '<p class="ad-text">No advertisements available</p>';
            return;
        }

        // Select random ad
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        
        // Display ad
        adContainer.innerHTML = `
            <div class="ad-content">
                <img src="${randomAd.imageUrl || '/api/placeholder/600/400'}" 
                     alt="${randomAd.title}" 
                     class="ad-image"
                     onerror="this.src='/api/placeholder/600/400'">
                <div class="ad-text">
                    <h2 class="ad-title">${randomAd.title}</h2>
                    <p class="ad-description">${randomAd.description}</p>
                </div>
            </div>
        `;

        // Show popup if user is logged in 
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail && Math.random() < 0.5) {
            showPopupAd(randomAd);
        }

    } catch (error) {
        console.error('Error displaying ad:', error);
        const adContainer = document.getElementById('ad-container');
        if (adContainer) {
            adContainer.innerHTML = '<p class="ad-text">Error loading advertisement</p>';
        }
    }
}

// Function to show popup ad
function showPopupAd(ad) {
    const popup = document.getElementById('ad-popup');
    const popupContent = document.getElementById('popup-content');
    const closeBtn = document.querySelector('.close-popup');

    if (!popup || !popupContent || !closeBtn) return;

    popupContent.innerHTML = `
        <img src="${ad.imageUrl || '/api/placeholder/600/400'}" 
             alt="${ad.title}" 
             style="width: 100%; border-radius: 4px; margin-bottom: 15px;">
        <h2>${ad.title}</h2>
        <p>${ad.description}</p>
    `;

    popup.style.display = 'block';

    closeBtn.onclick = () => popup.style.display = 'none';
    popup.onclick = (e) => {
        if (e.target === popup) popup.style.display = 'none';
    };
}

// Rotate ads every 30 seconds
function startAdRotation() {
    displayRandomAd();
    setInterval(displayRandomAd, 30000);
}

// ============= Ad Management Functions =============

// Handle image preview
function initImagePreview() {
    const imageInput = document.getElementById('adImage');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('imagePreview');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }
}

// Handle ad form submission
function initAdForm() {
    const adForm = document.getElementById('adForm');
    if (adForm) {
        adForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const imageFile = document.getElementById('adImage').files[0];
            if (!imageFile) {
                alert('Please select an image');
                return;
            }

            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const response = await fetch(ADS_URL, {
                        method: 'POST',
                        headers: {
                            'x-apikey': APIKEY,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            title: document.getElementById('adTitle').value,
                            description: document.getElementById('adDescription').value,
                            imageUrl: e.target.result,
                            duration: parseInt(document.getElementById('adDuration').value),
                            createdAt: new Date().toISOString(),
                            userEmail: localStorage.getItem('userEmail')
                        })
                    });

                    if (!response.ok) throw new Error('Failed to create advertisement');
                    
                    alert('Advertisement created successfully!');
                    loadUserAds();
                    adForm.reset();
                    document.getElementById('imagePreview').style.display = 'none';
                } catch (error) {
                    console.error('Error creating ad:', error);
                    alert('Failed to create advertisement');
                }
            };
            reader.readAsDataURL(imageFile);
        });
    }
}

// Load user's ads
async function loadUserAds() {
    const adsGrid = document.getElementById('ads-grid');
    if (!adsGrid) return;

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    try {
        const response = await fetch(
            `${ADS_URL}?q={"userEmail":"${userEmail}"}`,
            {
                headers: {
                    'x-apikey': APIKEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) throw new Error('Failed to fetch ads');
        
        const ads = await response.json();
        
        adsGrid.innerHTML = ads.map(ad => `
            <div class="ad-card">
                <img src="${ad.imageUrl}" alt="${ad.title}" 
                     onerror="this.src='/api/placeholder/300/200'">
                <div class="ad-card-content">
                    <h3>${ad.title}</h3>
                    <p>${ad.description}</p>
                    <p>Duration: ${ad.duration} days</p>
                    <p>Created: ${new Date(ad.createdAt).toLocaleDateString()}</p>
                    <button onclick="deleteAd('${ad._id}')" class="delete-btn">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading ads:', error);
        adsGrid.innerHTML = '<p>Error loading advertisements</p>';
    }
}

// Delete ad
async function deleteAd(adId) {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
        const response = await fetch(`${ADS_URL}/${adId}`, {
            method: 'DELETE',
            headers: {
                'x-apikey': APIKEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to delete ad');
        
        alert('Advertisement deleted successfully');
        loadUserAds();
    } catch (error) {
        console.error('Error deleting ad:', error);
        alert('Failed to delete advertisement');
    }
}

// Check user authentication
function checkAuth() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        alert('Please login to manage advertisements');
        window.location.href = 'home.html';
    }
}

// ============= Initialization =============
document.addEventListener('DOMContentLoaded', function() {
    // Home page initialization
    if (document.getElementById('ad-container')) {
        startAdRotation();
    }
    
    // Ad management page initialization
    if (document.getElementById('adForm')) {
        checkAuth();
        initImagePreview();
        initAdForm();
        loadUserAds();
        
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            const userDisplay = document.getElementById('userDisplay');
            if (userDisplay) {
                userDisplay.textContent = userEmail;
            }
        }
    }
});



// Add this to your ads.js
let hasShownLoginAd = false; // Track if we've shown the login ad

function checkLoginStatus() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail && !hasShownLoginAd) {
        // User is logged in and we haven't shown the ad yet
        displayLoginAd();
        hasShownLoginAd = true;
    }
}

async function displayLoginAd() {
    try {
        const response = await fetch(ADS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            }
        });

        if (!response.ok) throw new Error('Failed to fetch ads');
        const ads = await response.json();

        if (ads.length > 0) {
            // Select random ad from available ads
            const randomAd = ads[Math.floor(Math.random() * ads.length)];
            showPopupAd(randomAd);
        }
    } catch (error) {
        console.error('Error displaying login ad:', error);
    }
}

// In displayRandomAd function, add these logs
async function displayRandomAd() {
    try {
        const adContainer = document.getElementById('ad-container');
        if (!adContainer) {
            console.log('No ad container found on this page'); // Debug log
            return;
        }

        console.log('Found ad container, fetching ads...'); // Debug log
        const response = await fetch(ADS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            }
        });

        if (!response.ok) throw new Error('Failed to fetch ads');
        const ads = await response.json();
        console.log('Fetched ads:', ads); // Debug log

        if (ads.length === 0) {
            console.log('No ads available in database'); // Debug log
            adContainer.innerHTML = '<p class="ad-text">No advertisements available</p>';
            return;
        }

        // Rest of the code remains exactly the same...
    } catch (error) {
        console.error('Error displaying ad:', error);
        const adContainer = document.getElementById('ad-container');
        if (adContainer) {
            adContainer.innerHTML = '<p class="ad-text">Error loading advertisement</p>';
        }
    }
}

// In startAdRotation function, add a log
function startAdRotation() {
    console.log('Starting ad rotation...'); // Debug log
    displayRandomAd();
    setInterval(displayRandomAd, 30000);
}

// In initialization, add a log
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking for ad container...'); // Debug log
    // Home page initialization
    const adContainer = document.getElementById('ad-container');
    if (adContainer) {
        console.log('Found ad container, will start rotation'); // Debug log
        startAdRotation();
    }
    
    // Rest of the code remains exactly the same...
});











// Update the displayLoginAd function
async function displayLoginAd() {
    const userEmail = localStorage.getItem('userEmail'); // Add this line
    if (!userEmail) {
        console.log('No user email found');
        return;
    }

    try {
        const response = await fetch(ADS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            }
        });

        if (!response.ok) throw new Error('Failed to fetch ads');
        const ads = await response.json();

        if (ads.length > 0) {
            // Select random ad from available ads
            const randomAd = ads[Math.floor(Math.random() * ads.length)];
            showPopupAd(randomAd);
        }
    } catch (error) {
        console.error('Error displaying login ad:', error);
    }
}

// Update checkLoginStatus
function checkLoginStatus() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail && !hasShownLoginAd) {
        console.log('User logged in, displaying ad');
        displayLoginAd();
        hasShownLoginAd = true;
    } else {
        console.log('User not logged in or ad already shown');
    }
}


// Update initialization section
document.addEventListener('DOMContentLoaded', function() {
    // Home page initialization
    if (document.getElementById('ad-container')) {
        console.log('Starting ad rotation on home page');
        startAdRotation();
    }
    
    // Ad management page initialization
    if (document.getElementById('adForm')) {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            console.log('User not logged in, redirecting');
            alert('Please login to manage advertisements');
            window.location.href = 'home.html';
            return;
        }
        
        console.log('Initializing ad management page');
        initImagePreview();
        initAdForm();
        loadUserAds();
        
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = userEmail;
        }
    }
});