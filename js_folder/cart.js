// cart.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = itemCount;
    }
}

function toggleCart() {
    window.location.href = 'cart.html';
}

function displayCart() {
  const cartItems = document.getElementById('cart-items');
  
  if (!cartItems) return;

  // Handle empty cart
  if (!cart.length) {
      cartItems.innerHTML = '<p>Your cart is empty</p>';
      document.querySelector('.cart-summary').innerHTML = `
          <h2>Order Summary</h2>
          <div class="summary-item">
              <span>Total</span>
              <span>$0.00</span>
          </div>
          <button onclick="proceedToCheckout()" class="checkout-btn" disabled>
              <i class="fas fa-lock"></i> Proceed to Checkout
          </button>
      `;
      return;
  }

  // Display cart items
  cartItems.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
              <h3>${item.name}</h3>
              <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
          </div>
          <div class="cart-item-controls">
              <button onclick="removeFromCart(${item.id})" class="quantity-btn">-</button>
              <span>${item.quantity}</span>
              <button onclick="addToCart(${item.id})" class="quantity-btn">+</button>
          </div>
      </div>
  `).join('');

  // Update order summary
  let subtotalHTML = '<h2>Order Summary</h2>';
  
  // Only show items with quantity > 0
  cart.filter(item => item.quantity > 0).forEach(item => {
      subtotalHTML += `
          <div class="summary-item" data-id="${item.id}">
              <span>${item.name} (x${item.quantity})</span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
      `;
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  subtotalHTML += `
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

  document.querySelector('.cart-summary').innerHTML = subtotalHTML;
}





function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    // Add checkout logic here
    alert('Processing your order...');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
});