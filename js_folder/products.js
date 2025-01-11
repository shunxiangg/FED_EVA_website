
// Sample products data
const products = [
    { name: "Laptop", category: "electronics", price: 800, condition: "new" },
    { name: "Sofa", category: "furniture", price: 1200, condition: "second-hand" },
    { name: "Smartphone", category: "electronics", price: 500, condition: "new" },
    { name: "Book - JavaScript", category: "books", price: 25, condition: "new" },
    { name: "T-Shirt", category: "clothing", price: 30, condition: "second-hand" },
    // Add more products as needed
  ];
  
  // Function to display products
  function displayProducts(filteredProducts) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear existing products
  
    if (filteredProducts.length === 0) {
      productList.innerHTML = "<p>No products found.</p>";
    }
  
    filteredProducts.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');
      productElement.innerHTML = `
        <h3>${product.name}</h3>
        <p>Category: ${product.category}</p>
        <p>Price: $${product.price}</p>
        <p>Condition: ${product.condition}</p>
      `;
      productList.appendChild(productElement);
    });
  }
  
  // Function to filter products based on selected category and price range
  function filterProducts() {
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const priceDisplay = document.getElementById('price-display');
  
    // Update price display text
    priceDisplay.textContent = `Price: $0 - $${price}`;
  
    // Filter products
    let filteredProducts = products.filter(product => {
      return (category === 'all' || product.category === category) && product.price <= price;
    });
  
    displayProducts(filteredProducts);
  }
  
  // Initial display of all products
  document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products); // Display all products initially
  });
  