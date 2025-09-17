// Marketplace JavaScript functionality
class TribalMarketplace {
    constructor() {
        this.products = [];
        this.cart = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.filters = {
            category: '',
            priceRange: '',
            region: '',
            search: ''
        };
        
        this.initializeMarketplace();
    }

    initializeMarketplace() {
        this.loadProducts();
        this.setupEventListeners();
        this.loadCartFromStorage();
        this.updateCartUI();
    }

    loadProducts() {
        // Sample products data - in a real app, this would come from an API
        this.products = [
            {
                id: 1,
                title: "Handwoven Santhal Saree",
                category: "textiles",
                price: 2500,
                originalPrice: 3000,
                description: "Beautiful traditional Santhal saree with intricate patterns, handwoven by skilled artisans.",
                image: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                artisan: {
                    name: "Manju Devi",
                    location: "Dumka",
                    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                },
                rating: 4.8,
                reviews: 23,
                badge: "Bestseller",
                region: "dumka"
            },
            {
                id: 2,
                title: "Dokra Metal Elephant",
                category: "metal-craft",
                price: 1800,
                originalPrice: 2200,
                description: "Traditional Dokra metal craft elephant sculpture, perfect for home decoration.",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                artisan: {
                    name: "Raman Singh",
                    location: "Hazaribagh",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                },
                rating: 4.9,
                reviews: 18,
                badge: "Authentic",
                region: "hazaribagh"
            },
            {
                id: 3,
                title: "Tribal Necklace Set",
                category: "jewelry",
                price: 1200,
                originalPrice: 1500,
                description: "Handcrafted tribal necklace set with traditional beads and patterns.",
                image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                artisan: {
                    name: "Kamala Munda",
                    location: "Ranchi",
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                },
                rating: 4.7,
                reviews: 31,
                badge: "New",
                region: "ranchi"
            },
            {
                id: 4,
                title: "Paitkar Painting",
                category: "paintings",
                price: 3500,
                originalPrice: 4000,
                description: "Traditional Paitkar scroll painting depicting tribal folklore and mythology.",
                image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                artisan: {
                    name: "Suresh Chitrakar",
                    location: "Deoghar",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                },
                rating: 5.0,
                reviews: 12,
                badge: "Premium",
                region: "deoghar"
            },
            {
                id: 5,
                title: "Bamboo Flute (Bansuri)",
                category: "musical-instruments",
                price: 800,
                originalPrice: 1000,
                description: "Handcrafted bamboo flute with traditional tribal designs and sweet melodies.",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                artisan: {
                    name: "Gopal Oraon",
                    location: "Giridih",
                    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                },
                rating: 4.6,
                reviews: 27,
                badge: "Eco-friendly",
                region: "giridih"
            },
            {
                id: 6,
                title: "Clay Water Pot",
                category: "pottery",
                price: 450,
                originalPrice: 600,
                description: "Traditional clay water pot with cooling properties, perfect for summer.",
                image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                artisan: {
                    name: "Rekha Kumari",
                    location: "Dhanbad",
                    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                },
                rating: 4.5,
                reviews: 45,
                badge: "Popular",
                region: "dhanbad"
            },
            {
                id: 7,
                title: "Wooden Tribal Mask",
                category: "woodwork",
                price: 2200,
                originalPrice: 2800,
                description: "Handcarved wooden tribal mask used in traditional ceremonies and festivals.",
                image: "https://images.unsplash.com/photo-1594736797933-d0401ba0ad65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                artisan: {
                    name: "Birsa Munda",
                    location: "Ranchi",
                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                },
                rating: 4.8,
                reviews: 16,
                badge: "Ceremonial",
                region: "ranchi"
            },
            {
                id: 8,
                title: "Handwoven Basket Set",
                category: "handicrafts",
                price: 1100,
                originalPrice: 1400,
                description: "Set of 3 handwoven baskets made from natural fibers, perfect for storage.",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                artisan: {
                    name: "Sita Devi",
                    location: "Hazaribagh",
                    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                },
                rating: 4.4,
                reviews: 38,
                badge: "Eco-friendly",
                region: "hazaribagh"
            }
        ];

        this.renderProducts();
    }

    setupEventListeners() {
        // Cart toggle
        document.getElementById('cartIcon').addEventListener('click', () => this.toggleCart());
        
        // Filter listeners
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('priceFilter').addEventListener('change', (e) => {
            this.filters.priceRange = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('regionFilter').addEventListener('change', (e) => {
            this.filters.region = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });
    }

    renderProducts(productsToRender = null) {
        const products = productsToRender || this.getFilteredProducts();
        const productsGrid = document.getElementById('productsGrid');
        
        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }
        
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" onclick="openProductModal(${product.id})">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" onerror="this.src='assets/images/jharkhand-hero.png'">
                    <span class="product-badge">${product.badge}</span>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category.replace('-', ' ')}</div>
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-price">
                        <span class="current-price">₹${product.price}</span>
                        ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ''}
                        ${product.originalPrice ? `<span class="discount">${Math.round((1 - product.price/product.originalPrice) * 100)}% OFF</span>` : ''}
                    </div>
                    
                    <div class="product-artisan">
                        <div class="artisan-avatar">
                            <img src="${product.artisan.avatar}" alt="${product.artisan.name}" onerror="this.src='assets/images/jharkhand-hero.png'">
                        </div>
                        <div class="artisan-info">
                            <div class="artisan-name">${product.artisan.name}</div>
                            <div class="artisan-location">${product.artisan.location}</div>
                            <div class="product-rating">
                                <div class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</div>
                                <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary full-width" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    getFilteredProducts() {
        return this.products.filter(product => {
            const matchesCategory = !this.filters.category || product.category === this.filters.category;
            const matchesRegion = !this.filters.region || product.region === this.filters.region;
            const matchesSearch = !this.filters.search || 
                product.title.toLowerCase().includes(this.filters.search) ||
                product.description.toLowerCase().includes(this.filters.search) ||
                product.artisan.name.toLowerCase().includes(this.filters.search);
            
            let matchesPrice = true;
            if (this.filters.priceRange) {
                const [min, max] = this.filters.priceRange.includes('+') 
                    ? [parseInt(this.filters.priceRange.replace('+', '')), Infinity]
                    : this.filters.priceRange.split('-').map(p => parseInt(p));
                matchesPrice = product.price >= min && product.price <= max;
            }
            
            return matchesCategory && matchesRegion && matchesSearch && matchesPrice;
        });
    }

    applyFilters() {
        this.currentPage = 1;
        this.renderProducts();
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        
        this.saveCartToStorage();
        this.updateCartUI();
        this.showAddToCartFeedback(product.title);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartUI();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCartToStorage();
                this.updateCartUI();
            }
        }
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        cartCount.textContent = totalItems;
        cartTotal.textContent = totalPrice;
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='assets/images/jharkhand-hero.png'">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>₹${item.price} each</p>
                        <div class="quantity-controls">
                            <button onclick="marketplace.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="marketplace.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        <p>₹${item.price * item.quantity}</p>
                        <button class="remove-btn" onclick="marketplace.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        cartSidebar.classList.toggle('active');
    }

    saveCartToStorage() {
        localStorage.setItem('tribalMarketplaceCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const saved = localStorage.getItem('tribalMarketplaceCart');
        if (saved) {
            this.cart = JSON.parse(saved);
        }
    }

    showAddToCartFeedback(productTitle) {
        // Create and show a temporary notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            "${productTitle}" added to cart!
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // In a real app, this would redirect to a checkout page
        alert('Checkout functionality would be implemented here. Total: ₹' + 
              this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0));
    }
}

// Global functions
function openProductModal(productId) {
    const product = marketplace.products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="product-modal-content">
            <div class="product-modal-image">
                <img src="${product.image}" alt="${product.title}" onerror="this.src='assets/images/jharkhand-hero.png'">
            </div>
            <div class="product-modal-info">
                <div class="product-category">${product.category.replace('-', ' ')}</div>
                <h2>${product.title}</h2>
                <div class="product-rating">
                    <div class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</div>
                    <span>${product.rating} (${product.reviews} reviews)</span>
                </div>
                
                <div class="product-price">
                    <span class="current-price">₹${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ''}
                    ${product.originalPrice ? `<span class="discount">${Math.round((1 - product.price/product.originalPrice) * 100)}% OFF</span>` : ''}
                </div>
                
                <p class="product-description">${product.description}</p>
                
                <div class="product-artisan">
                    <div class="artisan-avatar">
                        <img src="${product.artisan.avatar}" alt="${product.artisan.name}" onerror="this.src='assets/images/jharkhand-hero.png'">
                    </div>
                    <div class="artisan-info">
                        <div class="artisan-name">${product.artisan.name}</div>
                        <div class="artisan-location">${product.artisan.location}</div>
                    </div>
                </div>
                
                <button class="btn btn-primary full-width" onclick="addToCart(${product.id}); closeProductModal();">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function addToCart(productId) {
    marketplace.addToCart(productId);
}

function applyFilters() {
    marketplace.applyFilters();
}

function loadMoreProducts() {
    // In a real app, this would load more products from the server
    alert('Load more functionality would be implemented for pagination');
}

// Initialize marketplace when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.marketplace = new TribalMarketplace();
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeProductModal();
    }
}