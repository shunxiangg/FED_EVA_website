document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "6787a92c77327a0a035a5437";
  const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";

  // Initialize image upload preview for new listing
  const photoUpload = document.getElementById('photoUpload');
  if (photoUpload) {
    photoUpload.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const uploadBox = document.querySelector('.upload-box');
          uploadBox.style.backgroundImage = `url(${e.target.result})`;
          uploadBox.querySelector('span').style.display = 'none';
        }
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  // Initialize image upload preview for editing listing
  const editPhotoUpload = document.getElementById('editPhotoUpload');
  if (editPhotoUpload) {
    editPhotoUpload.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const uploadBox = document.querySelector('#editListingModal .upload-box');
          uploadBox.style.backgroundImage = `url(${e.target.result})`;
          uploadBox.querySelector('span').style.display = 'none';
        }
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  // Create new listing
  const sellForm = document.getElementById("sellForm");
  if (sellForm) {
    sellForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Comprehensive data collection
      const listingData = {
        "sellerId": localStorage.getItem('userEmail') || 'unknown',
        "sellerName": localStorage.getItem('userName') || 'Anonymous',
        "sellerEmail": localStorage.getItem('userEmail') || '',
        "imageData": null,
        "videoLink": document.querySelector('.video-link input')?.value || '',
        "category": document.querySelector('.category-group select')?.value || 'uncategorized',
        "condition": document.querySelector('input[name="condition"]:checked')?.id || 'unknown',
        "itemName": document.querySelector('input[placeholder="Item Name"]')?.value || 'Unnamed Item',
        "price": document.querySelector('input[placeholder="$ Price"]')?.value || '0',
        "description": document.querySelector('textarea[placeholder="Description"]')?.value || '',
        "quantity": document.querySelector('input[placeholder="Item Quantity"]')?.value || '1',
        "pickupAddress": document.querySelector('.pickup-address')?.value || '',
        "unitNo": document.querySelector('.unit-no')?.value || '',
        "postalCode": document.querySelector('.postal-code')?.value || '',
        "deliveryMethod": document.querySelector('input[name="deliveryMethod"]:checked')?.id || 'standard',
        "status": "available",
        "datePosted": new Date().toISOString()
      };

      // Handle optional discount fields
      const discountPercentage = document.getElementById('discountPercentage')?.value;
      const discountStartDate = document.getElementById('discountStartDate')?.value;
      const discountEndDate = document.getElementById('discountEndDate')?.value;

      if (discountPercentage) {
        listingData.discountPercentage = parseFloat(discountPercentage);
        listingData.discountStartDate = discountStartDate || null;
        listingData.discountEndDate = discountEndDate || null;
      }

      // Handle image upload
      const imageFile = document.getElementById('photoUpload').files[0];
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          listingData.imageData = e.target.result;
          createListing(listingData);
        };
        reader.readAsDataURL(imageFile);
      } else {
        createListing(listingData);
      }
    });
  }

  // Create listing in database
  function createListing(listingData) {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(listingData)
    };

    fetch(DATABASE_URL, settings)
      .then(response => {
        if (!response.ok) {
          return response.text().then(errorText => {
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Listing created successfully:', data);
        alert('Item listed successfully!');
        sellForm.reset();
        resetImageUpload();
        getUserListings();
      })
      .catch(error => {
        console.error('Error creating listing:', error);
        alert(`Failed to list item. Error: ${error.message}`);
      });
  }

  // Get user's listings
  function getUserListings() {
    const listingsList = document.getElementById("listings-list");
    if (!listingsList) return;

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
        const userListings = listings.filter(listing => listing.sellerEmail === userEmail);
        displayListings(userListings, listingsList);
      })
      .catch(error => {
        console.error('Error fetching listings:', error);
      });
  }

  // Display listings
  function displayListings(listings, container) {
    let content = "";
    listings.forEach(listing => {
      // Calculate pricing with discount
      const originalPrice = parseFloat(listing.price);
      let displayPrice = originalPrice;
      let discountInfo = '';

      if (listing.discountPercentage && listing.discountPercentage > 0) {
        const currentDate = new Date();
        const startDate = listing.discountStartDate ? new Date(listing.discountStartDate) : null;
        const endDate = listing.discountEndDate ? new Date(listing.discountEndDate) : null;

        const isDiscountActive = (!startDate || currentDate >= startDate) && 
                                  (!endDate || currentDate <= endDate);

        if (isDiscountActive) {
          displayPrice = originalPrice * (1 - listing.discountPercentage / 100);
          discountInfo = `
            <p class="discount-badge">
              ${listing.discountPercentage}% OFF 
              ${startDate ? `(From ${startDate.toLocaleDateString()})` : ''} 
              ${endDate ? `(Until ${endDate.toLocaleDateString()})` : ''}
            </p>
          `;
        }
      }

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
            <p>Original Price: $${originalPrice.toFixed(2)}</p>
            <p>Current Price: $${displayPrice.toFixed(2)}</p>
            ${discountInfo}
            <p>Category: ${listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}</p>
            <p>Condition: ${listing.condition === 'brandNew' ? 'Brand New' : listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}</p>
            <p>Status: ${listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}</p>
            <div class="listing-actions">
              <button onclick="editListing('${listing._id}')" class="edit-btn">Edit</button>
              <button onclick="deleteListing('${listing._id}')" class="delete-btn">Delete</button>
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = content || '<p>You haven\'t posted any listings yet.</p>';
  }

  // Edit listing - populate form
  window.editListing = function(id) {
    const settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      }
    };

    fetch(`${DATABASE_URL}/${id}`, settings)
      .then(response => response.json())
      .then(listing => {
        // Populate form fields
        document.getElementById('edit-listing-id').value = listing._id;
        document.getElementById('edit-item-name').value = listing.itemName;
        document.getElementById('edit-price').value = listing.price;
        document.getElementById('edit-description').value = listing.description;
        document.getElementById('edit-quantity').value = listing.quantity;
        
        // Set category
        const categorySelect = document.getElementById('edit-category');
        categorySelect.value = listing.category;

        // Populate discount fields
        document.getElementById('edit-discount-percentage').value = listing.discountPercentage || '';
        document.getElementById('edit-discount-start').value = listing.discountStartDate || '';
        document.getElementById('edit-discount-end').value = listing.discountEndDate || '';

        // Reset image upload box
        const uploadBox = document.querySelector('#editListingModal .upload-box');
        uploadBox.style.backgroundImage = listing.imageData ? `url(${listing.imageData})` : '';
        uploadBox.querySelector('span').style.display = listing.imageData ? 'none' : 'block';

        // Show the modal
        const editModal = document.getElementById('editListingModal');
        if (editModal) {
          editModal.style.display = 'block';
        }
      })
      .catch(error => {
        console.error('Error fetching listing details:', error);
        alert('Failed to load listing details');
      });
  }

  // Delete listing
  window.deleteListing = function(id) {
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
        console.log('Listing deleted successfully:', data);
        alert('Listing deleted successfully!');
        getUserListings(); // Refresh listings after deletion
      })
      .catch(error => {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing');
      });
  }

  // Edit listing form submission
  document.getElementById('editListingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('edit-listing-id').value;
    
    // Prepare updated data
    const updatedData = {
      itemName: document.getElementById('edit-item-name').value,
      price: document.getElementById('edit-price').value,
      category: document.getElementById('edit-category').value,
      description: document.getElementById('edit-description').value,
      quantity: document.getElementById('edit-quantity').value,

      // Discount fields
      discountPercentage: document.getElementById('edit-discount-percentage')?.value || null,
      discountStartDate: document.getElementById('edit-discount-start')?.value || null,
      discountEndDate: document.getElementById('edit-discount-end')?.value || null
    };

    // Handle image upload for editing
    const imageFile = document.getElementById('editPhotoUpload').files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function(e) {
        updatedData.imageData = e.target.result;
        performUpdate(id, updatedData);
      };
      reader.readAsDataURL(imageFile);
    } else {
      performUpdate(id, updatedData);
    }
  });

  // Perform update in database
  function performUpdate(id, updatedData) {
    const settings = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(updatedData)
    };

    fetch(`${DATABASE_URL}/${id}`, settings)
      .then(response => response.json())
      .then(data => {
        console.log('Listing updated successfully:', data);
        alert('Listing updated successfully!');
        closeEditModal();
        getUserListings(); // Refresh listings
      })
      .catch(error => {
        console.error('Error updating listing:', error);
        alert('Failed to update listing');
      });
  }

  // Close edit modal
  window.closeEditModal = function() {
    const editModal = document.getElementById('editListingModal');
    if (editModal) {
      editModal.style.display = 'none';
      // Reset form and file input
      document.getElementById('editListingForm').reset();
      const uploadBox = document.querySelector('#editListingModal .upload-box');
      uploadBox.style.backgroundImage = '';
      uploadBox.querySelector('span').style.display = 'block';
    }
  }

  // Reset image upload
  function resetImageUpload() {
    const uploadBox = document.querySelector('.upload-box');
    if (uploadBox) {
      uploadBox.style.backgroundImage = '';
      const span = uploadBox.querySelector('span');
      if (span) span.style.display = 'block';
    }
  }

  // Load user's listings when page loads
  getUserListings();
});