const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const destinationRoutes = require('./routes/destinations');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');
const chatbotRoutes = require('./routes/chatbot');
const weatherRoutes = require('./routes/weather');
const reviewRoutes = require('./routes/reviews');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jharkhand-tourism';

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
            scriptSrc: ["'self'", "https://unpkg.com", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "ws:", "wss:"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});

app.use(limiter);

// Compression and logging
app.use(compression());
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ Connected to MongoDB');
})
.catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);
    
    // Join user to room based on their ID
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });
    
    // Handle chatbot messages
    socket.on('chatbot_message', async (data) => {
        try {
            const response = await processChatbotMessage(data.message, data.userId);
            socket.emit('chatbot_response', response);
        } catch (error) {
            socket.emit('chatbot_error', { message: 'Sorry, I encountered an error. Please try again.' });
        }
    });
    
    // Handle real-time location updates
    socket.on('location_update', (data) => {
        socket.broadcast.emit('user_location', data);
    });
    
    // Handle booking updates
    socket.on('booking_update', (data) => {
        io.to(data.userId).emit('booking_notification', data);
    });
    
    socket.on('disconnect', () => {
        console.log('🔌 User disconnected:', socket.id);
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve static files from frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    });
}

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    server.close(() => {
        console.log('Process terminated');
        mongoose.connection.close();
    });
});

// Simple chatbot message processor
async function processChatbotMessage(message, userId) {
    const lowerMessage = message.toLowerCase();
    
    // Simple rule-based responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
        return {
            message: 'Namaste! Welcome to Jharkhand Tourism. How can I help you explore our beautiful state?',
            suggestions: ['Popular destinations', 'Weather info', 'Cultural sites', 'Plan a trip']
        };
    }
    
    if (lowerMessage.includes('destination') || lowerMessage.includes('place')) {
        return {
            message: 'Here are some amazing destinations in Jharkhand:\n• Betla National Park - Wildlife sanctuary\n• Hundru Falls - 98m waterfall\n• Netarhat - Hill station\n• Deoghar - Sacred temple\n\nWhich one interests you?',
            suggestions: ['Betla National Park', 'Hundru Falls', 'Netarhat', 'Deoghar']
        };
    }
    
    if (lowerMessage.includes('weather')) {
        return {
            message: 'The weather in Jharkhand varies by season:\n• Winter (Oct-Feb): Pleasant, 10-25°C\n• Summer (Mar-May): Hot, 25-42°C\n• Monsoon (Jun-Sep): Rainy, 22-32°C\n\nBest time to visit is October to March!',
            suggestions: ['Current weather', 'Best time to visit', 'Seasonal activities']
        };
    }
    
    if (lowerMessage.includes('culture') || lowerMessage.includes('festival')) {
        return {
            message: 'Jharkhand has rich tribal culture!\n• 32 tribal communities\n• Festivals: Sarhul, Karma, Sohrai\n• Arts: Dokra craft, tribal paintings\n• Music & Dance: Traditional performances\n\nWould you like to know about specific cultural sites?',
            suggestions: ['Tribal villages', 'Festivals', 'Handicrafts', 'Cultural centers']
        };
    }
    
    // Default response
    return {
        message: 'I\'m here to help you explore Jharkhand! You can ask me about:\n• Tourist destinations\n• Weather information\n• Cultural sites\n• Trip planning\n• Local cuisine\n• Transportation\n\nWhat would you like to know?',
        suggestions: ['Popular destinations', 'Plan a trip', 'Cultural sites', 'Weather info']
    };
}

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});

module.exports = { app, io };