// slideshow.js
class Slideshow {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.slideInterval = null;
        this.intervalDuration = 5000;
        console.log('Slideshow class initialized');
    }

    async init() {
        try {
            console.log('Initializing slideshow...');
            const slideContainer = document.getElementById('ad-slides');
            const dotsContainer = document.getElementById('slide-dots');
            
            if (!slideContainer || !dotsContainer) {
                console.error('Required containers not found:', {
                    slideContainer: !!slideContainer,
                    dotsContainer: !!dotsContainer
                });
                return;
            }

            console.log('Fetching ads from:', window.ADS_URL);
            const response = await fetch(window.ADS_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": window.APIKEY,
                    "Cache-Control": "no-cache"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch ads: ${response.status}`);
            }

            this.slides = await response.json();
            console.log('Fetched slides:', this.slides);

            if (this.slides.length === 0) {
                this.handleNoSlides();
                return;
            }

            this.renderSlides();
            this.startSlideshow();
        } catch (error) {
            console.error('Error in slideshow initialization:', error);
            this.handleError(error);
        }
    }

    handleNoSlides() {
        const slideContainer = document.getElementById('ad-slides');
        if (slideContainer) {
            slideContainer.innerHTML = '<p class="slide active">No advertisements available</p>';
        }
    }

    handleError(error) {
        const slideContainer = document.getElementById('ad-slides');
        if (slideContainer) {
            slideContainer.innerHTML = `<p class="slide active">Error loading advertisements: ${error.message}</p>`;
        }
    }

    renderSlides() {
        const slideContainer = document.getElementById('ad-slides');
        const dotsContainer = document.getElementById('slide-dots');
        
        if (!slideContainer || !dotsContainer) {
            console.log('Required containers not found');
            return;
        }

        // Generate slides HTML
        slideContainer.innerHTML = this.slides.map((ad, index) => `
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
        dotsContainer.innerHTML = this.slides.map((_, index) => `
            <span class="dot ${index === 0 ? 'active' : ''}" 
                  onclick="window.slideshow.goToSlide(${index})"></span>
        `).join('');

        console.log('Slides rendered');
    }

    showSlide(n) {
        if (!this.slides.length) return;
        
        this.currentSlide = (n + this.slides.length) % this.slides.length;

        const slides = document.getElementsByClassName('slide');
        const dots = document.getElementsByClassName('dot');

        Array.from(slides).forEach((slide, i) => {
            slide.classList.toggle('active', i === this.currentSlide);
        });

        Array.from(dots).forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
    }

    changeSlide(direction) {
        this.showSlide(this.currentSlide + direction);
        this.resetTimer();
    }

    goToSlide(n) {
        this.showSlide(n);
        this.resetTimer();
    }

    resetTimer() {
        clearInterval(this.slideInterval);
        this.slideInterval = setInterval(() => this.changeSlide(1), this.intervalDuration);
    }

    startSlideshow() {
        this.resetTimer();
    }
}

// Initialize slideshow
let slideshowInstance;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking for slideshow...');
    if (document.getElementById('ad-slides')) {
        console.log('Found ad-slides, initializing...');
        slideshowInstance = new Slideshow();
        slideshowInstance.init();
        
        // Expose functions globally
        window.slideshow = {
            changeSlide: (direction) => slideshowInstance.changeSlide(direction),
            goToSlide: (n) => slideshowInstance.goToSlide(n)
        };
    }
});