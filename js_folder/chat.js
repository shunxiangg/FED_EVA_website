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

document.addEventListener('DOMContentLoaded', function() {
    const APIKEY = "6787a92c77327a0a035a5437";
    const BASE_URL = "https://evadatabase-f3b8.restdb.io/rest";
    let currentUser = null;
    let activeChatId = null;

    async function initialize() {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            window.location.href = 'login.html';
            return;
        }

        currentUser = userEmail;
        await loadChats();
        setupEventListeners();

        const urlParams = new URLSearchParams(window.location.search);
        const seller = urlParams.get('seller');
        const productId = urlParams.get('product');
        
        if (seller && productId) {
            await initializeChat(seller, productId);
        } else {
            const chatId = urlParams.get('chatId');
            if (chatId) {
                await openChat(chatId);
            }
        }
    }

    async function fetchProductDetails(productId) {
        const response = await fetch(`${BASE_URL}/sell/${productId}`, {
            headers: { 'x-apikey': APIKEY }
        });
        return response.json();
    }

    async function loadChats() {
        try {
            const query = JSON.stringify({
                "$or": [
                    { "buyer": currentUser },
                    { "seller": currentUser }
                ]
            });
            
            const response = await fetch(`${BASE_URL}/chats?q=${query}`, {
                headers: { 'x-apikey': APIKEY }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const chats = await response.json();
            const enhancedChats = await Promise.all(chats.map(async chat => {
                const product = await fetchProductDetails(chat.productId);
                return { ...chat, product };
            }));
            
            displayChats(enhancedChats);
        } catch (error) {
            console.error('Error loading chats:', error);
        }
    }





    

    function displayChats(chats) {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;

        chatList.innerHTML = '';

        if (!chats.length) {
            chatList.innerHTML = '<div class="no-chats">No conversations yet</div>';
            return;
        }

        chats.sort((a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0))
             .forEach(chat => {
                const otherUser = chat.buyer === currentUser ? chat.seller : chat.buyer;
                const div = document.createElement('div');
                div.className = 'chat-item' + (chat._id === activeChatId ? ' active' : '');

                div.innerHTML = `
                    <div class="chat-preview">
                        <div class="product-info">
                            ${chat.product?.imageData ? 
                                `<img src="${chat.product.imageData}" alt="${chat.productName}" class="product-thumb">` : 
                                '<div class="no-image">No Image</div>'
                            }
                            <div class="product-details">
                                <h4>${chat.productName}</h4>
                                <p class="price">$${chat.product?.price || 'N/A'}</p>
                                <p class="category">${chat.product?.category || 'N/A'}</p>
                                <p class="condition">${chat.product?.condition || 'N/A'}</p>
                            </div>
                        </div>
                        <div class="chat-meta">
                            <p class="chat-with">Chat with: ${otherUser}</p>
                            <small class="last-active">Last active: ${new Date(chat.lastMessageTime || Date.now()).toLocaleString()}</small>
                            ${chat.lastMessage ? `<p class="last-message">${chat.lastMessage}</p>` : ''}
                        </div>
                    </div>
                `;

                div.addEventListener('click', () => openChat(chat._id));
                chatList.appendChild(div);
             });
    }

    async function loadMessages(chatId) {
        try {
            const response = await fetch(`${BASE_URL}/messages?q={"chatId":"${chatId}"}`, {
                headers: { 'x-apikey': APIKEY }
            });

            const messages = await response.json();
            displayMessages(messages);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    function displayMessages(messages) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = '';

        if (!messages.length) {
            messagesContainer.innerHTML = '<p class="no-messages">No messages yet</p>';
            return;
        }

        messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .forEach(message => {
            const div = document.createElement('div');
            div.className = `message ${message.sender === currentUser ? 'sent' : 'received'}`;
            
            const time = new Date(message.timestamp).toLocaleTimeString();
            
            div.innerHTML = `
                <div class="message-content">${message.content}</div>
                <div class="message-time">${time}</div>
            `;
            messagesContainer.appendChild(div);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function openChat(chatId) {
        try {
            activeChatId = chatId;
            
            const response = await fetch(`${BASE_URL}/chats/${chatId}`, {
                headers: { 'x-apikey': APIKEY }
            });
            
            const chat = await response.json();
            const product = await fetchProductDetails(chat.productId);

            const chatContent = document.getElementById('chat-content');
            const chatHeader = document.getElementById('chatUserHeader');
            const productInfo = document.getElementById('productInfo');

            if (chatContent) chatContent.style.display = 'flex';
            
            if (chatHeader) {
                chatHeader.innerHTML = `
                    <div class="chat-header-content">
                        <div class="user-info">
                            <h3>Chat Participants</h3>
                            <p class="seller">Seller: ${chat.seller}</p>
                            <p class="buyer">Buyer: ${chat.buyer}</p>
                        </div>
                    </div>
                `;
            }

            if (productInfo) {
                productInfo.innerHTML = `
                    <div class="product-details-panel">
                        <h3>Product Details</h3>
                        <div class="product-image">
                            ${product.imageData ? 
                                `<img src="${product.imageData}" alt="${chat.productName}">` : 
                                '<div class="no-image">No Image Available</div>'
                            }
                        </div>
                        <div class="product-info-details">
                            <h4>${chat.productName}</h4>
                            <p class="price">Price: $${product.price}</p>
                            <p class="category">Category: ${product.category}</p>
                            <p class="condition">Condition: ${product.condition}</p>
                            <p class="description">${product.description || 'No description available'}</p>
                            <button onclick="window.location.href='productinformation.html?id=${chat.productId}'" class="view-product-btn">
                                View Full Product Details
                            </button>
                        </div>
                    </div>
                `;
            }

            await loadMessages(chatId);
        } catch (error) {
            console.error('Error opening chat:', error);
        }
    }

    async function sendMessage() {
        if (!activeChatId) return;

        const messageInput = document.getElementById('messageInput');
        const content = messageInput.value.trim();
        
        if (!content) return;

        try {
            const message = {
                chatId: activeChatId,
                sender: currentUser,
                content: content,
                timestamp: new Date().toISOString(),
                read: false
            };

            const response = await fetch(`${BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': APIKEY
                },
                body: JSON.stringify(message)
            });

            if (response.ok) {
                messageInput.value = '';
                
                await fetch(`${BASE_URL}/chats/${activeChatId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-apikey': APIKEY
                    },
                    body: JSON.stringify({
                        lastMessage: content,
                        lastMessageTime: new Date().toISOString()
                    })
                });

                await loadMessages(activeChatId);
                await loadChats();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    function setupEventListeners() {
        const sendButton = document.getElementById('sendMessage');
        const messageInput = document.getElementById('messageInput');
        const searchInput = document.getElementById('searchChat');

        if (sendButton) {
            sendButton.addEventListener('click', sendMessage);
        }

        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => searchChats(e.target.value));
        }
    }

    async function searchChats(query) {
        if (!query.trim()) {
            await loadChats();
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/chats`, {
                headers: { 'x-apikey': APIKEY }
            });

            const chats = await response.json();
            const filteredChats = chats.filter(chat => {
                const isParticipant = chat.buyer === currentUser || chat.seller === currentUser;
                const matchesSearch = chat.productName.toLowerCase().includes(query.toLowerCase());
                return isParticipant && matchesSearch;
            });

            displayChats(filteredChats);
        } catch (error) {
            console.error('Error searching chats:', error);
        }
    }

    setInterval(() => {
        if (activeChatId) {
            loadMessages(activeChatId);
        }
        loadChats();
    }, 10000);

    initialize();
});


async function initializeChat(seller, productId) {
    const buyerEmail = localStorage.getItem('userEmail');

    if (!buyerEmail) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Check for existing chat
        const existingChatQuery = JSON.stringify({
            buyer: buyerEmail,
            seller: seller,
            productId: productId
        });

        const existingChatResponse = await fetch(`${BASE_URL}/chats?q=${existingChatQuery}`, {
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        });

        const existingChats = await existingChatResponse.json();

        let chatId;
        if (existingChats.length === 0) {
            // Create new chat if no existing chat
            const productResponse = await fetch(`${BASE_URL}/sell/${productId}`, {
                headers: { 'x-apikey': APIKEY }
            });
            const product = await productResponse.json();

            const newChat = {
                buyer: buyerEmail,
                seller: seller,
                productId: productId,
                productName: product.itemName,
                lastMessageTime: new Date().toISOString(),
                messages: []
            };

            const createChatResponse = await fetch(`${BASE_URL}/chats`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY
                },
                body: JSON.stringify(newChat)
            });

            const createdChat = await createChatResponse.json();
            chatId = createdChat._id;
        } else {
            chatId = existingChats[0]._id;
        }

        // Open the chat
        await openChat(chatId);
    } catch (error) {
        console.error('Error initializing chat:', error);
    }
}