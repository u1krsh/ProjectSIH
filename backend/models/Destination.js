const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    type: {
        type: String,
        required: true,
        enum: ['wildlife', 'natural', 'adventure', 'religious', 'cultural', 'historical']
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },
        longitude: {
            type: Number,
            required: true,
            min: -180,
            max: 180
        }
    },
    images: [{
        url: String,
        caption: String,
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    location: {
        district: {
            type: String,
            required: true
        },
        address: String,
        nearestCity: String,
        distanceFromRanchi: Number // in kilometers
    },
    details: {
        bestTimeToVisit: String,
        timings: String,
        entryFee: {
            indian: Number,
            foreign: Number,
            child: Number
        },
        duration: String, // recommended visit duration
        difficulty: {
            type: String,
            enum: ['easy', 'moderate', 'difficult']
        }
    },
    activities: [String],
    facilities: [String],
    accessibility: {
        wheelchairAccessible: Boolean,
        publicTransport: Boolean,
        parking: Boolean,
        restrooms: Boolean
    },
    contact: {
        phone: String,
        email: String,
        website: String
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    },
    popularity: {
        annualVisitors: Number,
        trending: {
            type: Boolean,
            default: false
        }
    },
    weather: {
        averageTemperature: {
            winter: { min: Number, max: Number },
            summer: { min: Number, max: Number },
            monsoon: { min: Number, max: Number }
        },
        rainfall: {
            annual: Number,
            monsoonMonths: [String]
        }
    },
    nearbyAttractions: [{
        name: String,
        distance: Number,
        type: String
    }],
    transportation: {
        nearestRailway: {
            station: String,
            distance: Number
        },
        nearestAirport: {
            name: String,
            distance: Number
        },
        roadConnectivity: String
    },
    conservation: {
        ecoFriendly: Boolean,
        conservationEfforts: [String],
        sustainabilityRating: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    featured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
destinationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
destinationSchema.index({ type: 1 });
destinationSchema.index({ 'location.district': 1 });
destinationSchema.index({ featured: 1 });
destinationSchema.index({ 'rating.average': -1 });
destinationSchema.index({ 'popularity.annualVisitors': -1 });

// Virtual for getting primary image
destinationSchema.virtual('primaryImage').get(function() {
    const primaryImg = this.images.find(img => img.isPrimary);
    return primaryImg || this.images[0];
});

// Virtual for distance calculation (requires user coordinates)
destinationSchema.virtual('distance').get(function() {
    return this._distance || null;
});

// Method to calculate distance from given coordinates
destinationSchema.methods.calculateDistance = function(userLat, userLng) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (this.coordinates.latitude - userLat) * Math.PI / 180;
    const dLon = (this.coordinates.longitude - userLng) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(userLat * Math.PI / 180) * Math.cos(this.coordinates.latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    this._distance = R * c;
    return this._distance;
};

// Static method to find nearby destinations
destinationSchema.statics.findNearby = function(lat, lng, maxDistance = 50) {
    return this.find({
        'coordinates.latitude': {
            $gte: lat - (maxDistance / 111.32),
            $lte: lat + (maxDistance / 111.32)
        },
        'coordinates.longitude': {
            $gte: lng - (maxDistance / (111.32 * Math.cos(lat * Math.PI / 180))),
            $lte: lng + (maxDistance / (111.32 * Math.cos(lat * Math.PI / 180)))
        },
        status: 'active'
    });
};

// Pre-save middleware
destinationSchema.pre('save', function(next) {
    // Ensure only one primary image
    if (this.images && this.images.length > 0) {
        let primaryCount = this.images.filter(img => img.isPrimary).length;
        if (primaryCount === 0) {
            this.images[0].isPrimary = true;
        } else if (primaryCount > 1) {
            this.images.forEach((img, index) => {
                img.isPrimary = index === 0;
            });
        }
    }
    next();
});

module.exports = mongoose.model('Destination', destinationSchema);