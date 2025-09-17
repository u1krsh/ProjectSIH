const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// Enhanced chatbot with NLP-like responses
class ChatbotService {
    constructor() {
        this.responses = {
            greetings: [
                "नमस्ते! Welcome to Tribal Trails! 🙏 I'm here to help you discover the incredible beauty of Jharkhand. What interests you most?",
                "Hello! Welcome to the land of forests and waterfalls! 🌲💧 How can I help you explore Jharkhand today?",
                "Namaste! Ready to discover Jharkhand's hidden gems? 🏔️ I'm your personal tourism guide!"
            ],
            destinations: {
                general: "Jharkhand has amazing destinations! Here are some highlights:\n\n🐅 **Betla National Park** - Tiger reserve and wildlife sanctuary\n💧 **Hundru Falls** - 98m spectacular waterfall\n🏔️ **Netarhat** - Queen of Chotanagpur plateau\n🛕 **Deoghar** - Sacred Baidyanath Temple\n\nWhich type interests you - Wildlife, Nature, Culture, or Adventure?",
                wildlife: "🐅 **Wildlife Destinations in Jharkhand:**\n\n• **Betla National Park** - Tigers, elephants, and diverse wildlife\n• **Hazaribagh Wildlife Sanctuary** - Leopards and bird watching\n• **Dalma Wildlife Sanctuary** - Elephants and scenic views\n\nBest time: November to April. Would you like safari booking information?",
                nature: "🌿 **Natural Wonders of Jharkhand:**\n\n• **Hundru Falls** - 98m high waterfall (Jul-Feb best)\n• **Dassam Falls** - Beautiful cascade waterfall\n• **Netarhat** - Sunrise/sunset viewpoint\n• **Parasnath Hill** - Highest peak in Jharkhand\n\nPerfect for photography and nature walks!",
                cultural: "🎭 **Cultural Heritage Sites:**\n\n• **Tribal Museums** - Rich tribal culture\n• **Traditional Villages** - Authentic experiences\n• **Handicraft Centers** - Dokra art, bamboo crafts\n• **Festival Locations** - Sarhul, Karma celebrations\n\nWould you like to visit tribal villages?",
                adventure: "🏔️ **Adventure Activities:**\n\n• **Parasnath Trekking** - Highest peak challenge\n• **Rock Climbing** - Various difficulty levels\n• **River Rafting** - Seasonal water sports\n• **Camping** - Under starlit skies\n\nWhat's your adventure experience level?",
                religious: "🛕 **Sacred Places:**\n\n• **Baidyanath Dham, Deoghar** - One of 12 Jyotirlingas\n• **Parasnath Hill** - Sacred Jain pilgrimage\n• **Jagannath Temple, Ranchi** - Replica of Puri temple\n• **Various Tribal Sacred Groves**\n\nLooking for spiritual experiences or pilgrimage tours?"
            },
            weather: {
                general: "🌤️ **Jharkhand Weather Guide:**\n\n**Best Time to Visit:** October to March\n• **Winter (Oct-Feb):** Pleasant 10-25°C ❄️\n• **Summer (Mar-May):** Hot 25-42°C ☀️\n• **Monsoon (Jun-Sep):** Rainy 22-32°C 🌧️\n\nWhich season are you planning to visit?",
                current: "Let me check the current weather conditions for you! Which city or destination in Jharkhand interests you?",
                seasonal: {
                    winter: "❄️ **Winter in Jharkhand (Oct-Mar):**\nPerfect weather for tourism! Pleasant days, cool nights. Ideal for all outdoor activities, wildlife safaris, and sightseeing.",
                    summer: "☀️ **Summer in Jharkhand (Apr-Jun):**\nHot and dry. Early morning and evening activities recommended. Great for hill stations like Netarhat.",
                    monsoon: "🌧️ **Monsoon in Jharkhand (Jul-Sep):**\nWaterfalls at their best! Lush green landscapes. Some areas may be difficult to access due to rain."
                }
            },
            culture: {
                general: "🎭 **Rich Tribal Culture of Jharkhand:**\n\n**32 Tribal Communities** including:\n• Santhal - Largest tribe\n• Munda - Known for Birsa Munda\n• Oraon - Rich traditions\n• Ho - Unique customs\n\n**Cultural Elements:**\n🎵 Music & Dance\n🎨 Art & Crafts\n🍽️ Traditional Cuisine\n🎉 Festivals\n\nWhat cultural aspect interests you most?",
                festivals: "🎉 **Major Festivals:**\n\n• **Sarhul** (Spring) - Worship of Sal trees\n• **Karma** (Monsoon) - Nature worship\n• **Sohrai** (Winter) - Harvest festival\n• **Tusu Parab** - Folk celebration\n\nThese festivals offer authentic cultural experiences!",
                food: "🍽️ **Traditional Jharkhand Cuisine:**\n\n• **Dhuska** - Rice pancakes with curry\n• **Pittha** - Sweet rice dumplings\n• **Litti Chokha** - Baked wheat balls\n• **Handia** - Traditional rice beer\n• **Rugra** - Wild mushroom curry\n\nWould you like restaurant recommendations?",
                crafts: "🎨 **Traditional Handicrafts:**\n\n• **Dokra Art** - Ancient metal casting\n• **Bamboo Crafts** - Sustainable art\n• **Tribal Paintings** - Sohrai & Khovar art\n• **Handloom Textiles** - Traditional weaving\n\nInterested in craft workshops or shopping locations?"
            },
            travel: {
                transport: "🚗 **Getting Around Jharkhand:**\n\n✈️ **By Air:** Ranchi (Birsa Munda Airport)\n🚂 **By Train:** Well connected to major cities\n🚌 **By Bus:** State and private buses\n🚗 **Local:** Taxis, auto-rickshaws\n🏔️ **Remote Areas:** Jeeps recommended\n\nFrom which city are you traveling?",
                accommodation: "🏨 **Accommodation Options:**\n\n• **Government Tourist Lodges** - Budget-friendly\n• **Forest Rest Houses** - Nature experience\n• **Heritage Hotels** - Cultural immersion\n• **Eco Resorts** - Sustainable stays\n• **Tribal Homestays** - Authentic experience\n\nWhat's your budget range?",
                itinerary: "📅 **Popular Itineraries:**\n\n**2-3 Days:** Ranchi + Hundru Falls + Netarhat\n**4-5 Days:** Above + Betla National Park\n**7 Days:** Complete Jharkhand tour with tribal villages\n\nHow many days do you have for your trip?"
            },
            emergency: {
                contacts: "🚨 **Emergency Contacts:**\n\n• **Police:** 100\n• **Medical Emergency:** 108\n• **Fire Service:** 101\n• **Tourist Helpline:** 1363\n• **Disaster Management:** 108\n\n**Tourist Support:**\n• Tribal Trails: +91-651-2446441\n• 24/7 Helpline: 1363",
                safety: "🛡️ **Safety Tips:**\n\n• Carry ID proofs always\n• Inform someone about your itinerary\n• Use registered tour operators\n• Respect local customs\n• Stay in groups during night time\n• Keep emergency contacts handy"
            }
        };
        
        this.quickActions = {
            'popular_destinations': 'Show me popular destinations',
            'weather_info': 'What\'s the weather like?',
            'cultural_sites': 'Tell me about culture',
            'plan_trip': 'Help me plan a trip',
            'emergency_help': 'Emergency information',
            'food_recommendations': 'Local cuisine guide'
        };
    }

    async processMessage(message, userId, conversationHistory = []) {
        const lowerMessage = message.toLowerCase();
        let response = {
            message: '',
            suggestions: [],
            quickActions: [],
            data: null,
            type: 'text'
        };

        try {
            // Greeting detection
            if (this.isGreeting(lowerMessage)) {
                response.message = this.getRandomResponse(this.responses.greetings);
                response.suggestions = ['Popular destinations', 'Weather info', 'Cultural sites', 'Plan trip'];
                response.quickActions = ['popular_destinations', 'weather_info', 'cultural_sites', 'plan_trip'];
            }
            
            // Destination queries
            else if (this.isDestinationQuery(lowerMessage)) {
                const destinationType = this.detectDestinationType(lowerMessage);
                if (destinationType && this.responses.destinations[destinationType]) {
                    response.message = this.responses.destinations[destinationType];
                    response.suggestions = this.getDestinationSuggestions(destinationType);
                } else {
                    response.message = this.responses.destinations.general;
                    response.suggestions = ['Wildlife parks', 'Waterfalls', 'Cultural sites', 'Adventure sports'];
                }
                
                // Fetch actual destination data
                response.data = await this.getDestinationData(destinationType);
                response.type = 'destinations';
            }
            
            // Weather queries
            else if (this.isWeatherQuery(lowerMessage)) {
                const city = this.extractCityName(lowerMessage);
                if (city) {
                    response.data = await this.getWeatherData(city);
                    response.message = `🌤️ **Current weather in ${city}:**\n\n🌡️ Temperature: ${response.data.temperature}°C\n💧 Humidity: ${response.data.humidity}%\n💨 Wind: ${response.data.windSpeed} km/h\n\n${response.data.description}`;
                    response.type = 'weather';
                } else {
                    response.message = this.responses.weather.general;
                }
                response.suggestions = ['Current weather', 'Best time to visit', 'Weather alerts'];
            }
            
            // Culture queries
            else if (this.isCultureQuery(lowerMessage)) {
                const cultureType = this.detectCultureType(lowerMessage);
                if (cultureType && this.responses.culture[cultureType]) {
                    response.message = this.responses.culture[cultureType];
                } else {
                    response.message = this.responses.culture.general;
                }
                response.suggestions = ['Festivals', 'Traditional food', 'Handicrafts', 'Tribal villages'];
                response.type = 'culture';
            }
            
            // Travel planning queries
            else if (this.isTravelQuery(lowerMessage)) {
                const travelType = this.detectTravelType(lowerMessage);
                if (travelType && this.responses.travel[travelType]) {
                    response.message = this.responses.travel[travelType];
                } else {
                    response.message = "I can help you plan your Jharkhand trip! What specific information do you need?";
                }
                response.suggestions = ['Transportation', 'Accommodation', 'Itinerary planning', 'Budget guide'];
                response.type = 'travel';
            }
            
            // Emergency queries
            else if (this.isEmergencyQuery(lowerMessage)) {
                response.message = this.responses.emergency.contacts;
                response.suggestions = ['Safety tips', 'Medical facilities', 'Tourist helpline'];
                response.type = 'emergency';
            }
            
            // Specific destination queries
            else if (this.isSpecificDestination(lowerMessage)) {
                const destination = this.extractDestinationName(lowerMessage);
                response.data = await this.getSpecificDestinationInfo(destination);
                if (response.data) {
                    response.message = this.formatDestinationInfo(response.data);
                    response.type = 'destination_detail';
                    response.suggestions = ['Get directions', 'Book tour', 'Nearby places', 'Weather info'];
                } else {
                    response.message = `I couldn't find specific information about "${destination}". Let me show you popular destinations instead.`;
                    response.data = await this.getDestinationData('general');
                }
            }
            
            // Thanks/positive feedback
            else if (this.isThanks(lowerMessage)) {
                response.message = "You're welcome! I'm happy to help you explore Jharkhand. Is there anything else you'd like to know about our beautiful state? 😊";
                response.suggestions = ['More destinations', 'Travel tips', 'Local culture', 'Plan another trip'];
            }
            
            // Default response
            else {
                response = await this.getDefaultResponse(lowerMessage);
            }

            // Add personality and context
            response.timestamp = new Date().toISOString();
            response.conversationId = userId;
            
            return response;

        } catch (error) {
            console.error('Chatbot processing error:', error);
            return {
                message: "I apologize, but I'm having trouble processing your request right now. Please try asking again or contact our support team for immediate assistance.",
                suggestions: ['Try again', 'Contact support', 'Emergency help'],
                type: 'error'
            };
        }
    }

    // Helper methods for message classification
    isGreeting(message) {
        const greetings = ['hello', 'hi', 'hey', 'namaste', 'namaskar', 'good morning', 'good afternoon', 'good evening'];
        return greetings.some(greeting => message.includes(greeting));
    }

    isDestinationQuery(message) {
        const keywords = ['destination', 'place', 'visit', 'see', 'go', 'tourist', 'attraction', 'spot', 'location'];
        return keywords.some(keyword => message.includes(keyword));
    }

    isWeatherQuery(message) {
        const keywords = ['weather', 'temperature', 'climate', 'rain', 'hot', 'cold', 'sunny', 'cloudy', 'mausam'];
        return keywords.some(keyword => message.includes(keyword));
    }

    isCultureQuery(message) {
        const keywords = ['culture', 'festival', 'tribe', 'tribal', 'tradition', 'custom', 'art', 'craft', 'food', 'cuisine', 'sanskriti'];
        return keywords.some(keyword => message.includes(keyword));
    }

    isTravelQuery(message) {
        const keywords = ['travel', 'trip', 'plan', 'itinerary', 'hotel', 'stay', 'transport', 'bus', 'train', 'flight'];
        return keywords.some(keyword => message.includes(keyword));
    }

    isEmergencyQuery(message) {
        const keywords = ['emergency', 'help', 'police', 'hospital', 'doctor', 'accident', 'danger', 'problem'];
        return keywords.some(keyword => message.includes(keyword));
    }

    isSpecificDestination(message) {
        const destinations = ['betla', 'hundru', 'netarhat', 'deoghar', 'ranchi', 'hazaribagh', 'parasnath', 'dassam'];
        return destinations.some(dest => message.includes(dest));
    }

    isThanks(message) {
        const thanks = ['thank', 'thanks', 'dhanyawad', 'appreciate', 'helpful'];
        return thanks.some(word => message.includes(word));
    }

    // Type detection methods
    detectDestinationType(message) {
        if (['wildlife', 'animal', 'tiger', 'elephant', 'safari', 'betla', 'national park'].some(word => message.includes(word))) {
            return 'wildlife';
        }
        if (['waterfall', 'nature', 'natural', 'hundru', 'dassam', 'falls'].some(word => message.includes(word))) {
            return 'nature';
        }
        if (['culture', 'tribal', 'tradition', 'art', 'museum'].some(word => message.includes(word))) {
            return 'cultural';
        }
        if (['adventure', 'trek', 'climb', 'parasnath', 'hill', 'mountain'].some(word => message.includes(word))) {
            return 'adventure';
        }
        if (['temple', 'religious', 'pilgrimage', 'deoghar', 'baidyanath'].some(word => message.includes(word))) {
            return 'religious';
        }
        return null;
    }

    detectCultureType(message) {
        if (['festival', 'celebration', 'sarhul', 'karma', 'sohrai'].some(word => message.includes(word))) {
            return 'festivals';
        }
        if (['food', 'cuisine', 'eat', 'dhuska', 'pittha', 'dish'].some(word => message.includes(word))) {
            return 'food';
        }
        if (['craft', 'art', 'dokra', 'bamboo', 'painting'].some(word => message.includes(word))) {
            return 'crafts';
        }
        return 'general';
    }

    detectTravelType(message) {
        if (['transport', 'bus', 'train', 'flight', 'travel', 'reach'].some(word => message.includes(word))) {
            return 'transport';
        }
        if (['hotel', 'stay', 'accommodation', 'lodge', 'resort'].some(word => message.includes(word))) {
            return 'accommodation';
        }
        if (['plan', 'itinerary', 'schedule', 'days', 'trip'].some(word => message.includes(word))) {
            return 'itinerary';
        }
        return null;
    }

    // Data fetching methods
    async getDestinationData(type = 'all') {
        try {
            const query = type === 'all' ? {} : { type: type };
            const destinations = await Destination.find({ ...query, status: 'active' })
                .limit(6)
                .select('name description type images rating location coordinates')
                .sort({ 'rating.average': -1 });
            return destinations;
        } catch (error) {
            console.error('Error fetching destinations:', error);
            return [];
        }
    }

    async getWeatherData(city) {
        // This would typically call the weather API
        // For now, return mock data
        return {
            city: city,
            temperature: 25,
            humidity: 65,
            windSpeed: 8,
            condition: 'partly_cloudy',
            description: 'Pleasant weather perfect for sightseeing!'
        };
    }

    async getSpecificDestinationInfo(destinationName) {
        try {
            const destination = await Destination.findOne({
                name: new RegExp(destinationName, 'i'),
                status: 'active'
            });
            return destination;
        } catch (error) {
            console.error('Error fetching specific destination:', error);
            return null;
        }
    }

    // Utility methods
    extractCityName(message) {
        const cities = ['ranchi', 'jamshedpur', 'dhanbad', 'bokaro', 'deoghar', 'hazaribagh'];
        return cities.find(city => message.includes(city));
    }

    extractDestinationName(message) {
        const destinations = ['betla', 'hundru', 'netarhat', 'deoghar', 'hazaribagh', 'parasnath', 'dassam'];
        return destinations.find(dest => message.includes(dest));
    }

    formatDestinationInfo(destination) {
        return `📍 **${destination.name}**\n\n${destination.description}\n\n⭐ Rating: ${destination.rating.average}/5\n📍 Location: ${destination.location.district}\n💰 Entry Fee: ${destination.details?.entryFee?.indian ? '₹' + destination.details.entryFee.indian : 'Free'}\n⏰ Best Time: ${destination.details?.bestTimeToVisit || 'Year round'}\n\nWould you like directions or more details?`;
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getDestinationSuggestions(type) {
        const suggestions = {
            wildlife: ['Betla National Park', 'Hazaribagh Sanctuary', 'Safari bookings', 'Best viewing times'],
            nature: ['Hundru Falls', 'Dassam Falls', 'Netarhat sunrise', 'Photography tips'],
            cultural: ['Tribal villages', 'Handicraft centers', 'Cultural festivals', 'Traditional food'],
            adventure: ['Parasnath trekking', 'Rock climbing', 'Camping sites', 'Adventure gear'],
            religious: ['Deoghar temple', 'Parasnath pilgrimage', 'Religious festivals', 'Accommodation']
        };
        return suggestions[type] || ['More destinations', 'Plan visit', 'Get directions', 'Weather info'];
    }

    async getDefaultResponse(message) {
        // Analyze message for keywords and provide intelligent response
        const keywordResponses = {
            'booking': "For bookings, I recommend contacting authorized tour operators or visiting the official Tribal Trails website. Would you like me to provide contact details?",
            'cost': "Costs vary by destination and season. Most natural sites have minimal entry fees (₹10-50). Accommodation ranges from ₹500-5000+ per night. Would you like specific budget information?",
            'best time': "The best time to visit Jharkhand is October to March when the weather is pleasant. Waterfalls are best during monsoon (July-September). Which specific destination interests you?",
            'distance': "I can help with distances between cities and attractions. Which route are you planning? From which city will you be traveling?",
            'permit': "Most tourist destinations in Jharkhand don't require special permits. Some forest areas may need entry permissions. Which specific location are you visiting?"
        };

        for (const [keyword, response] of Object.entries(keywordResponses)) {
            if (message.includes(keyword)) {
                return {
                    message: response,
                    suggestions: ['More information', 'Contact details', 'Plan trip', 'Other destinations'],
                    type: 'helpful'
                };
            }
        }

        return {
            message: "I'm here to help you explore Jharkhand! 🌟\n\nI can assist you with:\n• Tourist destinations and attractions\n• Weather information\n• Cultural sites and festivals\n• Travel planning and itineraries\n• Local cuisine and restaurants\n• Transportation and accommodation\n\nWhat would you like to know about Jharkhand?",
            suggestions: ['Popular destinations', 'Weather info', 'Cultural sites', 'Plan a trip'],
            quickActions: ['popular_destinations', 'weather_info', 'cultural_sites', 'plan_trip'],
            type: 'default'
        };
    }
}

// Routes
const chatbotService = new ChatbotService();

// POST /api/chatbot/message - Process chatbot message
router.post('/message', async (req, res) => {
    try {
        const { message, userId, conversationHistory } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const response = await chatbotService.processMessage(
            message.trim(),
            userId || 'anonymous',
            conversationHistory || []
        );

        res.json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error('Chatbot route error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing message',
            error: error.message
        });
    }
});

// GET /api/chatbot/suggestions - Get conversation starters
router.get('/suggestions', (req, res) => {
    const suggestions = [
        "What are the popular destinations in Jharkhand?",
        "What's the weather like in Ranchi?",
        "Tell me about tribal culture",
        "How can I plan a 3-day trip?",
        "What are the best waterfalls to visit?",
        "Where can I see wildlife in Jharkhand?",
        "What festivals are celebrated here?",
        "What local food should I try?"
    ];

    res.json({
        success: true,
        data: suggestions
    });
});

// GET /api/chatbot/quick-actions - Get quick action buttons
router.get('/quick-actions', (req, res) => {
    const quickActions = [
        { id: 'popular_destinations', label: '🏔️ Popular Places', action: 'Show me popular destinations' },
        { id: 'weather_info', label: '🌤️ Weather', action: 'What\'s the weather like?' },
        { id: 'cultural_sites', label: '🎭 Culture', action: 'Tell me about culture' },
        { id: 'plan_trip', label: '📅 Plan Trip', action: 'Help me plan a trip' },
        { id: 'food_guide', label: '🍽️ Food Guide', action: 'What local food should I try?' },
        { id: 'emergency_help', label: '🚨 Emergency', action: 'Emergency information' }
    ];

    res.json({
        success: true,
        data: quickActions
    });
});

module.exports = router;