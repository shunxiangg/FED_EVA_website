// Browse page products display
const APIKEY = "6787a92c77327a0a035a5437";
const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";

document.addEventListener('DOMContentLoaded', function() {
    loadDatabaseProducts();
    initializeFilters();
});

async function loadDatabaseProducts() {
    try {
        const dbProducts = await fetchDatabaseProducts();
        displayProducts(dbProducts);
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

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    if (products.length === 0) {
        productList.innerHTML = "<p class='no-products'>No products found.</p>";
        return;
    }

    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                     ${product.imageData ? 
                    `<img src="${product.imageData}" alt="${product.itemName}" class="product-image">` :
                    '<div class="no-image">No Image Available</div>'
                }
            </div>
            <div class="product-details">
                <h3>${product.itemName}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-category">Category: ${product.category}</p>
                <p class="product-condition">Condition: ${product.condition}</p>
                <p class="product-price">$${product.price}</p>
                <p class="seller-info">Seller: ${product.sellerName}</p>
                <button onclick="addToCart('${product._id}')" class="add-to-cart-btn">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function initializeFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    // Initialize price display
    const priceInput = document.getElementById('price');
    const priceDisplay = document.getElementById('price-display');
    if (priceInput && priceDisplay) {
        priceInput.addEventListener('input', function() {
            priceDisplay.textContent = `Price: $0 - $${this.value}`;
        });
    }
}

function applyFilters() {
    const category = document.getElementById('category').value;
    const maxPrice = parseFloat(document.getElementById('price').value);
    const condition = document.getElementById('condition').value;
    const searchQuery = document.getElementById('search').value.toLowerCase();

    fetchDatabaseProducts()
        .then(products => {
            const filteredProducts = products.filter(product => {
                const matchesCategory = category === 'all' || product.category === category;
                const matchesPrice = parseFloat(product.price) <= maxPrice;
                const matchesCondition = condition === 'all' || product.condition === condition;
                const matchesSearch = product.itemName.toLowerCase().includes(searchQuery) ||
                                  product.description.toLowerCase().includes(searchQuery);
                
                return matchesCategory && matchesPrice && matchesCondition && matchesSearch;
            });

            displayProducts(filteredProducts);
        })
        .catch(error => console.error('Error applying filters:', error));
}