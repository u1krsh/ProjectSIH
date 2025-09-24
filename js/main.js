/* filepath: d:\SIH\ProjectSIH\js\main.js */
// Performance Optimization: Defer non-critical operations
document.addEventListener('DOMContentLoaded', function() {
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
            }, 0);
        });
    }
    
    // Intersection Observer for lazy loading animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.destination-card, .feature-card, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }
});

// Enhanced data for destinations with more details
const destinations = [
    {
        name: "Betla National Park",
        description: "Famous wildlife sanctuary and tiger reserve with rich biodiversity",
        image: "assets/images/betla.jpeg",
        features: ["Wildlife", "Tiger Reserve", "Adventure Safari"],
        category: "nature",
        rating: 4.6,
        visitors: "125k+ annually",
        coordinates: [23.8859, 84.1917]
    },
    {
        name: "Hundru Falls",
        description: "Spectacular 98-meter waterfall near Ranchi, perfect for photography",
        image: "assets/images/hundru.jpeg",
        features: ["Waterfall", "Trekking", "Photography"],
        category: "nature",
        rating: 4.4,
        visitors: "89k+ annually",
        coordinates: [23.4298, 85.5943]
    },
    {
        name: "Netarhat",
        description: "Queen of Chotanagpur plateau, famous for sunrise and sunset views",
        image: "assets/images/netarhat.jpeg",
        features: ["Hill Station", "Sunrise Point", "Cool Climate"],
        category: "nature",
        rating: 4.5,
        visitors: "95k+ annually",
        coordinates: [23.4676, 84.2631]
    },
    {
        name: "Deoghar",
        description: "Sacred pilgrimage city with the famous Baidyanath Temple",
        image: "assets/images/deoghar.jpg",
        features: ["Pilgrimage", "Ancient Temples", "Spiritual"],
        category: "pilgrimage",
        rating: 4.7,
        visitors: "2M+ annually",
        coordinates: [24.4842, 86.6947]
    },
    {
        name: "Hazaribagh Wildlife Sanctuary",
        description: "Rich biodiversity sanctuary with leopards and diverse wildlife",
        image: "assets/images/hazaribagh.jpg",
        features: ["Wildlife Sanctuary", "Leopards", "Nature Trails"],
        category: "nature",
        rating: 4.3,
        visitors: "67k+ annually",
        coordinates: [23.9929, 85.3647]
    },
    {
        name: "Ranchi",
        description: "Capital city with beautiful waterfalls, lakes and modern attractions",
        image: "assets/images/ranchi.jpeg",
        features: ["Urban Tourism", "Waterfalls", "Cultural Sites"],
        category: "cultural",
        rating: 4.2,
        visitors: "450k+ annually",
        coordinates: [23.3441, 85.3096]
    },
    {
        name: "Parasnath Hill",
        description: "Highest peak of Jharkhand, sacred Jain pilgrimage site",
        image: "assets/images/parasnath.jpg",
        features: ["Highest Peak", "Jain Temples", "Trekking"],
        category: "adventure",
        rating: 4.5,
        visitors: "78k+ annually",
        coordinates: [23.9648, 86.1636]
    },
    {
        name: "Dassam Falls",
        description: "Beautiful cascade waterfall surrounded by dense forests",
        image: "assets/images/dassam.jpg",
        features: ["Waterfall", "Forest", "Picnic Spot"],
        category: "nature",
        rating: 4.3,
        visitors: "112k+ annually",
        coordinates: [23.3775, 85.4453]
    }
];

const ecoTours = [
    {
        name: "Wildlife Safari Adventure",
        description: "Experience the rich wildlife of Jharkhand's national parks with expert naturalists",
        icon: "fas fa-binoculars",
        duration: "3-4 hours",
        price: "₹2,500",
        difficulty: "Easy",
        includes: ["Professional Guide", "Safari Vehicle", "Refreshments"]
    },
    {
        name: "Tribal Village Immersion",
        description: "Live with tribal communities and learn their sustainable lifestyle",
        icon: "fas fa-home",
        duration: "2-3 days",
        price: "₹8,000",
        difficulty: "Moderate",
        includes: ["Village Stay", "Cultural Activities", "Traditional Meals"]
    },
    {
        name: "Waterfall Trekking Expedition",
        description: "Trek through pristine forests to discover hidden waterfalls",
        icon: "fas fa-hiking",
        duration: "Full day",
        price: "₹3,500",
        difficulty: "Challenging",
        includes: ["Trekking Guide", "Safety Equipment", "Packed Lunch"]
    },
    {
        name: "Bird Watching Paradise",
        description: "Spot over 200 species of birds in their natural habitat",
        icon: "fas fa-dove",
        duration: "4-5 hours",
        price: "₹1,800",
        difficulty: "Easy",
        includes: ["Ornithologist Guide", "Binoculars", "Field Guide"]
    },
    {
        name: "Forest Camping Experience",
        description: "Overnight camping under the stars in pristine wilderness",
        icon: "fas fa-campground",
        duration: "2 days",
        price: "₹5,500",
        difficulty: "Moderate",
        includes: ["Camping Equipment", "Meals", "Bonfire Evening"]
    },
    {
        name: "Traditional Craft Workshop",
        description: "Learn ancient art forms from master craftsmen",
        icon: "fas fa-palette",
        duration: "Half day",
        price: "₹2,000",
        difficulty: "Easy",
        includes: ["Materials", "Master Artisan", "Take-home Craft"]
    }
];

const cultureData = {
    traditions: [
        {
            title: "Sohrai Festival",
            description: "Harvest festival celebrated with beautiful wall paintings and cattle worship",
            image: "assets/images/sohrai.jpg"
        },
        {
            title: "Karma Dance",
            description: "Traditional dance performed during Karma festival to worship nature",
            image: "assets/images/karma-dance.jpg"
        },
        {
            title: "Tribal Music Traditions",
            description: "Rich musical heritage with unique instruments like Madal, Dhol, and Flute",
            image: "assets/images/tribal-music.jpg"
        }
    ],
    festivals: [
        {
            title: "Tusu Parab",
            description: "Winter harvest festival celebrated with folk songs and dances",
            image: "assets/images/tusu.jpg"
        },
        {
            title: "Karam Festival",
            description: "Celebration of nature and fertility with the sacred Karam tree",
            image: "assets/images/karam.jpg"
        },
        {
            title: "Sarhul Festival",
            description: "Spring festival marking the blooming of Sal trees",
            image: "assets/images/sarhul.jpg"
        }
    ],
    crafts: [
        {
            title: "Dokra Art",
            description: "Ancient brass casting technique creating beautiful figurines",
            image: "assets/images/dokra.jpg"
        },
        {
            title: "Bamboo Crafts",
            description: "Intricate basketry and utility items from bamboo",
            image: "assets/images/bamboo-craft.jpg"
        },
        {
            title: "Tribal Paintings",
            description: "Colorful wall and canvas paintings depicting tribal life",
            image: "assets/images/tribal-art.jpg"
        }
    ],
    cuisine: [
        {
            title: "Dhuska",
            description: "Deep-fried rice and lentil fritters, a popular breakfast item",
            image: "assets/images/dhuska.jpg"
        },
        {
            title: "Pittha",
            description: "Steamed rice cake stuffed with jaggery and coconut",
            image: "assets/images/pittha.jpg"
        },
        {
            title: "Handia",
            description: "Traditional fermented rice beer with medicinal properties",
            image: "assets/images/handia.jpg"
        }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Remove loading screen after a short delay
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 2000); // Show loading for 2 seconds

    initializeApp();
    setupEventListeners();
    startCounterAnimations();
    
    // Initialize weather with a slight delay to ensure DOM is fully loaded
    setTimeout(() => {
        initializeWeather();
    }, 1000);
});

function initializeApp() {
    renderDestinations();
    renderEcoTours();
    renderCultureContent();

    const exploreMapBtn = document.getElementById('exploreMapBtn');
    if (exploreMapBtn) {
        exploreMapBtn.addEventListener('click', () => {
            document.getElementById('interactive-map').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navMenu?.classList.remove('active');
                hamburger?.classList.remove('active');
            }
        });
    });

    // Hero buttons
    const exploreMapBtn = document.querySelector('.btn-primary.btn-glow');
    const arExperienceBtn = document.querySelector('.btn-secondary.btn-glass');
    
    if (exploreMapBtn) {
        exploreMapBtn.addEventListener('click', function() {
            document.getElementById('interactive-map')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (arExperienceBtn) {
        arExperienceBtn.addEventListener('click', function() {
            document.getElementById('ar-guide')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Destination filters
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterDestinations(this.dataset.category);
        });
    });

    // Culture tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            showCultureTab(this.dataset.tab);
        });
    });

    // AI Trip form
    const aiTripForm = document.getElementById('aiTripForm');
    if (aiTripForm) {
        aiTripForm.addEventListener('submit', handleAITripSubmission);
    }

    // Scroll effects
    window.addEventListener('scroll', handleScroll);

    // Notification button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', showNotifications);
    }
}

function renderDestinations() {
    const destinationGrid = document.getElementById('destinationGrid');
    if (!destinationGrid) return;
    
    destinationGrid.innerHTML = '';

    destinations.forEach(destination => {
        const destinationCard = createEnhancedDestinationCard(destination);
        destinationGrid.appendChild(destinationCard);
    });
}

function createEnhancedDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.dataset.category = destination.category;
    
    card.innerHTML = `
        <div class="card-image-container">
            <img src="${destination.image}" alt="${destination.name}" onerror="this.src='https://via.placeholder.com/400x250?text=${destination.name}'">
            <div class="card-overlay">
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${destination.rating}</span>
                </div>
                <div class="visitors">
                    <i class="fas fa-users"></i>
                    <span>${destination.visitors}</span>
                </div>
            </div>
        </div>
        <div class="card-content">
            <h3>${destination.name}</h3>
            <p>${destination.description}</p>
            <div class="card-features">
                ${destination.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="card-actions">
                <button class="btn-primary btn-small" onclick="exploreDestination('${destination.name}')">
                    <i class="fas fa-map-marker-alt"></i> Explore
                </button>
                <button class="btn-secondary btn-small" onclick="addToWishlist('${destination.name}')">
                    <i class="fas fa-heart"></i> Save
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function renderEcoTours() {
    const ecoGrid = document.getElementById('ecoGrid');
    if (!ecoGrid) return;
    
    ecoGrid.innerHTML = '';

    ecoTours.forEach(tour => {
        const tourCard = createEnhancedEcoTourCard(tour);
        ecoGrid.appendChild(tourCard);
    });
}

function createEnhancedEcoTourCard(tour) {
    const card = document.createElement('div');
    card.className = 'eco-card enhanced';
    
    card.innerHTML = `
        <div class="eco-card-header">
            <i class="${tour.icon}"></i>
            <div class="difficulty-badge ${tour.difficulty.toLowerCase()}">${tour.difficulty}</div>
        </div>
        <h3>${tour.name}</h3>
        <p>${tour.description}</p>
        <div class="tour-details">
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>${tour.duration}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-tag"></i>
                <span>${tour.price}</span>
            </div>
        </div>
        <div class="tour-includes">
            <h4>Includes:</h4>
            <ul>
                ${tour.includes.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
            </ul>
        </div>
        <button class="btn-primary btn-eco" onclick="bookEcoTour('${tour.name}')">
            <i class="fas fa-calendar-plus"></i> Book Now
        </button>
    `;
    
    return card;
}

function renderCultureContent() {
    const cultureContent = document.getElementById('cultureContent');
    if (!cultureContent) return;
    
    // Show traditions by default
    showCultureTab('traditions');
}

function showCultureTab(tabName) {
    const cultureContent = document.getElementById('cultureContent');
    if (!cultureContent || !cultureData[tabName]) return;
    
    const items = cultureData[tabName];
    
    cultureContent.innerHTML = `
        <div class="culture-grid">
            ${items.map(item => `
                <div class="culture-card">
                    <div class="culture-image">
                        <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x200?text=${item.title}'">
                    </div>
                    <div class="culture-info">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <button class="btn-secondary btn-small" onclick="learnMore('${item.title}')">
                            Learn More
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function filterDestinations(category) {
    const cards = document.querySelectorAll('.destination-card');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

function startCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60 FPS
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current);
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback);
    counters.forEach(counter => observer.observe(counter));
}

function handleAITripSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const budget = formData.get('budget');
    const travelStyle = formData.get('travelStyle');
    const interests = Array.from(document.querySelectorAll('.preference-card input:checked'))
                           .map(cb => cb.value);
    
    if (!budget || !travelStyle) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    generateAIItinerary(budget, travelStyle, interests);
}

function generateAIItinerary(budget, travelStyle, interests) {
    const aiSuggestions = document.getElementById('aiSuggestions');
    if (!aiSuggestions) return;
    
    // Show loading state
    aiSuggestions.innerHTML = `
        <div class="ai-loading">
            <div class="ai-spinner"></div>
            <h3>AI is crafting your perfect itinerary...</h3>
            <p>Analyzing your preferences and matching with best destinations</p>
        </div>
    `;
    
    // Simulate AI processing time
    setTimeout(() => {
        const itinerary = createPersonalizedItinerary(budget, travelStyle, interests);
        displayAIItinerary(itinerary);
    }, 3000);
}

function createPersonalizedItinerary(budget, travelStyle, interests) {
    // AI logic to create personalized itinerary
    const budgetRanges = {
        budget: { min: 5000, max: 15000 },
        mid: { min: 15000, max: 40000 },
        luxury: { min: 40000, max: 100000 }
    };
    
    const selectedDestinations = destinations.filter(dest => {
        return interests.length === 0 || interests.some(interest => 
            dest.category === interest || 
            dest.features.some(feature => feature.toLowerCase().includes(interest))
        );
    }).slice(0, travelStyle === 'solo' ? 2 : 3);
    
    return {
        budget: budgetRanges[budget],
        style: travelStyle,
        destinations: selectedDestinations,
        duration: interests.includes('adventure') ? '5-7 days' : '3-5 days',
        estimatedCost: calculateEstimatedCost(budget, selectedDestinations.length),
        recommendations: generateRecommendations(interests, travelStyle)
    };
}

function displayAIItinerary(itinerary) {
    const aiSuggestions = document.getElementById('aiSuggestions');
    if (!aiSuggestions) return;
    
    aiSuggestions.innerHTML = `
        <div class="ai-result">
            <div class="ai-header">
                <i class="fas fa-magic"></i>
                <h3>Your Personalized Jharkhand Adventure</h3>
            </div>
            <div class="itinerary-overview">
                <div class="overview-item">
                    <i class="fas fa-calendar"></i>
                    <span>${itinerary.duration}</span>
                </div>
                <div class="overview-item">
                    <i class="fas fa-rupee-sign"></i>
                    <span>${itinerary.estimatedCost}</span>
                </div>
                <div class="overview-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${itinerary.destinations.length} Destinations</span>
                </div>
            </div>
            <div class="suggested-destinations">
                <h4>Recommended Destinations:</h4>
                <div class="mini-destination-grid">
                    ${itinerary.destinations.map(dest => `
                        <div class="mini-destination-card">
                            <img src="${dest.image}" alt="${dest.name}" onerror="this.src='https://via.placeholder.com/150x100?text=${dest.name}'">
                            <div class="mini-card-content">
                                <h5>${dest.name}</h5>
                                <div class="mini-features">
                                    ${dest.features.slice(0, 2).map(f => `<span>${f}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="ai-recommendations">
                <h4>AI Recommendations:</h4>
                <ul>
                    ${itinerary.recommendations.map(rec => `<li><i class="fas fa-lightbulb"></i> ${rec}</li>`).join('')}
                </ul>
            </div>
            <div class="itinerary-actions">
                <button class="btn-primary" onclick="downloadItinerary()">
                    <i class="fas fa-download"></i> Download Itinerary
                </button>
                <button class="btn-secondary" onclick="customizeItinerary()">
                    <i class="fas fa-edit"></i> Customize
                </button>
                <button class="btn-secondary" onclick="shareItinerary()">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `;
}

function calculateEstimatedCost(budget, destinationCount) {
    const baseCosts = {
        budget: 8000,
        mid: 25000,
        luxury: 60000
    };
    
    const cost = baseCosts[budget] + (destinationCount - 1) * (baseCosts[budget] * 0.3);
    return `₹${Math.round(cost).toLocaleString()}`;
}

function generateRecommendations(interests, travelStyle) {
    const recommendations = [];
    
    if (interests.includes('wildlife')) {
        recommendations.push('Visit Betla National Park early morning for best wildlife sightings');
    }
    if (interests.includes('culture')) {
        recommendations.push('Participate in local festivals for authentic cultural experience');
    }
    if (interests.includes('adventure')) {
        recommendations.push('Try paragliding at Netarhat for breathtaking aerial views');
    }
    if (travelStyle === 'family') {
        recommendations.push('Book family-friendly accommodations with recreational facilities');
    }
    if (travelStyle === 'couple') {
        recommendations.push('Plan romantic sunset visits to Hundru Falls');
    }
    
    recommendations.push('Carry eco-friendly water bottles and respect local customs');
    recommendations.push('Book accommodations in advance during festival seasons');
    
    return recommendations;
}

function handleScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Advanced Weather System
let currentWeatherData = null;
let userLocation = { lat: 23.3441, lng: 85.3096, city: 'Ranchi' }; // Default to Ranchi

function initializeWeather() {
    console.log("Weather: Initializing.");
    const weatherWidget = document.getElementById('weatherWidget');
    if (weatherWidget) {
        setupWeatherEvents();
        getUserLocationAndFetchWeather();
        
        // Set up automatic weather refresh every 10 minutes
        setInterval(() => {
            console.log("Weather: Auto-refreshing weather data");
            if (userLocation.city) {
                fetchWeatherData(userLocation.city);
            } else if (userLocation.lat && userLocation.lng) {
                fetchWeatherByCoordinates(userLocation.lat, userLocation.lng);
            }
        }, 600000); // 10 minutes
    } else {
        console.error("Weather: Widget element not found, retrying in 2 seconds");
        setTimeout(initializeWeather, 2000);
    }
}

function setupWeatherEvents() {
    console.log("Weather: Setting up events.");
    const weatherWidget = document.getElementById('weatherWidget');
    const weatherModal = document.getElementById('weatherModal');
    const closeBtn = document.querySelector('.close-weather-modal');
    const expandBtn = weatherWidget ? weatherWidget.querySelector('.weather-expand') : null;

    const handleWidgetClick = () => {
        console.log("Weather: Widget clicked.");
        console.log("Weather: Current data is:", currentWeatherData);
        if (currentWeatherData) {
            openWeatherDashboard();
        } else {
            console.warn("Weather data not available, cannot open dashboard.");
        }
    };

    if (weatherWidget) {
        console.log("Weather: Found widget, attaching click listener.");
        // Handle clicks on the main widget body and the expand icon
        weatherWidget.addEventListener('click', handleWidgetClick);
    }
    
    if (expandBtn) {
        // Prevent the main widget click from firing twice if the icon is clicked
        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            handleWidgetClick();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeWeatherDashboard);
    }

    if (weatherModal) {
        weatherModal.addEventListener('click', (e) => {
            if (e.target === weatherModal) {
                closeWeatherDashboard();
            }
        });
    }

    window.addEventListener('scroll', () => {
        const widget = document.getElementById('weatherWidget');
        if (widget) {
            widget.classList.toggle('hidden', window.scrollY > 100);
        }
    }, { passive: true });

    // Auto-refresh weather every 10 minutes
    setInterval(() => {
        if (userLocation.city) {
            fetchWeatherData(userLocation.city);
        } else if (userLocation.lat && userLocation.lng) {
            fetchWeatherByCoordinates(userLocation.lat, userLocation.lng);
        }
    }, 600000); // 10 minutes
}

function getUserLocationAndFetchWeather() {
    console.log("Weather: Fetching weather for Ranchi (default location).");
    
    // Show loading immediately
    showWeatherLoading(true);
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Weather: Geolocation success.", position.coords);
                userLocation.lat = position.coords.latitude;
                userLocation.lng = position.coords.longitude;
                fetchWeatherByCoordinates(userLocation.lat, userLocation.lng);
            },
            (error) => {
                console.error('Weather: Geolocation error:', error.message, "Falling back to default city.");
                showWeatherError('Location access denied. Showing weather for Ranchi.');
                fetchWeatherData('ranchi');
            },
            { timeout: 5000, enableHighAccuracy: false }
        );
    } else {
        console.error('Weather: Geolocation not supported. Falling back to default city.');
        showWeatherError('Geolocation not supported. Showing weather for Ranchi.');
    }
    // Always fetch Ranchi weather instead of trying to get user location
    // fetchWeatherData('ranchi');
}

async function fetchWeatherData(city) {
    try {
        console.log(`Weather: Fetching data for city: ${city}`);
        showWeatherLoading(true);
        const response = await fetch(`http://localhost:5000/api/weather/${city}`);
        console.log(`Weather: Response status for ${city}: ${response.status}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
            handleSuccessfulWeatherFetch(result);
        } else {
            throw new Error(result.message || 'Failed to fetch weather data');
        }
    } catch (error) {
        handleFailedWeatherFetch(error, city);
    } finally {
        showWeatherLoading(false);
    }
}

async function fetchWeatherByCoordinates(lat, lng) {
    try {
        console.log(`Weather: Fetching data for coords: ${lat}, ${lng}`);
        showWeatherLoading(true);
        const response = await fetch(`http://localhost:5000/api/weather/coords/${lat}/${lng}`);
        console.log(`Weather: Response status for coords: ${response.status}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
            handleSuccessfulWeatherFetch(result);
        } else {
            throw new Error(result.message || 'Failed to fetch weather data');
        }
    } catch (error) {
        handleFailedWeatherFetch(error, 'ranchi');
    } finally {
        showWeatherLoading(false);
    }
}

function handleSuccessfulWeatherFetch(result) {
    console.log("Weather: Fetch successful. Received data:", result.data);
    currentWeatherData = result.data;
    updateWeatherWidget(currentWeatherData);
    userLocation.city = currentWeatherData.city;
    console.log(`🌤️ Weather data loaded for ${currentWeatherData.city} from ${result.source || 'unknown'} source (Cached: ${!!result.cached})`);
}

function handleFailedWeatherFetch(error, fallbackCity) {
    console.error('Weather: Fetch failed.', error);
    showWeatherError('Unable to fetch live weather. Showing sample data.');
    currentWeatherData = getMockWeatherData(fallbackCity);
    updateWeatherWidget(currentWeatherData);
    userLocation.city = currentWeatherData.city;
}

function getMockWeatherData(city = 'Ranchi') {
    const mockData = {
        ranchi: {
            city: 'Ranchi (Mock)',
            temperature: 25,
            condition: 'partly_cloudy',
            description: 'Partly cloudy',
            humidity: 65,
            windSpeed: 8,
            feelsLike: 27,
            pressure: 1013,
            forecast: [
                { day: 'Today', high: 28, low: 18, condition: 'partly_cloudy' },
                { day: 'Tomorrow', high: 30, low: 19, condition: 'sunny' },
            ]
        }
    };
    return mockData[city.toLowerCase()] || mockData.ranchi;
}

function updateWeatherWidget(data) {
    const weatherWidget = document.getElementById('weatherWidget');
    if (!weatherWidget || !data) {
        console.error("Weather widget element not found or no data provided.");
        return;
    }

    const icons = {
        sunny: 'fas fa-sun',
        partly_cloudy: 'fas fa-cloud-sun',
        cloudy: 'fas fa-cloud',
        rainy: 'fas fa-cloud-showers-heavy',
        stormy: 'fas fa-bolt',
        snowy: 'fas fa-snowflake',
        foggy: 'fas fa-smog',
        hazy: 'fas fa-smog'
    };

    const mainCondition = data.condition.toLowerCase();

    weatherWidget.querySelector('.weather-icon i').className = icons[mainCondition] || 'fas fa-cloud-sun';
    weatherWidget.querySelector('.temperature').textContent = `${Math.round(data.temperature)}°C`;
    weatherWidget.querySelector('.condition').textContent = data.description;
    weatherWidget.querySelector('.location').textContent = data.city;
    weatherWidget.querySelector('.humidity').textContent = `${data.humidity}%`;
    weatherWidget.querySelector('.wind').textContent = `${data.windSpeed} km/h`;

    updateWeatherStyling(mainCondition);
}

function updateWeatherStyling(condition) {
    const weatherWidget = document.getElementById('weatherWidget');
    if (!weatherWidget) return;
    weatherWidget.classList.remove('weather-sunny', 'weather-cloudy', 'weather-rainy', 'weather-stormy');
    weatherWidget.classList.add(`weather-${condition}`);
}

function showWeatherLoading(show) {
    const weatherWidget = document.getElementById('weatherWidget');
    if (weatherWidget) {
        weatherWidget.classList.toggle('loading', show);
    }
}

function showWeatherError(message) {
    console.warn('Weather Error:', message);
    const weatherWidget = document.getElementById('weatherWidget');
    if (weatherWidget) {
        weatherWidget.title = message;
        weatherWidget.style.opacity = '0.7';
        setTimeout(() => {
            weatherWidget.title = 'Current Weather';
            weatherWidget.style.opacity = '1';
        }, 3000);
    }
}

function openWeatherDashboard() {
    const weatherModal = document.getElementById('weatherModal');
    if (weatherModal && currentWeatherData) {
        updateWeatherDashboard(currentWeatherData);
        weatherModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            weatherModal.classList.add('weather-modal-open');
        }, 10);
    }
}

function closeWeatherDashboard() {
    const weatherModal = document.getElementById('weatherModal');
    if (weatherModal) {
        weatherModal.classList.remove('weather-modal-open');
        document.body.style.overflow = '';
        setTimeout(() => {
            weatherModal.style.display = 'none';
        }, 300);
    }
}

function updateWeatherDashboard(data) {
    updateCurrentWeatherSection(data);
    updateForecastSection(data.forecast || []);
    // The functions below are placeholders as the HTML for them does not exist in the provided context
    // updateTravelAdviceSection(data);
    // fetchAndUpdateAlerts(data.city);
}

function updateCurrentWeatherSection(data) {
    const modal = document.getElementById('weatherModal');
    if (!modal) return;

    const icons = {
        sunny: 'fas fa-sun',
        partly_cloudy: 'fas fa-cloud-sun',
        cloudy: 'fas fa-cloud',
        rainy: 'fas fa-cloud-showers-heavy',
        stormy: 'fas fa-bolt',
        snowy: 'fas fa-snowflake',
        foggy: 'fas fa-smog',
        hazy: 'fas fa-smog'
    };

    const mainCondition = data.condition.toLowerCase();

    // Main display
    const currentIcon = modal.querySelector('.current-icon i');
    if (currentIcon) currentIcon.className = icons[mainCondition] || 'fas fa-cloud-sun';
    
    const currentLocation = modal.querySelector('.current-location');
    if (currentLocation) currentLocation.textContent = `${data.city}, Jharkhand`;

    const currentTemp = modal.querySelector('.current-temp');
    if (currentTemp) currentTemp.textContent = `${Math.round(data.temperature)}°C`;

    const currentCondition = modal.querySelector('.current-condition');
    if (currentCondition) currentCondition.textContent = data.description;

    const feelsLike = modal.querySelector('.feels-like');
    if (feelsLike) feelsLike.textContent = `Feels like ${Math.round(data.feelsLike)}°C`;

    // Details grid
    updateDetailValue('Humidity', `${data.humidity}%`);
    updateDetailValue('Wind Speed', `${data.windSpeed} km/h`);
    updateDetailValue('Pressure', `${data.pressure} hPa`);
    updateDetailValue('Visibility', `${data.visibility || 'N/A'} km`);
}

function updateDetailValue(label, value) {
    const detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach(item => {
        const labelElement = item.querySelector('.detail-label');
        if (labelElement && labelElement.textContent === label) {
            const valueElement = item.querySelector('.detail-value');
            if (valueElement) {
                valueElement.textContent = value;
            }
        }
    });
}

function updateForecastSection(forecast) {
    const forecastContainer = document.querySelector('.forecast-container');
    if (!forecastContainer || !forecast.length) return;

    const icons = {
        sunny: 'fas fa-sun',
        partly_cloudy: 'fas fa-cloud-sun',
        cloudy: 'fas fa-cloud',
        rainy: 'fas fa-cloud-showers-heavy',
        stormy: 'fas fa-bolt',
        snowy: 'fas fa-snowflake',
        foggy: 'fas fa-smog'
    };

    forecastContainer.innerHTML = forecast.map((day, index) => `
        <div class="forecast-item">
            <div class="forecast-day">${day.day}</div>
            <div class="forecast-icon">
                <i class="${icons[day.condition] || icons.partly_cloudy}"></i>
            </div>
            <div class="forecast-temps">
                <span class="high">${day.high}°</span>
                <span class="low">${day.low}°</span>
            </div>
        </div>
    `).join('');
}


function setupThemeToggle() {
    // Dark mode is now default - no theme toggle needed
    // Ensure dark theme is always set
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
}

function setupLanguageSelector() {
    const languageSelect = document.getElementById('languageSelect');
    if (!languageSelect) return;
    
    languageSelect.addEventListener('change', function() {
        const selectedLang = this.value;
        // In a real app, this would trigger translation
        showNotification(`Language changed to ${this.options[this.selectedIndex].text}`, 'success');
    });
}

function showNotifications() {
    const notifications = [
        { type: 'info', message: 'New eco-tour package available in Betla National Park', time: '2 hours ago' },
        { type: 'success', message: 'Your trip to Hundru Falls was rated 5 stars!', time: '1 day ago' },
        { type: 'warning', message: 'Weather alert: Light rain expected in Ranchi', time: '3 hours ago' }
    ];
    
    // Create notification panel (simplified)
    alert('Notifications:\n' + notifications.map(n => `• ${n.message}`).join('\n'));
}

function showNotification(message, type = 'info') {
    // Create a simple notification system
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#5352ed'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Utility functions
function exploreDestination(destinationName) {
    showNotification(`Opening detailed view for ${destinationName}`, 'info');
    // In a real app, this would open a detailed destination page
}

function addToWishlist(destinationName) {
    showNotification(`${destinationName} added to your wishlist!`, 'success');
    // In a real app, this would save to user's wishlist
}

function bookEcoTour(tourName) {
    showNotification(`Redirecting to booking for ${tourName}...`, 'info');
    // In a real app, this would open booking form
}

function learnMore(cultureName) {
    showNotification(`Loading more information about ${cultureName}...`, 'info');
    // In a real app, this would show detailed cultural information
}

function downloadItinerary() {
    showNotification('Preparing your itinerary for download...', 'info');
    // In a real app, this would generate and download PDF
}

function customizeItinerary() {
    showNotification('Opening itinerary customization...', 'info');
    // In a real app, this would open customization interface
}

function shareItinerary() {
    if (navigator.share) {
        navigator.share({
            title: 'My Jharkhand Adventure Itinerary',
            text: 'Check out my AI-generated travel plan for Jharkhand!',
            url: window.location.href
        });
    } else {
        showNotification('Itinerary link copied to clipboard!', 'success');
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .btn-small {
        padding: 8px 16px;
        font-size: 0.9rem;
    }
    
    .card-image-container {
        position: relative;
        overflow: hidden;
    }
    
    .card-overlay {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .rating, .visitors {
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .card-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }
    
    .ai-loading {
        text-align: center;
        padding: 3rem;
    }
    
    .ai-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #2c5530;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 2rem;
    }
    
    .mini-destination-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .mini-destination-card {
        display: flex;
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }
    
    .mini-destination-card img {
        width: 80px;
        height: 60px;
        object-fit: cover;
    }
    
    .mini-card-content {
        padding: 10px;
        flex: 1;
    }
    
    .mini-card-content h5 {
        margin: 0 0 5px 0;
        font-size: 0.9rem;
    }
    
    .mini-features {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
    }
    
    .mini-features span {
        background: #e8f5e8;
        color: #2c5530;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.7rem;
    }
`;
document.head.appendChild(style);

// Culture tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // Animated counters for hero stats
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    };
    
    // Trigger counter animation when hero section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        observer.observe(heroSection);
    }
    
    // Filter functionality for destinations
    const filterButtons = document.querySelectorAll('.filter-tag');
    const destinationCards = document.querySelectorAll('.destination-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            destinationCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Add smooth scrolling to navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .destination-card {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .testimonial-card,
    .eco-card,
    .culture-card {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .testimonial-card:nth-child(1) { animation-delay: 0.1s; }
    .testimonial-card:nth-child(2) { animation-delay: 0.2s; }
    .testimonial-card:nth-child(3) { animation-delay: 0.3s; }
    
    .eco-card:nth-child(1) { animation-delay: 0.1s; }
    .eco-card:nth-child(2) { animation-delay: 0.2s; }
    .eco-card:nth-child(3) { animation-delay: 0.3s; }
`;
document.head.appendChild(animationStyles);

// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        
        console.log('ThemeManager initialized');
        console.log('Toggle button found:', !!this.themeToggle);
        console.log('Theme icon found:', !!this.themeIcon);
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Theme toggle clicked');
                this.toggleTheme();
            });
            console.log('Event listener added to theme toggle');
        } else {
            console.error('Theme toggle button not found!');
        }
        
        // Update theme based on system preference if no saved preference
        if (!localStorage.getItem('theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        console.log('Toggling theme from', this.currentTheme, 'to', newTheme);
        this.setTheme(newTheme);
        
        // Add rotation animation
        if (this.themeToggle) {
            this.themeToggle.classList.add('rotating');
            setTimeout(() => {
                this.themeToggle.classList.remove('rotating');
            }, 500);
        }
    }
    
    setTheme(theme) {
        console.log('Setting theme to:', theme);
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update icon
        if (this.themeIcon) {
            if (theme === 'dark') {
                this.themeIcon.className = 'fas fa-moon';
            } else {
                this.themeIcon.className = 'fas fa-sun';
            }
            console.log('Icon updated for', theme, 'theme');
        }
        
        // Update toggle button aria-label
        if (this.themeToggle) {
            this.themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
        
        console.log('Theme set successfully');
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ThemeManager');
    const themeManager = new ThemeManager();
    initializeCultureTabs();
    
    // Additional fallback for theme toggle
    const fallbackToggle = document.getElementById('themeToggle');
    if (fallbackToggle && !fallbackToggle.hasAttribute('data-initialized')) {
        fallbackToggle.setAttribute('data-initialized', 'true');
        fallbackToggle.addEventListener('click', () => {
            console.log('Fallback theme toggle clicked');
            themeManager.toggleTheme();
        });
    }
});

// Culture tabs functionality
function initializeCultureTabs() {
    const tabButtons = document.querySelectorAll('.culture-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.culture-content .tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    setTimeout(() => {
        openModal(targetModalId);
    }, 100);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Handle form submissions
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add login logic here
            showNotification('Login functionality coming soon!', 'info');
            closeModal('loginModal');
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add registration logic here
            showNotification('Registration functionality coming soon!', 'info');
            closeModal('registerModal');
        });
    }
});