const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const { validateDestination } = require('../middleware/validation');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/destinations/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// GET /api/destinations - Get all destinations with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            type,
            district,
            featured,
            search,
            sortBy = 'name',
            order = 'asc',
            lat,
            lng,
            maxDistance = 50
        } = req.query;

        const query = { status: 'active' };
        
        // Apply filters
        if (type) query.type = type;
        if (district) query['location.district'] = new RegExp(district, 'i');
        if (featured) query.featured = featured === 'true';
        
        // Search functionality
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { 'location.district': new RegExp(search, 'i') }
            ];
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Build sort object
        const sortObject = {};
        sortObject[sortBy] = order === 'desc' ? -1 : 1;

        let destinations;
        let total;

        // If location provided, find nearby destinations
        if (lat && lng) {
            destinations = await Destination.findNearby(
                parseFloat(lat), 
                parseFloat(lng), 
                parseInt(maxDistance)
            );
            
            // Calculate distances and apply other filters
            destinations = destinations
                .filter(dest => {
                    // Apply query filters
                    return Object.keys(query).every(key => {
                        if (key === '$or') {
                            return query[key].some(condition => {
                                const field = Object.keys(condition)[0];
                                const value = condition[field];
                                return value.test(dest[field] || '');
                            });
                        }
                        return dest[key] === query[key] || query[key] === undefined;
                    });
                })
                .map(dest => {
                    dest.calculateDistance(parseFloat(lat), parseFloat(lng));
                    return dest;
                })
                .sort((a, b) => a.distance - b.distance)
                .slice(skip, skip + parseInt(limit));
            
            total = destinations.length;
        } else {
            // Regular query without location
            destinations = await Destination.find(query)
                .sort(sortObject)
                .limit(parseInt(limit))
                .skip(skip)
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email');
            
            total = await Destination.countDocuments(query);
        }

        const totalPages = Math.ceil(total / parseInt(limit));

        res.json({
            success: true,
            data: destinations,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalResults: total,
                hasNext: parseInt(page) < totalPages,
                hasPrev: parseInt(page) > 1
            },
            filters: {
                types: await Destination.distinct('type'),
                districts: await Destination.distinct('location.district')
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching destinations',
            error: error.message
        });
    }
});

// GET /api/destinations/featured - Get featured destinations
router.get('/featured', async (req, res) => {
    try {
        const featured = await Destination.find({ featured: true, status: 'active' })
            .sort({ 'rating.average': -1 })
            .limit(6);

        res.json({
            success: true,
            data: featured
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching featured destinations',
            error: error.message
        });
    }
});

// GET /api/destinations/popular - Get popular destinations
router.get('/popular', async (req, res) => {
    try {
        const popular = await Destination.find({ status: 'active' })
            .sort({ 'popularity.annualVisitors': -1 })
            .limit(10)
            .select('name images rating popularity location type');

        res.json({
            success: true,
            data: popular
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching popular destinations',
            error: error.message
        });
    }
});

// GET /api/destinations/stats - Get destination statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await Destination.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: null,
                    totalDestinations: { $sum: 1 },
                    averageRating: { $avg: '$rating.average' },
                    totalVisitors: { $sum: '$popularity.annualVisitors' },
                    typeDistribution: {
                        $push: '$type'
                    }
                }
            }
        ]);

        const typeStats = await Destination.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    avgRating: { $avg: '$rating.average' },
                    totalVisitors: { $sum: '$popularity.annualVisitors' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                overview: stats[0],
                byType: typeStats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching destination stats',
            error: error.message
        });
    }
});

// GET /api/destinations/:id - Get single destination
router.get('/:id', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email');

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: 'Destination not found'
            });
        }

        // Find nearby attractions
        const nearby = await Destination.findNearby(
            destination.coordinates.latitude,
            destination.coordinates.longitude,
            20
        ).limit(5);

        res.json({
            success: true,
            data: {
                destination,
                nearby: nearby.filter(d => d._id.toString() !== destination._id.toString())
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching destination',
            error: error.message
        });
    }
});

// POST /api/destinations - Create new destination (Admin only)
router.post('/', authenticateToken, isAdmin, upload.array('images', 5), validateDestination, async (req, res) => {
    try {
        const destinationData = req.body;
        
        // Add uploaded images
        if (req.files && req.files.length > 0) {
            destinationData.images = req.files.map((file, index) => ({
                url: `/uploads/destinations/${file.filename}`,
                caption: `${destinationData.name} - Image ${index + 1}`,
                isPrimary: index === 0
            }));
        }

        destinationData.createdBy = req.user.id;
        destinationData.updatedBy = req.user.id;

        const destination = new Destination(destinationData);
        await destination.save();

        res.status(201).json({
            success: true,
            message: 'Destination created successfully',
            data: destination
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating destination',
            error: error.message
        });
    }
});

// PUT /api/destinations/:id - Update destination (Admin only)
router.put('/:id', authenticateToken, isAdmin, upload.array('images', 5), validateDestination, async (req, res) => {
    try {
        const destinationData = req.body;
        destinationData.updatedBy = req.user.id;

        // Handle new images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file, index) => ({
                url: `/uploads/destinations/${file.filename}`,
                caption: `${destinationData.name} - Image ${index + 1}`,
                isPrimary: false
            }));
            
            // Merge with existing images or replace
            if (destinationData.replaceImages === 'true') {
                destinationData.images = newImages;
                if (newImages.length > 0) newImages[0].isPrimary = true;
            } else {
                const existing = await Destination.findById(req.params.id);
                destinationData.images = [...(existing.images || []), ...newImages];
            }
        }

        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            destinationData,
            { new: true, runValidators: true }
        );

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: 'Destination not found'
            });
        }

        res.json({
            success: true,
            message: 'Destination updated successfully',
            data: destination
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating destination',
            error: error.message
        });
    }
});

// DELETE /api/destinations/:id - Delete destination (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            { status: 'inactive' },
            { new: true }
        );

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: 'Destination not found'
            });
        }

        res.json({
            success: true,
            message: 'Destination deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting destination',
            error: error.message
        });
    }
});

// POST /api/destinations/:id/rate - Rate a destination
router.post('/:id/rate', authenticateToken, async (req, res) => {
    try {
        const { rating } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({
                success: false,
                message: 'Destination not found'
            });
        }

        // Update rating (simplified - in production, track individual user ratings)
        const newTotal = destination.rating.totalReviews + 1;
        const newAverage = ((destination.rating.average * destination.rating.totalReviews) + rating) / newTotal;

        destination.rating.average = Math.round(newAverage * 10) / 10;
        destination.rating.totalReviews = newTotal;

        await destination.save();

        res.json({
            success: true,
            message: 'Rating submitted successfully',
            data: {
                averageRating: destination.rating.average,
                totalReviews: destination.rating.totalReviews
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting rating',
            error: error.message
        });
    }
});

module.exports = router;