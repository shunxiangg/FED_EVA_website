// // Filter functionality
// let currentFilters = {
//   category: 'all',
//   maxPrice: CONFIG.MAX_PRICE,
//   condition: 'all',
//   searchQuery: ''
// };

// function initializeFilters() {
//   // Set up price range
//   const priceInput = document.getElementById('price');
//   const priceDisplay = document.getElementById('price-display');
  
//   priceInput.addEventListener('input', (e) => {
//     const value = e.target.value;
//     priceDisplay.textContent = `Price: $0 - $${value}`;
//     currentFilters.maxPrice = Number(value);
//   });

//   // Set up search
//   const searchInput = document.getElementById('search');
//   searchInput.addEventListener('input', (e) => {
//     currentFilters.searchQuery = e.target.value.toLowerCase();
//   });

//   // Set up category filter
//   const categorySelect = document.getElementById('category');
//   categorySelect.addEventListener('change', (e) => {
//     currentFilters.category = e.target.value;
//   });

//   // Set up condition filter
//   const conditionSelect = document.getElementById('condition');
//   conditionSelect.addEventListener('change', (e) => {
//     currentFilters.condition = e.target.value;
//   });

//   // Apply filters button
//   document.getElementById('apply-filters').addEventListener('click', applyFilters);
// }

// function applyFilters() {
//   const filteredProducts = products.filter(product => {
//     const matchesCategory = currentFilters.category === 'all' || 
//     product.category === currentFilters.category;
//     const matchesPrice = product.price <= currentFilters.maxPrice;
//     const matchesCondition = currentFilters.condition === 'all' || 
//     product.condition === currentFilters.condition;
//     const matchesSearch = product.name.toLowerCase().includes(currentFilters.searchQuery);
    
//     return matchesCategory && matchesPrice && matchesCondition && matchesSearch;
//   });

//   displayProducts(filteredProducts);
// }