class ChatManager {
    constructor() {
        this.RESTDB_URL = 'https://evadatabase-f3b8.restdb.io/rest';
        this.RESTDB_KEY = '67a2786e673edb588fd1d2e3';
        this.currentUser = null;
        this.selectedUser = null;
        this.currentProduct = null;
        this.messagePollingInterval = null;
        this.POLLING_INTERVAL = 30000; // 30 seconds
    }

    async init() {
        try {
            // Get current user from localStorage
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                localStorage.setItem('returnUrl', window.location.href);
                window.location.href = 'login.html';
                return;
            }

            // Fetch current user details
            this.currentUser = await this.fetchUserDetails(userEmail);
            if (!this.currentUser) {
                console.error('Could not fetch current user details');
                return;
            }

            // Check URL parameters for direct chat
            const urlParams = new URLSearchParams(window.location.search);
            const sellerEmail = urlParams.get('seller');
            const productId = urlParams.get('product');

            this.setupEventListeners();
            await this.loadChatList();

            if (sellerEmail && productId) {
                this.currentProduct = productId;
                const sellerDetails = await this.fetchUserDetails(sellerEmail);
                if (sellerDetails) {
                    await this.selectUser(sellerDetails);
                }
            }

            this.startMessagePolling();
        } catch (error) {
            console.error('Error initializing chat:', error);
        }
    }

    async fetchUserDetails(email) {
        try {
            const query = JSON.stringify({
                "email": email
            });
            
            const response = await fetch(`${this.RESTDB_URL}/accounts?q=${query}`, {
                headers: {
                    'x-apikey': this.RESTDB_KEY
                }
            });
            
            const users = await response.json();
            return users[0];
        } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    }

    setupEventListeners() {
        const sendButton = document.getElementById('sendMessage');
        const messageInput = document.getElementById('messageInput');
        const searchInput = document.getElementById('searchChat');

        if (sendButton && messageInput) {
            sendButton.addEventListener('click', () => this.handleSendMessage());
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchChats(e.target.value));
        }
    }

    async handleSendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (message && this.selectedUser) {
            try {
                await this.sendMessage(message);
                messageInput.value = '';
                await this.loadMessages();
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    }

    async sendMessage(message) {
        const messageData = {
            sender_id: this.currentUser.email,
            receiver_id: this.selectedUser.email,
            message: message,
            timestamp: new Date().toISOString(),
            product_id: this.currentProduct,
            read: false
        };

        try {
            const response = await fetch(`${this.RESTDB_URL}/chats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': this.RESTDB_KEY
                },
                body: JSON.stringify(messageData)
            });

            if (!response.ok) throw new Error('Failed to send message');
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async loadMessages() {
        if (!this.selectedUser) return;

        const query = {
            "$or": [
                {
                    "$and": [
                        {"sender_id": this.currentUser.email},
                        {"receiver_id": this.selectedUser.email}
                    ]
                },
                {
                    "$and": [
                        {"sender_id": this.selectedUser.email},
                        {"receiver_id": this.currentUser.email}
                    ]
                }
            ]
        };

        try {
            const response = await fetch(`${this.RESTDB_URL}/chats?q=${JSON.stringify(query)}`, {
                headers: {
                    'x-apikey': this.RESTDB_KEY
                }
            });
            const messages = await response.json();
            this.displayMessages(messages);
            await this.markMessagesAsRead(messages);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    displayMessages(messages) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        
        messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
               .forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender_id === this.currentUser.email ? 'sent' : 'received'}`;
            
            const time = new Date(msg.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            messageDiv.innerHTML = `
                <div class="message-content">${msg.message}</div>
                <div class="message-time">${time}</div>
            `;
            
            chatMessages.appendChild(messageDiv);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async loadChatList() {
        try {
            const chatQuery = {
                "$or": [
                    {"sender_id": this.currentUser.email},
                    {"receiver_id": this.currentUser.email}
                ]
            };

            const response = await fetch(`${this.RESTDB_URL}/chats?q=${JSON.stringify(chatQuery)}`, {
                headers: {
                    'x-apikey': this.RESTDB_KEY
                }
            });
            const chats = await response.json();

            // Get unique user emails from chats
            const userEmails = new Set();
            chats.forEach(chat => {
                const otherEmail = chat.sender_id === this.currentUser.email ? 
                    chat.receiver_id : chat.sender_id;
                userEmails.add(otherEmail);
            });

            // Fetch user details and last messages
            const chatUsers = await Promise.all(
                Array.from(userEmails).map(async email => {
                    const user = await this.fetchUserDetails(email);
                    if (user) {
                        const userChats = chats.filter(chat => 
                            chat.sender_id === email || chat.receiver_id === email
                        );
                        const lastChat = userChats.sort((a, b) => 
                            new Date(b.timestamp) - new Date(a.timestamp)
                        )[0];

                        const unreadCount = userChats.filter(chat => 
                            chat.receiver_id === this.currentUser.email && !chat.read
                        ).length;

                        return {
                            ...user,
                            lastMessage: lastChat?.message || '',
                            lastMessageTime: lastChat?.timestamp,
                            unreadCount
                        };
                    }
                    return null;
                })
            );

            this.displayChatList(chatUsers.filter(Boolean));
        } catch (error) {
            console.error('Error loading chat list:', error);
        }
    }

    displayChatList(users) {
        const chatList = document.getElementById('chatList');
        chatList.innerHTML = '';
        
        users.sort((a, b) => {
            if (!a.lastMessageTime) return 1;
            if (!b.lastMessageTime) return -1;
            return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        }).forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = `chat-item ${user.unreadCount > 0 ? 'unread' : ''}`;
            
            const time = user.lastMessageTime ? 
                this.formatMessageTime(new Date(user.lastMessageTime)) : '';
            
            userDiv.innerHTML = `
                <div class="chat-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <div class="chat-info">
                    <h4>${user.name}</h4>
                    <p>${user.lastMessage || 'No messages yet'}</p>
                    <div class="chat-time">${time}</div>
                    ${user.unreadCount ? `<span class="unread-badge">${user.unreadCount}</span>` : ''}
                </div>
            `;
            
            userDiv.addEventListener('click', () => this.selectUser(user));
            chatList.appendChild(userDiv);
        });
    }

    async selectUser(user) {
        this.selectedUser = user;
        
        document.getElementById('no-chat-placeholder').style.display = 'none';
        document.getElementById('chat-content').style.display = 'flex';
        
        const headerDiv = document.getElementById('chatUserHeader');
        headerDiv.innerHTML = `
            <div class="chat-avatar">${user.name.charAt(0).toUpperCase()}</div>
            <div class="user-info">
                <h3>${user.name}</h3>
                <p>${user.email}</p>
            </div>
        `;
        
        await this.loadMessages();
        
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.focus();
        }
    }

    async markMessagesAsRead(messages) {
        const unreadMessages = messages.filter(msg => 
            msg.receiver_id === this.currentUser.email && !msg.read
        );

        for (const message of unreadMessages) {
            try {
                await fetch(`${this.RESTDB_URL}/chats/${message._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-apikey': this.RESTDB_KEY
                    },
                    body: JSON.stringify({ read: true })
                });
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        }
    }

    async searchChats(query) {
        if (!query.trim()) {
            await this.loadChatList();
            return;
        }

        try {
            const searchQuery = {
                "name": {
                    "$regex": query,
                    "$options": "i"
                }
            };

            const response = await fetch(`${this.RESTDB_URL}/accounts?q=${JSON.stringify(searchQuery)}`, {
                headers: {
                    'x-apikey': this.RESTDB_KEY
                }
            });
            const users = await response.json();
            this.displayChatList(users);
        } catch (error) {
            console.error('Error searching chats:', error);
        }
    }

    formatMessageTime(date) {
        const now = new Date();
        const diff = now - date;
        const oneDay = 24 * 60 * 60 * 1000;

        if (diff < oneDay && date.getDate() === now.getDate()) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (diff < 7 * oneDay) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    }

    startMessagePolling() {
        if (this.messagePollingInterval) {
            clearInterval(this.messagePollingInterval);
        }

        this.messagePollingInterval = setInterval(() => {
            if (this.selectedUser) {
                this.loadMessages();
            }
            this.loadChatList();
        }, this.POLLING_INTERVAL);
    }

    stopMessagePolling() {
        if (this.messagePollingInterval) {
            clearInterval(this.messagePollingInterval);
        }
    }
}

// Initialize chat manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatManager = new ChatManager();
    chatManager.init();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        chatManager.stopMessagePolling();
    });
});