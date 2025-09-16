const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    profileImage: {
        type: String,
        default: ''
    },
    preferences: {
        interests: [{
            type: String,
            enum: ['wildlife', 'adventure', 'culture', 'nature', 'religious', 'photography', 'trekking', 'waterfalls']
        }],
        language: {
            type: String,
            enum: ['en', 'hi', 'bho'], // English, Hindi, Bhojpuri
            default: 'en'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            sms: {
                type: Boolean,
                default: false
            },
            push: {
                type: Boolean,
                default: true
            }
        },
        accessibility: {
            fontSize: {
                type: String,
                enum: ['small', 'medium', 'large'],
                default: 'medium'
            },
            highContrast: {
                type: Boolean,
                default: false
            }
        }
    },
    emergencyContact: {
        name: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        relationship: {
            type: String,
            trim: true
        }
    },
    bookings: [{
        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Destination',
            required: true
        },
        bookingType: {
            type: String,
            enum: ['day_visit', 'overnight_stay', 'guided_tour', 'adventure_package'],
            required: true
        },
        visitDate: {
            type: Date,
            required: true
        },
        numberOfPeople: {
            type: Number,
            required: true,
            min: 1,
            max: 50
        },
        specialRequests: {
            type: String,
            maxlength: 500
        },
        contactInfo: {
            alternatePhone: String,
            emergencyContactName: String,
            emergencyContactPhone: String
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending'
        },
        bookedAt: {
            type: Date,
            default: Date.now
        },
        confirmationNumber: {
            type: String,
            unique: true,
            sparse: true
        }
    }],
    favorites: [{
        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Destination'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    travelHistory: [{
        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Destination'
        },
        visitDate: Date,
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: {
            type: String,
            maxlength: 1000
        },
        photos: [String], // Array of photo URLs
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    socialConnections: {
        facebook: String,
        instagram: String,
        twitter: String
    },
    accountStatus: {
        type: String,
        enum: ['active', 'suspended', 'deactivated'],
        default: 'active'
    },
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        count: {
            type: Number,
            default: 0
        },
        lastAttempt: Date,
        lockedUntil: Date
    },
    verificationStatus: {
        email: {
            type: Boolean,
            default: false
        },
        phone: {
            type: Boolean,
            default: false
        },
        emailVerificationToken: String,
        phoneVerificationCode: String
    },
    resetPassword: {
        token: String,
        expires: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ 'bookings.visitDate': 1 });
userSchema.index({ 'favorites.addedAt': -1 });

// Virtual for user's full profile completion percentage
userSchema.virtual('profileCompleteness').get(function() {
    let completeness = 0;
    const fields = [
        this.name,
        this.email,
        this.phone,
        this.profileImage,
        this.emergencyContact?.name,
        this.emergencyContact?.phone,
        this.preferences?.interests?.length > 0
    ];
    
    const filledFields = fields.filter(field => field && field.length > 0).length;
    completeness = Math.round((filledFields / fields.length) * 100);
    
    return completeness;
});

// Virtual for active bookings
userSchema.virtual('activeBookings').get(function() {
    return this.bookings.filter(booking => 
        booking.status === 'confirmed' && booking.visitDate > new Date()
    );
});

// Virtual for past bookings
userSchema.virtual('pastBookings').get(function() {
    return this.bookings.filter(booking => 
        booking.visitDate < new Date()
    );
});

// Pre-save middleware to generate confirmation numbers
userSchema.pre('save', function(next) {
    if (this.isModified('bookings')) {
        this.bookings.forEach(booking => {
            if (!booking.confirmationNumber && booking.status === 'confirmed') {
                booking.confirmationNumber = 'JH' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
            }
        });
    }
    next();
});

// Method to check if account is locked
userSchema.methods.isLocked = function() {
    return !!(this.loginAttempts.lockedUntil && this.loginAttempts.lockedUntil > Date.now());
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.loginAttempts.lockedUntil && this.loginAttempts.lockedUntil < Date.now()) {
        return this.updateOne({
            $unset: { 'loginAttempts.lockedUntil': 1 },
            $set: {
                'loginAttempts.count': 1,
                'loginAttempts.lastAttempt': Date.now()
            }
        });
    }
    
    const updates = {
        $inc: { 'loginAttempts.count': 1 },
        $set: { 'loginAttempts.lastAttempt': Date.now() }
    };
    
    // Lock account after 5 attempts for 2 hours
    if (this.loginAttempts.count + 1 >= 5) {
        updates.$set['loginAttempts.lockedUntil'] = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
    }
    
    return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: {
            'loginAttempts.count': 1,
            'loginAttempts.lastAttempt': 1,
            'loginAttempts.lockedUntil': 1
        }
    });
};

// Method to add favorite destination
userSchema.methods.addFavorite = function(destinationId) {
    const existingFavorite = this.favorites.find(fav => 
        fav.destination.toString() === destinationId.toString()
    );
    
    if (!existingFavorite) {
        this.favorites.push({
            destination: destinationId,
            addedAt: new Date()
        });
    }
    
    return this.save();
};

// Method to remove favorite destination
userSchema.methods.removeFavorite = function(destinationId) {
    this.favorites = this.favorites.filter(fav => 
        fav.destination.toString() !== destinationId.toString()
    );
    
    return this.save();
};

// Method to add travel history
userSchema.methods.addTravelHistory = function(destinationId, visitDate, rating, review, photos = []) {
    this.travelHistory.push({
        destination: destinationId,
        visitDate: visitDate,
        rating: rating,
        review: review,
        photos: photos,
        addedAt: new Date()
    });
    
    return this.save();
};

// Static method to find users by interests
userSchema.statics.findByInterests = function(interests) {
    return this.find({
        'preferences.interests': { $in: interests }
    });
};

// Static method to get user statistics
userSchema.statics.getUserStats = function() {
    return this.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                activeUsers: {
                    $sum: {
                        $cond: [{ $eq: ['$accountStatus', 'active'] }, 1, 0]
                    }
                },
                verifiedUsers: {
                    $sum: {
                        $cond: [{ $eq: ['$verificationStatus.email', true] }, 1, 0]
                    }
                },
                avgBookingsPerUser: { $avg: { $size: '$bookings' } }
            }
        }
    ]);
};

module.exports = mongoose.model('User', userSchema);