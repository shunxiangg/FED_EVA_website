const RESTDB_URL = 'https://evadatabase-f3b8.restdb.io/rest/chats';
const RESTDB_KEY = '67a2786e673edb588fd1d2e3';

// Function to send message
async function sendMessage(message) {
    const data = {
        sender_id: currentUserId,
        receiver_id: selectedUserId,
        message: message,
        timestamp: new Date(),
        product_id: currentProductId,
        read: false
    };

    try {
        const response = await fetch(RESTDB_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': RESTDB_KEY
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to fetch messages
async function fetchMessages(userId1, userId2, productId) {
    try {
        const query = {
            "$or": [
                {
                    "$and": [
                        {"sender_id": userId1},
                        {"receiver_id": userId2},
                        {"product_id": productId}
                    ]
                },
                {
                    "$and": [
                        {"sender_id": userId2},
                        {"receiver_id": userId1},
                        {"product_id": productId}
                    ]
                }
            ]
        };

        const response = await fetch(`${RESTDB_URL}?q=${JSON.stringify(query)}`, {
            headers: {
                'x-apikey': RESTDB_KEY
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Event Listeners
document.getElementById('sendMessage').addEventListener('click', async () => {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message) {
        await sendMessage(message);
        messageInput.value = '';
        // Refresh messages
        loadMessages();
    }
});

// Function to display messages
function displayMessages(messages) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sender_id === currentUserId ? 'sent' : 'received'}`;
        messageDiv.textContent = msg.message;
        chatMessages.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}