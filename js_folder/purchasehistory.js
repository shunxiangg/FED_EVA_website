async function loadPurchaseHistory() {
    const APIKEY = "6787a92c77327a0a035a5437";
    const PURCHASES_URL = "https://evadatabase-f3b8.restdb.io/rest/purchases";
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        document.getElementById('purchase-history').innerHTML = '<p>Please login to view your purchase history.</p>';
        return;
    }
    try {
        const response = await fetch(
            `${PURCHASES_URL}?q={"userId":"${userEmail}"}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': APIKEY,
                    'Cache-Control': 'no-cache'
                }
            }
        );
  
        if (!response.ok) throw new Error('Failed to fetch purchases');
        const purchases = await response.json();
  
        const purchaseHistory = document.getElementById('purchase-history');
        if (purchases.length === 0) {
            purchaseHistory.innerHTML = '<p>No purchase history found.</p>';
            return;
        }
  
        purchaseHistory.innerHTML = purchases.map(purchase => `
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
        console.error('Error fetching purchases:', error);
        document.getElementById('purchase-history').innerHTML = 
            '<p>Error loading purchase history. Please try again later.</p>';
    }
  }
  document.addEventListener('DOMContentLoaded', loadPurchaseHistory);

  