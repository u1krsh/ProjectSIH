const express = require('express');
const router = express.Router();

// Get database connection from app
let db;
router.use((req, res, next) => {
    db = req.app.get('db');
    next();
});

// @route   GET /api/forum/categories
// @desc    Get all forum categories
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await db.execute(`
            SELECT fc.*, 
                   COUNT(DISTINCT fp.id) as post_count,
                   COUNT(DISTINCT fr.id) as reply_count,
                   MAX(GREATEST(fp.created_at, fr.created_at)) as last_activity
            FROM forum_categories fc
            LEFT JOIN forum_posts fp ON fc.id = fp.category_id AND fp.is_active = TRUE
            LEFT JOIN forum_replies fr ON fp.id = fr.post_id AND fr.is_active = TRUE
            WHERE fc.is_active = TRUE
            GROUP BY fc.id
            ORDER BY fc.sort_order ASC, fc.name ASC
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

// @route   GET /api/forum/posts
// @desc    Get all forum posts with filtering and pagination
// @access  Public
router.get('/posts', async (req, res) => {
    try {
        const {
            category,
            search,
            sort = 'created_at',
            order = 'DESC',
            page = 1,
            limit = 20
        } = req.query;

        const offset = (page - 1) * limit;
        
        let baseQuery = `
            SELECT fp.*, 
                   u.first_name as author_first_name,
                   u.last_name as author_last_name,
                   u.user_type as author_type,
                   fc.name as category_name,
                   fc.color as category_color,
                   COUNT(fr.id) as reply_count,
                   COUNT(DISTINCT fl.user_id) as like_count,
                   MAX(fr.created_at) as last_reply_at
            FROM forum_posts fp
            JOIN users u ON fp.user_id = u.id
            JOIN forum_categories fc ON fp.category_id = fc.id
            LEFT JOIN forum_replies fr ON fp.id = fr.post_id AND fr.is_active = TRUE
            LEFT JOIN forum_likes fl ON fp.id = fl.post_id AND fl.reply_id IS NULL
            WHERE fp.is_active = TRUE
        `;

        const queryParams = [];
        
        // Add filters
        if (category) {
            baseQuery += ` AND fc.name = ?`;
            queryParams.push(category);
        }
        
        if (search) {
            baseQuery += ` AND (fp.title LIKE ? OR fp.content LIKE ?)`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm);
        }

        baseQuery += ` GROUP BY fp.id`;

        // Add sorting
        const validSortFields = ['created_at', 'title', 'reply_count', 'like_count', 'last_reply_at'];
        const validOrders = ['ASC', 'DESC'];
        
        if (validSortFields.includes(sort) && validOrders.includes(order.toUpperCase())) {
            if (sort === 'reply_count' || sort === 'like_count') {
                baseQuery += ` ORDER BY ${sort} ${order.toUpperCase()}, fp.created_at DESC`;
            } else if (sort === 'last_reply_at') {
                baseQuery += ` ORDER BY last_reply_at ${order.toUpperCase()}, fp.created_at DESC`;
            } else {
                baseQuery += ` ORDER BY fp.${sort} ${order.toUpperCase()}`;
            }
        } else {
            baseQuery += ` ORDER BY fp.is_pinned DESC, fp.created_at DESC`;
        }

        // Add pagination
        baseQuery += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [posts] = await db.execute(baseQuery, queryParams);

        // Get total count for pagination
        let countQuery = `
            SELECT COUNT(DISTINCT fp.id) as total
            FROM forum_posts fp
            JOIN users u ON fp.user_id = u.id
            JOIN forum_categories fc ON fp.category_id = fc.id
            WHERE fp.is_active = TRUE
        `;

        const countParams = [];
        let paramIndex = 0;
        
        if (category) {
            countQuery += ` AND fc.name = ?`;
            countParams.push(queryParams[paramIndex++]);
        }
        if (search) {
            countQuery += ` AND (fp.title LIKE ? OR fp.content LIKE ?)`;
            countParams.push(queryParams[paramIndex++], queryParams[paramIndex++]);
        }

        const [countResult] = await db.execute(countQuery, countParams);
        const totalPosts = countResult[0].total;

        res.json({
            success: true,
            data: {
                posts,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalPosts / limit),
                    totalPosts,
                    hasNext: (page * limit) < totalPosts,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching posts'
        });
    }
});

// @route   GET /api/forum/posts/:id
// @desc    Get single forum post with replies
// @access  Public
router.get('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // Get post details
        const [posts] = await db.execute(`
            SELECT fp.*, 
                   u.first_name as author_first_name,
                   u.last_name as author_last_name,
                   u.user_type as author_type,
                   fc.name as category_name,
                   fc.color as category_color,
                   COUNT(DISTINCT fr.id) as reply_count,
                   COUNT(DISTINCT fl.user_id) as like_count
            FROM forum_posts fp
            JOIN users u ON fp.user_id = u.id
            JOIN forum_categories fc ON fp.category_id = fc.id
            LEFT JOIN forum_replies fr ON fp.id = fr.post_id AND fr.is_active = TRUE
            LEFT JOIN forum_likes fl ON fp.id = fl.post_id AND fl.reply_id IS NULL
            WHERE fp.id = ? AND fp.is_active = TRUE
            GROUP BY fp.id
        `, [postId]);

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const post = posts[0];

        // Get post replies
        const [replies] = await db.execute(`
            SELECT fr.*, 
                   u.first_name as author_first_name,
                   u.last_name as author_last_name,
                   u.user_type as author_type,
                   COUNT(DISTINCT fl.user_id) as like_count
            FROM forum_replies fr
            JOIN users u ON fr.user_id = u.id
            LEFT JOIN forum_likes fl ON fr.id = fl.reply_id
            WHERE fr.post_id = ? AND fr.is_active = TRUE
            GROUP BY fr.id
            ORDER BY fr.created_at ASC
        `, [postId]);

        post.replies = replies;

        // Increment view count
        await db.execute('UPDATE forum_posts SET view_count = view_count + 1 WHERE id = ?', [postId]);

        res.json({
            success: true,
            data: post
        });

    } catch (error) {
        console.error('Get post details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching post details'
        });
    }
});

// @route   POST /api/forum/posts
// @desc    Create new forum post
// @access  Private
router.post('/posts', async (req, res) => {
    try {
        const userId = req.user?.id; // This would come from auth middleware

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const { title, content, categoryId, tags } = req.body;

        if (!title || !content || !categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Title, content, and category are required'
            });
        }

        // Check if category exists
        const [categories] = await db.execute(
            'SELECT id FROM forum_categories WHERE id = ? AND is_active = TRUE',
            [categoryId]
        );

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Create post
        const [result] = await db.execute(
            'INSERT INTO forum_posts (user_id, category_id, title, content, tags) VALUES (?, ?, ?, ?, ?)',
            [userId, categoryId, title, content, tags || '']
        );

        const postId = result.insertId;

        // Get created post with details
        const [newPost] = await db.execute(`
            SELECT fp.*, 
                   u.first_name as author_first_name,
                   u.last_name as author_last_name,
                   u.user_type as author_type,
                   fc.name as category_name,
                   fc.color as category_color
            FROM forum_posts fp
            JOIN users u ON fp.user_id = u.id
            JOIN forum_categories fc ON fp.category_id = fc.id
            WHERE fp.id = ?
        `, [postId]);

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: newPost[0]
        });

    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating post'
        });
    }
});

// @route   POST /api/forum/posts/:id/replies
// @desc    Add reply to forum post
// @access  Private
router.post('/posts/:id/replies', async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user?.id; // This would come from auth middleware

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        // Check if post exists
        const [posts] = await db.execute(
            'SELECT id FROM forum_posts WHERE id = ? AND is_active = TRUE',
            [postId]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Create reply
        const [result] = await db.execute(
            'INSERT INTO forum_replies (post_id, user_id, content) VALUES (?, ?, ?)',
            [postId, userId, content]
        );

        const replyId = result.insertId;

        // Get created reply with details
        const [newReply] = await db.execute(`
            SELECT fr.*, 
                   u.first_name as author_first_name,
                   u.last_name as author_last_name,
                   u.user_type as author_type
            FROM forum_replies fr
            JOIN users u ON fr.user_id = u.id
            WHERE fr.id = ?
        `, [replyId]);

        res.status(201).json({
            success: true,
            message: 'Reply added successfully',
            data: newReply[0]
        });

    } catch (error) {
        console.error('Add reply error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding reply'
        });
    }
});

// @route   POST /api/forum/posts/:id/like
// @desc    Like/unlike a forum post
// @access  Private
router.post('/posts/:id/like', async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user?.id; // This would come from auth middleware

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if post exists
        const [posts] = await db.execute(
            'SELECT id FROM forum_posts WHERE id = ? AND is_active = TRUE',
            [postId]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if already liked
        const [existingLikes] = await db.execute(
            'SELECT id FROM forum_likes WHERE post_id = ? AND user_id = ? AND reply_id IS NULL',
            [postId, userId]
        );

        let liked = false;
        if (existingLikes.length > 0) {
            // Unlike - remove like
            await db.execute(
                'DELETE FROM forum_likes WHERE post_id = ? AND user_id = ? AND reply_id IS NULL',
                [postId, userId]
            );
            liked = false;
        } else {
            // Like - add like
            await db.execute(
                'INSERT INTO forum_likes (post_id, user_id) VALUES (?, ?)',
                [postId, userId]
            );
            liked = true;
        }

        // Get updated like count
        const [likeCount] = await db.execute(
            'SELECT COUNT(*) as count FROM forum_likes WHERE post_id = ? AND reply_id IS NULL',
            [postId]
        );

        res.json({
            success: true,
            data: {
                liked,
                likeCount: likeCount[0].count
            }
        });

    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({
            success: false,
            message: 'Error liking post'
        });
    }
});

// @route   POST /api/forum/replies/:id/like
// @desc    Like/unlike a forum reply
// @access  Private
router.post('/replies/:id/like', async (req, res) => {
    try {
        const replyId = req.params.id;
        const userId = req.user?.id; // This would come from auth middleware

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if reply exists
        const [replies] = await db.execute(
            'SELECT post_id FROM forum_replies WHERE id = ? AND is_active = TRUE',
            [replyId]
        );

        if (replies.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reply not found'
            });
        }

        const postId = replies[0].post_id;

        // Check if already liked
        const [existingLikes] = await db.execute(
            'SELECT id FROM forum_likes WHERE post_id = ? AND reply_id = ? AND user_id = ?',
            [postId, replyId, userId]
        );

        let liked = false;
        if (existingLikes.length > 0) {
            // Unlike - remove like
            await db.execute(
                'DELETE FROM forum_likes WHERE post_id = ? AND reply_id = ? AND user_id = ?',
                [postId, replyId, userId]
            );
            liked = false;
        } else {
            // Like - add like
            await db.execute(
                'INSERT INTO forum_likes (post_id, reply_id, user_id) VALUES (?, ?, ?)',
                [postId, replyId, userId]
            );
            liked = true;
        }

        // Get updated like count
        const [likeCount] = await db.execute(
            'SELECT COUNT(*) as count FROM forum_likes WHERE reply_id = ?',
            [replyId]
        );

        res.json({
            success: true,
            data: {
                liked,
                likeCount: likeCount[0].count
            }
        });

    } catch (error) {
        console.error('Like reply error:', error);
        res.status(500).json({
            success: false,
            message: 'Error liking reply'
        });
    }
});

// @route   GET /api/forum/user/:userId/posts
// @desc    Get user's forum posts
// @access  Public
router.get('/user/:userId/posts', async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const [posts] = await db.execute(`
            SELECT fp.*, 
                   fc.name as category_name,
                   fc.color as category_color,
                   COUNT(DISTINCT fr.id) as reply_count,
                   COUNT(DISTINCT fl.user_id) as like_count
            FROM forum_posts fp
            JOIN forum_categories fc ON fp.category_id = fc.id
            LEFT JOIN forum_replies fr ON fp.id = fr.post_id AND fr.is_active = TRUE
            LEFT JOIN forum_likes fl ON fp.id = fl.post_id AND fl.reply_id IS NULL
            WHERE fp.user_id = ? AND fp.is_active = TRUE
            GROUP BY fp.id
            ORDER BY fp.created_at DESC
            LIMIT ? OFFSET ?
        `, [userId, parseInt(limit), parseInt(offset)]);

        res.json({
            success: true,
            data: posts
        });

    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user posts'
        });
    }
});

// @route   GET /api/forum/trending
// @desc    Get trending forum posts
// @access  Public
router.get('/trending', async (req, res) => {
    try {
        const [posts] = await db.execute(`
            SELECT fp.*, 
                   u.first_name as author_first_name,
                   u.last_name as author_last_name,
                   u.user_type as author_type,
                   fc.name as category_name,
                   fc.color as category_color,
                   COUNT(DISTINCT fr.id) as reply_count,
                   COUNT(DISTINCT fl.user_id) as like_count,
                   (COUNT(DISTINCT fr.id) * 2 + COUNT(DISTINCT fl.user_id) + fp.view_count * 0.1) as trending_score
            FROM forum_posts fp
            JOIN users u ON fp.user_id = u.id
            JOIN forum_categories fc ON fp.category_id = fc.id
            LEFT JOIN forum_replies fr ON fp.id = fr.post_id AND fr.is_active = TRUE AND fr.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            LEFT JOIN forum_likes fl ON fp.id = fl.post_id AND fl.reply_id IS NULL AND fl.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            WHERE fp.is_active = TRUE AND fp.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY fp.id
            ORDER BY trending_score DESC, fp.created_at DESC
            LIMIT 10
        `);

        res.json({
            success: true,
            data: posts
        });

    } catch (error) {
        console.error('Get trending posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching trending posts'
        });
    }
});

// @route   DELETE /api/forum/posts/:id
// @desc    Delete forum post (soft delete)
// @access  Private
router.delete('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user?.id; // This would come from auth middleware

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if post exists and user owns it
        const [posts] = await db.execute(
            'SELECT user_id FROM forum_posts WHERE id = ? AND is_active = TRUE',
            [postId]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        if (posts[0].user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own posts'
            });
        }

        // Soft delete post
        await db.execute('UPDATE forum_posts SET is_active = FALSE WHERE id = ?', [postId]);

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });

    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting post'
        });
    }
});

module.exports = router;