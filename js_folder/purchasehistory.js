async function loadPurchaseHistory() {
    const APIKEY = "6787a92c77327a0a035a5437";
    const PURCHASES_URL = "https://evadatabase-f3b8.restdb.io/rest/purchases";
    const userEmail = localStorage.getItem('userEmail');

    // Get all data from database first
    const settings = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
        }
    };

    try {
        // Get user specific purchases
        const response = await fetch(
            `${PURCHASES_URL}?q={"userEmail":"${userEmail}"}`,
            settings
        );

        if (!response.ok) throw new Error('Failed to fetch purchases');
        const purchases = await response.json();

        const purchaseHistory = document.getElementById('purchase-history');
        if (purchases.length === 0) {
            purchaseHistory.innerHTML = '<p>No purchase history found.</p>';
            return;
        }

        // Display only purchases for current logged in user
        const userPurchases = purchases.filter(purchase => purchase.userEmail === userEmail);
        purchaseHistory.innerHTML = userPurchases.map(purchase => `
            <div class="purchase-card">
                <div class="purchase-header">
                    <div>
                        <h3>Order #${purchase._id.slice(-6)}</h3>
                        <p>${new Date(purchase.orderDate).toLocaleDateString()}</p>
                    </div>
                    <span class="purchase-status status-${purchase.status.toLowerCase()}">
                        ${purchase.status}
                    </span>
                </div>
                <div class="purchase-items">
                    ${purchase.items.map(item => `
                        <div class="purchase-item">
                            <span class="item-name">${item.itemName}</span>
                            <span class="item-quantity">Qty: ${item.quantity}</span>
                            <span class="item-price">$${item.price.toFixed(2)}</span>
                            <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="purchase-total">
                    Total: $${purchase.totalAmount.toFixed(2)}
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('purchase-history').innerHTML = 
            '<p>Error loading purchase history. Please try again later.</p>';
    }
}
//create purcahse adding to history
async function createPurchase(purchaseData) {
    const APIKEY = "6787a92c77327a0a035a5437";
    const PURCHASES_URL = "https://evadatabase-f3b8.restdb.io/rest/purchases";
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        console.error('User not logged in');
        return null;
    }

    const newPurchase = {
        ...purchaseData,
        userEmail: userEmail,
        orderDate: new Date().toISOString(),
        status: 'COMPLETED'
    };

    try {
        const response = await fetch(PURCHASES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': APIKEY
            },
            body: JSON.stringify(newPurchase)
        });

        if (!response.ok) throw new Error('Failed to create purchase');
        return await response.json();
    } catch (error) {
        console.error('Error creating purchase:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', loadPurchaseHistory);