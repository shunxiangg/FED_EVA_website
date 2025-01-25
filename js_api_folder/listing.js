// listings.js
const APIKEY = "6787a92c77327a0a035a5437";

document.getElementById('listing-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const listing = {
        sellerId: localStorage.getItem('userEmail'),
        sellerName: localStorage.getItem('userName'),
        itemName: document.getElementById('item-name').value,
        price: document.getElementById('item-price').value,
        category: document.getElementById('item-category').value,
        description: document.getElementById('item-description').value,
        status: 'available',
        datePosted: new Date().toISOString()
    };

    try {
        const response = await fetch("https://evadatabase-f3b8.restdb.io/rest/listings", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': APIKEY
            },
            body: JSON.stringify(listing)
        });

        if (response.ok) {
            alert('Item listed successfully!');
            window.location.href = 'browse.html';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to list item');
    }
});

// loads user's listing
async function loadUserListings() {
    const userEmail = localStorage.getItem('userEmail');
    
    try {
        const response = await fetch(
            `https://evadatabase-f3b8.restdb.io/rest/listings?q={"sellerId":"${userEmail}"}`,
            {
                headers: {
                    'x-apikey': APIKEY
                }
            }
        );
        const listings = await response.json();
        // shows listings in profile page
        displayListings(listings);
    } catch (error) {
        console.error('Error:', error);
    }
}