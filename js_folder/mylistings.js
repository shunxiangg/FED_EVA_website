document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "6787a92c77327a0a035a5437";
    const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";

    function getUserListings() {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;

        const settings = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            }
        };

        fetch(DATABASE_URL, settings)
            .then(response => response.json())
            .then(listings => {
                // Filter listings for current user
                const userListings = listings.filter(listing => listing.sellerId === userEmail);
                console.log("User listings:", userListings); // Debug log
                displayUserListings(userListings);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function formatPrice(price) {
        // Remove any existing dollar signs
        const numericPrice = String(price).replace('$', '');
        // Add dollar sign and format
        return numericPrice ? `$${numericPrice}` : '$0';
    }

    function displayUserListings(listings) {
        const container = document.getElementById("my-listings");
        if (!container) return;

        if (listings.length === 0) {
            container.innerHTML = '<p>You haven\'t posted any listings yet.</p>';
            return;
        }

        let content = "";
        listings.forEach(listing => {
            console.log("Processing listing price:", listing.price); // Debug log
            const formattedPrice = formatPrice(listing.price);
            console.log("Formatted price:", formattedPrice); // Debug log

            content += `
                <div class="listing-card" id="${listing._id}">
                    <div class="listing-image">
                        ${listing.imageData ?
                    `<img src="${listing.imageData}" alt="${listing.itemName}">` :
                    '<div class="no-image">No Image</div>'
                }
                    </div>
                    <div class="listing-details">
                        <h3>${listing.itemName}</h3>
                        <h3>${formattedPrice}</h3>
                        <p class="category">Category: ${listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}</p>
                        <p class="condition">Condition: ${listing.condition === 'brandNew' ? 'Brand New' : listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}</p>
                        <p class="status">Status: ${listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}</p>
                        <div class="listing-actions">
                            <button onclick="editListing('${listing._id}')" class="edit-btn">Edit</button>
                            <button onclick="deleteListing('${listing._id}')" class="delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = content;
    }

    // Delete listing function
    window.deleteListing = function (id) {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        const settings = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            }
        };

        fetch(`${DATABASE_URL}/${id}`, settings)
            .then(response => response.json())
            .then(data => {
                alert('Listing deleted successfully!');
                getUserListings(); // Refresh listings
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to delete listing');
            });
    }


    // Initialize
    getUserListings();
});