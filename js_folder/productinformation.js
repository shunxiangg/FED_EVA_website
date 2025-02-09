const APIKEY = "6787a92c77327a0a035a5437";
const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";
let globalProduct;

// Check if user is authenticated
function checkAuthentication() {
    const userEmail = localStorage.getItem('userEmail');
    return !!userEmail;
}

// Calculate discounted price
function calculateDiscountedPrice(product) {
    const originalPrice = parseFloat(product.price);

    if (product.discountPercentage && product.discountPercentage > 0) {
        const currentDate = new Date();
        const startDate = product.discountStartDate ? new Date(product.discountStartDate) : null;
        const endDate = product.discountEndDate ? new Date(product.discountEndDate) : null;

        const isDiscountActive = (!startDate || currentDate >= startDate) &&
            (!endDate || currentDate <= endDate);

        if (isDiscountActive) {
            const discountedPrice = originalPrice * (1 - product.discountPercentage / 100);
            return {
                originalPrice,
                currentPrice: discountedPrice,
                discountPercentage: product.discountPercentage
            };
        }
    }

    return {
        originalPrice,
        currentPrice: originalPrice,
        discountPercentage: 0
    };
}

// Get product details from database
async function getProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.getElementById('product-details').innerHTML = 'Product not found';
        return;
    }

    localStorage.setItem('lastViewedProduct', productId);

    try {
        const response = await fetch(`${DATABASE_URL}/${productId}`, {
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        globalProduct = await response.json();
        displayProductDetails(globalProduct);
        updateCartCount(); // Updated to match cart.js naming
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('product-details').innerHTML = 'Error loading product';
    }
}

// Display product details on the page
function displayProductDetails(product) {
    const pricing = calculateDiscountedPrice(product);

    let priceHtml = '';
    if (pricing.discountPercentage > 0) {
        priceHtml = `
            <div class="price-container">
                <span class="original-price">$${pricing.originalPrice.toFixed(2)}</span>
                <span class="discounted-price">$${pricing.currentPrice.toFixed(2)}</span>
                <span class="discount-tag">${pricing.discountPercentage}% OFF</span>
            </div>
        `;
    } else {
        priceHtml = `
            <div class="price-container">
                <span class="current-price">$${pricing.currentPrice.toFixed(2)}</span>
            </div>
        `;
    }

    // Format category and condition with proper capitalization
    const formattedCategory = product.category.charAt(0).toUpperCase() + product.category.slice(1).toLowerCase();

    //handling for condition
    let formattedCondition;
    if (product.condition.toLowerCase() === 'brandnew') {
        formattedCondition = 'Brand New';
    }
    else if (product.condition.toLowerCase() === 'gentlyused') {
        formattedCondition = 'Gently Used';
    }
    else if (product.condition.toLowerCase() === 'likenew') {
        formattedCondition = 'Like New';
    }

    const detailsHtml = `
         <div class="product-details-grid">
             <div class="product-image-large">
                 <img src="${product.imageData || '/api/placeholder/600/400'}" 
                      alt="${product.itemName}"
                      onerror="this.src='/api/placeholder/600/400'">
             </div>
             <div class="product-info">
                 <h2>${product.itemName}</h2>
                 ${priceHtml}
                 <p class="description">${product.description || ''}</p>
                 <div class="specs">
                     <p><strong>Category:</strong> ${formattedCategory}</p>
                     <p><strong>Condition:</strong> ${formattedCondition}</p>
                     <p><strong>Seller:</strong> ${product.sellerName || 'Anonymous'}</p>
                    <p><strong>Available:</strong> ${product.quantity < 0 ? 0 : (product.quantity || 0)} items</p>
                     ${product.deliveryMethod ? `<p><strong>Delivery:</strong> ${product.deliveryMethod.charAt(0).toUpperCase() + product.deliveryMethod.slice(1)} ($${product.deliveryMethod === 'express' ? '5.00' : '4.50'})</p>` : ''}
                 </div>
                 <button onclick="addToCart('${product._id}')" class="add-to-cart-btn">
                     Add to Cart
                 </button>
             </div>
         </div>
     `;

    document.getElementById('product-details').innerHTML = detailsHtml;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    getProductDetails();

    // Display user name if logged in
    const userName = localStorage.getItem('userName');
    const userDisplay = document.getElementById('userDisplay');
    if (userName && userDisplay) {
        userDisplay.textContent = `Hello, ${userName}`;
    }
});

