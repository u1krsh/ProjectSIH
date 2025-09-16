const express = require('express');
const router = express.Router();
const axios = require('axios');

// Simple in-memory cache for weather data
const weatherCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// GET /api/weather/:city - Get weather for a specific city
router.get('/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const cacheKey = city.toLowerCase();
        
        // Check cache first
        const cached = weatherCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return res.json({
                success: true,
                data: cached.data,
                cached: true
            });
        }

        // Mock weather data for Jharkhand cities (replace with real API in production)
        const jharkhandWeather = {
            ranchi: {
                city: 'Ranchi',
                temperature: 25,
                condition: 'partly_cloudy',
                humidity: 65,
                windSpeed: 8,
                description: 'Partly cloudy with pleasant weather',
                forecast: [
                    { day: 'Today', high: 28, low: 18, condition: 'partly_cloudy' },
                    { day: 'Tomorrow', high: 30, low: 19, condition: 'sunny' },
                    { day: 'Day 3', high: 27, low: 17, condition: 'cloudy' },
                    { day: 'Day 4', high: 26, low: 16, condition: 'rainy' },
                    { day: 'Day 5', high: 29, low: 20, condition: 'sunny' }
                ]
            },
            jamshedpur: {
                city: 'Jamshedpur',
                temperature: 27,
                condition: 'sunny',
                humidity: 58,
                windSpeed: 12,
                description: 'Clear sunny day',
                forecast: [
                    { day: 'Today', high: 29, low: 20, condition: 'sunny' },
                    { day: 'Tomorrow', high: 31, low: 21, condition: 'sunny' },
                    { day: 'Day 3', high: 28, low: 19, condition: 'partly_cloudy' },
                    { day: 'Day 4', high: 25, low: 17, condition: 'rainy' },
                    { day: 'Day 5', high: 27, low: 18, condition: 'cloudy' }
                ]
            },
            dhanbad: {
                city: 'Dhanbad',
                temperature: 26,
                condition: 'cloudy',
                humidity: 70,
                windSpeed: 6,
                description: 'Overcast with mild temperatures',
                forecast: [
                    { day: 'Today', high: 28, low: 19, condition: 'cloudy' },
                    { day: 'Tomorrow', high: 29, low: 20, condition: 'partly_cloudy' },
                    { day: 'Day 3', high: 27, low: 18, condition: 'rainy' },
                    { day: 'Day 4', high: 24, low: 16, condition: 'rainy' },
                    { day: 'Day 5', high: 26, low: 17, condition: 'cloudy' }
                ]
            },
            bokaro: {
                city: 'Bokaro',
                temperature: 24,
                condition: 'rainy',
                humidity: 85,
                windSpeed: 10,
                description: 'Light rain with cool weather',
                forecast: [
                    { day: 'Today', high: 26, low: 18, condition: 'rainy' },
                    { day: 'Tomorrow', high: 25, low: 17, condition: 'rainy' },
                    { day: 'Day 3', high: 27, low: 19, condition: 'cloudy' },
                    { day: 'Day 4', high: 29, low: 20, condition: 'partly_cloudy' },
                    { day: 'Day 5', high: 30, low: 21, condition: 'sunny' }
                ]
            },
            deoghar: {
                city: 'Deoghar',
                temperature: 23,
                condition: 'partly_cloudy',
                humidity: 68,
                windSpeed: 7,
                description: 'Pleasant weather with scattered clouds',
                forecast: [
                    { day: 'Today', high: 25, low: 17, condition: 'partly_cloudy' },
                    { day: 'Tomorrow', high: 27, low: 18, condition: 'sunny' },
                    { day: 'Day 3', high: 26, low: 17, condition: 'cloudy' },
                    { day: 'Day 4', high: 24, low: 15, condition: 'rainy' },
                    { day: 'Day 5', high: 28, low: 19, condition: 'sunny' }
                ]
            },
            hazaribagh: {
                city: 'Hazaribagh',
                temperature: 22,
                condition: 'sunny',
                humidity: 55,
                windSpeed: 9,
                description: 'Beautiful sunny day perfect for sightseeing',
                forecast: [
                    { day: 'Today', high: 24, low: 16, condition: 'sunny' },
                    { day: 'Tomorrow', high: 26, low: 17, condition: 'sunny' },
                    { day: 'Day 3', high: 25, low: 16, condition: 'partly_cloudy' },
                    { day: 'Day 4', high: 23, low: 14, condition: 'cloudy' },
                    { day: 'Day 5', high: 27, low: 18, condition: 'sunny' }
                ]
            }
        };

        const weatherData = jharkhandWeather[cacheKey] || {
            city: city,
            temperature: 25,
            condition: 'partly_cloudy',
            humidity: 65,
            windSpeed: 8,
            description: 'Weather information not available for this location',
            forecast: []
        };

        // Add additional info
        weatherData.timestamp = new Date().toISOString();
        weatherData.airQuality = getRandomAirQuality();
        weatherData.uvIndex = getRandomUVIndex();
        weatherData.visibility = '10 km';

        // Cache the result
        weatherCache.set(cacheKey, {
            data: weatherData,
            timestamp: Date.now()
        });

        res.json({
            success: true,
            data: weatherData,
            cached: false
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching weather data',
            error: error.message
        });
    }
});

// GET /api/weather/coords/:lat/:lng - Get weather by coordinates
router.get('/coords/:lat/:lng', async (req, res) => {
    try {
        const { lat, lng } = req.params;
        const cacheKey = `${lat},${lng}`;
        
        // Check cache first
        const cached = weatherCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return res.json({
                success: true,
                data: cached.data,
                cached: true
            });
        }

        // Mock weather data based on coordinates
        const weatherData = {
            coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
            temperature: Math.round(20 + Math.random() * 15), // 20-35°C
            condition: ['sunny', 'partly_cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)],
            humidity: Math.round(50 + Math.random() * 40), // 50-90%
            windSpeed: Math.round(5 + Math.random() * 15), // 5-20 km/h
            description: 'Weather conditions for your location',
            timestamp: new Date().toISOString(),
            airQuality: getRandomAirQuality(),
            uvIndex: getRandomUVIndex(),
            visibility: '10 km'
        };

        // Cache the result
        weatherCache.set(cacheKey, {
            data: weatherData,
            timestamp: Date.now()
        });

        res.json({
            success: true,
            data: weatherData,
            cached: false
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching weather data',
            error: error.message
        });
    }
});

// GET /api/weather/alerts/:district - Get weather alerts for district
router.get('/alerts/:district', async (req, res) => {
    try {
        const { district } = req.params;
        
        // Mock weather alerts
        const alerts = [
            {
                id: 1,
                type: 'advisory',
                title: 'Pleasant Weather Advisory',
                description: 'Perfect weather conditions for outdoor activities and sightseeing.',
                severity: 'low',
                validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                districts: ['ranchi', 'hazaribagh', 'bokaro']
            },
            {
                id: 2,
                type: 'warning',
                title: 'Monsoon Alert',
                description: 'Moderate to heavy rainfall expected. Carry umbrellas and be cautious while traveling.',
                severity: 'medium',
                validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
                districts: ['dhanbad', 'bokaro', 'giridih']
            }
        ];

        const relevantAlerts = alerts.filter(alert => 
            alert.districts.includes(district.toLowerCase())
        );

        res.json({
            success: true,
            data: relevantAlerts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching weather alerts',
            error: error.message
        });
    }
});

// GET /api/weather/travel-advice/:destination - Get travel weather advice
router.get('/travel-advice/:destination', async (req, res) => {
    try {
        const { destination } = req.params;
        
        const travelAdvice = {
            destination: destination,
            currentConditions: 'Favorable for travel',
            recommendations: [
                'Perfect weather for outdoor activities',
                'Carry light cotton clothing',
                'Stay hydrated and use sunscreen',
                'Best time for photography is early morning or evening'
            ],
            whatToBring: [
                'Comfortable walking shoes',
                'Water bottle',
                'Sunhat or cap',
                'Light jacket for evenings'
            ],
            avoidTimes: [],
            bestActivities: [
                'Sightseeing',
                'Photography',
                'Nature walks',
                'Outdoor dining'
            ]
        };

        res.json({
            success: true,
            data: travelAdvice
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching travel advice',
            error: error.message
        });
    }
});

// Helper functions
function getRandomAirQuality() {
    const levels = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups'];
    const aqi = Math.round(50 + Math.random() * 100); // 50-150 AQI
    let level = 'Good';
    
    if (aqi > 100) level = 'Unhealthy for Sensitive Groups';
    else if (aqi > 75) level = 'Moderate';
    
    return {
        aqi: aqi,
        level: level,
        dominantPollutant: 'PM2.5'
    };
}

function getRandomUVIndex() {
    const index = Math.round(3 + Math.random() * 8); // 3-11
    let level = 'Low';
    
    if (index >= 8) level = 'Very High';
    else if (index >= 6) level = 'High';
    else if (index >= 3) level = 'Moderate';
    
    return {
        index: index,
        level: level
    };
}

module.exports = router;