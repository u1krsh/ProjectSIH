// Forum JavaScript Functionality

// Forum content database for search functionality
const forumDatabase = {
    discussions: [
        {
            id: 1,
            title: "Planning first visit to Jharkhand - need advice!",
            content: "Hey everyone! I'm planning my first trip to explore the tribal regions of Jharkhand next month. Looking for recommendations on best places to visit, authentic homestays, cultural experiences, and transportation tips. Also wondering about the weather in October and what to pack. Any suggestions for must-visit Santhal villages or Oraon communities? I'm particularly interested in traditional art forms, folk dances, and local festivals. Thanks in advance!",
            author: "Priya Sharma",
            category: "travel-tips",
            categoryName: "Travel Tips",
            replies: 23,
            views: 156,
            likes: 12,
            timestamp: "2 hours ago",
            tags: ["jharkhand", "first-visit", "santhal", "oraon", "homestays", "cultural-experience", "tribal-tourism", "advice", "planning", "folk-dance", "festivals"]
        },
        {
            id: 2,
            title: "Amazing Santhali folk dance performance last weekend",
            content: "Just witnessed the most incredible traditional dance performance in Dumka! The Santhali dancers were absolutely mesmerizing with their colorful attire and rhythmic movements. The 'Dong' dance was particularly beautiful - the way they synchronized with the drums was magical. The community was so welcoming and explained the significance of each dance form. If anyone is visiting Dumka, I highly recommend attending their weekend cultural shows. The entrance is free and they serve traditional snacks afterward. It's held every Saturday evening at the community center.",
            author: "Rajesh Kumar",
            category: "cultural-exchange",
            categoryName: "Cultural Exchange",
            replies: 18,
            views: 89,
            likes: 24,
            timestamp: "4 hours ago",
            tags: ["santhali", "folk-dance", "dumka", "dong-dance", "cultural-show", "traditional", "community", "weekend", "drums", "performance"]
        },
        {
            id: 3,
            title: "Best homestays for authentic tribal experience?",
            content: "Looking for recommendations for homestays that offer genuine cultural immersion. Has anyone stayed with Oraon families in the Ranchi area? I want to learn about their daily life, participate in farming activities, and understand their traditional practices. Budget is around 1500-2000 per night. Also interested in places where I can learn traditional crafts like bamboo weaving or pottery. Please share your experiences and contact details if possible.",
            author: "Maya Patel",
            category: "qa-help",
            categoryName: "Q&A & Help",
            replies: 31,
            views: 203,
            likes: 8,
            timestamp: "6 hours ago",
            tags: ["homestays", "oraon", "ranchi", "cultural-immersion", "farming", "traditional-crafts", "bamboo-weaving", "pottery", "authentic", "tribal-experience"]
        },
        {
            id: 4,
            title: "Sarhul festival dates 2025 - Complete schedule",
            content: "Hey fellow travelers! I've compiled the complete Sarhul festival schedule for 2025 across different regions of Jharkhand. This spring festival is celebrated by Oraon, Munda, and Ho tribes with great enthusiasm. Main dates: Ranchi region - March 15-17, Chaibasa area - March 20-22, Gumla district - March 18-20. The festival involves worship of sal trees, traditional songs, dance performances, and community feasts. Don't miss the flower decoration ceremonies and the traditional archery competitions. Best photography opportunities are during sunrise prayers and evening dance performances.",
            author: "Cultural Guide Amit",
            category: "local-events",
            categoryName: "Local Events",
            replies: 15,
            views: 245,
            likes: 34,
            timestamp: "1 hour ago",
            tags: ["sarhul", "festival", "2025", "oraon", "munda", "ho-tribe", "spring-festival", "sal-trees", "ranchi", "chaibasa", "gumla", "photography", "archery", "dance"]
        },
        {
            id: 5,
            title: "Morning mist in Betla National Park - Photo series",
            content: "Sharing some photographs from my early morning trek in Betla National Park. The mist rolling through the sal forests creates an ethereal atmosphere perfect for wildlife photography. Spotted several species including elephants, leopards, and various bird species. The tribal guides from nearby villages are incredibly knowledgeable about animal behavior and forest ecology. Best time for photography is between 6-8 AM when the light filters through the canopy. Used Canon 5D with 70-200mm lens for most shots. Planning to create a photo book featuring Jharkhand's natural beauty and tribal connections to the forest.",
            author: "Photographer Anita",
            category: "photo-sharing",
            categoryName: "Photo Stories",
            replies: 22,
            views: 167,
            likes: 45,
            timestamp: "3 hours ago",
            tags: ["betla-national-park", "photography", "morning-mist", "wildlife", "sal-forest", "elephants", "leopards", "tribal-guides", "photo-book", "canon", "nature"]
        },
        {
            id: 6,
            title: "Authentic Dokra art pieces - Where to buy?",
            content: "I'm fascinated by the traditional Dokra metal casting art form practiced by tribal artisans in Jharkhand. Looking for authentic pieces directly from artisans rather than commercial shops. Visited a few villages near Jamshedpur and found incredible craftsmanship - horses, elephants, tribal figures, and decorative items. Prices range from 200-5000 depending on size and complexity. The lost-wax technique used is thousands of years old. Can anyone recommend specific artisan families or cooperatives? Also interested in learning the technique if any workshops are available.",
            author: "Art Collector Suresh",
            category: "marketplace-discussion",
            categoryName: "Marketplace Discussion",
            replies: 19,
            views: 134,
            likes: 16,
            timestamp: "5 hours ago",
            tags: ["dokra-art", "metal-casting", "tribal-artisans", "jamshedpur", "authentic", "lost-wax", "handicrafts", "cooperatives", "workshops", "traditional-art"]
        },
        {
            id: 7,
            title: "Transport to remote tribal villages - Best options?",
            content: "Planning to visit some remote Santhal and Ho villages in East Singhbhum district. What's the best way to reach these areas? Local buses seem infrequent and private taxis are expensive. Heard about shared jeeps from Chaibasa - are they reliable? Also wondering about road conditions during monsoon season. Any local drivers or tour operators you'd recommend? Safety is important as I'm traveling solo. Looking for economical options that still provide comfort and reliability.",
            author: "Solo Traveler Deepak",
            category: "travel-tips",
            categoryName: "Travel Tips",
            replies: 28,
            views: 198,
            likes: 11,
            timestamp: "8 hours ago",
            tags: ["transport", "remote-villages", "santhal", "ho-tribe", "east-singhbhum", "chaibasa", "shared-jeeps", "monsoon", "solo-travel", "local-drivers"]
        },
        {
            id: 8,
            title: "Traditional Munda cuisine cooking workshop",
            content: "Attended an amazing cooking workshop in a Munda village near Khunti. Learned to prepare traditional dishes like 'Dhuska', 'Chilka Roti', and various rice-based preparations. The use of forest ingredients like 'Mahua' flowers and different types of wild greens was fascinating. The community women were excellent teachers, sharing not just recipes but stories behind each dish. They also taught sustainable foraging practices and the medicinal properties of various plants. Highly recommended for food enthusiasts! The workshop costs 500 per person and includes lunch.",
            author: "Food Blogger Kavita",
            category: "cultural-exchange",
            categoryName: "Cultural Exchange",
            replies: 14,
            views: 112,
            likes: 19,
            timestamp: "12 hours ago",
            tags: ["munda-cuisine", "cooking-workshop", "khunti", "dhuska", "chilka-roti", "mahua", "wild-greens", "foraging", "traditional-recipes", "food-culture"]
        },
        {
            id: 9,
            title: "Jharkhand tribal museum visit - What to expect?",
            content: "Planning to visit the Jharkhand Tribal Museum in Ranchi. Has anyone been there recently? What are the must-see exhibits? I'm particularly interested in the traditional clothing displays and musical instrument collections. Heard they have interactive sections where you can listen to folk songs and watch dance videos. Also wondering about photography rules and if they have guided tours. Are there any special exhibitions currently running? Planning to spend a full day there to understand the rich cultural heritage of the region.",
            author: "Student Researcher Pooja",
            category: "qa-help",
            categoryName: "Q&A & Help",
            replies: 12,
            views: 87,
            likes: 7,
            timestamp: "1 day ago",
            tags: ["tribal-museum", "ranchi", "exhibits", "traditional-clothing", "musical-instruments", "folk-songs", "guided-tours", "cultural-heritage", "research"]
        },
        {
            id: 10,
            title: "Bamboo craft workshop in Lohardaga - Amazing experience!",
            content: "Just returned from a 3-day bamboo craft workshop in Lohardaga district. Learned traditional basket weaving, decorative items, and even tried making a small stool! The master craftsman, Guru Suresh Oraon, has 40+ years of experience and shared incredible insights about different bamboo varieties and their uses. The community has formed a cooperative and sells products online now. Workshop fee was 2000 for 3 days including materials and meals. They also provide accommodation in the village. Planning to return next month for advanced furniture making techniques.",
            author: "Craft Enthusiast Mohan",
            category: "cultural-exchange",
            categoryName: "Cultural Exchange",
            replies: 21,
            views: 156,
            likes: 28,
            timestamp: "2 days ago",
            tags: ["bamboo-craft", "lohardaga", "basket-weaving", "workshop", "suresh-oraon", "cooperative", "traditional-skills", "furniture", "accommodation"]
        }
    ],
    
    members: [
        { name: "Priya Sharma", expertise: "Cultural Enthusiast", posts: 23, reputation: 156 },
        { name: "Rajesh Kumar", expertise: "Local Guide", posts: 45, reputation: 289 },
        { name: "Maya Patel", expertise: "Travel Blogger", posts: 34, reputation: 198 },
        { name: "Cultural Guide Amit", expertise: "Festival Expert", posts: 67, reputation: 445 },
        { name: "Photographer Anita", expertise: "Wildlife Photography", posts: 28, reputation: 234 },
        { name: "Art Collector Suresh", expertise: "Traditional Arts", posts: 19, reputation: 145 },
        { name: "Solo Traveler Deepak", expertise: "Adventure Travel", posts: 41, reputation: 267 },
        { name: "Food Blogger Kavita", expertise: "Tribal Cuisine", posts: 38, reputation: 223 },
        { name: "Student Researcher Pooja", expertise: "Cultural Research", posts: 15, reputation: 89 },
        { name: "Craft Enthusiast Mohan", expertise: "Traditional Crafts", posts: 32, reputation: 187 }
    ],
    
    categories: [
        { id: "travel-tips", name: "Travel Tips & Guides", description: "Share and discover insider tips for exploring Jharkhand's tribal regions" },
        { id: "cultural-exchange", name: "Cultural Exchange", description: "Connect with tribal communities and learn about their rich traditions" },
        { id: "local-events", name: "Local Events & Festivals", description: "Stay updated on upcoming cultural events and community gatherings" },
        { id: "qa-help", name: "Q&A & Help", description: "Get answers from experienced travelers and local guides" },
        { id: "photo-sharing", name: "Photo Stories", description: "Share your visual journey through Jharkhand's tribal landscapes" },
        { id: "marketplace-discussion", name: "Marketplace Discussion", description: "Discuss authentic tribal crafts, artwork, and local products" }
    ]
};

// Initialize all forum features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCounterAnimations();
    initializeSearchFunctionality();
    initializeCategoryCards();
    initializeDiscussionThreads();
    initializeEngagementButtons();
    initializeHeroAnimations();
});

// Animate counter numbers in hero section
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer to trigger animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Enhanced search functionality
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Add live search suggestions
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    
    // Add loading state
    const originalText = searchBtn.innerHTML;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    searchBtn.disabled = true;
    
    // Perform actual search
    setTimeout(() => {
        const results = searchForumContent(query);
        searchBtn.innerHTML = originalText;
        searchBtn.disabled = false;
        
        // Show search results
        showSearchResults(query, results);
    }, 800);
}

// Search functionality
function searchForumContent(query) {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    const results = {
        discussions: [],
        members: [],
        categories: []
    };
    
    // Search discussions
    forumDatabase.discussions.forEach(discussion => {
        let score = 0;
        const searchableText = (discussion.title + ' ' + discussion.content + ' ' + discussion.tags.join(' ')).toLowerCase();
        
        searchTerms.forEach(term => {
            // Title matches get higher score
            if (discussion.title.toLowerCase().includes(term)) {
                score += 10;
            }
            // Content matches
            if (discussion.content.toLowerCase().includes(term)) {
                score += 5;
            }
            // Tag matches
            if (discussion.tags.some(tag => tag.includes(term))) {
                score += 7;
            }
            // Author matches
            if (discussion.author.toLowerCase().includes(term)) {
                score += 3;
            }
            // Category matches
            if (discussion.categoryName.toLowerCase().includes(term)) {
                score += 4;
            }
        });
        
        if (score > 0) {
            results.discussions.push({ ...discussion, score });
        }
    });
    
    // Sort discussions by relevance score
    results.discussions.sort((a, b) => b.score - a.score);
    
    // Search members
    forumDatabase.members.forEach(member => {
        let score = 0;
        searchTerms.forEach(term => {
            if (member.name.toLowerCase().includes(term)) {
                score += 10;
            }
            if (member.expertise.toLowerCase().includes(term)) {
                score += 7;
            }
        });
        
        if (score > 0) {
            results.members.push({ ...member, score });
        }
    });
    
    // Sort members by relevance score
    results.members.sort((a, b) => b.score - a.score);
    
    // Search categories
    forumDatabase.categories.forEach(category => {
        let score = 0;
        searchTerms.forEach(term => {
            if (category.name.toLowerCase().includes(term)) {
                score += 10;
            }
            if (category.description.toLowerCase().includes(term)) {
                score += 5;
            }
        });
        
        if (score > 0) {
            results.categories.push({ ...category, score });
        }
    });
    
    // Sort categories by relevance score
    results.categories.sort((a, b) => b.score - a.score);
    
    return results;
}

function showSearchSuggestions(query) {
    const searchContainer = document.querySelector('.search-input-container');
    
    // Remove existing suggestions
    const existingSuggestions = document.querySelector('.search-suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
    
    // Get quick results
    const results = searchForumContent(query);
    const topDiscussions = results.discussions.slice(0, 3);
    const topMembers = results.members.slice(0, 2);
    
    if (topDiscussions.length === 0 && topMembers.length === 0) {
        return;
    }
    
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    
    let suggestionsHTML = '<div class="suggestions-content">';
    
    if (topDiscussions.length > 0) {
        suggestionsHTML += '<div class="suggestion-section"><h4>Discussions</h4>';
        topDiscussions.forEach(discussion => {
            suggestionsHTML += `
                <div class="suggestion-item" data-type="discussion" data-id="${discussion.id}">
                    <i class="fas fa-comments"></i>
                    <span class="suggestion-text">${discussion.title}</span>
                    <span class="suggestion-meta">${discussion.replies} replies</span>
                </div>
            `;
        });
        suggestionsHTML += '</div>';
    }
    
    if (topMembers.length > 0) {
        suggestionsHTML += '<div class="suggestion-section"><h4>Members</h4>';
        topMembers.forEach(member => {
            suggestionsHTML += `
                <div class="suggestion-item" data-type="member" data-name="${member.name}">
                    <i class="fas fa-user"></i>
                    <span class="suggestion-text">${member.name}</span>
                    <span class="suggestion-meta">${member.expertise}</span>
                </div>
            `;
        });
        suggestionsHTML += '</div>';
    }
    
    suggestionsHTML += '</div>';
    suggestionsContainer.innerHTML = suggestionsHTML;
    
    // Position suggestions below search container
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(suggestionsContainer);
    
    // Add click handlers for suggestions
    suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            if (type === 'discussion') {
                const discussionId = this.getAttribute('data-id');
                showThreadDetails(discussionId);
            } else if (type === 'member') {
                const memberName = this.getAttribute('data-name');
                showMemberProfile(memberName);
            }
            hideSearchSuggestions();
        });
    });
}

function hideSearchSuggestions() {
    const suggestions = document.querySelector('.search-suggestions');
    if (suggestions) {
        suggestions.remove();
    }
}

function showSearchResults(query, results) {
    const totalResults = results.discussions.length + results.members.length + results.categories.length;
    
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results-overlay';
    
    let resultsHTML = `
        <div class="search-results-container">
            <div class="search-results-header">
                <h3>Search Results for "${query}"</h3>
                <span class="results-count">${totalResults} results found</span>
                <button class="close-results">&times;</button>
            </div>
            <div class="search-results-content">
    `;
    
    if (totalResults === 0) {
        resultsHTML += `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h4>No results found</h4>
                <p>Try different keywords or check your spelling.</p>
                <div class="search-suggestions-help">
                    <h5>Search tips:</h5>
                    <ul>
                        <li>Try broader terms like "tribal", "festival", or "craft"</li>
                        <li>Search for places like "Ranchi", "Dumka", or "Chaibasa"</li>
                        <li>Look for activities like "dance", "food", or "photography"</li>
                    </ul>
                </div>
            </div>
        `;
    } else {
        // Show discussions
        if (results.discussions.length > 0) {
            resultsHTML += '<div class="results-section"><h4><i class="fas fa-comments"></i> Discussions</h4>';
            results.discussions.slice(0, 5).forEach(discussion => {
                const excerpt = discussion.content.substring(0, 150) + '...';
                resultsHTML += `
                    <div class="result-item discussion-result" data-discussion-id="${discussion.id}">
                        <div class="result-header">
                            <h5>${highlightSearchTerms(discussion.title, query)}</h5>
                            <span class="result-category">${discussion.categoryName}</span>
                        </div>
                        <p class="result-excerpt">${highlightSearchTerms(excerpt, query)}</p>
                        <div class="result-meta">
                            <span><i class="fas fa-user"></i> ${discussion.author}</span>
                            <span><i class="fas fa-comments"></i> ${discussion.replies} replies</span>
                            <span><i class="fas fa-eye"></i> ${discussion.views} views</span>
                            <span><i class="fas fa-clock"></i> ${discussion.timestamp}</span>
                        </div>
                    </div>
                `;
            });
            resultsHTML += '</div>';
        }
        
        // Show members
        if (results.members.length > 0) {
            resultsHTML += '<div class="results-section"><h4><i class="fas fa-users"></i> Members</h4>';
            results.members.slice(0, 3).forEach(member => {
                resultsHTML += `
                    <div class="result-item member-result" data-member-name="${member.name}">
                        <div class="member-result-content">
                            <h5>${highlightSearchTerms(member.name, query)}</h5>
                            <p>${highlightSearchTerms(member.expertise, query)}</p>
                            <div class="member-stats">
                                <span><i class="fas fa-edit"></i> ${member.posts} posts</span>
                                <span><i class="fas fa-star"></i> ${member.reputation} reputation</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            resultsHTML += '</div>';
        }
        
        // Show categories
        if (results.categories.length > 0) {
            resultsHTML += '<div class="results-section"><h4><i class="fas fa-folder"></i> Categories</h4>';
            results.categories.forEach(category => {
                resultsHTML += `
                    <div class="result-item category-result" data-category-id="${category.id}">
                        <h5>${highlightSearchTerms(category.name, query)}</h5>
                        <p>${highlightSearchTerms(category.description, query)}</p>
                    </div>
                `;
            });
            resultsHTML += '</div>';
        }
    }
    
    resultsHTML += '</div></div>';
    resultsContainer.innerHTML = resultsHTML;
    
    document.body.appendChild(resultsContainer);
    
    // Add event listeners
    resultsContainer.querySelector('.close-results').addEventListener('click', function() {
        resultsContainer.remove();
    });
    
    // Click handlers for results
    resultsContainer.querySelectorAll('.discussion-result').forEach(item => {
        item.addEventListener('click', function() {
            const discussionId = this.getAttribute('data-discussion-id');
            showThreadDetails(discussionId);
            resultsContainer.remove();
        });
    });
    
    resultsContainer.querySelectorAll('.member-result').forEach(item => {
        item.addEventListener('click', function() {
            const memberName = this.getAttribute('data-member-name');
            showMemberProfile(memberName);
            resultsContainer.remove();
        });
    });
    
    resultsContainer.querySelectorAll('.category-result').forEach(item => {
        item.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category-id');
            showCategoryPage(categoryId);
            resultsContainer.remove();
        });
    });
    
    // Close on outside click
    resultsContainer.addEventListener('click', function(e) {
        if (e.target === resultsContainer) {
            resultsContainer.remove();
        }
    });
}

function highlightSearchTerms(text, query) {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    let highlightedText = text;
    
    searchTerms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    
    return highlightedText;
}

function showMemberProfile(memberName) {
    const member = forumDatabase.members.find(m => m.name === memberName);
    if (!member) return;
    
    const modal = document.createElement('div');
    modal.className = 'member-profile-modal-overlay';
    modal.innerHTML = `
        <div class="member-profile-modal">
            <div class="modal-header">
                <h2>${member.name}</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-content">
                <div class="member-profile-content">
                    <div class="member-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="member-details">
                        <h3>${member.expertise}</h3>
                        <div class="member-stats-detailed">
                            <div class="stat-item">
                                <span class="stat-value">${member.posts}</span>
                                <span class="stat-label">Posts</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${member.reputation}</span>
                                <span class="stat-label">Reputation</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">Active</span>
                                <span class="stat-label">Status</span>
                            </div>
                        </div>
                        <div class="member-recent-posts">
                            <h4>Recent Posts</h4>
                            <div class="recent-posts-list">
                                ${forumDatabase.discussions
                                    .filter(d => d.author === memberName)
                                    .slice(0, 3)
                                    .map(d => `
                                        <div class="recent-post-item">
                                            <h5>${d.title}</h5>
                                            <span class="post-category">${d.categoryName}</span>
                                            <span class="post-time">${d.timestamp}</span>
                                        </div>
                                    `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Category card interactions
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            console.log('Navigating to category:', category);
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Simulate navigation to category
            showCategoryPage(category);
        });
        
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            // TODO: Add subtle hover sound effect
        });
    });
}

function showCategoryPage(category) {
    // Create modal or overlay for category view
    const modal = document.createElement('div');
    modal.className = 'category-modal-overlay';
    modal.innerHTML = `
        <div class="category-modal">
            <div class="category-modal-header">
                <h2>${formatCategoryName(category)}</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="category-modal-content">
                <p>This would show all discussions in the ${formatCategoryName(category)} category.</p>
                <p>Features would include:</p>
                <ul>
                    <li>List of all discussions in this category</li>
                    <li>Sorting options (newest, most popular, etc.)</li>
                    <li>Filtering options</li>
                    <li>Create new discussion button</li>
                </ul>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function formatCategoryName(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Discussion thread interactions
function initializeDiscussionThreads() {
    const discussionThreads = document.querySelectorAll('.discussion-thread');
    
    discussionThreads.forEach(thread => {
        thread.addEventListener('click', function(e) {
            // Don't trigger if clicking on engagement buttons
            if (e.target.closest('.thread-engagement')) return;
            
            const threadId = this.getAttribute('data-thread-id');
            console.log('Opening thread:', threadId);
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show thread details
            showThreadDetails(threadId);
        });
    });
}

function showThreadDetails(threadId) {
    const discussion = forumDatabase.discussions.find(d => d.id == threadId);
    if (!discussion) return;
    
    const modal = document.createElement('div');
    modal.className = 'thread-modal-overlay';
    modal.innerHTML = `
        <div class="thread-modal">
            <div class="thread-modal-header">
                <div class="thread-header-content">
                    <h2>${discussion.title}</h2>
                    <div class="thread-meta-header">
                        <span class="thread-category">${discussion.categoryName}</span>
                        <span class="thread-author">by ${discussion.author}</span>
                        <span class="thread-time">${discussion.timestamp}</span>
                    </div>
                </div>
                <button class="close-modal">&times;</button>
            </div>
            <div class="thread-modal-content">
                <div class="thread-main-post">
                    <div class="post-content">
                        <p>${discussion.content}</p>
                    </div>
                    <div class="post-tags">
                        ${discussion.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                    <div class="post-engagement">
                        <button class="engagement-btn like-btn ${Math.random() > 0.7 ? 'active' : ''}">
                            <i class="fas fa-heart"></i> ${discussion.likes}
                        </button>
                        <button class="engagement-btn bookmark-btn ${Math.random() > 0.8 ? 'active' : ''}">
                            <i class="fas fa-bookmark"></i> Bookmark
                        </button>
                        <button class="engagement-btn share-btn">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
                
                <div class="thread-stats">
                    <div class="stats-row">
                        <span><i class="fas fa-comments"></i> ${discussion.replies} replies</span>
                        <span><i class="fas fa-eye"></i> ${discussion.views} views</span>
                        <span><i class="fas fa-heart"></i> ${discussion.likes} likes</span>
                    </div>
                </div>
                
                <div class="thread-replies">
                    <h3>Replies (${discussion.replies})</h3>
                    <div class="replies-list">
                        ${generateSampleReplies(discussion.id).map(reply => `
                            <div class="reply-item">
                                <div class="reply-avatar">
                                    <img src="https://images.unsplash.com/photo-${reply.avatar}?w=40&h=40&fit=crop&crop=face" alt="User">
                                </div>
                                <div class="reply-content">
                                    <div class="reply-header">
                                        <strong>${reply.author}</strong>
                                        <span class="reply-time">${reply.time}</span>
                                    </div>
                                    <p>${reply.content}</p>
                                    <div class="reply-actions">
                                        <button class="reply-action-btn">
                                            <i class="fas fa-heart"></i> ${reply.likes}
                                        </button>
                                        <button class="reply-action-btn">
                                            <i class="fas fa-reply"></i> Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="new-reply-section">
                    <h4>Add your reply</h4>
                    <div class="reply-form">
                        <textarea class="reply-textarea" placeholder="Share your thoughts or experiences..."></textarea>
                        <div class="reply-form-actions">
                            <button class="btn btn-secondary">Cancel</button>
                            <button class="btn btn-primary">Post Reply</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Engagement button handlers
    modal.querySelectorAll('.like-btn, .bookmark-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            
            if (this.classList.contains('like-btn')) {
                const countSpan = this.childNodes[2]; // The text node after the icon
                let count = parseInt(countSpan.textContent.trim());
                if (this.classList.contains('active')) {
                    count++;
                } else {
                    count--;
                }
                countSpan.textContent = ` ${count}`;
            }
        });
    });
}

function generateSampleReplies(discussionId) {
    const sampleReplies = [
        {
            author: "Amit Singh",
            content: "Great question! I've been to several Santhal villages and the experience was incredible. The community in Dumka is particularly welcoming.",
            time: "2 hours ago",
            likes: 5,
            avatar: "1472099645785-5658abf4ff4e"
        },
        {
            author: "Sunita Devi",
            content: "For homestays, I recommend contacting the Jharkhand Tourism office. They have a verified list of authentic tribal homestays.",
            time: "4 hours ago",
            likes: 8,
            avatar: "1494790108755-2616b612b5bb"
        },
        {
            author: "Cultural Guide Ravi",
            content: "October is perfect timing! The weather is pleasant and many festivals happen during this period. Don't miss the post-harvest celebrations.",
            time: "6 hours ago",
            likes: 12,
            avatar: "1507003211169-0a1dd7228f2d"
        }
    ];
    
    return sampleReplies.slice(0, Math.min(3, Math.floor(Math.random() * 4) + 1));
}

// Engagement button functionality
function initializeEngagementButtons() {
    const likeButtons = document.querySelectorAll('.like-btn');
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isActive = this.classList.contains('active');
            const countSpan = this.querySelector('span');
            let count = parseInt(countSpan.textContent);
            
            if (isActive) {
                this.classList.remove('active');
                count--;
                // Add unlike animation
                this.style.animation = 'unlikeAnimation 0.3s ease';
            } else {
                this.classList.add('active');
                count++;
                // Add like animation
                this.style.animation = 'likeAnimation 0.3s ease';
            }
            
            countSpan.textContent = count;
            
            // Remove animation class after completion
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
    
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                this.classList.remove('active');
                this.style.animation = 'unbookmarkAnimation 0.3s ease';
            } else {
                this.classList.add('active');
                this.style.animation = 'bookmarkAnimation 0.3s ease';
            }
            
            // Remove animation class after completion
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
}

// Hero section animations
function initializeHeroAnimations() {
    const startDiscussionBtn = document.querySelector('.start-discussion-btn');
    const browseTopicsBtn = document.querySelector('.browse-topics-btn');
    
    if (startDiscussionBtn) {
        startDiscussionBtn.addEventListener('click', function() {
            console.log('Start new discussion clicked');
            showNewDiscussionModal();
        });
    }
    
    if (browseTopicsBtn) {
        browseTopicsBtn.addEventListener('click', function() {
            console.log('Browse topics clicked');
            // Smooth scroll to categories section
            document.querySelector('.forum-categories-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Add floating elements animation
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.addEventListener('mouseover', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(1.2) translateY(-10px)';
            this.style.opacity = '0.3';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.animation = `float 6s ease-in-out infinite ${index * 2}s`;
            this.style.transform = '';
            this.style.opacity = '0.1';
        });
    });
}

function showNewDiscussionModal() {
    const modal = document.createElement('div');
    modal.className = 'new-discussion-modal-overlay';
    modal.innerHTML = `
        <div class="new-discussion-modal">
            <div class="modal-header">
                <h2>Start New Discussion</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-content">
                <form class="new-discussion-form">
                    <div class="form-group">
                        <label for="discussion-title">Discussion Title</label>
                        <input type="text" id="discussion-title" placeholder="What would you like to discuss?" required>
                    </div>
                    <div class="form-group">
                        <label for="discussion-category">Category</label>
                        <select id="discussion-category" required>
                            <option value="">Select a category</option>
                            <option value="travel-tips">Travel Tips & Guides</option>
                            <option value="cultural-exchange">Cultural Exchange</option>
                            <option value="local-events">Local Events & Festivals</option>
                            <option value="qa-help">Q&A & Help</option>
                            <option value="photo-sharing">Photo Stories</option>
                            <option value="marketplace-discussion">Marketplace Discussion</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="discussion-content">Your Message</label>
                        <textarea id="discussion-content" rows="6" placeholder="Share your thoughts, questions, or experiences..." required></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary submit-btn">Post Discussion</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.remove();
    });
    
    modal.querySelector('.cancel-btn').addEventListener('click', function() {
        modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Handle form submission
    modal.querySelector('.new-discussion-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('discussion-title').value;
        const category = document.getElementById('discussion-category').value;
        const content = document.getElementById('discussion-content').value;
        
        console.log('New discussion:', { title, category, content });
        
        // Show success message
        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Posted!';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            modal.remove();
        }, 1500);
    });
}

// Add CSS for animations and modals
const style = document.createElement('style');
style.textContent = `
    /* Search Suggestions */
    .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 0 0 15px 15px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 100;
        border-top: 1px solid #e9ecef;
        animation: slideDown 0.3s ease;
    }
    
    .suggestions-content {
        padding: 1rem;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .suggestion-section {
        margin-bottom: 1rem;
    }
    
    .suggestion-section:last-child {
        margin-bottom: 0;
    }
    
    .suggestion-section h4 {
        font-size: 0.9rem;
        font-weight: 600;
        color: #1B4D3E;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .suggestion-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .suggestion-item:hover {
        background: #f8f9fa;
    }
    
    .suggestion-item i {
        color: #1B4D3E;
        width: 16px;
    }
    
    .suggestion-text {
        flex: 1;
        font-size: 0.9rem;
        color: #495057;
    }
    
    .suggestion-meta {
        font-size: 0.8rem;
        color: #6c757d;
    }
    
    /* Search Results Overlay */
    .search-results-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    .search-results-container {
        background: white;
        border-radius: 15px;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    }
    
    .search-results-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .results-count {
        color: #6c757d;
        font-size: 0.9rem;
    }
    
    .search-results-content {
        padding: 1.5rem;
    }
    
    .close-results {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6c757d;
    }
    
    /* Search Results Sections */
    .results-section {
        margin-bottom: 2rem;
    }
    
    .results-section:last-child {
        margin-bottom: 0;
    }
    
    .results-section h4 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1B4D3E;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .result-item {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 1.25rem;
        margin-bottom: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid #e9ecef;
    }
    
    .result-item:hover {
        background: white;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }
    
    .result-item:last-child {
        margin-bottom: 0;
    }
    
    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.5rem;
        gap: 1rem;
    }
    
    .result-header h5 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1B4D3E;
        margin: 0;
        line-height: 1.4;
    }
    
    .result-category {
        background: linear-gradient(135deg, #1B4D3E, #2a5f4a);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        white-space: nowrap;
    }
    
    .result-excerpt {
        color: #495057;
        line-height: 1.5;
        margin-bottom: 1rem;
        font-size: 0.95rem;
    }
    
    .result-meta {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        font-size: 0.85rem;
        color: #6c757d;
    }
    
    .result-meta span {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    /* Member Results */
    .member-result-content h5 {
        margin-bottom: 0.25rem;
    }
    
    .member-result-content p {
        color: #6c757d;
        margin-bottom: 0.75rem;
        font-size: 0.95rem;
    }
    
    .member-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.85rem;
        color: #495057;
    }
    
    .member-stats span {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    /* Search highlighting */
    mark {
        background: linear-gradient(135deg, #FF6B35, #ff8555);
        color: white;
        padding: 0.1rem 0.25rem;
        border-radius: 3px;
        font-weight: 500;
    }
    
    /* No results */
    .no-results {
        text-align: center;
        padding: 3rem 2rem;
        color: #6c757d;
    }
    
    .no-results i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .no-results h4 {
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
        color: #495057;
    }
    
    .search-suggestions-help {
        margin-top: 2rem;
        text-align: left;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .search-suggestions-help h5 {
        font-size: 1rem;
        margin-bottom: 0.75rem;
        color: #1B4D3E;
    }
    
    .search-suggestions-help ul {
        list-style: none;
        padding: 0;
    }
    
    .search-suggestions-help li {
        padding: 0.25rem 0;
        font-size: 0.9rem;
        position: relative;
        padding-left: 1rem;
    }
    
    .search-suggestions-help li::before {
        content: "•";
        color: #FF6B35;
        position: absolute;
        left: 0;
    }
    
    /* Modal Overlays */
    .category-modal-overlay,
    .thread-modal-overlay,
    .new-discussion-modal-overlay,
    .member-profile-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    .category-modal,
    .thread-modal,
    .new-discussion-modal,
    .member-profile-modal {
        background: white;
        border-radius: 15px;
        max-width: 800px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    }
    
    .category-modal-header,
    .thread-modal-header,
    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    
    .category-modal-content,
    .thread-modal-content,
    .modal-content {
        padding: 1.5rem;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6c757d;
        flex-shrink: 0;
        margin-left: 1rem;
    }
    
    /* Thread Modal Specific */
    .thread-header-content {
        flex: 1;
    }
    
    .thread-header-content h2 {
        margin: 0 0 0.5rem 0;
        color: #1B4D3E;
        line-height: 1.3;
    }
    
    .thread-meta-header {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        font-size: 0.9rem;
        color: #6c757d;
    }
    
    .thread-category {
        background: linear-gradient(135deg, #1B4D3E, #2a5f4a);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .thread-main-post {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .post-content p {
        line-height: 1.6;
        color: #495057;
        margin-bottom: 1.5rem;
    }
    
    .post-tags {
        margin-bottom: 1.5rem;
    }
    
    .tag {
        display: inline-block;
        background: #e9ecef;
        color: #495057;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    .post-engagement {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }
    
    .engagement-btn {
        background: none;
        border: 1px solid #e9ecef;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: #6c757d;
    }
    
    .engagement-btn:hover {
        border-color: #1B4D3E;
        color: #1B4D3E;
    }
    
    .engagement-btn.active {
        background: #1B4D3E;
        color: white;
        border-color: #1B4D3E;
    }
    
    .like-btn.active {
        background: #dc3545;
        border-color: #dc3545;
    }
    
    .bookmark-btn.active {
        background: #ffc107;
        border-color: #ffc107;
        color: #000;
    }
    
    .thread-stats {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 2rem;
    }
    
    .stats-row {
        display: flex;
        gap: 2rem;
        justify-content: center;
        font-size: 0.9rem;
        color: #6c757d;
    }
    
    .stats-row span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .thread-replies h3 {
        color: #1B4D3E;
        margin-bottom: 1.5rem;
        font-size: 1.3rem;
    }
    
    .reply-item {
        display: flex;
        gap: 1rem;
        padding: 1.25rem;
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 10px;
        margin-bottom: 1rem;
    }
    
    .reply-avatar img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .reply-content {
        flex: 1;
    }
    
    .reply-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.5rem;
    }
    
    .reply-header strong {
        color: #1B4D3E;
    }
    
    .reply-time {
        font-size: 0.85rem;
        color: #6c757d;
    }
    
    .reply-content p {
        color: #495057;
        line-height: 1.5;
        margin-bottom: 0.75rem;
    }
    
    .reply-actions {
        display: flex;
        gap: 0.75rem;
    }
    
    .reply-action-btn {
        background: none;
        border: none;
        color: #6c757d;
        cursor: pointer;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    
    .reply-action-btn:hover {
        background: #f8f9fa;
        color: #1B4D3E;
    }
    
    .new-reply-section {
        border-top: 2px solid #e9ecef;
        padding-top: 2rem;
        margin-top: 2rem;
    }
    
    .new-reply-section h4 {
        color: #1B4D3E;
        margin-bottom: 1rem;
    }
    
    .reply-textarea {
        width: 100%;
        min-height: 100px;
        padding: 1rem;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        resize: vertical;
        font-family: inherit;
        font-size: 0.95rem;
        margin-bottom: 1rem;
    }
    
    .reply-form-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
    }
    
    /* Member Profile Modal */
    .member-profile-content {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
    }
    
    .member-avatar {
        flex-shrink: 0;
    }
    
    .member-avatar i {
        font-size: 4rem;
        color: #1B4D3E;
    }
    
    .member-details {
        flex: 1;
    }
    
    .member-details h3 {
        color: #6c757d;
        font-size: 1.1rem;
        margin-bottom: 1rem;
        font-weight: 500;
    }
    
    .member-stats-detailed {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 10px;
    }
    
    .member-stats-detailed .stat-item {
        text-align: center;
    }
    
    .member-stats-detailed .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1B4D3E;
        display: block;
    }
    
    .member-stats-detailed .stat-label {
        font-size: 0.85rem;
        color: #6c757d;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .member-recent-posts h4 {
        color: #1B4D3E;
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
    
    .recent-post-item {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 0.75rem;
    }
    
    .recent-post-item h5 {
        color: #1B4D3E;
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }
    
    .post-category {
        background: linear-gradient(135deg, #1B4D3E, #2a5f4a);
        color: white;
        padding: 0.2rem 0.6rem;
        border-radius: 10px;
        font-size: 0.75rem;
        margin-right: 0.75rem;
    }
    
    .post-time {
        color: #6c757d;
        font-size: 0.8rem;
    }
    
    /* New Discussion Form */
    .new-discussion-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .form-group label {
        font-weight: 600;
        color: #1B4D3E;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 0.75rem;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        font-size: 1rem;
    }
    
    .form-group textarea {
        resize: vertical;
        min-height: 120px;
    }
    
    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    
    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes likeAnimation {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes unlikeAnimation {
        0% { transform: scale(1); }
        50% { transform: scale(0.8); }
        100% { transform: scale(1); }
    }
    
    @keyframes bookmarkAnimation {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.2) rotate(5deg); }
        100% { transform: scale(1) rotate(0deg); }
    }
    
    @keyframes unbookmarkAnimation {
        0% { transform: scale(1); }
        50% { transform: scale(0.8); }
        100% { transform: scale(1); }
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .community-stats {
            flex-direction: column;
            gap: 1rem;
        }
        
        .stat-divider {
            width: 100%;
            height: 1px;
        }
        
        .hero-actions {
            flex-direction: column;
        }
        
        .search-input-container {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
        }
        
        .search-btn {
            margin-left: 0;
            margin-top: 1rem;
        }
        
        .discussion-thread {
            flex-direction: column;
            align-items: stretch;
        }
        
        .thread-engagement {
            flex-direction: row;
            justify-content: flex-end;
        }
        
        .highlights-grid {
            grid-template-columns: 1fr;
        }
        
        .stats-grid {
            grid-template-columns: 1fr;
        }
        
        /* Search Results Mobile */
        .search-results-container {
            max-width: 95%;
            max-height: 90vh;
        }
        
        .result-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
        
        .result-meta {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .thread-modal,
        .member-profile-modal {
            max-width: 95%;
            max-height: 90vh;
        }
        
        .thread-meta-header {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .member-profile-content {
            flex-direction: column;
            gap: 1rem;
        }
        
        .member-stats-detailed {
            flex-direction: column;
            gap: 1rem;
        }
        
        .stats-row {
            flex-direction: column;
            gap: 1rem;
        }
        
        .post-engagement {
            flex-wrap: wrap;
        }
        
        .reply-item {
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .suggestions-content {
            max-height: 250px;
        }
        
        .suggestion-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
    
    @media (max-width: 480px) {
        .search-results-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
        
        .close-results {
            align-self: flex-end;
        }
        
        .result-item {
            padding: 1rem;
        }
        
        .thread-modal-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .close-modal {
            margin-left: 0;
            align-self: flex-end;
        }
    }
`;

document.head.appendChild(style);