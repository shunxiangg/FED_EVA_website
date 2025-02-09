
// for nagigation 
function navigateTo(page) {
    if (page === 'voucher') {
        window.location.href = 'signup.html';
    }
    else if (page === 'rewards') {
        window.location.href = 'signup.html';
    }
    else if (page === 'deals') {
        window.location.href = 'signup.html';
    }
    else if (page === 'events') {
        window.location.href = 'signup.html';
    }
    else if (page === 'shipping') {
        window.location.href = 'signup.html';
    }
    else if (page === 'discounts') {
        // Check if on home page
        if (window.location.pathname.includes('index.html')) {
            // Scroll to discounts section
            const discountsSection = document.querySelector('.discounts');
            if (discountsSection) {
                discountsSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Redirect to home page and focus on discounts section
            window.location.href = 'home.html#discounts';
        }
    }
    else if (page === 'products') {
        window.location.href = 'signup.html';
    }
    else if (page === 'sell') {
        window.location.href = 'signup.html';
    }
    else {
        console.error('Unknown page:', page);
    }
}

// // page products display
// const APIKEY = "6787a92c77327a0a035a5437";
const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";

document.addEventListener('DOMContentLoaded', function() {
    loadDatabaseProducts();
    initializeFilters();
});
async function loadDatabaseProducts() {
    try {
        const dbProducts = await fetchDatabaseProducts();
        displayProducts(dbProducts);
        displayDiscountedProducts(dbProducts); // Call new function
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayDiscountedProducts(products) {
    const discountList = document.getElementById('discounts-list');
    if (!discountList) return;
    
    const discountedProducts = products.filter(product => 
        product.discountPercentage > 0 && 
        (!product.discountStartDate || new Date(product.discountStartDate) <= new Date()) &&
        (!product.discountEndDate || new Date(product.discountEndDate) >= new Date())
    );
    
    if (discountedProducts.length === 0) {
        discountList.innerHTML = "<p>No discounted products available.</p>";
        return;
    }
    
    discountList.innerHTML = discountedProducts.map(product => {
        const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
        return `
            <div class="listing-card">
                <div class="listing-image">
                    <img src="${product.imageData}" alt="${product.itemName}">
                </div>
                <div class="listing-details">
                    <h3>${product.itemName}</h3>
                    <p class="price">Original: <s>$${product.price}</s></p>
                    <p class="price">Now: $${discountedPrice}</p>
                    <p class="discount-badge">${product.discountPercentage}% OFF</p>
                   
                </div>
            </div>`;
    }).join('');
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
    const loadingSpinner = document.getElementById('loading-spinner');
 
    loadingSpinner.style.display = 'block';
    
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
        .catch(error => console.error('Error applying filters:', error))
        .finally(() => {
            loadingSpinner.style.display = 'none';
        });
 }





 function displayProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    if (products.length === 0) {
        productList.innerHTML = "<p class='no-products'>No products found.</p>";
        return;
    }

    productList.innerHTML = products.map(product => {
        // Calculate discounted price if discount is active
        let displayPrice = parseFloat(product.price);
        let priceDisplay = '';
        let discountBadge = '';

        // Check if discount is active
        if (product.discountPercentage && product.discountPercentage > 0) {
            const currentDate = new Date();
            const startDate = product.discountStartDate ? new Date(product.discountStartDate) : null;
            const endDate = product.discountEndDate ? new Date(product.discountEndDate) : null;

            const isDiscountActive = (!startDate || currentDate >= startDate) && 
                                     (!endDate || currentDate <= endDate);

            if (isDiscountActive) {
                const discountedPrice = displayPrice * (1 - product.discountPercentage / 100);
                displayPrice = discountedPrice;
                
                priceDisplay = `
                    <div class="product-price-container">
                        <span class="original-price">$${parseFloat(product.price).toFixed(2)}</span>
                        <span class="current-price">$${displayPrice.toFixed(2)}</span>
                        <span class="discount-badge">${product.discountPercentage}% OFF</span>
                    </div>
                `;
            } else {
                priceDisplay = `
                    <div class="product-price-container">
                        <span class="current-price">$${displayPrice.toFixed(2)}</span>
                    </div>
                `;
            }
        } else {
            priceDisplay = `
                <div class="product-price-container">
                    <span class="current-price">$${displayPrice.toFixed(2)}</span>
                </div>
            `;
        }

        return `
        <div class="product-card" onclick="window.location.href='signup.html?id=${product._id}'">
            <div class="product-image">
                ${product.imageData ? 
                    `<img src="${product.imageData}" alt="${product.itemName}" class="product-image">` :
                    '<div class="no-image">No Image Available</div>'
                }
            </div>
            <div class="product-details">
                <h3>${product.itemName}</h3>
                    <p class="seller-info">Seller: ${product.sellerName}</p>
                ${priceDisplay}
            </div>
        </div>
    `}).join('');
}



function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
 }
// event listener for enter key to search
document.addEventListener('DOMContentLoaded', function() {
    const navbarSearch = document.querySelector('.navbar input[type="text"]');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    navbarSearch.addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            const searchQuery = this.value.toLowerCase();
            loadingSpinner.style.display = 'block';
            
            try {
                const products = await fetchDatabaseProducts();
                const filteredProducts = products.filter(product => 
                    product.itemName.toLowerCase().includes(searchQuery) ||
                    product.description.toLowerCase().includes(searchQuery)
                );
                displayProducts(filteredProducts);
            } catch (error) {
                console.error('Error searching products:', error);
            } finally {
                loadingSpinner.style.display = 'none';
            }
        }
    });
  });