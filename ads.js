const APIKEY = "6787a92c77327a0a035a5437";
const ADS_URL = "https://evadatabase-f3b8.restdb.io/rest/advertisements";

// Slideshow functionality
let currentSlide = 0;
let slides = [];
let slideInterval;

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
            document.getElementById('ad-slides').innerHTML = '<p class="slide active">No advertisements available</p>';
            return;
        }

        renderSlides();
        resetSlideTimer();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('ad-slides').innerHTML = '<p class="slide active">Error loading advertisements</p>';
    }
}

// Render slides
function renderSlides() {
    const slideContainer = document.getElementById('ad-slides');
    const dotsContainer = document.getElementById('slide-dots');

    slideContainer.innerHTML = slides.map((ad, index) => `
        <div class="slide ${index === 0 ? 'active' : ''}">
            <img src="${ad.imageUrl || '/api/placeholder/600/120'}" 
                 alt="${ad.title}" 
                 class="slide-image"
                 onerror="this.src='/api/placeholder/600/120'">
            <div class="slide-content">
                <span class="special-tag">Special Offer</span>
                <h2 class="ad-title">${ad.title}</h2>
                <p class="ad-description">${ad.description}</p>
            </div>
        </div>
    `).join('');

    dotsContainer.innerHTML = slides.map((_, index) => `
        <span class="dot ${index === 0 ? 'active' : ''}" 
              onclick="goToSlide(${index})"></span>
    `).join('');
}

// Navigation functions
function showSlides(n) {
    if (!slides.length) return;
    currentSlide = (n + slides.length) % slides.length;
    
    document.querySelectorAll('.slide').forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    
    document.querySelectorAll('.slide')[currentSlide].classList.add('active');
    document.querySelectorAll('.dot')[currentSlide].classList.add('active');
}

function changeSlide(direction) {
    showSlides(currentSlide + direction);
    resetSlideTimer();
}

function goToSlide(n) {
    showSlides(n);
    resetSlideTimer();
}

function resetSlideTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => changeSlide(1), 3000);
}

// Ad Management Functions
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

// Load and display user's ads
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
                    <button onclick="deleteAd('${ad._id}')" class="delete-btn">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading ads:', error);
        adsGrid.innerHTML = '<p>Error loading advertisements</p>';
    }
}

// Delete an ad
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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // For homepage slideshow
    if (document.getElementById('ad-slides')) {
        initializeSlideshow();
    }
    
    // For ad management page
    if (document.getElementById('adForm')) {
        initImagePreview();
        initAdForm();
        loadUserAds();
    }
});