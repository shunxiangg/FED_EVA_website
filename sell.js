// document.getElementById('sellForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     // added alert to let users know 
//     alert('Item listed successfully!');
// });

// document.getElementById('photoUpload').addEventListener('change', function(e) {
//     if (e.target.files && e.target.files[0]) {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             document.querySelector('.upload-box').style.backgroundImage = `url(${e.target.result})`;
//             document.querySelector('.upload-box span').style.display = 'none';
//         }
//         reader.readAsDataURL(e.target.files[0]);
//     }
// });

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
  
    // [STEP 1]: Create new listing
    const sellForm = document.getElementById("sellForm");
    if (sellForm) {
      sellForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        // Get all form values
        let jsondata = {
          "sellerId": localStorage.getItem('userEmail'),
          "sellerName": localStorage.getItem('userName'),
          "imageData": null, // Will be updated if image is uploaded
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
          "deliveryMethod": document.querySelector('input[name="delivery"]:checked')?.id || '',
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
          window.location.href = 'browse.html';
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to list item. Please try again.');
        });
    }
  
    // [STEP 2]: Get all listings
    function getListings(limit = 10, all = true) {
      const listingsList = document.getElementById("listings-list");
      if (!listingsList) return;
  
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
        .then(response => {
          displayListings(response, listingsList, limit);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
    function displayListings(listings, container, limit) {
      let content = "";
      for (let i = 0; i < listings.length && i < limit; i++) {
        content += `
          <div class="listing-card" id="${listings[i]._id}">
            <div class="listing-image">
              ${listings[i].imageData ? 
                `<img src="${listings[i].imageData}" alt="${listings[i].itemName}">` :
                '<div class="no-image">No Image</div>'
              }
            </div>
            <div class="listing-details">
              <h3>${listings[i].itemName}</h3>
              <p>Price: $${listings[i].price}</p>
              <p>Category: ${listings[i].category}</p>
              <p>Condition: ${listings[i].condition}</p>
              ${listings[i].sellerId === localStorage.getItem('userEmail') ? `
                <div class="listing-actions">
                  <button onclick="editListing('${listings[i]._id}')" class="edit-btn">Edit</button>
                  <button onclick="deleteListing('${listings[i]._id}')" class="delete-btn">Delete</button>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }
      container.innerHTML = content;
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
          populateEditForm(listing);
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
          getListings(); // Refresh listings
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to delete listing');
        });
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
  
    function populateEditForm(listing) {
      // Populate edit form with listing data
      // This will be implemented when you add the edit form HTML
      console.log('Edit listing:', listing);
    }
  
    // Load listings when page loads
    getListings();
  });