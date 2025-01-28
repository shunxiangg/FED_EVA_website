// Product display functionality
const APIKEY = "6787a92c77327a0a035a5437";
const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";

document.addEventListener('DOMContentLoaded', function() {
    // Load and display both local and database products
    loadAllProducts();
});

async function loadAllProducts() {
    try {
        // Get database products
        const dbProducts = await fetchDatabaseProducts();
        
        // Get local storage products
        const localProducts = products || []; 
        
        // Combine and display all products
        displayCombinedProducts(localProducts, dbProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        const productList = document.getElementById('product-list');
        if (productList) {
            productList.innerHTML = "<p class='no-products'>Error loading products.</p>";
        }
    }
}

async function fetchDatabaseProducts() {
    const settings = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
        }
    };

    const response = await fetch(DATABASE_URL, settings);
    return await response.json();
}

function displayCombinedProducts(localProducts, dbProducts) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    // Map database products to match local product structure
    const formattedDbProducts = dbProducts.map(dbProduct => ({
        id: dbProduct._id,
        image: dbProduct.imageData || 'path/to/default/image.jpg',
        name: dbProduct.itemName,
        description: dbProduct.description,
        category: dbProduct.category,
        condition: dbProduct.condition,
        price: dbProduct.price,
        isDbProduct: true // Flag to identify database products
    }));

    // Combine both arrays
    const allProducts = [...localProducts, ...formattedDbProducts];

    if (allProducts.length === 0) {
        productList.innerHTML = "<p class='no-products'>No products found.</p>";
        return;
    }

    productList.innerHTML = allProducts.map(product => `
        <div class="product-card">
            ${product.isDbProduct ? `
                <div class="product-image">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" class="product-image">` :
                        '<div class="no-image">No Image</div>'
                    }
                </div>
            ` : `
                <img src="${product.image}" alt="${product.name}" class="product-image">
            `}
            <div class="product-details">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-category">Category: ${product.category}</p>
                <p class="product-condition">Condition: ${product.condition}</p>
                <p class="product-price">$${product.price}</p>
                ${product.isDbProduct ? `
                    <button onclick="addDbItemToCart('${product.id}')" class="add-to-cart-btn">
                        Add to Cart
                    </button>
                ` : `
                    <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                        Add to Cart
                    </button>
                `}
            </div>
        </div>
    `).join('');
}

// Function to add database items to cart
window.addDbItemToCart = async function(dbProductId) {
    try {
        const settings = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            }
        };

        const response = await fetch(`${DATABASE_URL}/${dbProductId}`, settings);
        const dbProduct = await response.json();

        const cartItem = {
            id: dbProduct._id,
            name: dbProduct.itemName,
            price: parseFloat(dbProduct.price),
            image: dbProduct.imageData,
            quantity: 1,
            isDbProduct: true
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === dbProductId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        // alert('Item added to cart!');
    } catch (error) {
        console.error('Error adding item to cart:', error);
        // alert('Failed to add item to cart');
    }
}

// Filter functionality for combined products
function applyFilters() {
    const category = document.getElementById('category').value;
    const maxPrice = parseFloat(document.getElementById('price').value);
    const condition = document.getElementById('condition').value;
    const searchQuery = document.getElementById('search').value.toLowerCase();

    // Get local products
    const localProducts = products || [];
    
    // Fetch and filter database products
    fetchDatabaseProducts()
        .then(dbProducts => {
            const filteredLocalProducts = localProducts.filter(product => {
                return filterProduct(product, category, maxPrice, condition, searchQuery);
            });

            const filteredDbProducts = dbProducts.filter(product => {
                return filterProduct({
                    category: product.category,
                    price: parseFloat(product.price),
                    condition: product.condition,
                    name: product.itemName,
                    description: product.description
                }, category, maxPrice, condition, searchQuery);
            });

            displayCombinedProducts(filteredLocalProducts, filteredDbProducts);
        })
        .catch(error => {
            console.error('Error applying filters:', error);
        });
}

function filterProduct(product, category, maxPrice, condition, searchQuery) {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesPrice = product.price <= maxPrice;
    const matchesCondition = condition === 'all' || product.condition === condition;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery) ||
                         (product.description && product.description.toLowerCase().includes(searchQuery));
    
    return matchesCategory && matchesPrice && matchesCondition && matchesSearch;
}

// Initialize filter event listeners
document.addEventListener('DOMContentLoaded', function() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
});









// // display products from database without the local storage products handling
// // Browse page products display
// const APIKEY = "6787a92c77327a0a035a5437";
// const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";

// document.addEventListener('DOMContentLoaded', function() {
//     loadDatabaseProducts();
// });

// // Load products from database
// async function loadDatabaseProducts() {
//     try {
//         const dbProducts = await fetchDatabaseProducts();
//         displayProducts(dbProducts);
//     } catch (error) {
//         console.error('Error loading products:', error);
//         const productList = document.getElementById('product-list');
//         if (productList) {
//             productList.innerHTML = "<p class='no-products'>Error loading products.</p>";
//         }
//     }
// }

// // Fetch products from database
// async function fetchDatabaseProducts() {
//     const settings = {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "x-apikey": APIKEY,
//             "Cache-Control": "no-cache"
//         }
//     };

//     const response = await fetch(DATABASE_URL, settings);
//     return await response.json();
// }

// // Display products
// function displayProducts(products) {
//     const productList = document.getElementById('product-list');
//     if (!productList) return;

//     if (products.length === 0) {
//         productList.innerHTML = "<p class='no-products'>No products found.</p>";
//         return;
//     }

//     productList.innerHTML = products.map(product => `
//         <div class="product-card">
//             <div class="product-image">
//                 ${product.imageData ? 
//                     `<img src="${product.imageData}" alt="${product.itemName}" class="product-image">` :
//                     '<div class="no-image">No Image Available</div>'
//                 }
//             </div>
//             <div class="product-details">
//                 <h3>${product.itemName}</h3>
//                 <p class="product-description">${product.description}</p>
//                 <p class="product-category">Category: ${product.category}</p>
//                 <p class="product-condition">Condition: ${product.condition}</p>
//                 <p class="product-price">$${product.price}</p>
//                 <p class="seller-info">Seller: ${product.sellerName}</p>
//                 <button onclick="addToCart('${product._id}')" class="add-to-cart-btn">
//                     Add to Cart
//                 </button>
//             </div>
//         </div>
//     `).join('');
// }

// // Add to cart function
// async function addToCart(productId) {
//     try {
//         const settings = {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-apikey": APIKEY,
//                 "Cache-Control": "no-cache"
//             }
//         };

//         const response = await fetch(`${DATABASE_URL}/${productId}`, settings);
//         const product = await response.json();

//         const cartItem = {
//             id: product._id,
//             name: product.itemName,
//             price: parseFloat(product.price),
//             imageData: product.imageData,
//             quantity: 1
//         };

//         let cart = JSON.parse(localStorage.getItem('cart')) || [];
//         const existingItem = cart.find(item => item.id === productId);

//         if (existingItem) {
//             existingItem.quantity += 1;
//         } else {
//             cart.push(cartItem);
//         }

//         localStorage.setItem('cart', JSON.stringify(cart));
//         updateCartCount();
//     } catch (error) {
//         console.error('Error adding to cart:', error);
//     }
// }

// // Filter products
// function applyFilters() {
//     const category = document.getElementById('category').value;
//     const maxPrice = parseFloat(document.getElementById('price').value);
//     const condition = document.getElementById('condition').value;
//     const searchQuery = document.getElementById('search').value.toLowerCase();

//     fetchDatabaseProducts()
//         .then(products => {
//             const filteredProducts = products.filter(product => {
//                 const matchesCategory = category === 'all' || product.category === category;
//                 const matchesPrice = parseFloat(product.price) <= maxPrice;
//                 const matchesCondition = condition === 'all' || product.condition === condition;
//                 const matchesSearch = product.itemName.toLowerCase().includes(searchQuery) ||
//                                   product.description.toLowerCase().includes(searchQuery);
                
//                 return matchesCategory && matchesPrice && matchesCondition && matchesSearch;
//             });

//             displayProducts(filteredProducts);
//         })
//         .catch(error => {
//             console.error('Error applying filters:', error);
//         });
// }

// // Initialize filter event listeners
// document.addEventListener('DOMContentLoaded', function() {
//     const applyFiltersBtn = document.getElementById('apply-filters');
//     if (applyFiltersBtn) {
//         applyFiltersBtn.addEventListener('click', applyFilters);
//     }
// });