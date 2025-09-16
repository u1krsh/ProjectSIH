class TourismChatbot {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.recognition = null;
        this.isListening = false;
        this.messages = [];
        this.conversationHistory = [];
        this.userId = this.generateUserId();
        this.socket = null;
        
        // API configuration
        this.apiBaseUrl = 'http://localhost:5000/api';
        
        // Initialize socket connection
        this.initializeSocket();
        this.quickActions = [];
        this.loadQuickActions();
        
        this.initializeChatbot();
        this.setupSpeechRecognition();
    }

    initializeChatbot() {
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbot = document.getElementById('chatbot');
        const minimizeBtn = document.getElementById('minimizeChatbot');
        const closeBtn = document.getElementById('closeChatbot');
        const sendBtn = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');
        const voiceBtn = document.getElementById('voiceInput');

        chatbotToggle.addEventListener('click', () => this.toggleChatbot());
        minimizeBtn.addEventListener('click', () => this.minimizeChatbot());
        closeBtn.addEventListener('click', () => this.closeChatbot());
        sendBtn.addEventListener('click', () => this.sendMessage());
        voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick replies
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                this.handleQuickReply(e.target.dataset.reply);
            }
        });
    }

    generateUserId() {
        // Generate a temporary user ID for anonymous users
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    initializeSocket() {
        try {
            // Initialize Socket.IO connection if available
            if (typeof io !== 'undefined') {
                this.socket = io(this.apiBaseUrl.replace('/api', ''));
                
                this.socket.on('connect', () => {
                    console.log('Connected to chatbot server');
                    this.socket.emit('join', this.userId);
                });

                this.socket.on('chatbot_response', (response) => {
                    this.handleBotResponse(response);
                });

                this.socket.on('chatbot_error', (error) => {
                    this.addMessage('🤖', 'Sorry, I encountered an error. Please try again.', 'bot');
                    this.hideTyping();
                });
            }
        } catch (error) {
            console.log('Socket.IO not available, using HTTP API fallback');
        }
    }

    async loadQuickActions() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/chatbot/quick-actions`);
            const data = await response.json();
            
            if (data.success) {
                this.quickActions = data.data;
            }
        } catch (error) {
            console.log('Could not load quick actions:', error);
            // Fallback quick actions
            this.quickActions = [
                { id: 'popular_destinations', label: '🏔️ Popular Places', action: 'Show me popular destinations' },
                { id: 'weather_info', label: '🌤️ Weather', action: 'What\'s the weather like?' },
                { id: 'cultural_sites', label: '🎭 Culture', action: 'Tell me about culture' },
                { id: 'plan_trip', label: '📅 Plan Trip', action: 'Help me plan a trip' }
            ];
        }
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chatInput').value = transcript;
                this.sendMessage();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopVoiceInput();
            };

            this.recognition.onend = () => {
                this.stopVoiceInput();
            };
        }
    }

    toggleChatbot() {
        const chatbot = document.getElementById('chatbot');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatbot.classList.add('active');
            document.querySelector('.chat-badge').style.display = 'none';
        } else {
            chatbot.classList.remove('active');
        }
    }

    minimizeChatbot() {
        const chatbot = document.getElementById('chatbot');
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            chatbot.classList.add('minimized');
        } else {
            chatbot.classList.remove('minimized');
        }
    }

    closeChatbot() {
        const chatbot = document.getElementById('chatbot');
        chatbot.classList.remove('active');
        this.isOpen = false;
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';
        
        // Add to conversation history
        this.conversationHistory.push({ role: 'user', content: message });
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Try Socket.IO first, fallback to HTTP
            if (this.socket && this.socket.connected) {
                this.socket.emit('chatbot_message', {
                    message: message,
                    userId: this.userId,
                    conversationHistory: this.conversationHistory
                });
            } else {
                // HTTP API fallback
                const response = await this.sendMessageToAPI(message);
                this.handleBotResponse(response);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I\'m having trouble connecting. Please try again.', 'bot');
        }
    }

    async sendMessageToAPI(message) {
        const response = await fetch(`${this.apiBaseUrl}/chatbot/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                userId: this.userId,
                conversationHistory: this.conversationHistory
            })
        });

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'API error');
        }

        return data.data;
    }

    handleBotResponse(response) {
        this.hideTypingIndicator();
        
        // Add bot message to conversation history
        this.conversationHistory.push({ role: 'bot', content: response.message });
        
        // Display the message
        this.addMessage(response.message, 'bot');
        
        // Show suggestions if available
        if (response.suggestions && response.suggestions.length > 0) {
            this.showQuickReplies(response.suggestions);
        }
        
        // Handle special response types
        if (response.type === 'destinations' && response.data) {
            this.showDestinationCards(response.data);
        } else if (response.type === 'weather' && response.data) {
            this.showWeatherCard(response.data);
        }
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${content}</p>`;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store message
        this.messages.push({ content, sender, timestamp: new Date() });
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Greetings
        if (lowerMessage.match(/^(hi|hello|hey|namaste|namaskar)/)) {
            return this.getRandomResponse('greetings');
        }
        
        // Thanks
        if (lowerMessage.match(/(thank|thanks|dhanyawad)/)) {
            return this.getRandomResponse('thanks');
        }
        
        // Weather queries
        if (lowerMessage.match(/(weather|temperature|climate|mausam)/)) {
            return this.getRandomResponse('weather');
        }
        
        // Emergency
        if (lowerMessage.match(/(emergency|help|police|ambulance|danger)/)) {
            return this.getRandomResponse('emergency');
        }
        
        // Destinations
        if (lowerMessage.match(/(destination|place|visit|tourist spot|ghumne)/)) {
            return this.getDestinationRecommendations(message);
        }
        
        // Culture queries
        if (lowerMessage.match(/(culture|festival|tribe|tribal|sanskriti)/)) {
            return this.getCulturalInfo(message);
        }
        
        // Food queries
        if (lowerMessage.match(/(food|eat|restaurant|khana|dish)/)) {
            return this.getFoodRecommendations(message);
        }
        
        // Hotel/Stay queries
        if (lowerMessage.match(/(hotel|stay|accommodation|lodge|rukne)/)) {
            return this.getAccommodationInfo(message);
        }
        
        // Transport queries
        if (lowerMessage.match(/(transport|bus|train|taxi|flight|jane)/)) {
            return this.getTransportInfo(message);
        }
        
        // Default response with suggestions
        return this.getDefaultResponse(message);
    }

    getRandomResponse(type) {
        const responses = this.responses[type];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getDestinationRecommendations(message) {
        const recommendations = [
            "🏔️ **Netarhat** - Hill station perfect for sunrise views",
            "💧 **Hundru Falls** - Spectacular 98m waterfall",
            "🐅 **Betla National Park** - Wildlife and tiger reserve",
            "🛕 **Deoghar** - Sacred pilgrimage site",
            "🌲 **Hazaribagh Wildlife Sanctuary** - Rich biodiversity"
        ];
        
        return `Here are top destinations in Jharkhand:\n\n${recommendations.join('\n')}\n\nWhich type interests you - Nature, Culture, or Adventure?`;
    }

    getCulturalInfo(message) {
        return `🎭 **Jharkhand's Rich Culture:**\n\n• **32 Tribal Groups** - Santhal, Munda, Oraon, Ho\n• **Festivals** - Sarhul, Karma, Sohrai\n• **Arts** - Dokra metal craft, Paitkar paintings\n• **Dance** - Jhumar, Paika, Chhau\n• **Music** - Traditional drums and flutes\n\nWould you like to visit any tribal villages or cultural centers?`;
    }

    getFoodRecommendations(message) {
        return `🍽️ **Must-try Jharkhand Cuisine:**\n\n• **Dhuska** - Rice pancakes with curry\n• **Pittha** - Sweet rice dumplings\n• **Litti Chokha** - Baked wheat balls\n• **Handia** - Traditional rice beer\n• **Rugra** - Wild mushroom curry\n• **Bamboo Shoot** curry\n\nI can help you find restaurants serving these dishes!`;
    }

    getAccommodationInfo(message) {
        return `🏨 **Accommodation Options:**\n\n• **Government Tourist Lodges** - Budget-friendly\n• **Forest Rest Houses** - Nature experience\n• **Heritage Hotels** - Cultural immersion\n• **Eco Resorts** - Sustainable stays\n• **Tribal Homestays** - Authentic experience\n\nWhich city are you planning to visit? I can suggest specific places.`;
    }

    getTransportInfo(message) {
        return `🚗 **Getting Around Jharkhand:**\n\n• **By Air** - Ranchi (Birsa Munda Airport)\n• **By Train** - Well connected to major cities\n• **By Bus** - State transport & private buses\n• **Local Transport** - Taxis, auto-rickshaws\n• **For Remote Areas** - Jeeps recommended\n\nFrom which city are you traveling?`;
    }

    getDefaultResponse(message) {
        const suggestions = [
            "Ask about popular destinations",
            "Learn about tribal culture",
            "Get weather information", 
            "Find food recommendations",
            "Plan your itinerary"
        ];
        
        return `I'd be happy to help! Here's what I can assist you with:\n\n${suggestions.map(s => `• ${s}`).join('\n')}\n\nOr you can ask me anything about Jharkhand tourism!`;
    }

    handleQuickReply(reply) {
        const response = this.quickReplies[reply] || this.getDefaultResponse(reply);
        this.addMessage(reply, 'user');
        
        setTimeout(() => {
            this.addMessage(response, 'bot');
        }, 800);
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    toggleVoiceInput() {
        const voiceBtn = document.getElementById('voiceInput');
        
        if (!this.recognition) {
            alert('Speech recognition not supported in your browser');
            return;
        }

        if (this.isListening) {
            this.stopVoiceInput();
        } else {
            this.startVoiceInput();
        }
    }

    startVoiceInput() {
        const voiceBtn = document.getElementById('voiceInput');
        this.isListening = true;
        voiceBtn.classList.add('recording');
        this.recognition.start();
    }

    stopVoiceInput() {
        const voiceBtn = document.getElementById('voiceInput');
        this.isListening = false;
        voiceBtn.classList.remove('recording');
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    showQuickReplies(suggestions) {
        // Remove existing quick replies
        const existingReplies = document.querySelector('.quick-replies-container');
        if (existingReplies) {
            existingReplies.remove();
        }

        if (!suggestions || suggestions.length === 0) return;

        const messagesContainer = document.getElementById('chatMessages');
        const repliesContainer = document.createElement('div');
        repliesContainer.className = 'quick-replies-container';

        const repliesDiv = document.createElement('div');
        repliesDiv.className = 'quick-replies';

        suggestions.forEach(suggestion => {
            const replyBtn = document.createElement('button');
            replyBtn.className = 'quick-reply';
            replyBtn.textContent = suggestion;
            replyBtn.addEventListener('click', () => {
                document.getElementById('chatInput').value = suggestion;
                this.sendMessage();
                repliesContainer.remove();
            });
            repliesDiv.appendChild(replyBtn);
        });

        repliesContainer.appendChild(repliesDiv);
        messagesContainer.appendChild(repliesContainer);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showDestinationCards(destinations) {
        if (!destinations || destinations.length === 0) return;

        const messagesContainer = document.getElementById('chatMessages');
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'destination-cards-container';

        destinations.slice(0, 3).forEach(destination => {
            const card = document.createElement('div');
            card.className = 'destination-card';
            
            card.innerHTML = `
                <div class="card-image">
                    <img src="${destination.images?.[0] || '/assets/images/jharkhand-hero.png'}" 
                         alt="${destination.name}" 
                         onerror="this.src='/assets/images/jharkhand-hero.png'">
                </div>
                <div class="card-content">
                    <h3>${destination.name}</h3>
                    <p class="card-location">📍 ${destination.location?.district || 'Jharkhand'}</p>
                    <p class="card-description">${destination.description?.substring(0, 100)}...</p>
                    <div class="card-rating">
                        ⭐ ${destination.rating?.average || 4.5}/5
                    </div>
                    <button class="card-btn" onclick="tourismChatbot.getDestinationDetails('${destination._id}')">
                        More Details
                    </button>
                </div>
            `;
            
            cardsContainer.appendChild(card);
        });

        messagesContainer.appendChild(cardsContainer);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showWeatherCard(weatherData) {
        if (!weatherData) return;

        const messagesContainer = document.getElementById('chatMessages');
        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';

        weatherCard.innerHTML = `
            <div class="weather-header">
                <h3>🌤️ Weather in ${weatherData.city}</h3>
            </div>
            <div class="weather-content">
                <div class="weather-temp">
                    <span class="temp">${weatherData.temperature}°C</span>
                    <span class="condition">${weatherData.condition || 'Clear'}</span>
                </div>
                <div class="weather-details">
                    <div class="weather-item">
                        <i class="fas fa-tint"></i>
                        <span>Humidity: ${weatherData.humidity}%</span>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-wind"></i>
                        <span>Wind: ${weatherData.windSpeed} km/h</span>
                    </div>
                </div>
                <p class="weather-description">${weatherData.description}</p>
            </div>
        `;

        messagesContainer.appendChild(weatherCard);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async getDestinationDetails(destinationId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/destinations/${destinationId}`);
            const data = await response.json();
            
            if (data.success) {
                const destination = data.data;
                const message = `📍 **${destination.name}**\n\n${destination.description}\n\n⭐ Rating: ${destination.rating.average}/5\n📍 Location: ${destination.location.district}\n💰 Entry Fee: ${destination.details?.entryFee?.indian ? '₹' + destination.details.entryFee.indian : 'Free'}\n\nWould you like directions or booking information?`;
                
                this.addMessage(message, 'bot');
                this.showQuickReplies(['Get Directions', 'Book Now', 'Similar Places', 'Weather Info']);
            }
        } catch (error) {
            console.error('Error fetching destination details:', error);
            this.addMessage('Sorry, I couldn\'t fetch the details right now. Please try again.', 'bot');
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tourismChatbot = new TourismChatbot();
});