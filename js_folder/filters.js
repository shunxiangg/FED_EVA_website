// filters.js
const APIKEY = "6787a92c77327a0a035a5437";
const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";

document.addEventListener('DOMContentLoaded', function () {
    initializeFilters();
    loadDatabaseProducts(); // Initial load of all products
});

function initializeFilters() {
    // Initialize price display
    const priceInput = document.getElementById('price');
    const priceDisplay = document.getElementById('price-display');
    if (priceInput && priceDisplay) {
        priceInput.addEventListener('input', function () {
            priceDisplay.textContent = `Price: $0 - $${this.value}`;
        });
    }

    // Initialize category buttons
    const categoryButtons = document.querySelectorAll('.category-item');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
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
        conditionSelect.addEventListener('change', function () {
            const activeCategory = document.querySelector('.category-item.active');
            const category = activeCategory ? activeCategory.getAttribute('value') : 'all';
            applyAllFilters(category);
        });
    }

    // Initialize price range
    if (priceInput) {
        priceInput.addEventListener('change', function () {
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


// Update initializeFilters function in filters.js
function initializeFilters() {
    // Existing price display initialization
    const priceInput = document.getElementById('price');
    const priceDisplay = document.getElementById('price-display');
    if (priceInput && priceDisplay) {
        priceInput.addEventListener('input', function () {
            priceDisplay.textContent = `Price: $0 - $${this.value}`;
        });
    }

    // Add discount filter checkbox
    const discountFilterCheckbox = document.createElement('input');
    discountFilterCheckbox.type = 'checkbox';
    discountFilterCheckbox.id = 'discount-filter';

    const discountFilterLabel = document.createElement('label');
    discountFilterLabel.htmlFor = 'discount-filter';
    discountFilterLabel.textContent = 'Show Discounted Items Only';

    const filtersContainer = document.querySelector('.filters');
    if (filtersContainer) {
        const discountFilterContainer = document.createElement('div');
        discountFilterContainer.className = 'discount-filter-container';
        discountFilterContainer.appendChild(discountFilterCheckbox);
        discountFilterContainer.appendChild(discountFilterLabel);
        filtersContainer.appendChild(discountFilterContainer);

        // Add event listener for discount filter
        discountFilterCheckbox.addEventListener('change', applyAllFilters);
    }
}

// Modify applyAllFilters function
async function applyAllFilters() {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) loadingSpinner.style.display = 'block';

    try {
        const maxPrice = parseFloat(document.getElementById('price').value);
        const condition = document.getElementById('condition').value;
        const discountFilter = document.getElementById('discount-filter').checked;
        const activeCategory = document.querySelector('.category-item.active');
        const category = activeCategory ? activeCategory.getAttribute('value') : 'all';

        const products = await fetchDatabaseProducts();

        const filteredProducts = products.filter(product => {
            const matchesCategory = category === 'all' ||
                (product.category &&
                    product.category.toLowerCase() === category.toLowerCase());
            const matchesPrice = parseFloat(product.price) <= maxPrice;
            const matchesCondition = condition === 'all' ||
                product.condition === condition;

            // Discount filter logic
            const hasDiscount = product.discountPercentage &&
                product.discountPercentage > 0 &&
                (!product.discountStartDate || new Date(product.discountStartDate) <= new Date()) &&
                (!product.discountEndDate || new Date(product.discountEndDate) >= new Date());

            const matchesDiscountFilter = !discountFilter || hasDiscount;

            return matchesCategory &&
                matchesPrice &&
                matchesCondition &&
                matchesDiscountFilter;
        });

        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error applying filters:', error);
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// Modify displayProducts to show discount information
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    if (products.length === 0) {
        productList.innerHTML = "<p class='no-products'>No products found</p>";
        return;
    }

    productList.innerHTML = products.map(product => {
        // Calculate discounted price if discount exists
        const hasDiscount = product.discountPercentage &&
            product.discountPercentage > 0 &&
            (!product.discountStartDate || new Date(product.discountStartDate) <= new Date()) &&
            (!product.discountEndDate || new Date(product.discountEndDate) >= new Date());

        const originalPrice = parseFloat(product.price);
        let displayPrice = originalPrice;
        let discountInfo = '';

        if (hasDiscount) {
            const discountPercentage = product.discountPercentage;
            displayPrice = originalPrice * (1 - discountPercentage / 100);
            discountInfo = `
                <div class="discount-badge">
                    <span class="discount-percentage">${discountPercentage}% OFF</span>
                    <span class="original-price">$${originalPrice.toFixed(2)}</span>
                </div>
            `;
        }

        return `
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
                <div class="price-container">
                    <p class="product-price">$${displayPrice.toFixed(2)}</p>
                    ${discountInfo}
                </div>
                <p class="seller-info">Seller: ${product.sellerName || 'Anonymous'}</p>
                <button onclick="event.stopPropagation(); addToCart('${product._id}')" class="add-to-cart-btn">
                    Add to Cart
                </button>
            </div>
        </div>
    `}).join('');
}

// Add styles for discount display
const discountStyles = document.createElement('style');
discountStyles.textContent = `
.discount-badge {
    display: flex;
    align-items: center;
    margin-top: 5px;
}

.discount-percentage {
    background-color: #e44;
    color: white;
    padding: 2px 5px;
    border-radius: 4px;
    margin-right: 10px;
    font-size: 0.8em;
}

.original-price {
    text-decoration: line-through;
    color: #888;
    font-size: 0.9em;
}

.price-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.discount-filter-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}
`;
document.head.appendChild(discountStyles);