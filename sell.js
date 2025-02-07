document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "6787a92c77327a0a035a5437";
  const DATABASE_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";

  // Initialize photo upload preview
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

  // Initialize edit photo upload preview
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

  // [STEP 1]: Create new listing
  const sellForm = document.getElementById("sellForm");
  if (sellForm) {
    sellForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get all form values
      let jsondata = {
        "sellerId": localStorage.getItem('userEmail'),
        "sellerName": localStorage.getItem('userName'),
        "imageData": null,
        "videoLink": document.querySelector('.video-link input').value,
        "category": document.querySelector('.category-group select').value,
        "condition": document.querySelector('input[name="condition"]:checked')?.id || '',
        "itemName": document.querySelector('input[placeholder="Item Name"]').value,
        "price": document.querySelector('input[placeholder="$ Price"]').value,
        "description": document.querySelector('textarea[placeholder="Description"]').value,
        "quantity": document.querySelector('input[placeholder="Item Quantity"]').value,
        "pickupAddress": document.querySelector('.pickup-address').value,
        "unitNo": document.querySelector('.unit-no').value,
        "postalCode": document.querySelector('.postal-code').value,
        "deliveryMethod": document.querySelector('input[name="deliveryMethod"]:checked')?.id || '',
        "status": "available",
        "datePosted": new Date().toISOString()
      };

      // Handle image upload
      const imageFile = document.getElementById('photoUpload').files[0];
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          jsondata.imageData = e.target.result;
          createListing(jsondata);
        };
        reader.readAsDataURL(imageFile);
      } else {
        createListing(jsondata);
      }
    });
  }

  function createListing(jsondata) {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(jsondata)
    };

    fetch(DATABASE_URL, settings)
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Item listed successfully!');
        sellForm.reset();
        resetImageUpload();
        getUserListings(); // Refresh listings after creating new one
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to list item. Please try again.');
      });
  }

  // [STEP 2]: Get user's listings
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
        const userListings = listings.filter(listing => listing.sellerId === userEmail);
        displayListings(userListings, listingsList);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function displayListings(listings, container) {
    let content = "";
    listings.forEach(listing => {
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
            <p>Price: $${listing.price}</p>
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

  // [STEP 3]: Update listing
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
        console.error('Error:', error);
      });
  }

  // [STEP 4]: Delete listing
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
        console.log('Success:', data);
        alert('Listing deleted successfully!');
        getUserListings(); // Refresh listings after deletion
      })
      .catch(error => {
        console.error('Error:', error);
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
      quantity: document.getElementById('edit-quantity').value
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
        console.log('Success:', data);
        alert('Listing updated successfully!');
        closeEditModal();
        getUserListings(); // Refresh listings
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to update listing');
      });
  }

  // Close modal function
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

  // Helper functions
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