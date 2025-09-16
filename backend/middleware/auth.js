const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied'
            });
        }

        // Check if token starts with 'Bearer '
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format. Use Bearer token'
            });
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Check if user still exists
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found, authorization denied'
            });
        }

        // Check if user account is active
        if (user.accountStatus !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Account is not active, authorization denied'
            });
        }

        // Check if account is locked
        if (user.isLocked && user.isLocked()) {
            return res.status(401).json({
                success: false,
                message: 'Account is temporarily locked, authorization denied'
            });
        }

        // Add user to request object
        req.user = {
            userId: user._id,
            email: user.email,
            name: user.name,
            preferences: user.preferences
        };

        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token, authorization denied'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired, authorization denied'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error in authentication',
            error: error.message
        });
    }
};

// Optional auth middleware - doesn't require authentication but sets user if token is present
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // No token provided, continue without user
            req.user = null;
            return next();
        }

        const token = authHeader.substring(7);
        
        if (!token) {
            req.user = null;
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await User.findById(decoded.userId).select('-password');
            
            if (user && user.accountStatus === 'active' && (!user.isLocked || !user.isLocked())) {
                req.user = {
                    userId: user._id,
                    email: user.email,
                    name: user.name,
                    preferences: user.preferences
                };
            } else {
                req.user = null;
            }
        } catch (tokenError) {
            // Invalid token, but continue without user
            req.user = null;
        }

        next();

    } catch (error) {
        console.error('Optional auth middleware error:', error);
        // On error, continue without user
        req.user = null;
        next();
    }
};

// Admin auth middleware
const adminAuth = async (req, res, next) => {
    try {
        // First apply regular auth
        await new Promise((resolve, reject) => {
            auth(req, res, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });

        // Check if user is admin
        const user = await User.findById(req.user.userId);
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        next();

    } catch (error) {
        console.error('Admin auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error in admin authentication',
            error: error.message
        });
    }
};

module.exports = {
    auth,
    optionalAuth,
    adminAuth
};