// document.addEventListener('DOMContentLoaded', function() {
//     const APIKEY = "6787a92c77327a0a035a5437";
//     const BASE_URL = "https://evadatabase-f3b8.restdb.io/rest";
//     let currentUser = null;
//     let activeChatId = null;

//     async function initialize() {
//         const userEmail = localStorage.getItem('userEmail');
//         console.log('Current user email:', userEmail);
        
//         if (!userEmail) {
//             window.location.href = 'login.html';
//             return;
//         }

//         currentUser = userEmail;
//         setupEventListeners();
//         await loadChats();
        
//         const urlParams = new URLSearchParams(window.location.search);
//         const chatId = urlParams.get('chatId');
//         if (chatId) {
//             console.log('Opening specific chat:', chatId);
//             await openChat(chatId);
//         }
//     }

//     async function loadChats() {
//         try {
//             const query = JSON.stringify({
//                 "$or": [
//                     { "buyer": currentUser },
//                     { "seller": currentUser }
//                 ]
//             });
            
//             console.log('Fetching chats with query:', query);
            
//             const response = await fetch(`${BASE_URL}/chats?q=${query}`, {
//                 headers: {
//                     'x-apikey': APIKEY
//                 }
//             });

//             const chats = await response.json();
//             console.log('Fetched chats:', chats);
            
//             // Add error checking for response
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
            
//             displayChats(chats);
//         } catch (error) {
//             console.error('Error loading chats:', error);
//             console.error('Error details:', {
//                 message: error.message,
//                 stack: error.stack
//             });
//         }
//     }

//     function displayChats(chats) {
//         const chatList = document.getElementById('chatList');
//         console.log('Chat list element:', chatList);
//         console.log('Displaying chats:', chats);
        
//         if (!chatList) {
//             console.error('chatList element not found');
//             return;
//         }

//         chatList.innerHTML = '';

//         if (!Array.isArray(chats) || chats.length === 0) {
//             console.log('No chats to display');
//             chatList.innerHTML = '<div class="no-chats">No conversations yet</div>';
//             return;
//         }

//         // Sort chats by last message time
//         chats.sort((a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0));

//         chats.forEach(chat => {
//             console.log('Processing chat:', chat);
//             const otherUser = chat.buyer === currentUser ? chat.seller : chat.buyer;
//             const div = document.createElement('div');
//             div.className = 'chat-item' + (chat._id === activeChatId ? ' active' : '');

//             div.innerHTML = `
//                 <div class="chat-preview">
//                     <h4>${chat.productName || 'Unnamed Product'}</h4>
//                     <p>Chat with: ${otherUser}</p>
//                     <small>Last active: ${new Date(chat.lastMessageTime || Date.now()).toLocaleString()}</small>
//                 </div>
//             `;

//             div.addEventListener('click', () => {
//                 console.log('Chat clicked:', chat._id);
//                 openChat(chat._id);
//             });
//             chatList.appendChild(div);
//         });
//     }

//     async function openChat(chatId) {
//         try {
//             console.log('Opening chat:', chatId);
//             activeChatId = chatId;
            
//             const response = await fetch(`${BASE_URL}/chats/${chatId}`, {
//                 headers: {
//                     'x-apikey': APIKEY
//                 }
//             });
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const chat = await response.json();
//             console.log('Fetched chat details:', chat);

//             const noChat = document.getElementById('no-chat-placeholder');
//             const chatContent = document.getElementById('chat-content');
//             const chatHeader = document.getElementById('chatUserHeader');

//             if (noChat) noChat.style.display = 'none';
//             if (chatContent) chatContent.style.display = 'flex';
            
//             if (chatHeader) {
//                 chatHeader.innerHTML = `
//                     <h3>${chat.productName || 'Chat'}</h3>
//                     <p>Chatting with: ${chat.buyer === currentUser ? chat.seller : chat.buyer}</p>
//                 `;
//             }

//             await loadMessages(chatId);
//         } catch (error) {
//             console.error('Error opening chat:', error);
//             console.error('Error details:', {
//                 message: error.message,
//                 stack: error.stack
//             });
//         }
//     }


//     async function loadMessages(chatId) {
//         try {
//             const response = await fetch(`${BASE_URL}/messages?q={"chatId":"${chatId}"}`, {
//                 headers: {
//                     'x-apikey': APIKEY
//                 }
//             });

//             const messages = await response.json();
//             displayMessages(messages);
//         } catch (error) {
//             console.error('Error loading messages:', error);
//         }
//     }

//     function displayMessages(messages) {
//         const messagesContainer = document.getElementById('chatMessages');
//         if (!messagesContainer) return;

//         messagesContainer.innerHTML = '';

//         if (messages.length === 0) {
//             messagesContainer.innerHTML = '<p class="no-messages">No messages yet</p>';
//             return;
//         }

//         messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
//                 .forEach(message => {
//             const div = document.createElement('div');
//             div.className = `message ${message.sender === currentUser ? 'sent' : 'received'}`;
            
//             const time = new Date(message.timestamp).toLocaleTimeString();
            
//             div.innerHTML = `
//                 <div class="message-content">${message.content}</div>
//                 <div class="message-time">${time}</div>
//             `;
//             messagesContainer.appendChild(div);
//         });

//         messagesContainer.scrollTop = messagesContainer.scrollHeight;
//     }

//     async function sendMessage() {
//         if (!activeChatId) return;

//         const messageInput = document.getElementById('messageInput');
//         const content = messageInput.value.trim();
        
//         if (!content) return;

//         try {
//             const message = {
//                 chatId: activeChatId,
//                 sender: currentUser,
//                 content: content,
//                 timestamp: new Date().toISOString(),
//                 read: false
//             };

//             const response = await fetch(`${BASE_URL}/messages`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'x-apikey': APIKEY
//                 },
//                 body: JSON.stringify(message)
//             });

//             if (response.ok) {
//                 messageInput.value = '';
                
//                 // Update chat's last message
//                 await fetch(`${BASE_URL}/chats/${activeChatId}`, {
//                     method: 'PATCH',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'x-apikey': APIKEY
//                     },
//                     body: JSON.stringify({
//                         lastMessage: content,
//                         lastMessageTime: new Date().toISOString()
//                     })
//                 });

//                 await loadMessages(activeChatId);
//                 await loadChats();
//             }
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     }

//     function setupEventListeners() {
//         const sendButton = document.getElementById('sendMessage');
//         const messageInput = document.getElementById('messageInput');
//         const searchInput = document.getElementById('searchChat');

//         if (sendButton) {
//             sendButton.addEventListener('click', sendMessage);
//         }

//         if (messageInput) {
//             messageInput.addEventListener('keypress', (e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     sendMessage();
//                 }
//             });
//         }

//         if (searchInput) {
//             searchInput.addEventListener('input', (e) => searchChats(e.target.value));
//         }
//     }

//     async function searchChats(query) {
//         if (!query.trim()) {
//             await loadChats();
//             return;
//         }

//         try {
//             const response = await fetch(`${BASE_URL}/chats`, {
//                 headers: {
//                     'x-apikey': APIKEY
//                 }
//             });

//             const chats = await response.json();
//             const filteredChats = chats.filter(chat => {
//                 const isParticipant = chat.buyer === currentUser || chat.seller === currentUser;
//                 const matchesSearch = chat.productName.toLowerCase().includes(query.toLowerCase());
//                 return isParticipant && matchesSearch;
//             });

//             displayChats(filteredChats);
//         } catch (error) {
//             console.error('Error searching chats:', error);
//         }
//     }

//     // Start the application
//     initialize();

//     // Set up periodic updates
//     setInterval(() => {
//         if (activeChatId) {
//             loadMessages(activeChatId);
//         }
//         loadChats();
//     }, 10000);

//     console.log('Initializing chat system');
//     initialize();
// });

let allMessages = [];

document.addEventListener("DOMContentLoaded", () => {
    const currentChat = localStorage.getItem("currentChat");
    getAllMessages().then(() => {
        if (currentChat) {
            loadChat(currentChat);
        }
    });
});

function getAllMessages() {
    const from = localStorage.getItem("loginId");
    const APIKEY = "6787a92c77327a0a035a5437";
    const MESSAGES_URL = "https://evadatabase-f3b8.restdb.io/rest/chats";

    // Fetch all messages where the user is the `from` or the `to`
    const query = {
        "$or": [
            { "from._id": from },
            { "to._id": from }
        ]
    };

    return fetch(`${MESSAGES_URL}?q=${encodeURIComponent(JSON.stringify(query))}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((messages) => {
        allMessages = messages;
        loadContacts();
    })
    .catch((error) => {
        console.error("Error fetching messages:", error);
    });
}

function loadContacts() {
    const from = localStorage.getItem("loginId");
    const contactList = document.querySelector('.contact-list');
    contactList.innerHTML = '';

    const contacts = allMessages.reduce((acc, message) => {
        const contactId = message.from[0]._id === from ? message.to[0]._id : message.from[0]._id;
        if (!acc[contactId] || new Date(message.sent) > new Date(acc[contactId].sent)) {
            acc[contactId] = message;
        }
        return acc;
    }, {});

    Object.values(contacts).reverse().forEach((contact) => {
        const contactData = contact.from[0]._id === from ? contact.to[0] : contact.from[0];
        const lastMessage = contact.message;
        const contactItem = document.createElement('div');
        contactItem.classList.add('contact-item');
        contactItem.setAttribute('onclick', `switchChat('${contactData._id}')`);
        contactItem.innerHTML = `
            <img src="/src/images/avatar-placeholder.jpg" alt="Avatar" class="avatar" />
            <div class="contact-info">
                <span class="contact-name">${contactData.username}</span>
                <span class="contact-status">${lastMessage}</span>
            </div>
        `;
        contactList.appendChild(contactItem);
    });
}

function switchChat(contact) {
    // Remove active class from all contacts
    document.querySelectorAll('.contact-item').forEach(item => item.classList.remove('active'));
    
    // Add active class to the selected contact
    document.querySelector(`.contact-item[onclick="switchChat('${contact}')"]`).classList.add('active');
    
    // Set current chat in localStorage
    localStorage.setItem("currentChat", contact);
    
    // Load the selected chat
    loadChat(contact);
}

function loadChat(contact) {
    const chatContainer = document.getElementById('chat-container');
    const chatAvatar = document.getElementById('chat-avatar');
    const chatContactName = document.getElementById('chat-contact-name');
    const chatHeader = document.getElementById('chat-header');
    const chatInputContainer = document.getElementById('chat-input-container');
    const APIKEY = "6787a92c77327a0a035a5437";
    const ACCOUNTS_URL = "https://evadatabase-f3b8.restdb.io/rest/accounts";
    const LISTINGS_URL = "https://evadatabase-f3b8.restdb.io/rest/sell";
    // const OFFERS_URL = "https://mokesell-2304.restdb.io/rest/offers";
    const from = localStorage.getItem("loginId");
    const to = contact;
    
    // Clear existing chat messages
    chatContainer.innerHTML = '';
    chatContainer.classList.remove('chat-container-empty');
    
    // Show chat header and input container
    chatHeader.style.display = 'flex';
    chatInputContainer.style.display = 'flex';
    
    // Fetch recipient's username
    fetch(`${ACCOUNTS_URL}/${contact}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        chatContactName.textContent = data.username;
        
        // Filter messages between logged in user and current chat
        const messages = allMessages.filter(message => 
            (message.from[0]._id === from && message.to[0]._id === to) ||
            (message.from[0]._id === to && message.to[0]._id === from)
        );

        messages.forEach((message) => {
            const messageBubble = document.createElement('div');
            messageBubble.classList.add('chat-message', message.from[0]._id === from ? 'sent' : 'received');
            
            if (message.offer) {
                const offerCard = document.createElement('div');
                offerCard.classList.add('offer-card');
                offerCard.style.width = '100%';
                chatContainer.appendChild(offerCard);

                fetch(`${LISTINGS_URL}/${message.offer[0].listing[0]}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": APIKEY,
                    },
                })
                .then((response) => response.json())
                .then((listing) => {
                    offerCard.innerHTML = `
                        <img src="/src/images/${listing.image}" alt="${listing.title}" class="offer-image" />
                        <div class="offer-details">
                            <h4>${listing.title}</h4>
                            <p>Offer Price: S$${message.offer[0].price}</p>
                        </div>
                    `;
                    
                    const offerStatus = document.createElement('div');
                    offerStatus.classList.add('offer-status');
                    offerCard.appendChild(offerStatus);

                    if (from === listing.sellerID[0]._id) {
                        if (message.offer[0].accept) {
                            offerStatus.innerHTML = `<span class="bi bi-check-circle"> Payment Received</span>`;
                        } else {
                            const acceptButton = document.createElement('button');
                            acceptButton.classList.add('btn', 'btn-success');
                            acceptButton.textContent = 'Accept Offer';
                            acceptButton.addEventListener('click', () => {
                                fetch(`${OFFERS_URL}/${message.offer[0]._id}`, {
                                    method: "PATCH",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "x-apikey": APIKEY,
                                    },
                                    body: JSON.stringify({ accept: true })
                                })
                                .then(() => {
                                    offerStatus.innerHTML = `<span class="bi bi-check-circle"> Payment Received</span>`;
                                    // Decrease the quantity of the listing
                                    fetch(`${LISTINGS_URL}/${listing._id}`, {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "x-apikey": APIKEY,
                                        },
                                        body: JSON.stringify({ quantity: listing.quantity - 1 })
                                    })
                                    .catch((error) => {
                                        console.error("Error updating listing quantity:", error);
                                    });
                                })
                                .catch((error) => {
                                    console.error("Error accepting offer:", error);
                                });
                            });
                            offerStatus.appendChild(acceptButton);
                        }
                    } else {
                        if (message.offer[0].accept) {
                            offerStatus.innerHTML = `<span class="bi bi-check-circle"> Item Shipped</span>`;
                            const ratingContainer = document.createElement('div');
                            ratingContainer.classList.add('rating-container');
                            ratingContainer.innerHTML = `
                                <span>Rate: </span>
                                <span class="bi bi-star" data-rating="1"></span>
                                <span class="bi bi-star" data-rating="2"></span>
                                <span class="bi bi-star" data-rating="3"></span>
                                <span class="bi bi-star" data-rating="4"></span>
                                <span class="bi bi-star" data-rating="5"></span>
                            `;
                            offerStatus.appendChild(ratingContainer);

                            ratingContainer.querySelectorAll('.bi-star').forEach(star => {
                                star.addEventListener('click', () => {
                                    const rating = star.getAttribute('data-rating');
                                    fetch(`${OFFERS_URL}/${message.offer[0]._id}`, {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "x-apikey": APIKEY,
                                        },
                                        body: JSON.stringify({ rating: rating })
                                    })
                                    .then(() => {
                                        alert("Rating submitted!");
                                    })
                                    .catch((error) => {
                                        console.error("Error submitting rating:", error);
                                    });
                                });
                            });
                        } else {
                            offerStatus.innerHTML = `<span class="bi bi-clock"> Awaiting Confirmation</span>`;
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error fetching listing:", error);
                });
            }

            messageBubble.innerHTML = `
                <p>${message.message}</p>
                <span class="timestamp">${new Date(message.sent).toLocaleTimeString()}</span>
            `;
            chatContainer.appendChild(messageBubble);
        });
        chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
    })
    .catch((error) => {
        console.error("Error fetching recipient's username:", error);
    });
}

document.querySelector('.chat-send-button').addEventListener('click', sendMessage);

function sendMessage() {
    const messageInput = document.querySelector('.chat-input');
    const message = messageInput.value.trim();
    const from = localStorage.getItem("loginId");
    const to = localStorage.getItem("currentChat");
    const APIKEY = "6787a92c77327a0a035a5437";
    const MESSAGES_URL = "https://evadatabase-f3b8.restdb.io/rest/messages";

    if (message === '') return;

    // Send message to the API
    fetch(MESSAGES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
        body: JSON.stringify({
            from: from,
            to: to,
            message: message,
            sent: new Date().toISOString()
        })
    })
    .then((response) => response.json())
    .then((data) => {
        // Append the sent message to the chat container
        const chatContainer = document.getElementById('chat-container');
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('chat-message', 'sent');
        messageBubble.innerHTML = `
            <p>${message}</p>
            <span class="timestamp">${new Date().toLocaleTimeString()}</span>
        `;
        chatContainer.appendChild(messageBubble);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
        messageInput.value = ''; // Clear the input field

        getAllMessages().then(() => {
            loadChat(to);
        });
    })
    .catch((error) => {
        console.error("Error sending message:", error);
    });
}
