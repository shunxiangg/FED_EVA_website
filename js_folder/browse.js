// document.addEventListener("DOMContentLoaded", function () {
//     const APIKEY = "6787a92c77327a0a035a5437";
//     const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";

//     // Load listings when page loads
//     function loadListings() {
//         const productList = document.getElementById("product-list");
//         if (!productList) return;

//         const settings = {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-apikey": APIKEY,
//                 "Cache-Control": "no-cache"
//             }
//         };

//         fetch(DATABASE_URL, settings)
//             .then(response => response.json())
//             .then(listings => {
//                 displayListings(listings, productList);
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 productList.innerHTML = '<p>Error loading products</p>';
//             });
//     }

//     function displayListings(listings, container) {
//         if (listings.length === 0) {
//             container.innerHTML = "<p class='no-products'>No products found.</p>";
//             return;
//         }

//         container.innerHTML = listings.map(listing => `
//             <div class="product-card">
//                 <div class="product-image">
//                     ${listing.imageData ? 
//                         `<img src="${listing.imageData}" alt="${listing.itemName}">` :
//                         '<div class="no-image">No Image</div>'
//                     }
//                 </div>
//                 <div class="product-details">
//                     <h3>${listing.itemName}</h3>
//                     <p class="product-description">${listing.description}</p>
//                     <p class="product-price">$${listing.price}</p>
//                     <div class="product-info">
//                         <span class="category">Category: ${listing.category}</span>
//                         <span class="condition">Condition: ${listing.condition}</span>
//                         <span class="quantity">Available: ${listing.quantity}</span>
//                     </div>
//                     <div class="seller-info">
//                         <p>Seller: ${listing.sellerName}</p>
//                         <p>Delivery: ${listing.deliveryMethod || 'Contact seller'}</p>
//                     </div>
//                     <button onclick="addToCart('${listing._id}')" class="add-to-cart-btn">
//                         Add to Cart
//                     </button>
//                 </div>
//             </div>
//         `).join('');
//     }

//     // Filter functionality
//     function applyFilters() {
//         const category = document.getElementById('category').value;
//         const maxPrice = document.getElementById('price').value;
//         const condition = document.getElementById('condition').value;
//         const searchQuery = document.getElementById('search').value.toLowerCase();

//         const settings = {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-apikey": APIKEY,
//                 "Cache-Control": "no-cache"
//             }
//         };

//         fetch(DATABASE_URL, settings)
//             .then(response => response.json())
//             .then(listings => {
//                 const filteredListings = listings.filter(listing => {
//                     const matchesCategory = category === 'all' || listing.category === category;
//                     const matchesPrice = parseFloat(listing.price) <= parseFloat(maxPrice);
//                     const matchesCondition = condition === 'all' || listing.condition === condition;
//                     const matchesSearch = listing.itemName.toLowerCase().includes(searchQuery) ||
//                                        listing.description.toLowerCase().includes(searchQuery);
                    
//                     return matchesCategory && matchesPrice && matchesCondition && matchesSearch;
//                 });

//                 displayListings(filteredListings, document.getElementById('product-list'));
//             })
//             .catch(error => console.error('Error:', error));
//     }

//     // Initialize event listeners
//     const applyFiltersBtn = document.getElementById('apply-filters');
//     if (applyFiltersBtn) {
//         applyFiltersBtn.addEventListener('click', applyFilters);
//     }

//     // Add to cart functionality
//     window.addToCart = function(listingId) {
//         const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
//         // Get listing details from database
//         const settings = {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-apikey": APIKEY,
//                 "Cache-Control": "no-cache"
//             }
//         };

//         fetch(`${DATABASE_URL}/${listingId}`, settings)
//             .then(response => response.json())
//             .then(listing => {
//                 const cartItem = {
//                     id: listing._id,
//                     name: listing.itemName,
//                     price: parseFloat(listing.price),
//                     image: listing.imageData,
//                     quantity: 1
//                 };

//                 const existingItem = cart.find(item => item.id === listingId);
//                 if (existingItem) {
//                     existingItem.quantity += 1;
//                 } else {
//                     cart.push(cartItem);
//                 }

//                 localStorage.setItem('cart', JSON.stringify(cart));
//                 updateCartCount();
//                 alert('Item added to cart!');
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 alert('Failed to add item to cart');
//             });
//     }

//     // Load listings when page loads
//     loadListings();
// });