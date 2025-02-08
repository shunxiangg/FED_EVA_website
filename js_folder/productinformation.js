


const APIKEY = "6787a92c77327a0a035a5437";
const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";
let globalProduct;

function checkAuthentication() {
    const userEmail = localStorage.getItem('userEmail');
    return userEmail != null;
}

async function getProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        document.getElementById('product-details').innerHTML = 'Product not found';
        return;
    }

    try {
        const response = await fetch(`${DATABASE_URL}/${productId}`, {
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        globalProduct = await response.json();
        displayProductDetails(globalProduct);
        updateCartButton();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('product-details').innerHTML = 'Error loading product';
    }
}

function displayProductDetails(product) {
    const detailsHtml = `
        <div class="product-details-grid">
            <div class="product-image-large">
                ${product.imageData ?
                    `<img src="${product.imageData}" alt="${product.itemName}">` :
                    '<div class="no-image">No Image Available</div>'
                }
            </div>
            <div class="product-info">
                <h1>${product.itemName}</h1>
                <p class="price">$${product.price}</p>
                <p class="description">${product.description}</p>
                <div class="specs">
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Condition:</strong> ${product.condition}</p>
                    <p><strong>Seller:</strong> ${product.sellerName}</p>
                </div>
                <button onclick="addToCart('${product._id}')" class="add-to-cart-btn">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    document.getElementById('product-details').innerHTML = detailsHtml;
}

function addToCart(productId) {
    if (!checkAuthentication()) {
        localStorage.setItem('returnUrl', window.location.href);
        window.location.href = 'login.html';
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.find(item => item.id === productId)) {
        alert('This item is already in your cart');
        return;
    }

    cart.push({
        id: productId,
        quantity: 1,
        dateAdded: new Date().toISOString()
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartButton();
    alert('Product added to cart successfully');
}

function updateCartButton() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.length;
    }
}

async function startChatWithSeller() {
    if (!globalProduct) {
        console.error('No product selected');
        return;
    }

    const buyerEmail = localStorage.getItem('userEmail');
    
    if (!buyerEmail) {
        alert('Please log in to start a chat');
        localStorage.setItem('returnUrl', window.location.href);
        window.location.href = 'login.html';
        return;
    }

    if (buyerEmail === globalProduct.sellerEmail) {
        alert('You cannot chat about your own product');
        return;
    }

    try {
        const existingChatQuery = JSON.stringify({
            buyer: buyerEmail,
            seller: globalProduct.sellerEmail,
            productId: globalProduct._id
        });

        const existingChatResponse = await fetch(`https://evadatabase-f3b8.restdb.io/rest/chats?q=${existingChatQuery}`, {
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        });

        const existingChats = await existingChatResponse.json();
        let chatId;

        if (existingChats.length === 0) {
            const newChat = {
                buyer: buyerEmail,
                seller: globalProduct.sellerEmail,
                productId: globalProduct._id,
                productName: globalProduct.itemName,
                lastMessageTime: new Date().toISOString(),
                messages: []
            };

            const createChatResponse = await fetch(`https://evadatabase-f3b8.restdb.io/rest/chats`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY
                },
                body: JSON.stringify(newChat)
            });

            const createdChat = await createChatResponse.json();
            chatId = createdChat._id;
        } else {
            chatId = existingChats[0]._id;
        }

        window.location.href = `chat.html?chatId=${chatId}`;
    } catch (error) {
        console.error('Error starting chat:', error);
        alert('Failed to start chat. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getProductDetails();
    
    const messageSellerBtn = document.getElementById('messageSellerBtn');
    if (messageSellerBtn) {
        messageSellerBtn.addEventListener('click', startChatWithSeller);
    }

    const userName = localStorage.getItem('userName');
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userName && userDisplay) {
        userDisplay.textContent = `Hello, ${userName}`;
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
        }
    }
});


