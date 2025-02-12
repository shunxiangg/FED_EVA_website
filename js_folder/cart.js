
let cart = [];

// Function to load cart from localStorage
function loadCart() {
    try {
        const storedCart = localStorage.getItem('cart');
        console.log('Stored cart raw value:', storedCart);

        if (storedCart === null || storedCart === 'undefined') {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            cart = JSON.parse(storedCart);
        }

        // Validate cart items and ensure they have all necessary properties
        cart = cart.filter(item =>
            item &&
            typeof item === 'object' &&
            item.id &&
            item.name &&
            typeof item.price === 'number'
        );

        console.log('Cart loaded:', cart);
        return cart;
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
    }
}


window.addToCart = async function (productId) {
    const APIKEY = "6787a92c77327a0a035a5437";
    const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";
    try {
        const response = await fetch(`${DATABASE_URL}/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        });

        if (!response.ok) throw new Error('Failed to fetch product');
        const product = await response.json();

        if (product.quantity === undefined || product.quantity === null) {
            throw new Error('Product quantity is undefined or null');
        }

        if (product.quantity <= 0) {
            showCustomAlert('This item is out of stock');
            return;
        }

        loadCart();
        const existingItem = cart.find(item => item.id === productId);

        // Use the product's delivery method and calculate cost
        const deliveryMethod = product.deliveryMethod || 'standard';
        let deliveryCost = 0;

        // Match the delivery method pricing from the sell page
        switch (deliveryMethod) {
            case 'standard':
                deliveryCost = 4.50;
                break;
            case 'express':
                deliveryCost = 5.00;
                break;
            default:
                deliveryCost = 0;
        }

        // Calculate discounted price if applicable
        let finalPrice = parseFloat(product.price);
        let discountInfo = null;

        // Check if discount is active
        if (product.discountPercentage && product.discountPercentage > 0) {
            const currentDate = new Date();
            const startDate = product.discountStartDate ? new Date(product.discountStartDate) : null;
            const endDate = product.discountEndDate ? new Date(product.discountEndDate) : null;

            const isDiscountActive = (!startDate || currentDate >= startDate) &&
                (!endDate || currentDate <= endDate);

            if (isDiscountActive) {
                finalPrice = finalPrice * (1 - product.discountPercentage / 100);
                discountInfo = {
                    originalPrice: parseFloat(product.price),
                    discountPercentage: product.discountPercentage
                };
            }
        }

        if (existingItem) {
            if (existingItem.quantity >= product.quantity) {
                showCustomAlert(`Cannot add more - only ${product.quantity} items available`);
                return;
            }
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: product.itemName,
                price: finalPrice,
                originalPrice: parseFloat(product.price),
                imageData: product.imageData,
                quantity: 1,
                maxQuantity: product.quantity,
                deliveryMethod: deliveryMethod,
                deliveryCost: deliveryCost,
                discountInfo: discountInfo
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        if (window.location.pathname.includes('cart.html')) {
            displayCart();
        }

        showCustomAlert('Product added to cart successfully!');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showCustomAlert(`Error: ${error.message}`);
    }
};

// -------------------styles for the discount section --------------------
const style = document.createElement('style');
style.textContent = `
.discount-section {
    padding: 2rem;
    margin-top: 2rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.discount-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.listing-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
}

.listing-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.listing-image {
    height: 200px;
    background-color: #f5f5f5;
    position: relative;
}

.listing-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.listing-details {
    padding: 1rem;
}

.listing-details h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
}

.listing-details p {
    margin: 0.25rem 0;
    color: #666;
}

.price {
    font-weight: bold;
    color: #2c5282;
}

.discount-badge {
    background-color: #f56565;
    color: white;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    display: inline-block;
    font-size: 0.9rem;
}
`;
document.head.appendChild(style);






// Function to display cart items
function displayCart() {
    loadCart();

    const cartItems = document.getElementById('cart-items');
    if (!cartItems) {
        console.log('Cart items container not found');
        return;
    }

    if (!cart || cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        updateOrderSummary();
        return;
    }

    console.log('Displaying cart items:', cart);

    // Clear previous cart items and add new ones
    cartItems.innerHTML = cart.map(item => {
        // Add additional error checking
        if (!item || typeof item !== 'object') {
            console.warn('Invalid cart item:', item);
            return '';
        }

        // Prepare price display with potential discount
        let priceDisplay = `$${(item.price || 0).toFixed(2)}`;
        let discountBadge = '';
        let originalPriceDisplay = '';

        if (item.discountInfo) {
            originalPriceDisplay = `<p class="original-price"><s>$${item.originalPrice.toFixed(2)}</s></p>`;
            priceDisplay = `$${(item.price || 0).toFixed(2)}`;
        }

        return `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image-container">
                <img src="${item.imageData || ''}" alt="${item.name || 'Product'}" class="cart-item-image">
                ${discountBadge}
            </div>
            <div class="cart-item-details">
                <h3>${item.name || 'Unknown Product'}</h3>
                ${originalPriceDisplay}
                <p>${priceDisplay} x ${item.quantity || 1}</p>
                <p>Seller: ${item.sellerName || 'Unknown Seller'}</p>
                <p>Available Inventory: ${item.maxQuantity || 0}</p>
                <p>Delivery: ${item.deliveryMethod || 'Standard'} ($${(item.deliveryCost || 0).toFixed(2)})</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="removeFromCart('${item.id}')" class="quantity-btn">-</button>
                <span>${item.quantity || 1}</span>
                <button onclick="addToCart('${item.id}')" class="quantity-btn">+</button>
            </div>
        </div>
    `}).join('');

    updateOrderSummary();
}

function updateOrderSummary() {
    const summary = document.querySelector('.cart-summary');
    if (!summary) return;

    // Calculate subtotal and delivery fees with error checking
    const subtotal = cart.reduce((sum, item) => {
        if (item && typeof item.price === 'number' && typeof item.quantity === 'number') {
            return sum + (item.price * item.quantity);
        }
        return sum;
    }, 0);

    const deliveryTotal = cart.reduce((sum, item) => {
        if (item && typeof item.deliveryCost === 'number' && typeof item.quantity === 'number') {
            return sum + (item.deliveryCost * item.quantity);
        }
        return sum;
    }, 0);

    const total = subtotal + deliveryTotal;

    summary.innerHTML = `
        <h2>Order Summary</h2>
        ${cart.map(item => {
        // Prepare item price display with potential discount
        const itemTotal = item.price * item.quantity;
        let priceDisplay = `$${itemTotal.toFixed(2)}`;
        let originalPriceDisplay = '';
        let discountBadge = '';

        if (item.discountInfo) {
            const originalItemTotal = item.originalPrice * item.quantity;
            originalPriceDisplay = `<span class="original-price"><s>$${originalItemTotal.toFixed(2)}</s></span>`;
            discountBadge = `<span class="discount-badge">${item.discountInfo.discountPercentage}% OFF</span>`;
            priceDisplay = `$${itemTotal.toFixed(2)}`;
        }

        return `
            <div class="summary-item" data-id="${item.id}">
                <div class="item-info">
                    <span>${item.name} (x${item.quantity})</span>
                    ${originalPriceDisplay}
                    <span>${priceDisplay} ${discountBadge}</span>
                </div>
                <div class="delivery-info">
                    <span>${item.deliveryMethod} Delivery</span>
                    <span>$${(item.deliveryCost * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        `}).join('')}
        <div class="summary-totals">
            <div class="subtotal">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="delivery-total">
                <span>Delivery Total</span>
                <span>$${deliveryTotal.toFixed(2)}</span>
            </div>
            <div class="total">
                <span>Total</span>
                <span id="cart-total-amount">$${total.toFixed(2)}</span>
            </div>
        </div>
        <button onclick="proceedToCheckout()" class="checkout-btn">
            <i class="fas fa-lock"></i> Proceed to Checkout
        </button>
    `;
}





function updateOrderSummary() {
    const summary = document.querySelector('.cart-summary');
    if (!summary) return;

    // Calculate subtotal and delivery fees with error checking
    const subtotal = cart.reduce((sum, item) => {
        if (item && typeof item.price === 'number' && typeof item.quantity === 'number') {
            return sum + (item.price * item.quantity);
        }
        return sum;
    }, 0);

    const deliveryTotal = cart.reduce((sum, item) => {
        if (item && typeof item.deliveryCost === 'number' && typeof item.quantity === 'number') {
            return sum + (item.deliveryCost * item.quantity);
        }
        return sum;
    }, 0);

    const total = subtotal + deliveryTotal;

    summary.innerHTML = `
        <h2>Order Summary</h2>
        ${cart.map(item => `
            <div class="summary-item" data-id="${item.id}">
                <div class="item-info">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div class="delivery-info">
                    <span>${item.deliveryMethod} Delivery</span>
                    <span>$${(item.deliveryCost * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        `).join('')}
        <div class="summary-totals">
            <div class="subtotal">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="delivery-total">
                <span>Delivery Total</span>
                <span>$${deliveryTotal.toFixed(2)}</span>
            </div>
            <div class="total">
                <span>Total</span>
                <span id="cart-total-amount">$${total.toFixed(2)}</span>
            </div>
        </div>
        <button onclick="proceedToCheckout()" class="checkout-btn">
            <i class="fas fa-lock"></i> Proceed to Checkout
        </button>
    `;
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const itemCount = cart.reduce((sum, item) => {
            // Ensure item is valid and has quantity
            if (item && typeof item.quantity === 'number') {
                return sum + item.quantity;
            }
            return sum;
        }, 0);
        cartCount.textContent = itemCount;
    }
}

window.removeFromCart = function (productId) {
    const index = cart.findIndex(item => item && item.id === productId);
    if (index > -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
    }
};

window.proceedToCheckout = async function () {
    if (!cart || cart.length === 0) {
        showCustomAlert('Your cart is empty!');
        return;
    }

    const APIKEY = "6787a92c77327a0a035a5437";
    const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";
    const PURCHASES_URL = "https://evadatabase-f3b8.restdb.io/rest/purchases";
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        showCustomAlert('Please login to checkout');
        return;
    }

    try {
        // First, check and update product quantities
        for (const item of cart) {
            // Skip invalid items
            if (!item || !item.id) continue;

            // Fetch the current product to get its latest quantity
            const productResponse = await fetch(`${DATABASE_URL}/${item.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                    "Cache-Control": "no-cache"
                }
            });

            if (!productResponse.ok) throw new Error(`Failed to fetch product ${item.id}`);

            const product = await productResponse.json();

            // Calculate new quantity
            const newQuantity = (product.quantity || 0) - item.quantity;

            // If quantity becomes zero or negative, delete the product
            if (newQuantity <= 0) {
                // Delete the product
                const deleteResponse = await fetch(`${DATABASE_URL}/${item.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": APIKEY,
                        "Cache-Control": "no-cache"
                    }
                });

                if (!deleteResponse.ok) throw new Error(`Failed to delete product ${item.id}`);
            } else {
                // Update the product quantity
                const updateResponse = await fetch(`${DATABASE_URL}/${item.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": APIKEY,
                        "Cache-Control": "no-cache"
                    },
                    body: JSON.stringify({
                        ...product,
                        quantity: newQuantity
                    })
                });

                if (!updateResponse.ok) throw new Error(`Failed to update product ${item.id}`);
            }
        }

        // Create purchase record
        const purchase = {
            userEmail: userEmail,
            items: cart.map(item => ({
                itemName: item.name,
                quantity: item.quantity,
                price: item.price,
                itemId: item.id
            })),
            totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            orderDate: new Date().toISOString(),
            status: 'COMPLETED'
        };

        const response = await fetch(PURCHASES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': APIKEY,
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(purchase)
        });

        if (!response.ok) throw new Error('Failed to create purchase');

        const popup = document.getElementById('success-popup');
        popup.style.display = 'flex';

        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));

        setTimeout(() => {
            window.location.href = 'browse.html';
        }, 1000);

    } catch (error) {
        console.error('Error processing purchase:', error);
        showCustomAlert('Failed to process purchase. Please try again.');
    }
}

// Initializing cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
});

function showCustomAlert(message) {
    // Create modal elements
    const alertModal = document.createElement('div');
    alertModal.className = 'custom-alert-modal';

    const alertContent = document.createElement('div');
    alertContent.className = 'custom-alert-content';

    const messageText = document.createElement('p');
    messageText.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'OK';
    closeButton.onclick = () => alertModal.remove();

    alertContent.appendChild(messageText);
    alertContent.appendChild(closeButton);
    alertModal.appendChild(alertContent);
    document.body.appendChild(alertModal);
}

const styles = `
.custom-alert-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.custom-alert-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    max-width: 300px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.custom-alert-content button {
    margin-top: 15px;
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    background: #007bff;
    color: white;
    cursor: pointer;
}

.custom-alert-content button:hover {
    background: #0056b3;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);