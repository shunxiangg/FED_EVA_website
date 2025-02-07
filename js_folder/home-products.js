// search filter products for home page

document.addEventListener('DOMContentLoaded', function() {
    loadDatabaseProducts();
    initializeCategoryFilters();
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

function initializeCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-item');
    if (categoryButtons.length === 0) return;

    // Set 'All' as active by default
    const allButton = document.querySelector('.category-item[value="all"]');
    if (allButton) {
        allButton.classList.add('active');
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', async function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('value');
            const loadingSpinner = document.getElementById('loading-spinner');
            if (loadingSpinner) loadingSpinner.style.display = 'block';

            try {
                const products = await fetchDatabaseProducts();
                let filteredProducts;

                if (category === 'all') {
                    filteredProducts = products;
                } else {
                    filteredProducts = products.filter(product => 
                        product.category && 
                        product.category.toLowerCase() === category.toLowerCase()
                    );
                }

                displayProducts(filteredProducts);
            } catch (error) {
                console.error('Error filtering products:', error);
            } finally {
                if (loadingSpinner) loadingSpinner.style.display = 'none';
            }
        });
    });
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    if (products.length === 0) {
        productList.innerHTML = "<p class='no-products'>No products found in this category</p>";
        return;
    }

    productList.innerHTML = products.map(product => `
        <div class="product-card" onclick="window.location.href='productInformation.html?id=${product._id}'">
            <div class="product-image">
                ${product.imageData ? 
                    `<img src="${product.imageData}" alt="${product.itemName}" class="product-image">` :
                    '<div class="no-image">No Image Available</div>'
                }
            </div>
            <div class="product-details">
                <h3>${product.itemName}</h3>
                <p class="product-description">${truncateText(product.description, 50)}</p>
                <p class="product-category">Category: ${product.category || 'Uncategorized'}</p>
                <p class="product-condition">Condition: ${product.condition || 'Not specified'}</p>
                <p class="product-price">$${product.price}</p>
                <p class="seller-info">Seller: ${product.sellerName || 'Anonymous'}</p>
                <button onclick="event.stopPropagation(); addToCart('${product._id}')" class="add-to-cart-btn">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}
