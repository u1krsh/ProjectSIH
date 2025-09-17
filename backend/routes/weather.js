const express = require('express');
const router = express.Router();
const axios = require('axios');

// OpenWeatherMap API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'your_openweather_api_key_here';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Simple in-memory cache for weather data
const weatherCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Jharkhand cities with coordinates
const JHARKHAND_CITIES = {
    ranchi: { lat: 23.3441, lon: 85.3096, name: 'Ranchi' },
    jamshedpur: { lat: 22.8046, lon: 86.2029, name: 'Jamshedpur' },
    dhanbad: { lat: 23.7957, lon: 86.4304, name: 'Dhanbad' },
    bokaro: { lat: 23.6669, lon: 86.1511, name: 'Bokaro' },
    deoghar: { lat: 24.4844, lon: 86.6947, name: 'Deoghar' },
    hazaribagh: { lat: 23.9929, lon: 85.3647, name: 'Hazaribagh' }
};

// Weather condition mapping from OpenWeatherMap to our system
const WEATHER_CONDITION_MAP = {
    'clear sky': 'sunny',
    'few clouds': 'partly_cloudy',
    'scattered clouds': 'partly_cloudy',
    'broken clouds': 'cloudy',
    'overcast clouds': 'cloudy',
    'shower rain': 'rainy',
    'rain': 'rainy',
    'thunderstorm': 'stormy',
    'snow': 'snowy',
    'mist': 'foggy',
    'fog': 'foggy',
    'haze': 'hazy'
};

// Function to get weather condition icon and type
function getWeatherCondition(openWeatherCondition, openWeatherMain) {
    const condition = openWeatherCondition.toLowerCase();
    const main = openWeatherMain.toLowerCase();
    
    if (main.includes('clear')) return 'sunny';
    if (main.includes('cloud')) return condition.includes('few') || condition.includes('scattered') ? 'partly_cloudy' : 'cloudy';
    if (main.includes('rain') || main.includes('drizzle')) return 'rainy';
    if (main.includes('thunderstorm')) return 'stormy';
    if (main.includes('snow')) return 'snowy';
    if (main.includes('mist') || main.includes('fog') || main.includes('haze')) return 'foggy';
    
    return WEATHER_CONDITION_MAP[condition] || 'partly_cloudy';
}

// Function to fetch real weather data from OpenWeatherMap
async function fetchRealWeatherData(lat, lon, cityName) {
    try {
        // Fetch current weather
        const currentWeatherResponse = await axios.get(
            `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        
        // Fetch 5-day forecast
        const forecastResponse = await axios.get(
            `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        
        const currentWeather = currentWeatherResponse.data;
        const forecast = forecastResponse.data;
        
        // Process current weather
        const weatherCondition = getWeatherCondition(
            currentWeather.weather[0].description,
            currentWeather.weather[0].main
        );
        
        // Process 5-day forecast (taking one reading per day)
        const dailyForecast = [];
        const processedDates = new Set();
        
        forecast.list.forEach((item, index) => {
            const date = new Date(item.dt * 1000);
            const dateString = date.toDateString();
            
            if (!processedDates.has(dateString) && dailyForecast.length < 5) {
                processedDates.add(dateString);
                
                let dayLabel;
                if (index === 0) dayLabel = 'Today';
                else if (index === 1) dayLabel = 'Tomorrow';
                else dayLabel = `Day ${dailyForecast.length + 1}`;
                
                dailyForecast.push({
                    day: dayLabel,
                    date: dateString,
                    high: Math.round(item.main.temp_max),
                    low: Math.round(item.main.temp_min),
                    condition: getWeatherCondition(item.weather[0].description, item.weather[0].main),
                    description: item.weather[0].description
                });
            }
        });
        
        return {
            city: cityName || currentWeather.name,
            temperature: Math.round(currentWeather.main.temp),
            condition: weatherCondition,
            humidity: currentWeather.main.humidity,
            windSpeed: Math.round(currentWeather.wind.speed * 3.6), // Convert m/s to km/h
            pressure: currentWeather.main.pressure,
            description: currentWeather.weather[0].description,
            feelsLike: Math.round(currentWeather.main.feels_like),
            visibility: currentWeather.visibility ? Math.round(currentWeather.visibility / 1000) : null,
            uvIndex: null, // UV index not available in free tier
            sunrise: new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            sunset: new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            forecast: dailyForecast,
            lastUpdated: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Error fetching real weather data:', error.message);
        throw error;
    }
}

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
                cached: true,
                source: 'cache'
            });
        }

        let weatherData;
        let dataSource = 'api';

        // Try to get real weather data first
        if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'your_openweather_api_key_here') {
            try {
                // Check if it's a known Jharkhand city
                const cityInfo = JHARKHAND_CITIES[cacheKey];
                if (cityInfo) {
                    weatherData = await fetchRealWeatherData(cityInfo.lat, cityInfo.lon, cityInfo.name);
                    console.log(`✅ Real weather data fetched for ${cityInfo.name}`);
                } else {
                    // For unknown cities, try to get weather data by city name
                    const response = await axios.get(
                        `${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
                    );
                    const coords = response.data.coord;
                    weatherData = await fetchRealWeatherData(coords.lat, coords.lon, response.data.name);
                    console.log(`✅ Real weather data fetched for ${city}`);
                }
            } catch (apiError) {
                console.log(`⚠️ OpenWeatherMap API failed for ${city}:`, apiError.message);
                console.log('🔄 Falling back to mock data...');
                weatherData = getMockWeatherData(city, cacheKey);
                dataSource = 'mock';
            }
        } else {
            console.log('⚠️ OpenWeatherMap API key not configured, using mock data');
            weatherData = getMockWeatherData(city, cacheKey);
            dataSource = 'mock';
        }

        // Add additional computed data
        weatherData.airQuality = getRandomAirQuality();
        weatherData.uvIndex = weatherData.uvIndex || getRandomUVIndex();
        weatherData.visibility = weatherData.visibility || '10 km';
        weatherData.timestamp = new Date().toISOString();

        // Cache the result
        weatherCache.set(cacheKey, {
            data: weatherData,
            timestamp: Date.now()
        });

        res.json({
            success: true,
            data: weatherData,
            cached: false,
            source: dataSource
        });

    } catch (error) {
        console.error('Weather API Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching weather data',
            error: error.message
        });
    }
});

// Fallback mock data function
function getMockWeatherData(city, cacheKey) {
    // Mock weather data for Jharkhand cities
    const jharkhandWeather = {
        ranchi: {
            city: 'Ranchi',
            temperature: 25,
            condition: 'partly_cloudy',
            humidity: 65,
            windSpeed: 8,
            pressure: 1013,
            description: 'Partly cloudy with pleasant weather',
            feelsLike: 27,
            forecast: [
                { day: 'Today', high: 28, low: 18, condition: 'partly_cloudy', description: 'Partly cloudy' },
                { day: 'Tomorrow', high: 30, low: 19, condition: 'sunny', description: 'Sunny' },
                { day: 'Day 3', high: 27, low: 17, condition: 'cloudy', description: 'Cloudy' },
                { day: 'Day 4', high: 26, low: 16, condition: 'rainy', description: 'Light rain' },
                { day: 'Day 5', high: 29, low: 20, condition: 'sunny', description: 'Sunny' }
            ]
        },
        jamshedpur: {
            city: 'Jamshedpur',
            temperature: 27,
            condition: 'sunny',
            humidity: 58,
            windSpeed: 12,
            pressure: 1015,
            description: 'Clear sunny day',
            feelsLike: 29,
            forecast: [
                { day: 'Today', high: 29, low: 20, condition: 'sunny', description: 'Sunny' },
                { day: 'Tomorrow', high: 31, low: 21, condition: 'sunny', description: 'Sunny' },
                { day: 'Day 3', high: 28, low: 19, condition: 'partly_cloudy', description: 'Partly cloudy' },
                { day: 'Day 4', high: 25, low: 17, condition: 'rainy', description: 'Light rain' },
                { day: 'Day 5', high: 27, low: 18, condition: 'cloudy', description: 'Cloudy' }
            ]
        },
        dhanbad: {
            city: 'Dhanbad',
            temperature: 26,
            condition: 'cloudy',
            humidity: 70,
            windSpeed: 6,
            pressure: 1012,
            description: 'Overcast with mild temperatures',
            feelsLike: 28,
            forecast: [
                { day: 'Today', high: 28, low: 19, condition: 'cloudy', description: 'Cloudy' },
                { day: 'Tomorrow', high: 29, low: 20, condition: 'partly_cloudy', description: 'Partly cloudy' },
                { day: 'Day 3', high: 27, low: 18, condition: 'rainy', description: 'Light rain' },
                { day: 'Day 4', high: 24, low: 16, condition: 'rainy', description: 'Moderate rain' },
                { day: 'Day 5', high: 26, low: 17, condition: 'cloudy', description: 'Cloudy' }
            ]
        },
        bokaro: {
            city: 'Bokaro',
            temperature: 24,
            condition: 'rainy',
            humidity: 85,
            windSpeed: 10,
            pressure: 1008,
            description: 'Light rain with cool weather',
            feelsLike: 26,
            forecast: [
                { day: 'Today', high: 26, low: 18, condition: 'rainy', description: 'Light rain' },
                { day: 'Tomorrow', high: 25, low: 17, condition: 'rainy', description: 'Moderate rain' },
                { day: 'Day 3', high: 27, low: 19, condition: 'cloudy', description: 'Cloudy' },
                { day: 'Day 4', high: 29, low: 20, condition: 'partly_cloudy', description: 'Partly cloudy' },
                { day: 'Day 5', high: 30, low: 21, condition: 'sunny', description: 'Sunny' }
            ]
        },
        deoghar: {
            city: 'Deoghar',
            temperature: 23,
            condition: 'partly_cloudy',
            humidity: 68,
            windSpeed: 7,
            pressure: 1014,
            description: 'Pleasant weather with scattered clouds',
            feelsLike: 25,
            forecast: [
                { day: 'Today', high: 25, low: 17, condition: 'partly_cloudy', description: 'Partly cloudy' },
                { day: 'Tomorrow', high: 27, low: 18, condition: 'sunny', description: 'Sunny' },
                { day: 'Day 3', high: 26, low: 17, condition: 'cloudy', description: 'Cloudy' },
                { day: 'Day 4', high: 24, low: 15, condition: 'rainy', description: 'Light rain' },
                { day: 'Day 5', high: 28, low: 19, condition: 'sunny', description: 'Sunny' }
            ]
        },
        hazaribagh: {
            city: 'Hazaribagh',
            temperature: 22,
            condition: 'sunny',
            humidity: 55,
            windSpeed: 9,
            pressure: 1016,
            description: 'Beautiful sunny day perfect for sightseeing',
            feelsLike: 24,
            forecast: [
                { day: 'Today', high: 24, low: 16, condition: 'sunny', description: 'Sunny' },
                { day: 'Tomorrow', high: 26, low: 17, condition: 'sunny', description: 'Sunny' },
                { day: 'Day 3', high: 25, low: 16, condition: 'partly_cloudy', description: 'Partly cloudy' },
                { day: 'Day 4', high: 23, low: 14, condition: 'cloudy', description: 'Cloudy' },
                { day: 'Day 5', high: 27, low: 18, condition: 'sunny', description: 'Sunny' }
            ]
        }
    };

    return jharkhandWeather[cacheKey] || {
        city: city,
        temperature: 25,
        condition: 'partly_cloudy',
        humidity: 65,
        windSpeed: 8,
        pressure: 1013,
        description: 'Weather information not available for this location',
        feelsLike: 27,
        forecast: [
            { day: 'Today', high: 27, low: 18, condition: 'partly_cloudy', description: 'Partly cloudy' },
            { day: 'Tomorrow', high: 28, low: 19, condition: 'sunny', description: 'Sunny' },
            { day: 'Day 3', high: 26, low: 17, condition: 'cloudy', description: 'Cloudy' },
            { day: 'Day 4', high: 24, low: 16, condition: 'rainy', description: 'Light rain' },
            { day: 'Day 5', high: 27, low: 18, condition: 'sunny', description: 'Sunny' }
        ]
    };
}

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
                cached: true,
                source: 'cache'
            });
        }

        let weatherData;
        let dataSource = 'api';

        // Try to get real weather data first
        if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'your_openweather_api_key_here') {
            try {
                weatherData = await fetchRealWeatherData(parseFloat(lat), parseFloat(lng));
                weatherData.coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };
                console.log(`✅ Real weather data fetched for coordinates (${lat}, ${lng})`);
            } catch (apiError) {
                console.log(`⚠️ OpenWeatherMap API failed for coordinates (${lat}, ${lng}):`, apiError.message);
                console.log('🔄 Falling back to mock data...');
                dataSource = 'mock';
                
                // Mock weather data based on coordinates
                weatherData = {
                    coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
                    city: 'Unknown Location',
                    temperature: Math.round(20 + Math.random() * 15), // 20-35°C
                    condition: ['sunny', 'partly_cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)],
                    humidity: Math.round(50 + Math.random() * 40), // 50-90%
                    windSpeed: Math.round(5 + Math.random() * 15), // 5-20 km/h
                    pressure: Math.round(1000 + Math.random() * 30), // 1000-1030 hPa
                    description: 'Weather conditions for your location',
                    feelsLike: Math.round(22 + Math.random() * 15),
                    forecast: [
                        { day: 'Today', high: Math.round(25 + Math.random() * 10), low: Math.round(15 + Math.random() * 8), condition: 'partly_cloudy', description: 'Partly cloudy' },
                        { day: 'Tomorrow', high: Math.round(26 + Math.random() * 8), low: Math.round(16 + Math.random() * 6), condition: 'sunny', description: 'Sunny' },
                        { day: 'Day 3', high: Math.round(24 + Math.random() * 9), low: Math.round(14 + Math.random() * 7), condition: 'cloudy', description: 'Cloudy' },
                        { day: 'Day 4', high: Math.round(23 + Math.random() * 8), low: Math.round(13 + Math.random() * 6), condition: 'rainy', description: 'Light rain' },
                        { day: 'Day 5', high: Math.round(27 + Math.random() * 7), low: Math.round(17 + Math.random() * 5), condition: 'sunny', description: 'Sunny' }
                    ]
                };
            }
        } else {
            console.log('⚠️ OpenWeatherMap API key not configured, using mock data');
            dataSource = 'mock';
            
            // Mock weather data based on coordinates
            weatherData = {
                coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
                city: 'Unknown Location',
                temperature: Math.round(20 + Math.random() * 15), // 20-35°C
                condition: ['sunny', 'partly_cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)],
                humidity: Math.round(50 + Math.random() * 40), // 50-90%
                windSpeed: Math.round(5 + Math.random() * 15), // 5-20 km/h
                pressure: Math.round(1000 + Math.random() * 30), // 1000-1030 hPa
                description: 'Weather conditions for your location',
                feelsLike: Math.round(22 + Math.random() * 15),
                forecast: [
                    { day: 'Today', high: Math.round(25 + Math.random() * 10), low: Math.round(15 + Math.random() * 8), condition: 'partly_cloudy', description: 'Partly cloudy' },
                    { day: 'Tomorrow', high: Math.round(26 + Math.random() * 8), low: Math.round(16 + Math.random() * 6), condition: 'sunny', description: 'Sunny' },
                    { day: 'Day 3', high: Math.round(24 + Math.random() * 9), low: Math.round(14 + Math.random() * 7), condition: 'cloudy', description: 'Cloudy' },
                    { day: 'Day 4', high: Math.round(23 + Math.random() * 8), low: Math.round(13 + Math.random() * 6), condition: 'rainy', description: 'Light rain' },
                    { day: 'Day 5', high: Math.round(27 + Math.random() * 7), low: Math.round(17 + Math.random() * 5), condition: 'sunny', description: 'Sunny' }
                ]
            };
        }

        // Add additional computed data 
        weatherData.timestamp = new Date().toISOString();
        weatherData.airQuality = getRandomAirQuality();
        weatherData.uvIndex = weatherData.uvIndex || getRandomUVIndex();
        weatherData.visibility = weatherData.visibility || Math.round(8 + Math.random() * 4) + ' km';

        // Cache the result
        weatherCache.set(cacheKey, {
            data: weatherData,
            timestamp: Date.now()
        });

        res.json({
            success: true,
            data: weatherData,
            cached: false,
            source: dataSource
        });

    } catch (error) {
        console.error('Weather Coordinates API Error:', error);
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