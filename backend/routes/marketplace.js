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
        cb(null, 'uploads/marketplace/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
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

// @route   GET /api/marketplace/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/products', async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            artisanId,
            search,
            sort = 'created_at',
            order = 'DESC',
            page = 1,
            limit = 12
        } = req.query;

        const offset = (page - 1) * limit;
        
        let baseQuery = `
            SELECT p.*, 
                   a.first_name as artisan_first_name, 
                   a.last_name as artisan_last_name,
                   a.profile_image as artisan_image,
                   a.specialization as artisan_specialization,
                   pc.name as category_name,
                   AVG(pr.rating) as avg_rating,
                   COUNT(pr.id) as review_count
            FROM products p
            JOIN artisan_profiles a ON p.artisan_id = a.id
            JOIN product_categories pc ON p.category_id = pc.id
            LEFT JOIN product_reviews pr ON p.id = pr.product_id
            WHERE p.is_active = TRUE AND p.stock_quantity > 0
        `;

        const queryParams = [];
        
        // Add filters
        if (category) {
            baseQuery += ` AND pc.name = ?`;
            queryParams.push(category);
        }
        
        if (minPrice) {
            baseQuery += ` AND p.price >= ?`;
            queryParams.push(minPrice);
        }
        
        if (maxPrice) {
            baseQuery += ` AND p.price <= ?`;
            queryParams.push(maxPrice);
        }
        
        if (artisanId) {
            baseQuery += ` AND p.artisan_id = ?`;
            queryParams.push(artisanId);
        }
        
        if (search) {
            baseQuery += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.materials LIKE ?)`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        baseQuery += ` GROUP BY p.id`;

        // Add sorting
        const validSortFields = ['created_at', 'price', 'name', 'avg_rating'];
        const validOrders = ['ASC', 'DESC'];
        
        if (validSortFields.includes(sort) && validOrders.includes(order.toUpperCase())) {
            if (sort === 'avg_rating') {
                baseQuery += ` ORDER BY avg_rating ${order.toUpperCase()}, p.created_at DESC`;
            } else {
                baseQuery += ` ORDER BY p.${sort} ${order.toUpperCase()}`;
            }
        } else {
            baseQuery += ` ORDER BY p.created_at DESC`;
        }

        // Add pagination
        baseQuery += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [products] = await db.execute(baseQuery, queryParams);

        // Get product images for each product
        for (let product of products) {
            const [images] = await db.execute(
                'SELECT image_url, is_primary FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, id ASC',
                [product.id]
            );
            product.images = images;
        }

        // Get total count for pagination
        let countQuery = `
            SELECT COUNT(DISTINCT p.id) as total
            FROM products p
            JOIN artisan_profiles a ON p.artisan_id = a.id
            JOIN product_categories pc ON p.category_id = pc.id
            WHERE p.is_active = TRUE AND p.stock_quantity > 0
        `;

        const countParams = [];
        let paramIndex = 0;
        
        if (category) {
            countQuery += ` AND pc.name = ?`;
            countParams.push(queryParams[paramIndex++]);
        }
        if (minPrice) {
            countQuery += ` AND p.price >= ?`;
            countParams.push(queryParams[paramIndex++]);
        }
        if (maxPrice) {
            countQuery += ` AND p.price <= ?`;
            countParams.push(queryParams[paramIndex++]);
        }
        if (artisanId) {
            countQuery += ` AND p.artisan_id = ?`;
            countParams.push(queryParams[paramIndex++]);
        }
        if (search) {
            countQuery += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.materials LIKE ?)`;
            countParams.push(queryParams[paramIndex++], queryParams[paramIndex++], queryParams[paramIndex++]);
        }

        const [countResult] = await db.execute(countQuery, countParams);
        const totalProducts = countResult[0].total;

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalProducts / limit),
                    totalProducts,
                    hasNext: (page * limit) < totalProducts,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products'
        });
    }
});

// @route   GET /api/marketplace/products/:id
// @desc    Get single product details
// @access  Public
router.get('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Get product details
        const [products] = await db.execute(`
            SELECT p.*, 
                   a.first_name as artisan_first_name, 
                   a.last_name as artisan_last_name,
                   a.profile_image as artisan_image,
                   a.specialization as artisan_specialization,
                   a.bio as artisan_bio,
                   a.location as artisan_location,
                   a.years_of_experience,
                   pc.name as category_name,
                   AVG(pr.rating) as avg_rating,
                   COUNT(pr.id) as review_count
            FROM products p
            JOIN artisan_profiles a ON p.artisan_id = a.id
            JOIN product_categories pc ON p.category_id = pc.id
            LEFT JOIN product_reviews pr ON p.id = pr.product_id
            WHERE p.id = ? AND p.is_active = TRUE
            GROUP BY p.id
        `, [productId]);

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const product = products[0];

        // Get product images
        const [images] = await db.execute(
            'SELECT image_url, is_primary FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, id ASC',
            [productId]
        );
        product.images = images;

        // Get product reviews
        const [reviews] = await db.execute(`
            SELECT pr.*, u.first_name, u.last_name
            FROM product_reviews pr
            JOIN users u ON pr.user_id = u.id
            WHERE pr.product_id = ?
            ORDER BY pr.created_at DESC
            LIMIT 10
        `, [productId]);
        product.reviews = reviews;

        // Get related products
        const [relatedProducts] = await db.execute(`
            SELECT p.id, p.name, p.price, p.discount_price,
                   pi.image_url,
                   AVG(pr.rating) as avg_rating
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
            LEFT JOIN product_reviews pr ON p.id = pr.product_id
            WHERE p.category_id = ? AND p.id != ? AND p.is_active = TRUE
            GROUP BY p.id
            ORDER BY RAND()
            LIMIT 4
        `, [product.category_id, productId]);
        product.relatedProducts = relatedProducts;

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Get product details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product details'
        });
    }
});

// @route   GET /api/marketplace/categories
// @desc    Get all product categories
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await db.execute(`
            SELECT pc.*, COUNT(p.id) as product_count
            FROM product_categories pc
            LEFT JOIN products p ON pc.id = p.category_id AND p.is_active = TRUE
            GROUP BY pc.id
            ORDER BY pc.name ASC
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

// @route   GET /api/marketplace/artisans
// @desc    Get all artisan profiles
// @access  Public
router.get('/artisans', async (req, res) => {
    try {
        const {
            specialization,
            location,
            search,
            page = 1,
            limit = 12
        } = req.query;

        const offset = (page - 1) * limit;
        
        let baseQuery = `
            SELECT a.*, 
                   COUNT(p.id) as product_count,
                   AVG(pr.rating) as avg_rating
            FROM artisan_profiles a
            LEFT JOIN products p ON a.id = p.artisan_id AND p.is_active = TRUE
            LEFT JOIN product_reviews pr ON p.id = pr.product_id
            WHERE a.is_verified = TRUE
        `;

        const queryParams = [];
        
        if (specialization) {
            baseQuery += ` AND a.specialization = ?`;
            queryParams.push(specialization);
        }
        
        if (location) {
            baseQuery += ` AND a.location LIKE ?`;
            queryParams.push(`%${location}%`);
        }
        
        if (search) {
            baseQuery += ` AND (a.first_name LIKE ? OR a.last_name LIKE ? OR a.specialization LIKE ?)`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        baseQuery += ` GROUP BY a.id ORDER BY avg_rating DESC, product_count DESC LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [artisans] = await db.execute(baseQuery, queryParams);

        res.json({
            success: true,
            data: artisans
        });

    } catch (error) {
        console.error('Get artisans error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching artisans'
        });
    }
});

// @route   GET /api/marketplace/artisans/:id
// @desc    Get single artisan profile with products
// @access  Public
router.get('/artisans/:id', async (req, res) => {
    try {
        const artisanId = req.params.id;

        // Get artisan details
        const [artisans] = await db.execute(`
            SELECT a.*, 
                   COUNT(p.id) as product_count,
                   AVG(pr.rating) as avg_rating,
                   COUNT(pr.id) as review_count
            FROM artisan_profiles a
            LEFT JOIN products p ON a.id = p.artisan_id AND p.is_active = TRUE
            LEFT JOIN product_reviews pr ON p.id = pr.product_id
            WHERE a.id = ? AND a.is_verified = TRUE
            GROUP BY a.id
        `, [artisanId]);

        if (artisans.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Artisan not found'
            });
        }

        const artisan = artisans[0];

        // Get artisan's products
        const [products] = await db.execute(`
            SELECT p.*, 
                   pc.name as category_name,
                   pi.image_url,
                   AVG(pr.rating) as avg_rating,
                   COUNT(pr.id) as review_count
            FROM products p
            JOIN product_categories pc ON p.category_id = pc.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
            LEFT JOIN product_reviews pr ON p.id = pr.product_id
            WHERE p.artisan_id = ? AND p.is_active = TRUE
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `, [artisanId]);

        artisan.products = products;

        res.json({
            success: true,
            data: artisan
        });

    } catch (error) {
        console.error('Get artisan details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching artisan details'
        });
    }
});

// @route   POST /api/marketplace/reviews
// @desc    Add product review
// @access  Private
router.post('/reviews', async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user?.id; // This would come from auth middleware

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!productId || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and rating are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if product exists
        const [products] = await db.execute(
            'SELECT id FROM products WHERE id = ? AND is_active = TRUE',
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed this product
        const [existingReviews] = await db.execute(
            'SELECT id FROM product_reviews WHERE product_id = ? AND user_id = ?',
            [productId, userId]
        );

        if (existingReviews.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        // Insert review
        const [result] = await db.execute(
            'INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [productId, userId, rating, comment]
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

// @route   GET /api/marketplace/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT p.*, 
                   a.first_name as artisan_first_name, 
                   a.last_name as artisan_last_name,
                   pc.name as category_name,
                   pi.image_url,
                   AVG(pr.rating) as avg_rating,
                   COUNT(pr.id) as review_count
            FROM products p
            JOIN artisan_profiles a ON p.artisan_id = a.id
            JOIN product_categories pc ON p.category_id = pc.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
            LEFT JOIN product_reviews pr ON p.id = pr.product_id
            WHERE p.is_active = TRUE AND p.is_featured = TRUE
            GROUP BY p.id
            ORDER BY p.featured_order ASC, p.created_at DESC
            LIMIT 8
        `);

        res.json({
            success: true,
            data: products
        });

    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching featured products'
        });
    }
});

module.exports = router;