# Tribal Trails - Smart Tourism Platform 🏔️

## Overview
A comprehensive hackathon-ready tourism platform for Jharkhand featuring enhanced frontend, real interactive mapping, and a complete backend infrastructure with AI-powered chatbot.

## ✨ Latest Enhancements (Hackathon-Ready)

### 🎨 Frontend Improvements
- **Enhanced CSS System**: Modern CSS variables with professional color scheme
- **Responsive Design**: Perfect mobile and desktop experience
- **Real Interactive Map**: Leaflet.js with actual Jharkhand coordinates and attractions
- **Loading Optimizations**: Smooth transitions and better UX

### 🗺️ Interactive Map Features
- **Real Coordinates**: Actual Jharkhand tourist destinations with precise locations
- **Interactive Markers**: Clickable destination markers with details
- **Marker Clustering**: Organized display for multiple nearby attractions
- **Routing System**: Get directions between locations
- **Search Functionality**: Find destinations easily
- **Weather Layer**: Real-time weather overlay
- **Custom Controls**: Zoom, fullscreen, and location controls

### 🚀 Backend Infrastructure
- **Express.js Server**: Production-ready with security middleware
- **MongoDB Integration**: Complete database with Mongoose models
- **Socket.IO**: Real-time communication for chatbot and notifications
- **RESTful APIs**: Comprehensive destination, weather, and user management
- **Authentication**: JWT-based secure authentication system
- **File Upload**: Multer integration for image handling

### 🤖 AI-Enhanced Chatbot
- **NLP-like Processing**: Smart message understanding and contextual responses
- **Real-time Communication**: Socket.IO for instant responses
- **Rich Responses**: Interactive cards, weather widgets, destination recommendations
- **Multilingual Support**: Hindi and English responses
- **Quick Actions**: Predefined helpful queries
- **Context Awareness**: Maintains conversation history

### 📊 API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

#### Destinations
- `GET /api/destinations` - List all destinations with filters
- `GET /api/destinations/:id` - Get destination details
- `POST /api/destinations` - Add new destination (admin)
- `PUT /api/destinations/:id` - Update destination
- `DELETE /api/destinations/:id` - Delete destination

#### Weather
- `GET /api/weather/current/:city` - Current weather for city
- `GET /api/weather/forecast/:city` - Weather forecast
- `GET /api/weather/cities` - Available cities list

#### Chatbot
- `POST /api/chatbot/message` - Process chatbot message
- `GET /api/chatbot/suggestions` - Get conversation starters
- `GET /api/chatbot/quick-actions` - Get quick action buttons

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Configure environment variables in .env:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jharkhand-tourism
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to project root
cd ..

# Serve frontend (using any local server)
# Option 1: Python
python -m http.server 3000

# Option 2: Live Server (VS Code extension)
# Right-click index.html > Open with Live Server

# Option 3: Node.js serve
npx serve . -p 3000
```

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create database: `jharkhand-tourism`
3. Collections will be created automatically by Mongoose

## 🏃‍♂️ Quick Start

1. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   # Use any method to serve static files on port 3000
   python -m http.server 3000
   ```

3. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎯 Hackathon Features

### ✅ Completed Features
- **Enhanced UI/UX**: Professional design with modern animations
- **Real Interactive Map**: Leaflet.js with Jharkhand destinations
- **Complete Backend**: Express.js server with MongoDB
- **AI Chatbot**: NLP-like processing with rich responses
- **Real-time Features**: Socket.IO integration
- **Authentication System**: JWT-based user management
- **Responsive Design**: Mobile and desktop optimized
- **API Documentation**: Complete REST API endpoints

### 📱 Mobile Responsive
- Optimized for all screen sizes
- Touch-friendly interface
- Mobile-first design approach

### 🔒 Security Features
- JWT authentication
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers

### 🎨 Design Excellence
- Modern gradient designs
- Smooth animations
- Professional color scheme
- Consistent UI components
- Dark theme support

## 🗂️ Project Structure
```
ProjectSIH/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Main server file
│   └── package.json     # Backend dependencies
├── styles/              # CSS files
├── js/                  # JavaScript files
├── assets/              # Images and static files
└── index.html           # Main HTML file
```

## 🚀 Deployment Ready
- Production-optimized code
- Environment configuration
- Database models ready
- API endpoints tested
- Error handling implemented
- Logging and monitoring ready

## 🏆 Hackathon Scoring Points
1. **Innovation**: AI-powered chatbot with NLP-like processing
2. **Technical Excellence**: Full-stack implementation with modern technologies
3. **User Experience**: Intuitive design with real interactive features
4. **Scalability**: Production-ready architecture
5. **Mobile Responsiveness**: Perfect cross-device experience
6. **Real-time Features**: Socket.IO for instant communication
7. **Security**: Comprehensive authentication and security measures
8. **API Design**: RESTful architecture with proper documentation

## 📊 Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript ES6+, Leaflet.js, Socket.IO
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.IO
- **Security**: JWT, bcryptjs, Helmet, CORS, Rate Limiting
- **Real-time**: Socket.IO for instant communication
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful design with comprehensive endpoints

## 🎯 Next Steps for Hackathon
1. Install Node.js and MongoDB
2. Run backend server (`npm run dev`)
3. Serve frontend files (any HTTP server)
4. Demo the interactive features
5. Showcase the AI chatbot capabilities
6. Demonstrate mobile responsiveness

## 📞 Support
For any issues or questions during setup, check:
1. Node.js and npm are properly installed
2. MongoDB is running
3. Environment variables are configured
4. Frontend is served on correct port (3000)
5. Backend is running on port 5000

**Ready for Hackathon Demo! 🚀**