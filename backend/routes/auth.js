const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 login attempts per windowMs
    message: {
        success: false,
        message: 'Too many login attempts, please try again later.'
    }
});

// POST /api/auth/register - Register new user
router.post('/register', authLimiter, async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            phone, 
            preferences,
            emergencyContact 
        } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            phone: phone ? phone.trim() : undefined,
            preferences: preferences || {
                interests: [],
                language: 'en',
                notifications: {
                    email: true,
                    sms: false,
                    push: true
                }
            },
            emergencyContact: emergencyContact || {}
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Return user data (without password)
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            preferences: user.preferences,
            createdAt: user.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse,
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
});

// POST /api/auth/login - Login user
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const tokenExpiry = rememberMe ? '30d' : '7d';
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: tokenExpiry }
        );

        // Return user data (without password)
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            preferences: user.preferences,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        };

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
});

// POST /api/auth/logout - Logout user (optional for JWT)
router.post('/logout', auth, (req, res) => {
    // For JWT, logout is mainly handled on frontend by removing token
    // Could implement token blacklisting for enhanced security
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// GET /api/auth/me - Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password')
            .populate('bookings.destination', 'name location images');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
        });
    }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, phone, preferences, emergencyContact } = req.body;

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (phone) updateData.phone = phone.trim();
        if (preferences) updateData.preferences = { ...updateData.preferences, ...preferences };
        if (emergencyContact) updateData.emergencyContact = { ...updateData.emergencyContact, ...emergencyContact };

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
});

// POST /api/auth/change-password - Change password
router.post('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        // Find user with password
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedNewPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
});

// POST /api/auth/forgot-password - Forgot password (placeholder)
router.post('/forgot-password', authLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({
                success: true,
                message: 'If an account with this email exists, password reset instructions have been sent.'
            });
        }

        // TODO: Implement email sending logic
        // For now, just log the reset request
        console.log(`Password reset requested for: ${email}`);

        res.json({
            success: true,
            message: 'If an account with this email exists, password reset instructions have been sent.'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing forgot password request',
            error: error.message
        });
    }
});

// GET /api/auth/bookings - Get user's bookings
router.get('/bookings', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate('bookings.destination', 'name location images rating')
            .select('bookings');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user.bookings || []
        });

    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
});

// POST /api/auth/booking - Add new booking
router.post('/booking', auth, async (req, res) => {
    try {
        const { 
            destinationId, 
            bookingType, 
            visitDate, 
            numberOfPeople, 
            specialRequests,
            contactInfo
        } = req.body;

        if (!destinationId || !bookingType || !visitDate || !numberOfPeople) {
            return res.status(400).json({
                success: false,
                message: 'Destination, booking type, visit date, and number of people are required'
            });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const booking = {
            destination: destinationId,
            bookingType,
            visitDate: new Date(visitDate),
            numberOfPeople: parseInt(numberOfPeople),
            specialRequests: specialRequests || '',
            contactInfo: contactInfo || {},
            status: 'pending',
            bookedAt: new Date()
        };

        user.bookings.push(booking);
        await user.save();

        // Populate the new booking
        await user.populate('bookings.destination', 'name location images rating');

        const newBooking = user.bookings[user.bookings.length - 1];

        res.status(201).json({
            success: true,
            message: 'Booking request submitted successfully',
            data: newBooking
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

module.exports = router;