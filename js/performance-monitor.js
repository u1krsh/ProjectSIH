// Critical CSS - Above the fold styling
const criticalCSS = `
/* Critical styles for initial render */
body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0F172A;
    color: #F8FAFC;
    line-height: 1.6;
}

.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.5s ease;
}

.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    padding: 1rem 0;
    transition: all 0.3s ease;
}

.hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
}
`;

// Inject critical CSS immediately
function injectCriticalCSS() {
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
}

// Performance monitoring and optimization
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.startTime = performance.now();
        this.init();
    }

    init() {
        this.measureCoreWebVitals();
        this.setupPerformanceObserver();
        this.optimizeLoadingSequence();
    }

    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.lcp = lastEntry.startTime;
                    console.log('LCP:', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.log('LCP measurement not supported');
            }
        }

        // First Input Delay (FID)
        if ('PerformanceObserver' in window) {
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        this.metrics.fid = entry.processingStart - entry.startTime;
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.log('FID measurement not supported');
            }
        }

        // Cumulative Layout Shift (CLS)
        if ('PerformanceObserver' in window) {
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    this.metrics.cls = clsValue;
                    console.log('CLS:', clsValue);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.log('CLS measurement not supported');
            }
        }
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    // Log long tasks (> 50ms)
                    if (entry.entryType === 'longtask') {
                        console.warn('Long task detected:', entry.duration + 'ms');
                    }
                    
                    // Log resource timing
                    if (entry.entryType === 'resource') {
                        if (entry.duration > 1000) {
                            console.warn('Slow resource:', entry.name, entry.duration + 'ms');
                        }
                    }
                });
            });

            try {
                observer.observe({ entryTypes: ['longtask', 'resource'] });
            } catch (e) {
                console.log('Performance observer not fully supported');
            }
        }
    }

    optimizeLoadingSequence() {
        // Prioritize critical resources
        window.addEventListener('load', () => {
            // Hide loading screen after page load
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 100);
            }

            // Report performance metrics
            setTimeout(() => {
                this.reportMetrics();
            }, 1000);
        });

        // Optimize images
        this.optimizeImages();
    }

    optimizeImages() {
        // Convert images to WebP if supported
        const supportsWebP = (function() {
            const canvas = document.createElement('canvas');
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        })();

        if (supportsWebP) {
            document.querySelectorAll('img[data-webp]').forEach(img => {
                img.src = img.dataset.webp;
            });
        }
    }

    reportMetrics() {
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        
        const performanceData = {
            pageLoadTime: navigationEntry.loadEventEnd - navigationEntry.fetchStart,
            domContentLoadedTime: navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart,
            firstByteTime: navigationEntry.responseStart - navigationEntry.requestStart,
            domInteractiveTime: navigationEntry.domInteractive - navigationEntry.fetchStart,
            resourcesLoadTime: navigationEntry.loadEventStart - navigationEntry.domContentLoadedEventEnd,
            ...this.metrics
        };

        console.log('📊 Performance Report:', performanceData);

        // Send to analytics if available
        if (window.gtag) {
            gtag('event', 'page_performance', {
                custom_map: {
                    load_time: performanceData.pageLoadTime,
                    lcp: performanceData.lcp,
                    fid: performanceData.fid,
                    cls: performanceData.cls
                }
            });
        }

        return performanceData;
    }
}

// Initialize critical optimizations immediately
if (document.readyState === 'loading') {
    injectCriticalCSS();
    document.addEventListener('DOMContentLoaded', () => {
        new PerformanceMonitor();
    });
} else {
    injectCriticalCSS();
    new PerformanceMonitor();
}