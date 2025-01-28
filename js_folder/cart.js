
let cart = JSON.parse(localStorage.getItem('cart')) || [];

window.addToCart = async function(productId) {
    const APIKEY = "6787a92c77327a0a035a5437";
    const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";

    try {
        // Fetch product details
        const response = await fetch(`${DATABASE_URL}/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            }
        });

        if (!response.ok) throw new Error('Failed to fetch product');
        
        const product = await response.json();
        console.log('Product fetched:', product);

        // Add to cart
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: product.itemName,
                price: parseFloat(product.price),
                imageData: product.imageData,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        if (window.location.pathname.includes('cart.html')) {
            displayCart();
        }

        console.log('Cart updated:', cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
};

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    if (!cart.length) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        updateOrderSummary();
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.imageData}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="removeFromCart('${item.id}')" class="quantity-btn">-</button>
                <span>${item.quantity}</span>
                <button onclick="addToCart('${item.id}')" class="quantity-btn">+</button>
            </div>
        </div>
    `).join('');

    updateOrderSummary();
}

function updateOrderSummary() {
    const summary = document.querySelector('.cart-summary');
    if (!summary) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    summary.innerHTML = `
        <h2>Order Summary</h2>
        ${cart.map(item => `
            <div class="summary-item" data-id="${item.id}">
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('')}
        <div class="summary-item">
            <span>Shipping</span>
            <span>Free</span>
        </div>
        <div class="summary-item total">
            <span>Total</span>
            <span id="cart-total-amount">$${total.toFixed(2)}</span>
        </div>
        <button onclick="proceedToCheckout()" class="checkout-btn">
            <i class="fas fa-lock"></i> Proceed to Checkout
        </button>
    `;
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = itemCount;
    }
}

window.removeFromCart = function(productId) {
    const index = cart.findIndex(item => item.id === productId);
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

async function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const APIKEY = "6787a92c77327a0a035a5437";
    const ORDERS_URL = "https://evadatabase-f3b8.restdb.io/rest/purchases";

    try {
        // Create order object
        const order = {
            userId: localStorage.getItem('userEmail'),
            userName: localStorage.getItem('userName'),
            orderDate: new Date().toISOString(),
            items: cart,
            totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'pending'
        };

        // Save order to database
        const response = await fetch(ORDERS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': APIKEY,
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(order)
        });

        if (!response.ok) throw new Error('Failed to create order');

        alert('Order placed successfully!');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
        window.location.href = 'payment.html';

    } catch (error) {
        console.error('Error processing order:', error);
        alert('Failed to process order. Please try again.');
    }
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
});