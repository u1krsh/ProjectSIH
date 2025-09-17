// Homestays Page JavaScript

// Sample homestay data
const homestaysData = [
    {
        id: 1,
        title: "Traditional Santhal Family Home",
        description: "Experience authentic Santhal culture with traditional dance, music, and local cuisine. Our family has been welcoming guests for over 10 years.",
        location: "Dumka, Jharkhand",
        price: 1500,
        rating: 4.8,
        reviews: 127,
        images: [
            "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
        ],
        amenities: ["wifi", "meals", "activities", "guide"],
        roomType: "private",
        host: "Ramdas Soren",
        maxGuests: 6,
        category: "Cultural Experience"
    },
    {
        id: 2,
        title: "Munda Village Cottage",
        description: "Stay in a traditional mud house and learn about Munda farming practices, pottery making, and forest conservation techniques.",
        location: "Ranchi, Jharkhand",
        price: 1200,
        rating: 4.6,
        reviews: 89,
        images: [
            "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop"
        ],
        amenities: ["meals", "activities", "guide"],
        roomType: "shared",
        host: "Sunita Munda",
        maxGuests: 4,
        category: "Farm Stay"
    },
    {
        id: 3,
        title: "Ho Tribe Heritage Home",
        description: "Discover Ho tribal traditions including archery, traditional games, and local craft making in this beautiful forest setting.",
        location: "Chaibasa, Jharkhand",
        price: 1800,
        rating: 4.9,
        reviews: 156,
        images: [
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
        ],
        amenities: ["wifi", "meals", "activities", "guide"],
        roomType: "entire",
        host: "Budhan Ho",
        maxGuests: 8,
        category: "Heritage Experience"
    },
    {
        id: 4,
        title: "Oraon Forest Lodge",
        description: "Eco-friendly stay with the Oraon community. Learn about medicinal plants, sustainable living, and enjoy nature walks.",
        location: "Gumla, Jharkhand",
        price: 1600,
        rating: 4.7,
        reviews: 203,
        images: [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop"
        ],
        amenities: ["meals", "activities", "guide"],
        roomType: "private",
        host: "Karma Oraon",
        maxGuests: 5,
        category: "Eco Stay"
    },
    {
        id: 5,
        title: "Kharia Mountain Retreat",
        description: "High-altitude homestay with stunning mountain views. Experience Kharia hunting traditions, folk tales, and mountain cuisine.",
        location: "Lohardaga, Jharkhand",
        price: 2000,
        rating: 4.5,
        reviews: 67,
        images: [
            "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop"
        ],
        amenities: ["wifi", "meals", "activities"],
        roomType: "private",
        host: "Mangal Kharia",
        maxGuests: 4,
        category: "Mountain Stay"
    },
    {
        id: 6,
        title: "Binjhia Artisan Home",
        description: "Learn traditional basket weaving, bamboo crafts, and forest product processing with skilled Binjhia artisans.",
        location: "Deoghar, Jharkhand",
        price: 1300,
        rating: 4.4,
        reviews: 92,
        images: [
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
        ],
        amenities: ["meals", "activities", "guide"],
        roomType: "shared",
        host: "Phoolmani Binjhia",
        maxGuests: 6,
        category: "Craft Experience"
    }
];

// Guest counter state
let guestCounts = {
    adults: 2,
    children: 0,
    infants: 0
};

// Current filters
let currentFilters = {
    location: '',
    checkin: '',
    checkout: '',
    guests: 2,
    price: '',
    roomType: '',
    amenities: [],
    rating: ''
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeDatePickers();
    initializeGuestSelector();
    initializeFilters();
    renderHomestays(homestaysData);
    setupViewToggle();
});

// Initialize date pickers
function initializeDatePickers() {
    const checkinDate = flatpickr("#checkinDate", {
        minDate: "today",
        dateFormat: "M d, Y",
        onChange: function(selectedDates, dateStr) {
            currentFilters.checkin = dateStr;
            // Update checkout minimum date
            if (checkoutPicker) {
                checkoutPicker.set('minDate', selectedDates[0] || "today");
            }
        }
    });

    const checkoutPicker = flatpickr("#checkoutDate", {
        minDate: "today",
        dateFormat: "M d, Y",
        onChange: function(selectedDates, dateStr) {
            currentFilters.checkout = dateStr;
        }
    });
}

// Initialize guest selector
function initializeGuestSelector() {
    const guestsInput = document.getElementById('guestsInput');
    const guestModal = document.getElementById('guestModal');
    
    // Position guest modal relative to guests field
    const guestsField = guestsInput.closest('.search-field');
    guestsField.style.position = 'relative';
    guestsField.appendChild(guestModal);
    
    guestsInput.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleGuestModal();
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (!guestModal.contains(e.target) && !guestsInput.contains(e.target)) {
            closeGuestModal();
        }
    });
    
    updateGuestInput();
}

// Toggle guest modal
function toggleGuestModal() {
    const guestModal = document.getElementById('guestModal');
    const isVisible = guestModal.style.display === 'block';
    guestModal.style.display = isVisible ? 'none' : 'block';
}

// Close guest modal
function closeGuestModal() {
    document.getElementById('guestModal').style.display = 'none';
}

// Change guest count
function changeGuestCount(type, delta) {
    const newCount = guestCounts[type] + delta;
    
    // Validation
    if (type === 'adults' && newCount < 1) return;
    if (newCount < 0) return;
    if (type !== 'adults' && newCount > 10) return;
    if (type === 'adults' && newCount > 16) return;
    
    guestCounts[type] = newCount;
    document.getElementById(type + 'Count').textContent = newCount;
    
    // Update button states
    const minusBtn = event.target.previousElementSibling || event.target.parentElement.querySelector('button');
    const plusBtn = event.target.nextElementSibling || event.target.parentElement.querySelector('button:last-child');
    
    if (minusBtn) {
        minusBtn.disabled = (type === 'adults' && newCount <= 1) || (type !== 'adults' && newCount <= 0);
    }
    
    updateGuestInput();
    currentFilters.guests = guestCounts.adults + guestCounts.children;
}

// Update guest input display
function updateGuestInput() {
    const total = guestCounts.adults + guestCounts.children;
    const infantText = guestCounts.infants > 0 ? `, ${guestCounts.infants} infant${guestCounts.infants > 1 ? 's' : ''}` : '';
    document.getElementById('guestsInput').value = `${total} guest${total > 1 ? 's' : ''}${infantText}`;
}

// Initialize filters
function initializeFilters() {
    // Location filter
    document.getElementById('locationInput').addEventListener('input', function() {
        currentFilters.location = this.value;
    });
    
    // Price filter
    document.getElementById('priceFilter').addEventListener('change', function() {
        currentFilters.price = this.value;
        applyFilters();
    });
    
    // Room type filter
    document.getElementById('roomTypeFilter').addEventListener('change', function() {
        currentFilters.roomType = this.value;
        applyFilters();
    });
    
    // Rating filter
    document.getElementById('ratingFilter').addEventListener('change', function() {
        currentFilters.rating = this.value;
        applyFilters();
    });
    
    // Amenity filters
    document.querySelectorAll('.amenity-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                currentFilters.amenities.push(this.value);
            } else {
                currentFilters.amenities = currentFilters.amenities.filter(a => a !== this.value);
            }
            applyFilters();
        });
    });
}

// Search homestays
function searchHomestays() {
    currentFilters.location = document.getElementById('locationInput').value;
    applyFilters();
}

// Apply filters
function applyFilters() {
    let filteredData = homestaysData.filter(homestay => {
        // Location filter
        if (currentFilters.location && !homestay.location.toLowerCase().includes(currentFilters.location.toLowerCase()) && !homestay.title.toLowerCase().includes(currentFilters.location.toLowerCase())) {
            return false;
        }
        
        // Price filter
        if (currentFilters.price) {
            const [min, max] = currentFilters.price.split('-').map(p => parseInt(p.replace('+', '')));
            if (max) {
                if (homestay.price < min || homestay.price > max) return false;
            } else {
                if (homestay.price < min) return false;
            }
        }
        
        // Room type filter
        if (currentFilters.roomType && homestay.roomType !== currentFilters.roomType) {
            return false;
        }
        
        // Rating filter
        if (currentFilters.rating && homestay.rating < parseFloat(currentFilters.rating)) {
            return false;
        }
        
        // Amenities filter
        if (currentFilters.amenities.length > 0) {
            const hasAllAmenities = currentFilters.amenities.every(amenity => 
                homestay.amenities.includes(amenity)
            );
            if (!hasAllAmenities) return false;
        }
        
        // Guest capacity
        if (currentFilters.guests > homestay.maxGuests) {
            return false;
        }
        
        return true;
    });
    
    renderHomestays(filteredData);
}

// Clear filters
function clearFilters() {
    // Reset form inputs
    document.getElementById('locationInput').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('roomTypeFilter').value = '';
    document.getElementById('ratingFilter').value = '';
    
    // Reset amenity checkboxes
    document.querySelectorAll('.amenity-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset filters object
    currentFilters = {
        location: '',
        checkin: '',
        checkout: '',
        guests: 2,
        price: '',
        roomType: '',
        amenities: [],
        rating: ''
    };
    
    // Re-render all homestays
    renderHomestays(homestaysData);
}

// Render homestays
function renderHomestays(data) {
    const grid = document.getElementById('homestaysGrid');
    
    if (data.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No homestays found</h3>
                <p>Try adjusting your search criteria or filters</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = data.map(homestay => `
        <div class="homestay-card" onclick="viewHomestay(${homestay.id})">
            <div class="card-image">
                <img src="${homestay.images[0]}" alt="${homestay.title}" loading="lazy">
                <button class="favorite-btn" onclick="event.stopPropagation(); toggleFavorite(${homestay.id})">
                    <i class="far fa-heart"></i>
                </button>
                <div class="card-badge">${homestay.category}</div>
            </div>
            <div class="card-content">
                <div class="card-header">
                    <div class="card-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${homestay.location}
                    </div>
                    <div class="card-rating">
                        <i class="fas fa-star"></i>
                        ${homestay.rating} (${homestay.reviews})
                    </div>
                </div>
                <h3 class="card-title">${homestay.title}</h3>
                <p class="card-description">${homestay.description}</p>
                <div class="card-amenities">
                    ${homestay.amenities.map(amenity => {
                        const icons = {
                            wifi: 'fa-wifi',
                            meals: 'fa-utensils',
                            activities: 'fa-hiking',
                            guide: 'fa-user-tie'
                        };
                        const labels = {
                            wifi: 'Wi-Fi',
                            meals: 'Meals',
                            activities: 'Activities',
                            guide: 'Guide'
                        };
                        return `<div class="amenity"><i class="fas ${icons[amenity]}"></i> ${labels[amenity]}</div>`;
                    }).join('')}
                </div>
                <div class="card-footer">
                    <div class="card-price">
                        ₹${homestay.price.toLocaleString('en-IN')} <span>/ night</span>
                    </div>
                    <button class="book-btn" onclick="event.stopPropagation(); openBookingModal(${homestay.id})">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update results count
    document.querySelector('.results-header h2').textContent = 
        `${data.length} homestay${data.length !== 1 ? 's' : ''} in Jharkhand`;
}

// Setup view toggle
function setupViewToggle() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            const grid = document.getElementById('homestaysGrid');
            
            if (view === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });
}

// Toggle favorite
function toggleFavorite(homestayId) {
    const favoriteBtn = event.target.closest('.favorite-btn');
    const icon = favoriteBtn.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.replace('far', 'fas');
        favoriteBtn.classList.add('active');
        // Save to localStorage or send to backend
        console.log(`Added homestay ${homestayId} to favorites`);
    } else {
        icon.classList.replace('fas', 'far');
        favoriteBtn.classList.remove('active');
        console.log(`Removed homestay ${homestayId} from favorites`);
    }
}

// View homestay details
function viewHomestay(homestayId) {
    const homestay = homestaysData.find(h => h.id === homestayId);
    if (!homestay) return;
    
    // For now, just open booking modal
    openBookingModal(homestayId);
}

// Open booking modal
function openBookingModal(homestayId) {
    const homestay = homestaysData.find(h => h.id === homestayId);
    if (!homestay) return;
    
    const modal = document.getElementById('bookingModal');
    const bookingDetails = document.getElementById('bookingDetails');
    
    const checkinDate = currentFilters.checkin || 'Select dates';
    const checkoutDate = currentFilters.checkout || 'Select dates';
    const guests = currentFilters.guests || 2;
    
    bookingDetails.innerHTML = `
        <div class="booking-homestay">
            <div class="booking-image">
                <img src="${homestay.images[0]}" alt="${homestay.title}">
            </div>
            <div class="booking-info">
                <h4>${homestay.title}</h4>
                <p class="booking-location">
                    <i class="fas fa-map-marker-alt"></i> ${homestay.location}
                </p>
                <p class="booking-host">Hosted by ${homestay.host}</p>
                <div class="booking-rating">
                    <i class="fas fa-star"></i> ${homestay.rating} (${homestay.reviews} reviews)
                </div>
            </div>
        </div>
        
        <div class="booking-dates">
            <h4>Your Stay</h4>
            <div class="date-inputs">
                <div class="date-input">
                    <label>Check-in</label>
                    <input type="text" id="bookingCheckin" value="${checkinDate}">
                </div>
                <div class="date-input">
                    <label>Check-out</label>
                    <input type="text" id="bookingCheckout" value="${checkoutDate}">
                </div>
            </div>
            <div class="guest-input">
                <label>Guests</label>
                <span>${guests} guest${guests > 1 ? 's' : ''}</span>
            </div>
        </div>
        
        <div class="booking-price">
            <h4>Price Details</h4>
            <div class="price-breakdown">
                <div class="price-item">
                    <span>₹${homestay.price.toLocaleString('en-IN')} x 1 night</span>
                    <span>₹${homestay.price.toLocaleString('en-IN')}</span>
                </div>
                <div class="price-item">
                    <span>Service fee</span>
                    <span>₹${Math.round(homestay.price * 0.1).toLocaleString('en-IN')}</span>
                </div>
                <div class="price-total">
                    <span>Total</span>
                    <span>₹${(homestay.price + Math.round(homestay.price * 0.1)).toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
        
        <div class="booking-actions">
            <button class="reserve-btn" onclick="reserveHomestay(${homestay.id})">
                Reserve Now
            </button>
            <p class="booking-note">You won't be charged yet</p>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize date pickers in modal
    setTimeout(() => {
        flatpickr("#bookingCheckin", {
            minDate: "today",
            dateFormat: "M d, Y"
        });
        
        flatpickr("#bookingCheckout", {
            minDate: "today",
            dateFormat: "M d, Y"
        });
    }, 100);
}

// Close booking modal
function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Reserve homestay
function reserveHomestay(homestayId) {
    const homestay = homestaysData.find(h => h.id === homestayId);
    if (!homestay) return;
    
    // Show success message
    if (typeof showNotification === 'function') {
        showNotification(`Reservation request sent for ${homestay.title}! The host will contact you soon.`, 'success');
    } else {
        alert(`Reservation request sent for ${homestay.title}! The host will contact you soon.`);
    }
    
    closeBookingModal();
    
    // In a real app, this would send data to backend
    console.log('Reservation data:', {
        homestayId,
        checkin: currentFilters.checkin,
        checkout: currentFilters.checkout,
        guests: currentFilters.guests,
        guestCounts
    });
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const bookingModal = document.getElementById('bookingModal');
    if (event.target === bookingModal) {
        closeBookingModal();
    }
});

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeBookingModal();
        closeGuestModal();
    }
});

// Counter Animation for Hero Stats
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with commas for large numbers
            if (target >= 1000) {
                counter.textContent = Math.floor(current).toLocaleString();
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Initialize hero animations when page loads
function initializeHeroAnimations() {
    // Start counter animation after a short delay
    setTimeout(() => {
        animateCounters();
    }, 500);
    
    // Add scroll-triggered animations for hero stats
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(heroStats);
    }
}

// Enhanced search functionality
function enhancedSearch() {
    const location = document.getElementById('locationInput').value;
    const checkin = document.getElementById('checkinDate').value;
    const checkout = document.getElementById('checkoutDate').value;
    const guests = document.getElementById('guestsInput').value;
    
    // Add visual feedback
    const searchBtn = document.querySelector('.search-btn');
    const originalText = searchBtn.innerHTML;
    
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    searchBtn.disabled = true;
    
    // Simulate search delay
    setTimeout(() => {
        // Reset button
        searchBtn.innerHTML = originalText;
        searchBtn.disabled = false;
        
        // Scroll to results
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Filter results based on search criteria
        searchHomestays();
    }, 1500);
}

// Add CSS for fadeInUp animation
const style = document.createElement('style');
style.textContent = `
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
    
    .hero-stats {
        opacity: 0;
    }
    
    /* Enhanced floating elements */
    .floating-element:hover {
        animation-play-state: paused;
        transform: scale(1.2);
        opacity: 0.3;
        transition: all 0.3s ease;
    }
    
    /* Enhanced search button */
    .search-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
    }
    
    /* Trust badge pulse animation */
    .trust-badge {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
        50% { box-shadow: 0 4px 25px rgba(245, 158, 11, 0.3); }
        100% { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
    }
`;
document.head.appendChild(style);

// Enhanced search functionality
function enhancedSearch(e) {
    e.preventDefault();
    
    const searchInput = document.querySelector('.search-box input[type="text"]');
    const locationSelect = document.querySelector('.search-box select');
    const searchBtn = e.target.closest('.search-btn');
    
    if (searchBtn) {
        // Add loading state
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        searchBtn.disabled = true;
        
        // Simulate search (replace with actual search logic)
        setTimeout(() => {
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
            searchBtn.disabled = false;
            
            // Show results or redirect
            console.log('Search performed for:', {
                location: searchInput?.value,
                destination: locationSelect?.value
            });
        }, 1500);
    }
}

// Quick destination interactions
function initializeQuickDestinations() {
    const quickCards = document.querySelectorAll('.destination-quick-card:not(.view-all)');
    const viewAllCard = document.querySelector('.destination-quick-card.view-all');

    quickCards.forEach(card => {
        card.addEventListener('click', function() {
            const destination = this.querySelector('h4').textContent;
            console.log(`Navigating to ${destination} homestays`);
            // Add navigation logic here
            
            // Update search with selected destination
            const locationSelect = document.querySelector('.search-box select');
            if (locationSelect) {
                const options = locationSelect.querySelectorAll('option');
                options.forEach(option => {
                    if (option.textContent.includes(destination)) {
                        option.selected = true;
                    }
                });
            }
        });
    });

    if (viewAllCard) {
        viewAllCard.addEventListener('click', function() {
            console.log('View all destinations clicked');
            // Scroll to main content or show all destinations
            document.querySelector('.homestays-grid')?.scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDatePickers();
    initializeGuestModal();
    loadHomestays();
    initializeViewOptions();
    initializeHeroAnimations();
    initializeQuickDestinations();
    
    // Override the search button click
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', enhancedSearch);
    }
    
    // Initialize filter interactions
    const filters = document.querySelectorAll('.filter-option');
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Add filter logic here
            const filterType = this.textContent.toLowerCase();
            console.log('Filter applied:', filterType);
        });
    });
});