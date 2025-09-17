-- Tribal Trails Database Schema
-- Created for SIH Project

DROP DATABASE IF EXISTS jharkhand_tourism;
CREATE DATABASE jharkhand_tourism;
USE jharkhand_tourism;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('tourist', 'local', 'guide', 'homestay', 'artisan', 'business') NOT NULL,
    profile_image VARCHAR(255),
    bio TEXT,
    location VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME,
    last_login TIMESTAMP NULL,
    login_attempts INT DEFAULT 0,
    locked_until DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Sessions table
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    refresh_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- Artisan Marketplace
CREATE TABLE artisans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    business_name VARCHAR(100),
    craft_specialty VARCHAR(100),
    experience_years INT,
    workshop_location VARCHAR(255),
    description TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    artisan_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category ENUM('textiles', 'pottery', 'jewelry', 'bamboo', 'metalwork', 'woodcraft', 'other') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_percentage INT DEFAULT 0,
    stock_quantity INT DEFAULT 1,
    images JSON,
    materials_used TEXT,
    dimensions VARCHAR(100),
    weight VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artisan_id) REFERENCES artisans(id) ON DELETE CASCADE
);

CREATE TABLE product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    images JSON,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Folklore & Storytelling
CREATE TABLE folklore_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO folklore_categories (name, description, icon) VALUES
('legends', 'Ancient legends and mythical tales', 'fas fa-scroll'),
('folktales', 'Traditional folk stories', 'fas fa-book-open'),
('mythology', 'Tribal mythology and beliefs', 'fas fa-star'),
('history', 'Historical narratives', 'fas fa-landmark');

CREATE TABLE stories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    category_id INT NOT NULL,
    narrator_name VARCHAR(100),
    narrator_bio TEXT,
    narrator_image VARCHAR(255),
    audio_file VARCHAR(255),
    duration_minutes INT,
    featured_image VARCHAR(255),
    tags JSON,
    is_featured BOOLEAN DEFAULT FALSE,
    listen_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES folklore_categories(id)
);

CREATE TABLE story_listens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    story_id INT NOT NULL,
    user_id INT,
    ip_address VARCHAR(45),
    listened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE story_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    story_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_story (user_id, story_id)
);

-- Homestays
CREATE TABLE homestays (
    id INT PRIMARY KEY AUTO_INCREMENT,
    host_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    property_type ENUM('traditional_house', 'modern_home', 'cottage', 'farm_house', 'tribal_hut') NOT NULL,
    max_guests INT NOT NULL,
    bedrooms INT,
    bathrooms INT,
    price_per_night DECIMAL(10,2) NOT NULL,
    images JSON,
    amenities JSON,
    house_rules TEXT,
    cultural_activities JSON,
    meals_included BOOLEAN DEFAULT TRUE,
    pickup_service BOOLEAN DEFAULT FALSE,
    languages_spoken JSON,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_bookings INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE homestay_bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    homestay_id INT NOT NULL,
    guest_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests_count INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    special_requests TEXT,
    host_notes TEXT,
    guest_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (homestay_id) REFERENCES homestays(id) ON DELETE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE homestay_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    homestay_id INT NOT NULL,
    guest_id INT NOT NULL,
    booking_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    cleanliness_rating INT,
    hospitality_rating INT,
    cultural_experience_rating INT,
    value_for_money_rating INT,
    images JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (homestay_id) REFERENCES homestays(id) ON DELETE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES homestay_bookings(id) ON DELETE CASCADE
);

-- Community Forum
CREATE TABLE forum_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    post_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO forum_categories (name, description, icon, color) VALUES
('Travel Tips', 'Share and discover travel tips and advice', 'fas fa-map-marker-alt', '#3B82F6'),
('Homestays', 'Discussions about homestay experiences', 'fas fa-home', '#10B981'),
('Local Markets', 'Information about local markets and shopping', 'fas fa-shopping-bag', '#F59E0B'),
('Food & Culture', 'Traditional food and cultural experiences', 'fas fa-utensils', '#EF4444'),
('Photography', 'Share photos and photography tips', 'fas fa-camera', '#8B5CF6'),
('Help & Support', 'Get help with your travel questions', 'fas fa-question-circle', '#6B7280');

CREATE TABLE forum_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    images JSON,
    tags JSON,
    is_featured BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES forum_categories(id) ON DELETE CASCADE
);

CREATE TABLE forum_replies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_reply_id INT DEFAULT NULL,
    content TEXT NOT NULL,
    images JSON,
    like_count INT DEFAULT 0,
    is_solution BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_reply_id) REFERENCES forum_replies(id) ON DELETE CASCADE
);

CREATE TABLE forum_post_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_post (user_id, post_id)
);

CREATE TABLE forum_reply_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reply_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reply_id) REFERENCES forum_replies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_reply (user_id, reply_id)
);

-- User Sessions
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id)
);

-- Email Verification
CREATE TABLE email_verifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    verification_token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Password Reset
CREATE TABLE password_resets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    reset_token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Activity Logs
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT,
    metadata JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_activity (user_id, created_at),
    INDEX idx_activity_type (activity_type)
);

-- Notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('booking', 'review', 'forum', 'marketplace', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_notifications (user_id, is_read)
);

-- Insert sample data
INSERT INTO users (first_name, last_name, email, phone, password_hash, user_type, is_verified) VALUES
('Admin', 'User', 'admin@jharkhantourism.com', '9876543210', '$2a$10$rQ7QbB7bZvZvK9K9K9K9KOe8V8V8V8V8V8V8V8V8V8V8V8V8V8', 'business', TRUE),
('Geeta', 'Soren', 'geeta.soren@email.com', '9876543211', '$2a$10$rQ7QbB7bZvZvK9K9K9K9KOe8V8V8V8V8V8V8V8V8V8V8V8V8V8', 'homestay', TRUE),
('Ramesh', 'Munda', 'ramesh.munda@email.com', '9876543212', '$2a$10$rQ7QbB7bZvZvK9K9K9K9KOe8V8V8V8V8V8V8V8V8V8V8V8V8V8', 'artisan', TRUE),
('Priya', 'Sharma', 'priya.sharma@email.com', '9876543213', '$2a$10$rQ7QbB7bZvZvK9K9K9K9KOe8V8V8V8V8V8V8V8V8V8V8V8V8V8', 'tourist', TRUE);

-- Sample stories
INSERT INTO stories (title, excerpt, content, category_id, narrator_name, narrator_bio, duration_minutes, featured_image, is_featured) VALUES
('The Legend of Birsa Munda', 'Discover the heroic tale of Birsa Munda, the tribal freedom fighter who became a legendary figure in Jharkhand''s history and culture.', 'Long detailed story content here...', 1, 'Elder Suresh Oraon', 'Traditional storyteller from Ranchi', 8, 'birsa-munda.jpg', TRUE),
('The Wise Tiger of Saranda', 'A mystical tale from the Saranda forests about a wise tiger who taught the tribal people the secrets of living in harmony with nature.', 'Long detailed story content here...', 2, 'Grandmother Kamala', 'Village elder and traditional storyteller', 6, 'saranda-tiger.jpg', FALSE);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_artisan ON products(artisan_id);
CREATE INDEX idx_homestays_location ON homestays(location);
CREATE INDEX idx_forum_posts_category ON forum_posts(category_id);
CREATE INDEX idx_forum_posts_user ON forum_posts(user_id);