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

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/homestays/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'homestay-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// @route   GET /api/homestays
// @desc    Get all homestays with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            location,
            minPrice,
            maxPrice,
            capacity,
            amenities,
            search,
            checkIn,
            checkOut,
            sort = 'created_at',
            order = 'DESC',
            page = 1,
            limit = 12
        } = req.query;

        const offset = (page - 1) * limit;
        
        let baseQuery = `
            SELECT h.*, 
                   hh.first_name as host_first_name,
                   hh.last_name as host_last_name,
                   hh.profile_image as host_image,
                   hh.bio as host_bio,
                   hh.years_hosting,
                   AVG(hr.rating) as avg_rating,
                   COUNT(hr.id) as review_count
            FROM homestays h
            JOIN homestay_hosts hh ON h.host_id = hh.id
            LEFT JOIN homestay_reviews hr ON h.id = hr.homestay_id
            WHERE h.is_active = TRUE AND h.is_verified = TRUE
        `;

        const queryParams = [];
        
        // Add filters
        if (location) {
            baseQuery += ` AND (h.location LIKE ? OR h.address LIKE ?)`;
            const locationTerm = `%${location}%`;
            queryParams.push(locationTerm, locationTerm);
        }
        
        if (minPrice) {
            baseQuery += ` AND h.price_per_night >= ?`;
            queryParams.push(minPrice);
        }
        
        if (maxPrice) {
            baseQuery += ` AND h.price_per_night <= ?`;
            queryParams.push(maxPrice);
        }
        
        if (capacity) {
            baseQuery += ` AND h.max_guests >= ?`;
            queryParams.push(capacity);
        }
        
        if (amenities) {
            const amenitiesList = amenities.split(',');
            for (let amenity of amenitiesList) {
                baseQuery += ` AND JSON_CONTAINS(h.amenities, JSON_QUOTE(?))`;
                queryParams.push(amenity.trim());
            }
        }
        
        if (search) {
            baseQuery += ` AND (h.name LIKE ? OR h.description LIKE ? OR h.location LIKE ?)`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        // Check availability if dates provided
        if (checkIn && checkOut) {
            baseQuery += ` AND h.id NOT IN (
                SELECT DISTINCT homestay_id FROM homestay_bookings 
                WHERE status IN ('confirmed', 'pending') 
                AND ((check_in_date <= ? AND check_out_date > ?) 
                     OR (check_in_date < ? AND check_out_date >= ?))
            )`;
            queryParams.push(checkIn, checkIn, checkOut, checkOut);
        }

        baseQuery += ` GROUP BY h.id`;

        // Add sorting
        const validSortFields = ['created_at', 'price_per_night', 'name', 'avg_rating'];
        const validOrders = ['ASC', 'DESC'];
        
        if (validSortFields.includes(sort) && validOrders.includes(order.toUpperCase())) {
            if (sort === 'avg_rating') {
                baseQuery += ` ORDER BY avg_rating ${order.toUpperCase()}, h.created_at DESC`;
            } else {
                baseQuery += ` ORDER BY h.${sort} ${order.toUpperCase()}`;
            }
        } else {
            baseQuery += ` ORDER BY h.created_at DESC`;
        }

        // Add pagination
        baseQuery += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [homestays] = await db.execute(baseQuery, queryParams);

        // Get homestay images for each homestay
        for (let homestay of homestays) {
            const [images] = await db.execute(
                'SELECT image_url, is_primary FROM homestay_images WHERE homestay_id = ? ORDER BY is_primary DESC, id ASC',
                [homestay.id]
            );
            homestay.images = images;
        }

        // Get total count for pagination
        let countQuery = `
            SELECT COUNT(DISTINCT h.id) as total
            FROM homestays h
            JOIN homestay_hosts hh ON h.host_id = hh.id
            WHERE h.is_active = TRUE AND h.is_verified = TRUE
        `;

        const countParams = [];
        let paramIndex = 0;
        
        if (location) {
            countQuery += ` AND (h.location LIKE ? OR h.address LIKE ?)`;
            countParams.push(queryParams[paramIndex++], queryParams[paramIndex++]);
        }
        if (minPrice) {
            countQuery += ` AND h.price_per_night >= ?`;
            countParams.push(queryParams[paramIndex++]);
        }
        if (maxPrice) {
            countQuery += ` AND h.price_per_night <= ?`;
            countParams.push(queryParams[paramIndex++]);
        }
        if (capacity) {
            countQuery += ` AND h.max_guests >= ?`;
            countParams.push(queryParams[paramIndex++]);
        }
        if (amenities) {
            const amenitiesList = amenities.split(',');
            for (let amenity of amenitiesList) {
                countQuery += ` AND JSON_CONTAINS(h.amenities, JSON_QUOTE(?))`;
                countParams.push(queryParams[paramIndex++]);
            }
        }
        if (search) {
            countQuery += ` AND (h.name LIKE ? OR h.description LIKE ? OR h.location LIKE ?)`;
            countParams.push(queryParams[paramIndex++], queryParams[paramIndex++], queryParams[paramIndex++]);
        }

        if (checkIn && checkOut) {
            countQuery += ` AND h.id NOT IN (
                SELECT DISTINCT homestay_id FROM homestay_bookings 
                WHERE status IN ('confirmed', 'pending') 
                AND ((check_in_date <= ? AND check_out_date > ?) 
                     OR (check_in_date < ? AND check_out_date >= ?))
            )`;
            countParams.push(queryParams[paramIndex++], queryParams[paramIndex++], queryParams[paramIndex++], queryParams[paramIndex++]);
        }

        const [countResult] = await db.execute(countQuery, countParams);
        const totalHomestays = countResult[0].total;

        res.json({
            success: true,
            data: {
                homestays,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalHomestays / limit),
                    totalHomestays,
                    hasNext: (page * limit) < totalHomestays,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get homestays error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching homestays'
        });
    }
});

// @route   GET /api/homestays/:id
// @desc    Get single homestay details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const homestayId = req.params.id;

        // Get homestay details
        const [homestays] = await db.execute(`
            SELECT h.*, 
                   hh.first_name as host_first_name,
                   hh.last_name as host_last_name,
                   hh.profile_image as host_image,
                   hh.bio as host_bio,
                   hh.years_hosting,
                   hh.response_rate,
                   hh.languages_spoken,
                   AVG(hr.rating) as avg_rating,
                   COUNT(hr.id) as review_count
            FROM homestays h
            JOIN homestay_hosts hh ON h.host_id = hh.id
            LEFT JOIN homestay_reviews hr ON h.id = hr.homestay_id
            WHERE h.id = ? AND h.is_active = TRUE
            GROUP BY h.id
        `, [homestayId]);

        if (homestays.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Homestay not found'
            });
        }

        const homestay = homestays[0];

        // Get homestay images
        const [images] = await db.execute(
            'SELECT image_url, is_primary, caption FROM homestay_images WHERE homestay_id = ? ORDER BY is_primary DESC, id ASC',
            [homestayId]
        );
        homestay.images = images;

        // Get homestay reviews
        const [reviews] = await db.execute(`
            SELECT hr.*, u.first_name, u.last_name
            FROM homestay_reviews hr
            JOIN users u ON hr.user_id = u.id
            WHERE hr.homestay_id = ?
            ORDER BY hr.created_at DESC
            LIMIT 10
        `, [homestayId]);
        homestay.reviews = reviews;

        // Get similar homestays
        const [similarHomestays] = await db.execute(`
            SELECT h.id, h.name, h.price_per_night, h.location,
                   hi.image_url,
                   AVG(hr.rating) as avg_rating
            FROM homestays h
            LEFT JOIN homestay_images hi ON h.id = hi.homestay_id AND hi.is_primary = TRUE
            LEFT JOIN homestay_reviews hr ON h.id = hr.homestay_id
            WHERE h.location = ? AND h.id != ? AND h.is_active = TRUE AND h.is_verified = TRUE
            GROUP BY h.id
            ORDER BY RAND()
            LIMIT 4
        `, [homestay.location, homestayId]);
        homestay.similarHomestays = similarHomestays;

        res.json({
            success: true,
            data: homestay
        });

    } catch (error) {
        console.error('Get homestay details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching homestay details'
        });
    }
});

// @route   GET /api/homestays/:id/availability
// @desc    Check homestay availability
// @access  Public
router.get('/:id/availability', async (req, res) => {
    try {
        const homestayId = req.params.id;
        const { checkIn, checkOut } = req.query;

        if (!checkIn || !checkOut) {
            return res.status(400).json({
                success: false,
                message: 'Check-in and check-out dates are required'
            });
        }

        // Check if homestay exists
        const [homestays] = await db.execute(
            'SELECT id, name, price_per_night FROM homestays WHERE id = ? AND is_active = TRUE',
            [homestayId]
        );

        if (homestays.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Homestay not found'
            });
        }

        // Check for existing bookings
        const [bookings] = await db.execute(`
            SELECT id FROM homestay_bookings 
            WHERE homestay_id = ? 
            AND status IN ('confirmed', 'pending')
            AND ((check_in_date <= ? AND check_out_date > ?) 
                 OR (check_in_date < ? AND check_out_date >= ?))
        `, [homestayId, checkIn, checkIn, checkOut, checkOut]);

        const isAvailable = bookings.length === 0;

        res.json({
            success: true,
            data: {
                available: isAvailable,
                homestay: homestays[0]
            }
        });

    } catch (error) {
        console.error('Check availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking availability'
        });
    }
});

// @route   POST /api/homestays/:id/book
// @desc    Book a homestay
// @access  Private
router.post('/:id/book', async (req, res) => {
    try {
        const homestayId = req.params.id;
        const userId = req.user?.id; // This would come from auth middleware

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const {
            checkInDate,
            checkOutDate,
            guestCount,
            specialRequests,
            contactDetails
        } = req.body;

        if (!checkInDate || !checkOutDate || !guestCount) {
            return res.status(400).json({
                success: false,
                message: 'Check-in date, check-out date, and guest count are required'
            });
        }

        // Check if homestay exists and is available
        const [homestays] = await db.execute(
            'SELECT id, name, price_per_night, max_guests FROM homestays WHERE id = ? AND is_active = TRUE AND is_verified = TRUE',
            [homestayId]
        );

        if (homestays.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Homestay not found'
            });
        }

        const homestay = homestays[0];

        if (guestCount > homestay.max_guests) {
            return res.status(400).json({
                success: false,
                message: `This homestay can accommodate maximum ${homestay.max_guests} guests`
            });
        }

        // Check availability
        const [existingBookings] = await db.execute(`
            SELECT id FROM homestay_bookings 
            WHERE homestay_id = ? 
            AND status IN ('confirmed', 'pending')
            AND ((check_in_date <= ? AND check_out_date > ?) 
                 OR (check_in_date < ? AND check_out_date >= ?))
        `, [homestayId, checkInDate, checkInDate, checkOutDate, checkOutDate]);

        if (existingBookings.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Homestay is not available for the selected dates'
            });
        }

        // Calculate total price
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * homestay.price_per_night;

        // Create booking
        const [result] = await db.execute(`
            INSERT INTO homestay_bookings 
            (homestay_id, user_id, check_in_date, check_out_date, guest_count, 
             total_nights, total_price, special_requests, contact_details, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `, [
            homestayId, userId, checkInDate, checkOutDate, guestCount,
            nights, totalPrice, specialRequests || '', JSON.stringify(contactDetails || {})
        ]);

        const bookingId = result.insertId;

        res.status(201).json({
            success: true,
            message: 'Booking request submitted successfully',
            data: {
                bookingId,
                totalPrice,
                totalNights: nights,
                status: 'pending'
            }
        });

    } catch (error) {
        console.error('Book homestay error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking'
        });
    }
});

// @route   GET /api/homestays/hosts
// @desc    Get all homestay hosts
// @access  Public
router.get('/hosts', async (req, res) => {
    try {
        const {
            location,
            search,
            page = 1,
            limit = 12
        } = req.query;

        const offset = (page - 1) * limit;
        
        let baseQuery = `
            SELECT hh.*, 
                   COUNT(h.id) as homestay_count,
                   AVG(hr.rating) as avg_rating
            FROM homestay_hosts hh
            LEFT JOIN homestays h ON hh.id = h.host_id AND h.is_active = TRUE
            LEFT JOIN homestay_reviews hr ON h.id = hr.homestay_id
            WHERE hh.is_verified = TRUE
        `;

        const queryParams = [];
        
        if (location) {
            baseQuery += ` AND hh.location LIKE ?`;
            queryParams.push(`%${location}%`);
        }
        
        if (search) {
            baseQuery += ` AND (hh.first_name LIKE ? OR hh.last_name LIKE ?)`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm);
        }

        baseQuery += ` GROUP BY hh.id ORDER BY avg_rating DESC, homestay_count DESC LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [hosts] = await db.execute(baseQuery, queryParams);

        res.json({
            success: true,
            data: hosts
        });

    } catch (error) {
        console.error('Get hosts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hosts'
        });
    }
});

// @route   POST /api/homestays/reviews
// @desc    Add homestay review
// @access  Private
router.post('/reviews', async (req, res) => {
    try {
        const { homestayId, rating, comment } = req.body;
        const userId = req.user?.id; // This would come from auth middleware

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!homestayId || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Homestay ID and rating are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if homestay exists
        const [homestays] = await db.execute(
            'SELECT id FROM homestays WHERE id = ? AND is_active = TRUE',
            [homestayId]
        );

        if (homestays.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Homestay not found'
            });
        }

        // Check if user has stayed at this homestay
        const [bookings] = await db.execute(
            'SELECT id FROM homestay_bookings WHERE homestay_id = ? AND user_id = ? AND status = "completed"',
            [homestayId, userId]
        );

        if (bookings.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'You can only review homestays you have stayed at'
            });
        }

        // Check if user already reviewed this homestay
        const [existingReviews] = await db.execute(
            'SELECT id FROM homestay_reviews WHERE homestay_id = ? AND user_id = ?',
            [homestayId, userId]
        );

        if (existingReviews.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this homestay'
            });
        }

        // Insert review
        const [result] = await db.execute(
            'INSERT INTO homestay_reviews (homestay_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [homestayId, userId, rating, comment]
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

// @route   GET /api/homestays/featured
// @desc    Get featured homestays
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const [homestays] = await db.execute(`
            SELECT h.*, 
                   hh.first_name as host_first_name,
                   hh.last_name as host_last_name,
                   hi.image_url,
                   AVG(hr.rating) as avg_rating,
                   COUNT(hr.id) as review_count
            FROM homestays h
            JOIN homestay_hosts hh ON h.host_id = hh.id
            LEFT JOIN homestay_images hi ON h.id = hi.homestay_id AND hi.is_primary = TRUE
            LEFT JOIN homestay_reviews hr ON h.id = hr.homestay_id
            WHERE h.is_active = TRUE AND h.is_verified = TRUE AND h.is_featured = TRUE
            GROUP BY h.id
            ORDER BY h.featured_order ASC, h.created_at DESC
            LIMIT 8
        `);

        res.json({
            success: true,
            data: homestays
        });

    } catch (error) {
        console.error('Get featured homestays error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching featured homestays'
        });
    }
});

module.exports = router;