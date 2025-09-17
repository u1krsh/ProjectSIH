// Performance Optimization Module for Tribal Trails
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Initialize performance monitoring
        this.setupPerformanceMonitoring();
        
        // Setup image lazy loading
        this.setupImageLazyLoading();
        
        // Setup resource preloading
        this.setupResourcePreloading();
        
        // Setup intersection observer for animations
        this.setupAnimationObserver();
        
        // Optimize third-party scripts
        this.optimizeThirdPartyScripts();
    }

    setupPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const metrics = {
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                        totalTime: perfData.loadEventEnd - perfData.fetchStart,
                        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
                        tcp: perfData.connectEnd - perfData.connectStart,
                        request: perfData.responseStart - perfData.requestStart,
                        response: perfData.responseEnd - perfData.responseStart
                    };
                    
                    console.log('Performance Metrics:', metrics);
                    
                    // Report slow loading if over 3 seconds
                    if (metrics.totalTime > 3000) {
                        console.warn('Slow page load detected:', metrics.totalTime + 'ms');
                    }
                }, 100);
            });
        }
    }

    setupImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Replace data-src with src for lazy loading
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px 0px'
            });

            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupResourcePreloading() {
        // Preload critical resources when idle
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.preloadCriticalResources();
            });
        } else {
            setTimeout(() => {
                this.preloadCriticalResources();
            }, 1000);
        }
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/js/map.js',
            '/js/marketplace.js',
            '/styles/marketplace.css',
            '/styles/forum.css'
        ];

        criticalResources.forEach(resource => {
            if (document.createElement('link').relList.supports('prefetch')) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = resource;
                document.head.appendChild(link);
            }
        });
    }

    setupAnimationObserver() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements for animation
            const elementsToAnimate = document.querySelectorAll(
                '.destination-card, .feature-card, .stat-card, .preview-section, .culture-item'
            );
            
            elementsToAnimate.forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    optimizeThirdPartyScripts() {
        // Delay non-critical third-party scripts
        const delayedScripts = [
            'https://cdn.socket.io/4.7.4/socket.io.min.js'
        ];

        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.loadDelayedScripts(delayedScripts);
            });
        } else {
            setTimeout(() => {
                this.loadDelayedScripts(delayedScripts);
            }, 2000);
        }
    }

    loadDelayedScripts(scripts) {
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.head.appendChild(script);
        });
    }

    // Debounce function for performance
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for performance
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize performance optimizer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PerformanceOptimizer();
    });
} else {
    new PerformanceOptimizer();
}

// Export for use in other modules
window.PerformanceOptimizer = PerformanceOptimizer;