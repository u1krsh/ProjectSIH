const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Get database connection from app
let db;
router.use((req, res, next) => {
    db = req.app.get('db');
    next();
});

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

// Validation middleware
const validateRegistration = [
    body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
    body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('phone').isMobilePhone('en-IN').withMessage('Please provide a valid Indian phone number'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase and number'),
    body('userType').isIn(['tourist', 'local', 'guide', 'homestay', 'artisan', 'business']).withMessage('Invalid user type')
];

const validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Generate JWT tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId, type: 'access' },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
        { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', authLimiter, validateRegistration, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { firstName, lastName, email, phone, password, userType } = req.body;

        // Check if user already exists
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ? OR phone = ?',
            [email, phone]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or phone already exists'
            });
        }

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Insert user
        const [result] = await db.execute(
            `INSERT INTO users (first_name, last_name, email, phone, password_hash, user_type) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, email, phone, passwordHash, userType]
        );

        const userId = result.insertId;

        // Insert email verification record
        await db.execute(
            'INSERT INTO email_verifications (user_id, verification_token, expires_at) VALUES (?, ?, ?)',
            [userId, verificationToken, verificationExpires]
        );

        // Send verification email
        const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        
        try {
            await emailTransporter.sendMail({
                from: process.env.FROM_EMAIL || 'noreply@jharkhantourism.com',
                to: email,
                subject: 'Verify your Tribal Trails account',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #1B4D3E;">Welcome to Tribal Trails!</h2>
                        <p>Hello ${firstName},</p>
                        <p>Thank you for joining our community! Please verify your email address by clicking the button below:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" 
                               style="background: #1B4D3E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                                Verify Email Address
                            </a>
                        </div>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                        <p>This link will expire in 24 hours.</p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #666;">
                            If you didn't create this account, please ignore this email.
                        </p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue with registration even if email fails
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(userId);

        // Store session
        await db.execute(
            `INSERT INTO user_sessions (user_id, session_token, refresh_token, ip_address, user_agent, expires_at)
             VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
            [userId, accessToken, refreshToken, req.ip, req.get('User-Agent')]
        );

        // Log activity
        await db.execute(
            'INSERT INTO activity_logs (user_id, activity_type, activity_description, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
            [userId, 'user_register', `User registered with type: ${userType}`, req.ip, req.get('User-Agent')]
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email to verify your account.',
            data: {
                user: {
                    id: userId,
                    firstName,
                    lastName,
                    email,
                    userType,
                    isVerified: false
                },
                tokens: {
                    accessToken,
                    refreshToken
                }
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginLimiter, validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { email, password, remember } = req.body;

        // Get user
        const [users] = await db.execute(
            'SELECT id, first_name, last_name, email, phone, password_hash, user_type, email_verified, is_active FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Check if account is active
        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Account has been deactivated. Please contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        await db.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id);

        // Set token expiry based on remember me
        const expiresAt = remember ? 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : 
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        // Store session
        await db.execute(
            `INSERT INTO user_sessions (user_id, session_token, refresh_token, ip_address, user_agent, expires_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user.id, accessToken, refreshToken, req.ip, req.get('User-Agent'), expiresAt]
        );

        // Log activity
        await db.execute(
            'INSERT INTO activity_logs (user_id, activity_type, activity_description, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
            [user.id, 'user_login', 'User logged in successfully', req.ip, req.get('User-Agent')]
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    userType: user.user_type,
                    isVerified: user.email_verified
                },
                tokens: {
                    accessToken,
                    refreshToken
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (token) {
            // Deactivate session
            await db.execute(
                'UPDATE user_sessions SET is_active = FALSE WHERE session_token = ?',
                [token]
            );
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during logout'
        });
    }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret');

        // Check if session is active
        const [sessions] = await db.execute(
            'SELECT user_id FROM user_sessions WHERE refresh_token = ? AND is_active = TRUE AND expires_at > NOW()',
            [refreshToken]
        );

        if (sessions.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

        // Update session
        await db.execute(
            'UPDATE user_sessions SET session_token = ?, refresh_token = ? WHERE refresh_token = ?',
            [accessToken, newRefreshToken, refreshToken]
        );

        res.json({
            success: true,
            data: {
                accessToken,
                refreshToken: newRefreshToken
            }
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token required'
            });
        }

        // Check verification token
        const [verifications] = await db.execute(
            'SELECT user_id FROM email_verifications WHERE verification_token = ? AND expires_at > NOW() AND is_used = FALSE',
            [token]
        );

        if (verifications.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        const userId = verifications[0].user_id;

        // Mark user as verified and token as used
        await db.execute('UPDATE users SET email_verified = TRUE WHERE id = ?', [userId]);
        await db.execute('UPDATE email_verifications SET is_used = TRUE WHERE verification_token = ?', [token]);

        res.json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during email verification'
        });
    }
});

module.exports = router;