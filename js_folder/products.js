// Product display functionality
function displayProducts(productsToShow) {
    const productList = document.getElementById('product-list');
    
    if (productsToShow.length === 0) {
      productList.innerHTML = "<p class='no-products'>No products found.</p>";
      return;
    }
  
    productList.innerHTML = productsToShow.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-details">
          <h3>${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <p class="product-category">Category: ${product.category}</p>
          <p class="product-condition">Condition: ${product.condition}</p>
          <p class="product-price">$${product.price}</p>
          <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    `).join('');
  }