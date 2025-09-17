// Service Worker for Tribal Trails - Performance Optimization
const CACHE_NAME = 'tribal-trails-v1.2';
const urlsToCache = [
    '/',
    '/index.html',
    '/marketplace.html',
    '/folklore.html',
    '/homestays.html',
    '/forum.html',
    '/styles/main.css',
    '/styles/map.css',
    '/styles/marketplace.css',
    '/styles/folklore.css',
    '/styles/forum.css',
    '/styles/homestays.css',
    '/js/main.js',
    '/js/map.js',
    '/js/auth.js',
    '/js/marketplace.js',
    '/js/folklore.js',
    '/js/forum.js',
    '/js/homestays.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Tribal Trails: Cache opened');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.log('Cache installation failed:', err))
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then(response => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(() => {
                // Offline fallback for HTML requests
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Tribal Trails: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});