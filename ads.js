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
        if (userEmail && Math.random() < 0.9) {
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

function startAdRotation() {
    displayRandomAd();
    setInterval(displayRandomAd, 30000);
}


// Update the initialization code
document.addEventListener('DOMContentLoaded', function() {
    // Home page initialization
    if (document.getElementById('ad-slides')) {
        initializeSlideshow();  // Use this instead of startAdRotation
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


let currentSlide = 0;
let slides = [];
let slideInterval;

// Function to display slides
function showSlides(n) {
    const slideContainer = document.getElementById('ad-slides');
    if (!slideContainer) return;

    // Reset current slide if out of bounds
    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;
    else currentSlide = n;

    // Update slide visibility
    const slideElements = slideContainer.getElementsByClassName('slide');
    Array.from(slideElements).forEach(slide => {
        slide.classList.remove('active');
    });
    slideElements[currentSlide].classList.add('active');

    // Update dots
    const dots = document.getElementsByClassName('dot');
    Array.from(dots).forEach(dot => {
        dot.classList.remove('active');
    });
    dots[currentSlide].classList.add('active');
}

// Function to change slides
function changeSlide(direction) {
    showSlides(currentSlide + direction);
    resetSlideTimer();
}

// Function to go to a specific slide
function goToSlide(n) {
    showSlides(n);
    resetSlideTimer();
}

// Reset the automatic slide timer
function resetSlideTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => changeSlide(1), 5000);
}

// Initialize slideshow
async function initializeSlideshow() {
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
        slides = await response.json();

        if (slides.length === 0) {
            const slideContainer = document.getElementById('ad-slides');
            if (slideContainer) {
                slideContainer.innerHTML = '<p class="slide active">No advertisements available</p>';
            }
            return;
        }

        // Create slides
        const slideContainer = document.getElementById('ad-slides');
        const dotsContainer = document.getElementById('slide-dots');
        
        if (!slideContainer || !dotsContainer) return;

        // Generate slides HTML
        slideContainer.innerHTML = slides.map((ad, index) => `
            <div class="slide ${index === 0 ? 'active' : ''}">
                <img src="${ad.imageUrl || '/api/placeholder/600/400'}" 
                     alt="${ad.title}" 
                     class="slide-image"
                     onerror="this.src='/api/placeholder/600/400'">
                <div class="slide-content">
                    <h2 class="ad-title">${ad.title}</h2>
                    <p class="ad-description">${ad.description}</p>
                </div>
            </div>
        `).join('');

        // Generate navigation dots
        dotsContainer.innerHTML = slides.map((_, index) => `
            <span class="dot ${index === 0 ? 'active' : ''}" 
                  onclick="goToSlide(${index})"></span>
        `).join('');

        // Start automatic slideshow
        resetSlideTimer();

    } catch (error) {
        console.error('Error initializing slideshow:', error);
        const slideContainer = document.getElementById('ad-slides');
        if (slideContainer) {
            slideContainer.innerHTML = '<p class="slide active">Error loading advertisements</p>';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('ad-slides')) {
        initializeSlideshow();
    }
    
    // Rest of your existing DOMContentLoaded code...
});

function renderSlides() {
    const slideContainer = document.getElementById('ad-slides');
    const dotsContainer = document.getElementById('slide-dots');

    if (!slideContainer || !dotsContainer) {
        console.error("Slideshow containers not found!");
        return;
    }

    // Create slide elements
    slideContainer.innerHTML = slides
        .map(
            (ad, index) => `
            <div class="slide ${index === 0 ? "active" : ""}">
                <img src="${ad.imageUrl || "/api/placeholder/200/120"}" 
                     alt="${ad.title}" 
                     class="slide-image"
                     onerror="this.src='/api/placeholder/200/120'">
                <div class="slide-content">
                    <span class="special-tag">Special Offer</span>
                    <h2 class="ad-title">${ad.title}</h2>
                    <p class="ad-description">${ad.description}</p>
                </div>
            </div>
        `
        )
        .join("");

    // Create navigation dots
    dotsContainer.innerHTML = slides
        .map(
            (_, index) => `
            <span class="dot ${index === 0 ? "active" : ""}" onclick="goToSlide(${index})"></span>
        `
        )
        .join("");

    // Start automatic rotation
    resetSlideTimer();
}

// Update automatic slide rotation
function resetSlideTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlides(currentSlide);
    }, 3000); // Changed to 3 seconds for faster rotation
}