document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "6787a92c77327a0a035a5437";
  
  // Initialize page elements
  const updateContainer = document.getElementById("update-contact-container");
  const addUpdateMsg = document.getElementById("add-update-msg");
  const errorMessage = document.getElementById("error-message");
  
  if (updateContainer) updateContainer.style.display = "none";
  if (addUpdateMsg) addUpdateMsg.style.display = "none";

  // Load contacts when page loads
  getContacts();

  // [STEP 1]: Create new contact with validation
  const contactSubmit = document.getElementById("contact-submit");
  if (contactSubmit) {
    contactSubmit.addEventListener("click", async function (e) {
      e.preventDefault();

      let contactName = document.getElementById("contact-name").value;
      let contactEmail = document.getElementById("contact-email").value;
      let contactPassword = document.getElementById("contact-password").value;
      let repeatPassword = document.getElementById("repeat-password-input").value;

      // Clear previous error message
      errorMessage.textContent = '';
      errorMessage.style.color = 'red';

      // Validate passwords match
      if (contactPassword !== repeatPassword) {
        errorMessage.textContent = 'Passwords do not match!';
        return;
      }

      // Validate password length
      if (contactPassword.length < 8) {
        errorMessage.textContent = 'Password must be at least 8 characters long';
        return;
      }

      // Check if email already exists
      try {
        const settings = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
          }
        };

        const response = await fetch("https://evadatabase-f3b8.restdb.io/rest/accounts", settings);
        const data = await response.json();
        
        const emailExists = data.some(account => account.email === contactEmail);
        
        if (emailExists) {
          errorMessage.textContent = 'This email is already registered. Please use another email.';
          return;
        }

        //loading animation through css keyframes
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `<div class="loading-content">
            <div class="loadSpin"></div>
          <p>Creating your account...</p>
          </div>`;
      document.body.appendChild(loadingOverlay);

        // Proceed with creating account
        let jsondata = {
          "name": contactName,
          "email": contactEmail,
          "password": contactPassword,
        };

        let submitSettings = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
          },
          body: JSON.stringify(jsondata)
        };

        const submitResponse = await fetch("https://evadatabase-f3b8.restdb.io/rest/accounts", submitSettings);
        const submitData = await submitResponse.json();
        
        console.log(submitData);
        
        // Redirect to browse page after successful signup
        setTimeout(() => {
          window.location.href = 'browse.html';
        }, 2000);

      } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Error creating account. Please try again.';
        // Remove loading overlay if exists
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
          loadingOverlay.remove();
        }
      }
    });
  }

  // [STEP 2]: Get all contacts
  function getContacts(limit = 10, all = true) {
    const contactList = document.getElementById("contact-list");
    const totalContacts = document.getElementById("total-contacts");
    
    if (!contactList) return;

    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      }
    };

    fetch("https://evadatabase-f3b8.restdb.io/rest/accounts", settings)
      .then(response => response.json())
      .then(response => {
        let content = "";
        for (let i = 0; i < response.length && i < limit; i++) {
          content += `<tr id='${response[i]._id}'>
            <td>${response[i].name || ''}</td>
            <td>${response[i].email || ''}</td>
            <td>${'*'.repeat(8)}</td>
            <td>
              <button class="btn btn-warning btn-sm edit-btn" 
                data-id='${response[i]._id}'
                data-name='${response[i].name || ''}'
                data-email='${response[i].email || ''}'
                data-password='${response[i].password || ''}'>
                Edit
              </button>
            </td>
            <td>
              <button class="btn btn-danger btn-sm delete-btn" 
                data-id='${response[i]._id}'>
                Delete
              </button>
            </td>
          </tr>`;
        }

        if (contactList.getElementsByTagName("tbody")[0]) {
          contactList.getElementsByTagName("tbody")[0].innerHTML = content;
        }
        if (totalContacts) {
          totalContacts.innerHTML = response.length;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error loading accounts');
      });
  }

  // [STEP 3]: Handle table actions (Edit and Delete)
  const contactListElement = document.getElementById("contact-list");
  if (contactListElement) {
    contactListElement.addEventListener("click", function (e) {
      // Delete action
      if (e.target.classList.contains("delete-btn")) {
        e.preventDefault();
        const contactId = e.target.getAttribute("data-id");
        
        if (confirm("Are you sure you want to delete this account?")) {
          deleteContact(contactId);
        }
      }
      
      // Edit action
      if (e.target.classList.contains("edit-btn")) {
        e.preventDefault();
        const contactId = e.target.getAttribute("data-id");
        const contactName = e.target.getAttribute("data-name");
        const contactEmail = e.target.getAttribute("data-email");
        const contactPassword = e.target.getAttribute("data-password");
        
        document.getElementById("update-contact-name").value = contactName;
        document.getElementById("update-contact-email").value = contactEmail;
        document.getElementById("update-contact-password").value = contactPassword;
        document.getElementById("update-contact-id").value = contactId;
        document.getElementById("update-contact-container").style.display = "block";
      }
    });
  }

  // [STEP 4]: Handle update form submission
  const updateSubmitBtn = document.getElementById("update-contact-submit");
  if (updateSubmitBtn) {
    updateSubmitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      
      const contactId = document.getElementById("update-contact-id").value;
      const contactName = document.getElementById("update-contact-name").value;
      const contactEmail = document.getElementById("update-contact-email").value;
      const contactPassword = document.getElementById("update-contact-password").value;

      updateContact(contactId, contactName, contactEmail, contactPassword);
    });
  }

  // [STEP 5]: Update contact function
  function updateContact(id, name, email, password) {
    const jsondata = {
      "name": name,
      "email": email,
      "password": password
    };

    const settings = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(jsondata)
    };

    fetch(`https://evadatabase-f3b8.restdb.io/rest/accounts/${id}`, settings)
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        document.getElementById("update-contact-container").style.display = "none";
        getContacts();
        
        if (addUpdateMsg) {
          addUpdateMsg.style.display = "block";
          setTimeout(function () {
            addUpdateMsg.style.display = "none";
          }, 3000);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error updating account');
      });
  }

  // [STEP 6]: Delete contact function
  function deleteContact(id) {
    const settings = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      }
    };

    fetch(`https://evadatabase-f3b8.restdb.io/rest/accounts/${id}`, settings)
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        getContacts();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error deleting account');
      });
  }

  //validation
  const passwordInput = document.getElementById("contact-password");
  const repeatPasswordInput = document.getElementById("repeat-password-input");
  
  if (repeatPasswordInput) {
    repeatPasswordInput.addEventListener('input', function() {
      if (passwordInput.value !== repeatPasswordInput.value) {
        errorMessage.textContent = 'Passwords do not match';
      } else {
        errorMessage.textContent = '';
      }
    });
  }
});