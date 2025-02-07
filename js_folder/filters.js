// filters.js
const APIKEY = "6787a92c77327a0a035a5437";
const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";

document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    loadDatabaseProducts(); // Initial load of all products
});

function initializeFilters() {
    // Initialize price display
    const priceInput = document.getElementById('price');
    const priceDisplay = document.getElementById('price-display');
    if (priceInput && priceDisplay) {
        priceInput.addEventListener('input', function() {
            priceDisplay.textContent = `Price: $0 - $${this.value}`;
        });
    }

    // Initialize category buttons
    const categoryButtons = document.querySelectorAll('.category-item');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Category clicked:', this.getAttribute('value'));
            
            // Remove active class from all category buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply filters
            applyAllFilters(this.getAttribute('value'));
        });
    });

    // Initialize condition select
    const conditionSelect = document.getElementById('condition');
    if (conditionSelect) {
        conditionSelect.addEventListener('change', function() {
            const activeCategory = document.querySelector('.category-item.active');
            const category = activeCategory ? activeCategory.getAttribute('value') : 'all';
            applyAllFilters(category);
        });
    }

    // Initialize price range
    if (priceInput) {
        priceInput.addEventListener('change', function() {
            const activeCategory = document.querySelector('.category-item.active');
            const category = activeCategory ? activeCategory.getAttribute('value') : 'all';
            applyAllFilters(category);
        });
    }
}

async function applyAllFilters(category) {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) loadingSpinner.style.display = 'block';

    try {
        const maxPrice = parseFloat(document.getElementById('price').value);
        const condition = document.getElementById('condition').value;
        const products = await fetchDatabaseProducts();

        const filteredProducts = products.filter(product => {
            const matchesCategory = category === 'all' || 
                                  (product.category && 
                                   product.category.toLowerCase() === category.toLowerCase());
            const matchesPrice = parseFloat(product.price) <= maxPrice;
            const matchesCondition = condition === 'all' || 
                                   product.condition === condition;

            return matchesCategory && matchesPrice && matchesCondition;
        });

        console.log('Filtered products:', filteredProducts.length);
        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error applying filters:', error);
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    if (products.length === 0) {
        productList.innerHTML = "<p class='no-products'>No products found</p>";
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

// Add styles for visual feedback
const style = document.createElement('style');
style.textContent = `
    .category-item {
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 10px 20px;
        border-radius: 5px;
        background: #f8f9fa;
        margin: 5px;
    }

    .category-item:hover {
        background-color: #e9ecef;
        transform: scale(1.02);
    }

    .category-item.active {
        background-color: #007bff;
        color: white;
    }

    .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 10px;
        padding: 15px;
    }

    .filters {
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .section-title {
        margin-bottom: 15px;
    }
`;
document.head.appendChild(style);