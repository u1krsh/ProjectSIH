// Authentication and User Management
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('current_user'));
        this.token = localStorage.getItem('auth_token');
        this.refreshToken = localStorage.getItem('refresh_token');
        this.baseURL = 'http://localhost:5000/api';
        this.users = JSON.parse(localStorage.getItem('registered_users')) || [];
        this.initializeDemoUsers();
        this.init();
    }

    initializeDemoUsers() {
        // Add demo users if none exist
        if (this.users.length === 0) {
            this.users = [
                {
                    id: 1,
                    firstName: 'Demo',
                    lastName: 'User',
                    email: 'demo@example.com',
                    phone: '+91-9876543210',
                    password: 'Demo123',
                    userType: 'tourist',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    firstName: 'Local',
                    lastName: 'Guide',
                    email: 'guide@example.com',
                    phone: '+91-9876543211',
                    password: 'Guide123',
                    userType: 'guide',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('registered_users', JSON.stringify(this.users));
        }
    }

    init() {
        // Check if user is logged in
        if (this.token) {
            this.validateToken();
        }
        this.bindEvents();
    }

    bindEvents() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Modal toggles
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        
        // Login modal triggers
        document.querySelectorAll('[data-toggle="login"]').forEach(btn => {
            btn.addEventListener('click', () => this.showModal('loginModal'));
        });

        // Register modal triggers
        document.querySelectorAll('[data-toggle="register"]').forEach(btn => {
            btn.addEventListener('click', () => this.showModal('registerModal'));
        });

        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.hideModal(modal.id);
            });
        });

        // Switch between login and register
        const switchToRegister = document.getElementById('switchToRegister');
        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('loginModal');
                this.showModal('registerModal');
            });
        }

        const switchToLogin = document.getElementById('switchToLogin');
        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('registerModal');
                this.showModal('loginModal');
            });
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };

        try {
            this.showLoading('loginForm');
            
            // Mock authentication with localStorage (fallback for demo)
            const user = this.users.find(u => u.email === loginData.email);
            
            let result;
            if (user && user.password === loginData.password) {
                // Successful login
                result = {
                    success: true,
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        userType: user.userType
                    },
                    token: 'mock_token_' + Date.now(),
                    refreshToken: 'mock_refresh_' + Date.now()
                };
            } else {
                result = {
                    success: false,
                    message: 'Invalid email or password'
                };
            }

            if (result.success) {
                this.setAuthData(result.data.tokens, result.data.user);
                this.hideModal('loginModal');
                this.showSuccess('Login successful!');
                this.updateUI();
                window.location.reload();
            } else {
                this.showError(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Network error. Please try again.');
        } finally {
            this.hideLoading('loginForm');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        // Validate password confirmation
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        const registerData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: password,
            userType: formData.get('userType')
        };

        try {
            this.showLoading('registerForm');
            
            // Check if email already exists
            const existingUser = this.users.find(u => u.email === registerData.email);
            let result;
            
            if (existingUser) {
                result = {
                    success: false,
                    message: 'Email already registered'
                };
            } else {
                // Create new user
                const newUser = {
                    id: Date.now(),
                    ...registerData,
                    createdAt: new Date().toISOString()
                };
                
                this.users.push(newUser);
                localStorage.setItem('registered_users', JSON.stringify(this.users));
                
                result = {
                    success: true,
                    message: 'Registration successful',
                    user: {
                        id: newUser.id,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        userType: newUser.userType
                    },
                    token: 'mock_token_' + Date.now(),
                    refreshToken: 'mock_refresh_' + Date.now()
                };
            }

            if (result.success) {
                this.setAuthData(result.token, result.user);
                this.hideModal('registerModal');
                this.showSuccess('Registration successful! Welcome to Tribal Trails!');
                this.updateUI();
            } else {
                this.showError(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showError('Network error. Please try again.');
        } finally {
            this.hideLoading('registerForm');
        }
    }

    async logout() {
        try {
            await fetch(`${this.baseURL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.clearAuthData();
        this.updateUI();
        this.showSuccess('Logged out successfully');
        window.location.reload();
    }

    async validateToken() {
        try {
            const response = await fetch(`${this.baseURL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                this.currentUser = result.data;
                this.updateUI();
            } else {
                // Token is invalid, try to refresh
                await this.refreshAccessToken();
            }
        } catch (error) {
            console.error('Token validation error:', error);
            this.clearAuthData();
        }
    }

    async refreshAccessToken() {
        if (!this.refreshToken) {
            this.clearAuthData();
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken: this.refreshToken })
            });

            if (response.ok) {
                const result = await response.json();
                this.setAuthData(result.data, this.currentUser);
            } else {
                this.clearAuthData();
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            this.clearAuthData();
        }
    }

    setAuthData(tokenOrTokens, user) {
        // Handle both token object and simple token string
        if (typeof tokenOrTokens === 'object' && tokenOrTokens.accessToken) {
            this.token = tokenOrTokens.accessToken;
            this.refreshToken = tokenOrTokens.refreshToken;
        } else {
            this.token = tokenOrTokens;
        }
        
        this.currentUser = user;

        localStorage.setItem('auth_token', this.token);
        if (this.refreshToken) {
            localStorage.setItem('refresh_token', this.refreshToken);
        }
        localStorage.setItem('current_user', JSON.stringify(user));
    }

    clearAuthData() {
        this.token = null;
        this.refreshToken = null;
        this.currentUser = null;

        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('current_user');
    }

    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            // User is logged in
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (userName) userName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        } else {
            // User is not logged in
            if (authButtons) authButtons.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showLoading(formId) {
        const form = document.getElementById(formId);
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
    }

    hideLoading(formId) {
        const form = document.getElementById(formId);
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            if (formId === 'loginForm') {
                submitBtn.innerHTML = 'Sign In';
            } else if (formId === 'registerForm') {
                submitBtn.innerHTML = 'Create Account';
            }
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        // Add to body
        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            margin-left: auto;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    isAuthenticated() {
        return !!this.token && !!this.currentUser;
    }

    getAuthHeader() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Export for use in other modules
window.authManager = authManager;