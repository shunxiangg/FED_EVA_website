// Constants
const APIKEY = "6787a92c77327a0a035a5437";
const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";

// Check authentication status
function checkAuthentication() {
    const userEmail = localStorage.getItem('userEmail');
    return userEmail != null;
}

// Main product details fetching function
async function getProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.getElementById('product-details').innerHTML = 'Product not found';
        return;
    }

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

        const product = await response.json();
        
        // Get seller details if needed
        if (!product.sellerEmail && product.userId) {
            const sellerDetails = await fetchSellerDetails(product.userId);
            if (sellerDetails) {
                product.sellerEmail = sellerDetails.email;
                product.sellerName = sellerDetails.name;
            }
        }

        displayProductDetails(product);
        setupMessageButton(product);
        updateCartButton();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('product-details').innerHTML = 'Error loading product';
    }
}

// Fetch seller details from accounts database
async function fetchSellerDetails(userId) {
    try {
        const response = await fetch(`https://evadatabase-f3b8.restdb.io/rest/accounts/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch seller details');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching seller details:', error);
        return null;
    }
}

// Display product details
function displayProductDetails(product) {
    const detailsHtml = `
        <div class="product-details-grid">
            <div class="product-image-large">
                ${product.imageData ?
                    `<img src="${product.imageData}" alt="${product.itemName}" class="product-image">` :
                    '<div class="no-image">No Image Available</div>'
                }
            </div>
            <div class="product-info">
                <h1 class="product-title">${product.itemName}</h1>
                <p class="price">$${product.price}</p>
                <p class="description">${product.description}</p>
                <div class="specs">
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Condition:</strong> ${product.condition}</p>
                    <p><strong>Seller:</strong> ${product.sellerName}</p>
                </div>
                <div class="product-actions">
                    <button onclick="addToCart('${product._id}')" class="add-to-cart-btn">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('product-details').innerHTML = detailsHtml;
}

// Setup message button functionality
function setupMessageButton(product) {
    const messageBtn = document.getElementById('messageSellerBtn');
    if (messageBtn) {
        messageBtn.addEventListener('click', () => {
            const currentUserEmail = localStorage.getItem('userEmail');
            
            if (!currentUserEmail) {
                // Save current page URL for return after login
                localStorage.setItem('returnUrl', window.location.href);
                window.location.href = 'login.html';
                return;
            }

            // Don't allow messaging yourself
            if (currentUserEmail === product.sellerEmail) {
                alert("This is your own product listing");
                return;
            }

            // Redirect to chat with seller
            window.location.href = `chat.html?seller=${encodeURIComponent(product.sellerEmail)}&product=${encodeURIComponent(product._id)}`;
        });
    }
}

// Cart functionality
function addToCart(productId) {
    if (!checkAuthentication()) {
        localStorage.setItem('returnUrl', window.location.href);
        window.location.href = 'login.html';
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        alert('This item is already in your cart');
        return;
    }

    // Add new product to cart
    cart.push({
        id: productId,
        quantity: 1,
        dateAdded: new Date().toISOString()
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartButton();
    
    // Show success message
    alert('Product added to cart successfully');
}

// Update cart count in UI
function updateCartButton() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.length;
    }
}

// Update back button functionality
function setupBackButton() {
    const backButton = document.querySelector('.back-button-main');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            const referrer = document.referrer;
            if (referrer && referrer.includes('browse.html')) {
                window.history.back();
            } else {
                window.location.href = 'browse.html';
            }
        });
    }
}

// Styles for the message button
const styles = `
    .message-seller-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--accent-color, #A19AD3);
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, background-color 0.2s;
        z-index: 1000;
    }

    .message-seller-btn:hover {
        transform: scale(1.1);
        background-color: var(--text-color, #2E2B41);
    }

    .message-seller-btn i {
        font-size: 24px;
    }

    .cart-toggle {
        position: fixed;
        bottom: 90px;
        right: 20px;
        background-color: var(--accent-color, #A19AD3);
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
        z-index: 1000;
    }

    .cart-toggle:hover {
        transform: scale(1.1);
        background-color: var(--text-color, #2E2B41);
    }

    .cart-count {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: #ff4444;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    getProductDetails();
    setupBackButton();
    updateCartButton();
    
    // Display user name if logged in
    const userName = localStorage.getItem('userName');
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userName && userDisplay) {
        userDisplay.textContent = `Hello, ${userName}`;
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
        }
    }
});

// Logout functionality
function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('cart');
    window.location.href = 'login.html';
}