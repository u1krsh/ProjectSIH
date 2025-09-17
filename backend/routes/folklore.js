const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Get database connection from app
let db;
router.use((req, res, next) => {
    db = req.app.get('db');
    next();
});

// Configure multer for audio uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'audio') {
            cb(null, 'uploads/folklore/audio/');
        } else if (file.fieldname === 'image') {
            cb(null, 'uploads/folklore/images/');
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        if (file.fieldname === 'audio') {
            cb(null, 'story-' + uniqueSuffix + path.extname(file.originalname));
        } else {
            cb(null, 'narrator-' + uniqueSuffix + path.extname(file.originalname));
        }
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit for audio files
    },
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'audio' && file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else if (file.fieldname === 'image' && file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// @route   GET /api/folklore/stories
// @desc    Get all stories with filtering and pagination
// @access  Public
router.get('/stories', async (req, res) => {
    try {
        const {
            category,
            narrator,
            language = 'hindi',
            duration,
            search,
            sort = 'created_at',
            order = 'DESC',
            page = 1,
            limit = 12
        } = req.query;

        const offset = (page - 1) * limit;
        
        let baseQuery = `
            SELECT s.*, 
                   sc.name as category_name,
                   n.name as narrator_name,
                   n.profile_image as narrator_image,
                   n.bio as narrator_bio,
                   AVG(sr.rating) as avg_rating,
                   COUNT(sr.id) as review_count,
                   COUNT(sp.id) as play_count
            FROM stories s
            JOIN story_categories sc ON s.category_id = sc.id
            JOIN narrators n ON s.narrator_id = n.id
            LEFT JOIN story_reviews sr ON s.id = sr.story_id
            LEFT JOIN story_plays sp ON s.id = sp.story_id
            WHERE s.is_active = TRUE
        `;

        const queryParams = [];
        
        // Add filters
        if (category) {
            baseQuery += ` AND sc.name = ?`;
            queryParams.push(category);
        }
        
        if (narrator) {
            baseQuery += ` AND s.narrator_id = ?`;
            queryParams.push(narrator);
        }
        
        if (language) {
            baseQuery += ` AND s.language = ?`;
            queryParams.push(language);
        }
        
        if (duration) {
            const [min, max] = duration.split('-');
            if (min && max) {
                baseQuery += ` AND s.duration_minutes BETWEEN ? AND ?`;
                queryParams.push(parseInt(min), parseInt(max));
            }
        }
        
        if (search) {
            baseQuery += ` AND (s.title LIKE ? OR s.description LIKE ? OR s.keywords LIKE ?)`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        baseQuery += ` GROUP BY s.id`;

        // Add sorting
        const validSortFields = ['created_at', 'title', 'duration_minutes', 'avg_rating', 'play_count'];
        const validOrders = ['ASC', 'DESC'];
        
        if (validSortFields.includes(sort) && validOrders.includes(order.toUpperCase())) {
            if (sort === 'avg_rating' || sort === 'play_count') {
                baseQuery += ` ORDER BY ${sort} ${order.toUpperCase()}, s.created_at DESC`;
            } else {
                baseQuery += ` ORDER BY s.${sort} ${order.toUpperCase()}`;
            }
        } else {
            baseQuery += ` ORDER BY s.created_at DESC`;
        }

        // Add pagination
        baseQuery += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [stories] = await db.execute(baseQuery, queryParams);

        // Get total count for pagination
        let countQuery = `
            SELECT COUNT(DISTINCT s.id) as total
            FROM stories s
            JOIN story_categories sc ON s.category_id = sc.id
            JOIN narrators n ON s.narrator_id = n.id
            WHERE s.is_active = TRUE
        `;

        const countParams = [];
        let paramIndex = 0;
        
        if (category) {
            countQuery += ` AND sc.name = ?`;
            countParams.push(queryParams[paramIndex++]);
        }
        if (narrator) {
            countQuery += ` AND s.narrator_id = ?`;
            countParams.push(queryParams[paramIndex++]);
        }
        if (language) {
            countQuery += ` AND s.language = ?`;
            countParams.push(queryParams[paramIndex++]);
        }
        if (duration) {
            const [min, max] = duration.split('-');
            if (min && max) {
                countQuery += ` AND s.duration_minutes BETWEEN ? AND ?`;
                countParams.push(queryParams[paramIndex++], queryParams[paramIndex++]);
            }
        }
        if (search) {
            countQuery += ` AND (s.title LIKE ? OR s.description LIKE ? OR s.keywords LIKE ?)`;
            countParams.push(queryParams[paramIndex++], queryParams[paramIndex++], queryParams[paramIndex++]);
        }

        const [countResult] = await db.execute(countQuery, countParams);
        const totalStories = countResult[0].total;

        res.json({
            success: true,
            data: {
                stories,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalStories / limit),
                    totalStories,
                    hasNext: (page * limit) < totalStories,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get stories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching stories'
        });
    }
});

// @route   GET /api/folklore/stories/:id
// @desc    Get single story details
// @access  Public
router.get('/stories/:id', async (req, res) => {
    try {
        const storyId = req.params.id;

        // Get story details
        const [stories] = await db.execute(`
            SELECT s.*, 
                   sc.name as category_name,
                   sc.description as category_description,
                   n.name as narrator_name,
                   n.profile_image as narrator_image,
                   n.bio as narrator_bio,
                   n.years_active,
                   n.specialization as narrator_specialization,
                   AVG(sr.rating) as avg_rating,
                   COUNT(sr.id) as review_count,
                   COUNT(sp.id) as play_count
            FROM stories s
            JOIN story_categories sc ON s.category_id = sc.id
            JOIN narrators n ON s.narrator_id = n.id
            LEFT JOIN story_reviews sr ON s.id = sr.story_id
            LEFT JOIN story_plays sp ON s.id = sp.story_id
            WHERE s.id = ? AND s.is_active = TRUE
            GROUP BY s.id
        `, [storyId]);

        if (stories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }

        const story = stories[0];

        // Get story reviews
        const [reviews] = await db.execute(`
            SELECT sr.*, u.first_name, u.last_name
            FROM story_reviews sr
            JOIN users u ON sr.user_id = u.id
            WHERE sr.story_id = ?
            ORDER BY sr.created_at DESC
            LIMIT 10
        `, [storyId]);
        story.reviews = reviews;

        // Get related stories
        const [relatedStories] = await db.execute(`
            SELECT s.id, s.title, s.thumbnail_url, s.duration_minutes,
                   n.name as narrator_name,
                   AVG(sr.rating) as avg_rating,
                   COUNT(sp.id) as play_count
            FROM stories s
            JOIN narrators n ON s.narrator_id = n.id
            LEFT JOIN story_reviews sr ON s.id = sr.story_id
            LEFT JOIN story_plays sp ON s.id = sp.story_id
            WHERE s.category_id = ? AND s.id != ? AND s.is_active = TRUE
            GROUP BY s.id
            ORDER BY RAND()
            LIMIT 4
        `, [story.category_id, storyId]);
        story.relatedStories = relatedStories;

        res.json({
            success: true,
            data: story
        });

    } catch (error) {
        console.error('Get story details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching story details'
        });
    }
});

// @route   POST /api/folklore/stories/:id/play
// @desc    Record story play
// @access  Public
router.post('/stories/:id/play', async (req, res) => {
    try {
        const storyId = req.params.id;
        const { userId } = req.body; // Optional user ID

        // Check if story exists
        const [stories] = await db.execute(
            'SELECT id FROM stories WHERE id = ? AND is_active = TRUE',
            [storyId]
        );

        if (stories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }

        // Record play
        await db.execute(
            'INSERT INTO story_plays (story_id, user_id, ip_address, user_agent) VALUES (?, ?, ?, ?)',
            [storyId, userId || null, req.ip, req.get('User-Agent')]
        );

        res.json({
            success: true,
            message: 'Play recorded successfully'
        });

    } catch (error) {
        console.error('Record play error:', error);
        res.status(500).json({
            success: false,
            message: 'Error recording play'
        });
    }
});

// @route   GET /api/folklore/categories
// @desc    Get all story categories
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await db.execute(`
            SELECT sc.*, COUNT(s.id) as story_count
            FROM story_categories sc
            LEFT JOIN stories s ON sc.id = s.category_id AND s.is_active = TRUE
            GROUP BY sc.id
            ORDER BY sc.name ASC
        `);

        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories'
        });
    }
});

// @route   GET /api/folklore/narrators
// @desc    Get all narrators
// @access  Public
router.get('/narrators', async (req, res) => {
    try {
        const {
            specialization,
            search,
            page = 1,
            limit = 12
        } = req.query;

        const offset = (page - 1) * limit;
        
        let baseQuery = `
            SELECT n.*, 
                   COUNT(s.id) as story_count,
                   AVG(sr.rating) as avg_rating,
                   SUM(sp.id) as total_plays
            FROM narrators n
            LEFT JOIN stories s ON n.id = s.narrator_id AND s.is_active = TRUE
            LEFT JOIN story_reviews sr ON s.id = sr.story_id
            LEFT JOIN story_plays sp ON s.id = sp.story_id
            WHERE n.is_active = TRUE
        `;

        const queryParams = [];
        
        if (specialization) {
            baseQuery += ` AND n.specialization = ?`;
            queryParams.push(specialization);
        }
        
        if (search) {
            baseQuery += ` AND (n.name LIKE ? OR n.specialization LIKE ?)`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm);
        }

        baseQuery += ` GROUP BY n.id ORDER BY avg_rating DESC, story_count DESC LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [narrators] = await db.execute(baseQuery, queryParams);

        res.json({
            success: true,
            data: narrators
        });

    } catch (error) {
        console.error('Get narrators error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching narrators'
        });
    }
});

// @route   GET /api/folklore/narrators/:id
// @desc    Get single narrator profile with stories
// @access  Public
router.get('/narrators/:id', async (req, res) => {
    try {
        const narratorId = req.params.id;

        // Get narrator details
        const [narrators] = await db.execute(`
            SELECT n.*, 
                   COUNT(s.id) as story_count,
                   AVG(sr.rating) as avg_rating,
                   COUNT(sr.id) as review_count,
                   SUM(sp.id) as total_plays
            FROM narrators n
            LEFT JOIN stories s ON n.id = s.narrator_id AND s.is_active = TRUE
            LEFT JOIN story_reviews sr ON s.id = sr.story_id
            LEFT JOIN story_plays sp ON s.id = sp.story_id
            WHERE n.id = ? AND n.is_active = TRUE
            GROUP BY n.id
        `, [narratorId]);

        if (narrators.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Narrator not found'
            });
        }

        const narrator = narrators[0];

        // Get narrator's stories
        const [stories] = await db.execute(`
            SELECT s.*, 
                   sc.name as category_name,
                   AVG(sr.rating) as avg_rating,
                   COUNT(sr.id) as review_count,
                   COUNT(sp.id) as play_count
            FROM stories s
            JOIN story_categories sc ON s.category_id = sc.id
            LEFT JOIN story_reviews sr ON s.id = sr.story_id
            LEFT JOIN story_plays sp ON s.id = sp.story_id
            WHERE s.narrator_id = ? AND s.is_active = TRUE
            GROUP BY s.id
            ORDER BY s.created_at DESC
        `, [narratorId]);

        narrator.stories = stories;

        res.json({
            success: true,
            data: narrator
        });

    } catch (error) {
        console.error('Get narrator details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching narrator details'
        });
    }
});

// @route   POST /api/folklore/reviews
// @desc    Add story review
// @access  Private
router.post('/reviews', async (req, res) => {
    try {
        const { storyId, rating, comment } = req.body;
        const userId = req.user?.id; // This would come from auth middleware

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!storyId || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Story ID and rating are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if story exists
        const [stories] = await db.execute(
            'SELECT id FROM stories WHERE id = ? AND is_active = TRUE',
            [storyId]
        );

        if (stories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }

        // Check if user already reviewed this story
        const [existingReviews] = await db.execute(
            'SELECT id FROM story_reviews WHERE story_id = ? AND user_id = ?',
            [storyId, userId]
        );

        if (existingReviews.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this story'
            });
        }

        // Insert review
        const [result] = await db.execute(
            'INSERT INTO story_reviews (story_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [storyId, userId, rating, comment]
        );

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: {
                reviewId: result.insertId
            }
        });

    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding review'
        });
    }
});

// @route   GET /api/folklore/featured
// @desc    Get featured stories
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const [stories] = await db.execute(`
            SELECT s.*, 
                   sc.name as category_name,
                   n.name as narrator_name,
                   n.profile_image as narrator_image,
                   AVG(sr.rating) as avg_rating,
                   COUNT(sr.id) as review_count,
                   COUNT(sp.id) as play_count
            FROM stories s
            JOIN story_categories sc ON s.category_id = sc.id
            JOIN narrators n ON s.narrator_id = n.id
            LEFT JOIN story_reviews sr ON s.id = sr.story_id
            LEFT JOIN story_plays sp ON s.id = sp.story_id
            WHERE s.is_active = TRUE AND s.is_featured = TRUE
            GROUP BY s.id
            ORDER BY s.featured_order ASC, s.created_at DESC
            LIMIT 8
        `);

        res.json({
            success: true,
            data: stories
        });

    } catch (error) {
        console.error('Get featured stories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching featured stories'
        });
    }
});

// @route   GET /api/folklore/popular
// @desc    Get popular stories
// @access  Public
router.get('/popular', async (req, res) => {
    try {
        const [stories] = await db.execute(`
            SELECT s.*, 
                   sc.name as category_name,
                   n.name as narrator_name,
                   n.profile_image as narrator_image,
                   AVG(sr.rating) as avg_rating,
                   COUNT(sr.id) as review_count,
                   COUNT(sp.id) as play_count
            FROM stories s
            JOIN story_categories sc ON s.category_id = sc.id
            JOIN narrators n ON s.narrator_id = n.id
            LEFT JOIN story_reviews sr ON s.id = sr.story_id
            LEFT JOIN story_plays sp ON s.id = sp.story_id
            WHERE s.is_active = TRUE
            GROUP BY s.id
            ORDER BY play_count DESC, avg_rating DESC
            LIMIT 8
        `);

        res.json({
            success: true,
            data: stories
        });

    } catch (error) {
        console.error('Get popular stories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching popular stories'
        });
    }
});

module.exports = router;