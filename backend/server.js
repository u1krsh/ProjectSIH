const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const PORT = process.env.PORT || 5000;

// MySQL Database Configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jharkhand_tourism',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

// Create MySQL connection pool
const db = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('⚠️  Server will continue running without database functionality');
        // Don't exit the process - continue running for API endpoints that don't need database
    }
}

// Make database connection available to routes
app.set('db', db);

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
    origin: [
        process.env.CLIENT_URL || 'http://localhost:3000',
        'http://localhost:8000',
        'http://127.0.0.1:8000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Create upload directories if they don't exist
const uploadDirs = [
    'uploads',
    'uploads/marketplace',
    'uploads/folklore',
    'uploads/folklore/audio',
    'uploads/folklore/images',
    'uploads/homestays'
];

uploadDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created directory: ${fullPath}`);
    }
});

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
console.log('📝 Registering API routes...');
app.use('/api/auth', require('./routes/auth'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/folklore', require('./routes/folklore'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/chatbot', require('./routes/chatbot'));
console.log('✅ Weather API route registered at /api/weather');

// Serve static files from frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    });
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Default error
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = { message, statusCode: 400 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};

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
            message: 'Namaste! Welcome to Tribal Trails. How can I help you explore our beautiful state?',
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
async function startServer() {
    try {
        await testConnection();
        
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
            console.log(`📁 Upload directories created`);
            console.log(`🔗 API available at http://localhost:${PORT}/api`);
            console.log(`❤️  Health check at http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('HTTP server closed');
    });
    await db.end();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('HTTP server closed');
    });
    await db.end();
    process.exit(0);
});

module.exports = { app, io };