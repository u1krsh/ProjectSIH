// Interactive Map Implementation for Jharkhand Tourism
class JharkhandMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.currentFilter = 'all';
        this.routingControl = null;
        this.weatherLayer = null;
        this.userLocation = null;
        this.clusteredMarkers = null;
        
        // Jharkhand boundaries and center
        this.jharkhandBounds = [
            [21.95, 83.32], // Southwest
            [25.35, 87.57]  // Northeast
        ];
        this.jharkhandCenter = [23.6102, 85.2799]; // Ranchi coordinates
        
        // Tourism data with real coordinates
        this.destinations = [
            {
                id: 1,
                name: "Betla National Park",
                type: "wildlife",
                coordinates: [23.8859, 84.1917],
                description: "Famous for tigers, elephants, and diverse wildlife",
                images: ["assets/images/betla-1.jpg", "assets/images/betla-2.jpg"],
                rating: 4.6,
                visitors: "125k+",
                bestTime: "Nov - Apr",
                activities: ["Wildlife Safari", "Bird Watching", "Nature Photography"],
                facilities: ["Safari Vehicles", "Guest House", "Canteen"],
                entryFee: "₹50 (Indians), ₹500 (Foreigners)",
                timings: "6:00 AM - 6:00 PM",
                phone: "+91-6562-250123",
                website: "https://jharkhandtourism.gov.in/betla"
            },
            {
                id: 2,
                name: "Hundru Falls",
                type: "natural",
                coordinates: [23.4298, 85.5943],
                description: "98-meter high spectacular waterfall near Ranchi",
                images: ["assets/images/hundru-1.jpg", "assets/images/hundru-2.jpg"],
                rating: 4.4,
                visitors: "89k+",
                bestTime: "Jul - Feb",
                activities: ["Photography", "Trekking", "Picnicking"],
                facilities: ["Parking", "Food Stalls", "Viewpoints"],
                entryFee: "₹20 per person",
                timings: "8:00 AM - 6:00 PM",
                phone: "+91-651-2446441",
                website: "https://jharkhandtourism.gov.in/hundru-falls"
            },
            {
                id: 3,
                name: "Netarhat",
                type: "adventure",
                coordinates: [23.4676, 84.2631],
                description: "Queen of Chotanagpur, famous for sunrise views",
                images: ["assets/images/netarhat-1.jpg", "assets/images/netarhat-2.jpg"],
                rating: 4.5,
                visitors: "95k+",
                bestTime: "Oct - Mar",
                activities: ["Sunrise Viewing", "Trekking", "Nature Walks"],
                facilities: ["Rest House", "Observatory", "Cafeteria"],
                entryFee: "Free",
                timings: "24 hours",
                phone: "+91-6565-223456",
                website: "https://jharkhandtourism.gov.in/netarhat"
            },
            {
                id: 4,
                name: "Deoghar Temple",
                type: "religious",
                coordinates: [24.4842, 86.6947],
                description: "Sacred Baidyanath Jyotirlinga temple",
                images: ["assets/images/deoghar-1.jpg", "assets/images/deoghar-2.jpg"],
                rating: 4.7,
                visitors: "2M+",
                bestTime: "Oct - Mar",
                activities: ["Temple Visit", "Pilgrimage", "Cultural Experience"],
                facilities: ["Dharamshala", "Prasad Counter", "Cloak Room"],
                entryFee: "Free",
                timings: "4:00 AM - 10:00 PM",
                phone: "+91-6432-233445",
                website: "https://jharkhandtourism.gov.in/deoghar"
            },
            {
                id: 5,
                name: "Hazaribagh Wildlife Sanctuary",
                type: "wildlife",
                coordinates: [23.9929, 85.3647],
                description: "Rich biodiversity with leopards and birds",
                images: ["assets/images/hazaribagh-1.jpg", "assets/images/hazaribagh-2.jpg"],
                rating: 4.3,
                visitors: "67k+",
                bestTime: "Nov - Apr",
                activities: ["Wildlife Safari", "Bird Watching", "Nature Photography"],
                facilities: ["Safari Jeeps", "Forest Lodge", "Canteen"],
                entryFee: "₹25 (Indians), ₹200 (Foreigners)",
                timings: "6:00 AM - 5:00 PM",
                phone: "+91-6546-222333",
                website: "https://jharkhandtourism.gov.in/hazaribagh"
            },
            {
                id: 6,
                name: "Parasnath Hill",
                type: "adventure",
                coordinates: [23.9648, 86.1636],
                description: "Highest peak in Jharkhand, Jain pilgrimage site",
                images: ["assets/images/parasnath-1.jpg", "assets/images/parasnath-2.jpg"],
                rating: 4.5,
                visitors: "78k+",
                bestTime: "Oct - Mar",
                activities: ["Trekking", "Temple Visit", "Mountain Climbing"],
                facilities: ["Guest House", "Food Stalls", "Medical Aid"],
                entryFee: "₹30 per person",
                timings: "5:00 AM - 7:00 PM",
                phone: "+91-6541-234567",
                website: "https://jharkhandtourism.gov.in/parasnath"
            },
            {
                id: 7,
                name: "Ranchi Rock Garden",
                type: "cultural",
                coordinates: [23.3441, 85.3096],
                description: "Beautiful rock garden with sculptures and landscapes",
                images: ["assets/images/ranchi-garden-1.jpg", "assets/images/ranchi-garden-2.jpg"],
                rating: 4.2,
                visitors: "150k+",
                bestTime: "Oct - Mar",
                activities: ["Sightseeing", "Photography", "Boating"],
                facilities: ["Parking", "Cafeteria", "Boat House"],
                entryFee: "₹15 per person",
                timings: "8:00 AM - 8:00 PM",
                phone: "+91-651-2345678",
                website: "https://jharkhandtourism.gov.in/ranchi"
            },
            {
                id: 8,
                name: "Dassam Falls",
                type: "natural",
                coordinates: [23.3775, 85.4453],
                description: "Beautiful cascade waterfall surrounded by forests",
                images: ["assets/images/dassam-1.jpg", "assets/images/dassam-2.jpg"],
                rating: 4.3,
                visitors: "112k+",
                bestTime: "Jul - Feb",
                activities: ["Photography", "Trekking", "Swimming"],
                facilities: ["Parking", "Food Stalls", "Changing Rooms"],
                entryFee: "₹10 per person",
                timings: "7:00 AM - 6:00 PM",
                phone: "+91-651-2456789",
                website: "https://jharkhandtourism.gov.in/dassam-falls"
            }
        ];
        
        this.init();
    }
    
    async init() {
        await this.createMap();
        this.addMarkers();
        this.setupEventListeners();
        this.addMapControls();
        await this.getUserLocation();
    }
    
    async createMap() {
        // Initialize the map
        this.map = L.map('jharkhandMap', {
            center: this.jharkhandCenter,
            zoom: 8,
            minZoom: 7,
            maxZoom: 18,
            zoomControl: false,
            attributionControl: false
        });
        
        // Add multiple tile layers
        const tileLayers = {
            'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }),
            'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
            }),
            'Terrain': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
            })
        };
        
        // Set default layer
        tileLayers['OpenStreetMap'].addTo(this.map);
        
        // Add layer control
        L.control.layers(tileLayers).addTo(this.map);
        
        // Add custom zoom control
        L.control.zoom({
            position: 'topright'
        }).addTo(this.map);
        
        // Add scale control
        L.control.scale({
            position: 'bottomleft'
        }).addTo(this.map);
        
        // Restrict map bounds to Jharkhand
        this.map.setMaxBounds(this.jharkhandBounds);
        
        // Add loading indicator
        this.map.on('movestart', () => {
            document.body.style.cursor = 'wait';
        });
        
        this.map.on('moveend', () => {
            document.body.style.cursor = 'default';
        });
    }
    
    addMarkers() {
        // Create marker cluster group
        this.clusteredMarkers = L.markerClusterGroup({
            chunkedLoading: true,
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            maxClusterRadius: 80,
            iconCreateFunction: (cluster) => {
                const childCount = cluster.getChildCount();
                let className = 'marker-cluster-';
                
                if (childCount < 10) {
                    className += 'small';
                } else if (childCount < 100) {
                    className += 'medium';
                } else {
                    className += 'large';
                }
                
                return new L.DivIcon({
                    html: `<div><span>${childCount}</span></div>`,
                    className: `marker-cluster ${className}`,
                    iconSize: new L.Point(40, 40)
                });
            }
        });
        
        this.destinations.forEach(destination => {
            const marker = this.createMarker(destination);
            this.markers.push({
                marker: marker,
                data: destination
            });
            this.clusteredMarkers.addLayer(marker);
        });
        
        this.map.addLayer(this.clusteredMarkers);
    }
    
    createMarker(destination) {
        // Create custom icon based on type
        const iconMap = {
            wildlife: '🐅',
            natural: '💧',
            adventure: '🏔️',
            religious: '🛕',
            cultural: '🏛️'
        };
        
        const customIcon = L.divIcon({
            className: `custom-marker ${destination.type}`,
            html: `
                <div class="marker-pin">
                    <span class="marker-icon">${iconMap[destination.type] || '📍'}</span>
                </div>
            `,
            iconSize: [40, 50],
            iconAnchor: [20, 50],
            popupAnchor: [0, -50]
        });
        
        const marker = L.marker(destination.coordinates, {
            icon: customIcon,
            title: destination.name
        });
        
        // Create detailed popup
        const popupContent = this.createPopupContent(destination);
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            minWidth: 250,
            className: 'custom-popup'
        });
        
        // Add click event
        marker.on('click', () => {
            this.showDestinationDetails(destination);
        });
        
        return marker;
    }
    
    createPopupContent(destination) {
        return `
            <div class="popup-content">
                <div class="popup-header">
                    <img src="${destination.images[0]}" alt="${destination.name}" 
                         onerror="this.src='https://via.placeholder.com/250x150?text=${destination.name}'">
                    <div class="popup-rating">
                        <i class="fas fa-star"></i>
                        <span>${destination.rating}</span>
                    </div>
                </div>
                <div class="popup-body">
                    <h3>${destination.name}</h3>
                    <p>${destination.description}</p>
                    <div class="popup-info">
                        <div class="info-item">
                            <i class="fas fa-users"></i>
                            <span>${destination.visitors} visitors/year</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-calendar"></i>
                            <span>Best: ${destination.bestTime}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-rupee-sign"></i>
                            <span>${destination.entryFee}</span>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <button class="btn-popup primary" onclick="jharkhandMap.getDirections(${destination.coordinates[0]}, ${destination.coordinates[1]})">
                            <i class="fas fa-directions"></i> Directions
                        </button>
                        <button class="btn-popup secondary" onclick="jharkhandMap.showDestinationDetails(${JSON.stringify(destination).replace(/"/g, '&quot;')})">
                            <i class="fas fa-info"></i> Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    showDestinationDetails(destination) {
        const sidebar = document.getElementById('mapSidebar');
        if (!sidebar) return;
        
        const sidebarContent = sidebar.querySelector('.sidebar-content');
        sidebarContent.innerHTML = `
            <div class="destination-details">
                <div class="details-header">
                    <h2>${destination.name}</h2>
                    <div class="rating-badge">
                        <i class="fas fa-star"></i>
                        <span>${destination.rating}</span>
                    </div>
                </div>
                
                <div class="image-gallery">
                    ${destination.images.map((img, index) => `
                        <img src="${img}" alt="${destination.name} ${index + 1}" 
                             onerror="this.src='https://via.placeholder.com/300x200?text=${destination.name}'"
                             onclick="jharkhandMap.openImageModal('${img}')">
                    `).join('')}
                </div>
                
                <div class="details-info">
                    <p class="description">${destination.description}</p>
                    
                    <div class="info-section">
                        <h4><i class="fas fa-clock"></i> Timings</h4>
                        <p>${destination.timings}</p>
                    </div>
                    
                    <div class="info-section">
                        <h4><i class="fas fa-rupee-sign"></i> Entry Fee</h4>
                        <p>${destination.entryFee}</p>
                    </div>
                    
                    <div class="info-section">
                        <h4><i class="fas fa-calendar-alt"></i> Best Time to Visit</h4>
                        <p>${destination.bestTime}</p>
                    </div>
                    
                    <div class="info-section">
                        <h4><i class="fas fa-hiking"></i> Activities</h4>
                        <div class="activity-tags">
                            ${destination.activities.map(activity => `
                                <span class="activity-tag">${activity}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4><i class="fas fa-home"></i> Facilities</h4>
                        <ul class="facilities-list">
                            ${destination.facilities.map(facility => `
                                <li><i class="fas fa-check"></i> ${facility}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <a href="tel:${destination.phone}">${destination.phone}</a>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-globe"></i>
                            <a href="${destination.website}" target="_blank">Official Website</a>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn-action primary" onclick="jharkhandMap.getDirections(${destination.coordinates[0]}, ${destination.coordinates[1]})">
                            <i class="fas fa-directions"></i> Get Directions
                        </button>
                        <button class="btn-action secondary" onclick="jharkhandMap.addToItinerary(${destination.id})">
                            <i class="fas fa-plus"></i> Add to Trip
                        </button>
                        <button class="btn-action secondary" onclick="jharkhandMap.shareLocation(${destination.id})">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Scroll to top of sidebar
        sidebar.scrollTop = 0;
    }
    
    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('[data-filter]');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterMarkers(filter);
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Tool buttons
        document.getElementById('routePlanner')?.addEventListener('click', () => {
            this.toggleRoutePlanning();
        });
        
        document.getElementById('nearbyPlaces')?.addEventListener('click', () => {
            this.findNearbyPlaces();
        });
        
        document.getElementById('weatherLayer')?.addEventListener('click', () => {
            this.toggleWeatherLayer();
        });
    }
    
    filterMarkers(filter) {
        this.currentFilter = filter;
        this.clusteredMarkers.clearLayers();
        
        const filteredMarkers = this.markers.filter(item => {
            return filter === 'all' || item.data.type === filter;
        });
        
        filteredMarkers.forEach(item => {
            this.clusteredMarkers.addLayer(item.marker);
        });
        
        // Update counter
        this.updateMarkerCounter(filteredMarkers.length);
    }
    
    updateMarkerCounter(count) {
        const counter = document.querySelector('.marker-counter');
        if (counter) {
            counter.textContent = `${count} places found`;
        }
    }
    
    async getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = [position.coords.latitude, position.coords.longitude];
                    
                    // Add user location marker
                    const userIcon = L.divIcon({
                        className: 'user-location-marker',
                        html: '<div class="user-pin"><i class="fas fa-user"></i></div>',
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    });
                    
                    L.marker(this.userLocation, { icon: userIcon })
                        .addTo(this.map)
                        .bindPopup('Your Location');
                },
                (error) => {
                    console.log('Geolocation error:', error);
                }
            );
        }
    }
    
    getDirections(lat, lng) {
        if (!this.userLocation) {
            alert('Please allow location access to get directions');
            return;
        }
        
        if (this.routingControl) {
            this.map.removeControl(this.routingControl);
        }
        
        this.routingControl = L.Routing.control({
            waypoints: [
                L.latLng(this.userLocation[0], this.userLocation[1]),
                L.latLng(lat, lng)
            ],
            routeWhileDragging: true,
            geocoder: L.Control.Geocoder.nominatim(),
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
            }),
            lineOptions: {
                styles: [{ color: '#2c5530', weight: 6, opacity: 0.8 }]
            },
            show: false,
            addWaypoints: false,
            createMarker: () => null
        }).addTo(this.map);
    }
    
    toggleRoutePlanning() {
        const routePanel = document.querySelector('.route-planning-panel');
        if (routePanel) {
            routePanel.style.display = routePanel.style.display === 'none' ? 'block' : 'none';
        } else {
            this.createRoutePlanningPanel();
        }
    }
    
    createRoutePlanningPanel() {
        const panel = document.createElement('div');
        panel.className = 'route-planning-panel';
        panel.innerHTML = `
            <h4>Plan Your Route</h4>
            <div class="route-form">
                <input type="text" id="startPoint" placeholder="Starting point">
                <input type="text" id="endPoint" placeholder="Destination">
                <button onclick="jharkhandMap.planRoute()">Get Route</button>
            </div>
        `;
        
        document.querySelector('.map-container').appendChild(panel);
    }
    
    findNearbyPlaces() {
        if (!this.userLocation) {
            alert('Please allow location access to find nearby places');
            return;
        }
        
        const nearbyPlaces = this.destinations.filter(dest => {
            const distance = this.calculateDistance(
                this.userLocation[0], this.userLocation[1],
                dest.coordinates[0], dest.coordinates[1]
            );
            return distance <= 50; // Within 50km
        }).sort((a, b) => {
            const distA = this.calculateDistance(
                this.userLocation[0], this.userLocation[1],
                a.coordinates[0], a.coordinates[1]
            );
            const distB = this.calculateDistance(
                this.userLocation[0], this.userLocation[1],
                b.coordinates[0], b.coordinates[1]
            );
            return distA - distB;
        });
        
        this.showNearbyPlaces(nearbyPlaces);
    }
    
    showNearbyPlaces(places) {
        const sidebar = document.getElementById('mapSidebar');
        const sidebarContent = sidebar.querySelector('.sidebar-content');
        
        sidebarContent.innerHTML = `
            <div class="nearby-places">
                <h3><i class="fas fa-location-arrow"></i> Nearby Places</h3>
                <div class="places-list">
                    ${places.map(place => {
                        const distance = this.calculateDistance(
                            this.userLocation[0], this.userLocation[1],
                            place.coordinates[0], place.coordinates[1]
                        );
                        return `
                            <div class="nearby-place-card" onclick="jharkhandMap.showDestinationDetails(${JSON.stringify(place).replace(/"/g, '&quot;')})">
                                <img src="${place.images[0]}" alt="${place.name}"
                                     onerror="this.src='https://via.placeholder.com/80x60?text=${place.name}'">
                                <div class="place-info">
                                    <h4>${place.name}</h4>
                                    <p>${distance.toFixed(1)} km away</p>
                                    <div class="place-rating">
                                        <i class="fas fa-star"></i>
                                        <span>${place.rating}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    toggleWeatherLayer() {
        if (this.weatherLayer) {
            this.map.removeLayer(this.weatherLayer);
            this.weatherLayer = null;
        } else {
            // Add weather layer (using OpenWeatherMap API)
            this.weatherLayer = L.tileLayer(
                'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY',
                {
                    attribution: 'Weather data © OpenWeatherMap',
                    opacity: 0.6
                }
            );
            this.weatherLayer.addTo(this.map);
        }
    }
    
    addMapControls() {
        // Add custom controls
        const customControl = L.Control.extend({
            onAdd: function(map) {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                container.innerHTML = `
                    <div class="map-controls">
                        <button onclick="jharkhandMap.centerMap()" title="Center Map">
                            <i class="fas fa-crosshairs"></i>
                        </button>
                        <button onclick="jharkhandMap.toggleFullscreen()" title="Fullscreen">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                `;
                
                L.DomEvent.disableClickPropagation(container);
                return container;
            }
        });
        
        new customControl({ position: 'topright' }).addTo(this.map);
    }
    
    centerMap() {
        this.map.setView(this.jharkhandCenter, 8);
    }
    
    toggleFullscreen() {
        const mapContainer = document.getElementById('jharkhandMap');
        if (!document.fullscreenElement) {
            mapContainer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    addToItinerary(destinationId) {
        // Add to user's itinerary (backend integration)
        console.log('Adding destination to itinerary:', destinationId);
        alert('Added to your trip itinerary!');
    }
    
    shareLocation(destinationId) {
        const destination = this.destinations.find(d => d.id === destinationId);
        if (navigator.share) {
            navigator.share({
                title: destination.name,
                text: destination.description,
                url: `${window.location.origin}?destination=${destinationId}`
            });
        } else {
            // Fallback
            navigator.clipboard.writeText(`${window.location.origin}?destination=${destinationId}`);
            alert('Location link copied to clipboard!');
        }
    }
    
    openImageModal(imageSrc) {
        // Create image modal
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <img src="${imageSrc}" alt="Destination Image">
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal events
        modal.querySelector('.modal-close').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
}

// Initialize the map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('jharkhandMap')) {
        window.jharkhandMap = new JharkhandMap();
    }
});