document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "6787a92c77327a0a035a5437";
  
  // Only show/hide elements if they exist
  const updateContainer = document.getElementById("update-contact-container");
  const addUpdateMsg = document.getElementById("add-update-msg");
  
  if (updateContainer) updateContainer.style.display = "none";
  if (addUpdateMsg) addUpdateMsg.style.display = "none";

  // [STEP 1]: Create our submit form listener
  const contactSubmit = document.getElementById("contact-submit");
  if (contactSubmit) {
    contactSubmit.addEventListener("click", function (e) {
      e.preventDefault();

      // [STEP 2]: Retrieve form data
      let contactName = document.getElementById("contact-name").value;
      let contactEmail = document.getElementById("contact-email").value;
      let contactPassword = document.getElementById("contact-password").value;

      // [STEP 3]: Get form values when the user clicks on send
      let jsondata = {
        "name": contactName,
        "email": contactEmail,
        "password": contactPassword,
      };

      // [STEP 4]: Create AJAX settings to send data to server
      let settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": APIKEY,
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify(jsondata)
      };

      // [STEP 5]: Send AJAX request to server
      fetch("https://evadatabase-f3b8.restdb.io/rest/accounts", settings)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (contactSubmit) contactSubmit.disabled = false;
          
          const addUpdateMsg = document.getElementById("add-update-msg");
          if (addUpdateMsg) {
            addUpdateMsg.style.display = "block";
            setTimeout(function () {
              addUpdateMsg.style.display = "none";
            }, 3000);
          }

          const form = document.getElementById("add-contact-form");
          if (form) form.reset();

          // Only call getContacts if we're on the admin page
          const contactList = document.getElementById("contact-list");
          if (contactList) getContacts();
        });
    });
  }

  // [STEP 6]: Function to retrieve all contacts from the database
  function getContacts(limit = 10, all = true) {
    const contactList = document.getElementById("contact-list");
    const totalContacts = document.getElementById("total-contacts");
    
    if (!contactList) return; // Exit if we're not on the admin page

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
            <td>${response[i].name}</td>
            <td>${response[i].email}</td>
            <td>${response[i].password}</td>
            <td><a href='#' class='delete' data-id='${response[i]._id}'>Del</a></td>
            <td><a href='#update-contact-container' class='update' data-id='${response[i]._id}' data-msg='${response[i].message}' data-name='${response[i].name}' data-email='${response[i].email}'>Update</a></td>
          </tr>`;
        }

        if (contactList.getElementsByTagName("tbody")[0]) {
          contactList.getElementsByTagName("tbody")[0].innerHTML = content;
        }
        if (totalContacts) {
          totalContacts.innerHTML = response.length;
        }
      });
  }

  // Rest of your code remains the same...
});