// Interactive Map Implementation for Tribal Trails
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
            },
            // JAMSHEDPUR AND SURROUNDING AREAS
            {
                id: 9,
                name: "Jamshedpur - Tata Steel City",
                type: "cultural",
                coordinates: [22.8046, 86.2029],
                description: "India's first planned industrial city with beautiful parks and lakes",
                images: ["assets/images/jamshedpur-1.jpg", "assets/images/jamshedpur-2.jpg"],
                rating: 4.4,
                visitors: "200k+",
                bestTime: "Oct - Mar",
                activities: ["City Tour", "Industrial Heritage", "Lake Activities"],
                facilities: ["Hotels", "Restaurants", "Shopping Malls"],
                entryFee: "Free",
                timings: "24 hours",
                phone: "+91-657-2345678",
                website: "https://jharkhandtourism.gov.in/jamshedpur"
            },
            {
                id: 10,
                name: "Jubilee Park, Jamshedpur",
                type: "cultural",
                coordinates: [22.7996, 86.1844],
                description: "Beautiful urban park with rose garden, zoo and lake",
                images: ["assets/images/jubilee-park-1.jpg", "assets/images/jubilee-park-2.jpg"],
                rating: 4.5,
                visitors: "150k+",
                bestTime: "Nov - Feb",
                activities: ["Boating", "Zoo Visit", "Garden Walk", "Photography"],
                facilities: ["Zoo", "Boating", "Cafeteria", "Parking"],
                entryFee: "₹20 per person, Zoo: ₹10 extra",
                timings: "6:00 AM - 8:00 PM",
                phone: "+91-657-2234567",
                website: "https://jharkhandtourism.gov.in/jubilee-park"
            },
            {
                id: 11,
                name: "Tata Steel Zoological Park",
                type: "wildlife",
                coordinates: [22.7884, 86.1473],
                description: "One of the finest zoos in eastern India with diverse species",
                images: ["assets/images/tata-zoo-1.jpg", "assets/images/tata-zoo-2.jpg"],
                rating: 4.6,
                visitors: "180k+",
                bestTime: "Oct - Mar",
                activities: ["Zoo Safari", "Animal Shows", "Photography", "Education"],
                facilities: ["Safari Rides", "Cafeteria", "Gift Shop", "First Aid"],
                entryFee: "₹30 (Adults), ₹15 (Children)",
                timings: "9:00 AM - 5:00 PM",
                phone: "+91-657-2445566",
                website: "https://tatasteel.com/zoo"
            },
            {
                id: 12,
                name: "Dimna Lake, Jamshedpur",
                type: "natural",
                coordinates: [22.7710, 86.0965],
                description: "Serene artificial lake perfect for water sports and picnics",
                images: ["assets/images/dimna-lake-1.jpg", "assets/images/dimna-lake-2.jpg"],
                rating: 4.4,
                visitors: "120k+",
                bestTime: "Oct - Apr",
                activities: ["Boating", "Water Sports", "Fishing", "Picnicking"],
                facilities: ["Boat Club", "Restaurants", "Water Sports", "Parking"],
                entryFee: "₹25 per person",
                timings: "8:00 AM - 6:00 PM",
                phone: "+91-657-2556677",
                website: "https://jharkhandtourism.gov.in/dimna-lake"
            },
            // DHANBAD REGION
            {
                id: 13,
                name: "Dhanbad - Coal Capital",
                type: "cultural",
                coordinates: [23.7957, 86.4304],
                description: "Coal mining hub with industrial heritage and natural beauty",
                images: ["assets/images/dhanbad-1.jpg", "assets/images/dhanbad-2.jpg"],
                rating: 4.1,
                visitors: "85k+",
                bestTime: "Nov - Mar",
                activities: ["Industrial Tour", "Mining Heritage", "Local Culture"],
                facilities: ["Hotels", "Restaurants", "Transportation"],
                entryFee: "Free",
                timings: "24 hours",
                phone: "+91-326-2345678",
                website: "https://jharkhandtourism.gov.in/dhanbad"
            },
            {
                id: 14,
                name: "Maithon Dam",
                type: "natural",
                coordinates: [23.8668, 86.8447],
                description: "Scenic dam with beautiful reservoir and boating facilities",
                images: ["assets/images/maithon-dam-1.jpg", "assets/images/maithon-dam-2.jpg"],
                rating: 4.3,
                visitors: "95k+",
                bestTime: "Oct - Apr",
                activities: ["Boating", "Fishing", "Photography", "Picnicking"],
                facilities: ["Boat Club", "Guest House", "Restaurants", "Parking"],
                entryFee: "₹15 per person",
                timings: "7:00 AM - 6:00 PM",
                phone: "+91-326-2667788",
                website: "https://jharkhandtourism.gov.in/maithon-dam"
            },
            // BOKARO REGION
            {
                id: 15,
                name: "Bokaro Steel City",
                type: "cultural",
                coordinates: [23.6669, 86.1511],
                description: "Modern steel city with parks, lakes and cultural centers",
                images: ["assets/images/bokaro-1.jpg", "assets/images/bokaro-2.jpg"],
                rating: 4.2,
                visitors: "110k+",
                bestTime: "Oct - Mar",
                activities: ["City Tour", "Industrial Heritage", "Cultural Programs"],
                facilities: ["Hotels", "Shopping Centers", "Restaurants", "Parks"],
                entryFee: "Free",
                timings: "24 hours",
                phone: "+91-6542-345678",
                website: "https://jharkhandtourism.gov.in/bokaro"
            },
            {
                id: 16,
                name: "Bokaro City Park",
                type: "cultural",
                coordinates: [23.6789, 86.1234],
                description: "Beautiful urban park with gardens, lake and recreational facilities",
                images: ["assets/images/bokaro-park-1.jpg", "assets/images/bokaro-park-2.jpg"],
                rating: 4.4,
                visitors: "75k+",
                bestTime: "Nov - Mar",
                activities: ["Boating", "Garden Walk", "Children's Play", "Jogging"],
                facilities: ["Boating", "Gardens", "Play Area", "Food Court"],
                entryFee: "₹10 per person",
                timings: "6:00 AM - 8:00 PM",
                phone: "+91-6542-567890",
                website: "https://jharkhandtourism.gov.in/bokaro-park"
            },
            // GIRIDIH AND MORE RELIGIOUS SITES
            {
                id: 17,
                name: "Giridih - Parasnath Hills",
                type: "religious",
                coordinates: [24.1833, 86.3000],
                description: "Sacred Jain pilgrimage site with ancient temples",
                images: ["assets/images/giridih-1.jpg", "assets/images/giridih-2.jpg"],
                rating: 4.5,
                visitors: "90k+",
                bestTime: "Oct - Mar",
                activities: ["Temple Visit", "Trekking", "Pilgrimage", "Meditation"],
                facilities: ["Dharamshala", "Restaurants", "Medical Aid", "Parking"],
                entryFee: "Free",
                timings: "4:00 AM - 8:00 PM",
                phone: "+91-6541-234567",
                website: "https://jharkhandtourism.gov.in/giridih"
            },
            {
                id: 18,
                name: "Usri Falls",
                type: "natural",
                coordinates: [24.0167, 86.1833],
                description: "Beautiful waterfall surrounded by hills and forests",
                images: ["assets/images/usri-falls-1.jpg", "assets/images/usri-falls-2.jpg"],
                rating: 4.3,
                visitors: "65k+",
                bestTime: "Jul - Feb",
                activities: ["Photography", "Trekking", "Nature Walk", "Picnicking"],
                facilities: ["Parking", "Food Stalls", "Rest Sheds", "Viewpoints"],
                entryFee: "₹15 per person",
                timings: "8:00 AM - 6:00 PM",
                phone: "+91-6541-345678",
                website: "https://jharkhandtourism.gov.in/usri-falls"
            },
            // KODERMA AND GAYA REGION
            {
                id: 19,
                name: "Koderma Wildlife Sanctuary",
                type: "wildlife",
                coordinates: [24.4667, 85.5833],
                description: "Home to various wildlife species and medicinal plants",
                images: ["assets/images/koderma-1.jpg", "assets/images/koderma-2.jpg"],
                rating: 4.2,
                visitors: "45k+",
                bestTime: "Nov - Apr",
                activities: ["Wildlife Safari", "Bird Watching", "Nature Photography"],
                facilities: ["Safari Vehicles", "Forest Rest House", "Canteen"],
                entryFee: "₹30 per person",
                timings: "6:00 AM - 5:00 PM",
                phone: "+91-6543-234567",
                website: "https://jharkhandtourism.gov.in/koderma"
            },
            // DUMKA REGION
            {
                id: 20,
                name: "Dumka - Santhali Culture Hub",
                type: "cultural",
                coordinates: [24.2667, 87.2500],
                description: "Rich tribal culture with traditional arts and crafts",
                images: ["assets/images/dumka-1.jpg", "assets/images/dumka-2.jpg"],
                rating: 4.3,
                visitors: "70k+",
                bestTime: "Oct - Mar",
                activities: ["Cultural Tours", "Tribal Arts", "Folk Dance", "Handicrafts"],
                facilities: ["Cultural Centers", "Handicraft Shops", "Hotels", "Restaurants"],
                entryFee: "Free",
                timings: "24 hours",
                phone: "+91-6434-345678",
                website: "https://jharkhandtourism.gov.in/dumka"
            },
            {
                id: 21,
                name: "Massanjore Dam",
                type: "natural",
                coordinates: [24.4500, 87.3167],
                description: "Large reservoir with beautiful surroundings and water activities",
                images: ["assets/images/massanjore-1.jpg", "assets/images/massanjore-2.jpg"],
                rating: 4.4,
                visitors: "85k+",
                bestTime: "Oct - Apr",
                activities: ["Boating", "Fishing", "Water Sports", "Photography"],
                facilities: ["Boat Club", "Guest House", "Restaurants", "Parking"],
                entryFee: "₹20 per person",
                timings: "7:00 AM - 6:00 PM",
                phone: "+91-6434-456789",
                website: "https://jharkhandtourism.gov.in/massanjore"
            },
            // GODDA REGION
            {
                id: 22,
                name: "Godda - Ganga River Town",
                type: "religious",
                coordinates: [24.8333, 87.2167],
                description: "Holy town on Ganga river with temples and ghats",
                images: ["assets/images/godda-1.jpg", "assets/images/godda-2.jpg"],
                rating: 4.1,
                visitors: "60k+",
                bestTime: "Oct - Mar",
                activities: ["Temple Visit", "River Bathing", "Boat Rides", "Religious Tours"],
                facilities: ["Temples", "Dharamshala", "Boat Services", "Restaurants"],
                entryFee: "Free",
                timings: "4:00 AM - 9:00 PM",
                phone: "+91-6422-234567",
                website: "https://jharkhandtourism.gov.in/godda"
            },
            // CHAIBASA REGION
            {
                id: 23,
                name: "Chaibasa - Tribal Heritage",
                type: "cultural",
                coordinates: [22.5167, 85.8000],
                description: "District headquarters with rich Ho tribal culture",
                images: ["assets/images/chaibasa-1.jpg", "assets/images/chaibasa-2.jpg"],
                rating: 4.0,
                visitors: "55k+",
                bestTime: "Nov - Mar",
                activities: ["Tribal Culture Tours", "Local Markets", "Traditional Arts"],
                facilities: ["Cultural Centers", "Markets", "Hotels", "Restaurants"],
                entryFee: "Free",
                timings: "24 hours",
                phone: "+91-6582-234567",
                website: "https://jharkhandtourism.gov.in/chaibasa"
            },
            // ADDITIONAL WATERFALLS AND NATURAL SITES
            {
                id: 24,
                name: "Jonha Falls (Gautamdhara)",
                type: "natural",
                coordinates: [23.3000, 85.6000],
                description: "Sacred waterfall with temples and natural pools",
                images: ["assets/images/jonha-falls-1.jpg", "assets/images/jonha-falls-2.jpg"],
                rating: 4.5,
                visitors: "130k+",
                bestTime: "Jul - Feb",
                activities: ["Temple Visit", "Photography", "Swimming", "Trekking"],
                facilities: ["Temples", "Parking", "Food Stalls", "Changing Rooms"],
                entryFee: "₹15 per person",
                timings: "6:00 AM - 6:00 PM",
                phone: "+91-651-3456789",
                website: "https://jharkhandtourism.gov.in/jonha-falls"
            },
            {
                id: 25,
                name: "Panchghagh Falls",
                type: "natural",
                coordinates: [23.6167, 85.4333],
                description: "Five-tiered waterfall creating natural pools and cascades",
                images: ["assets/images/panchghagh-1.jpg", "assets/images/panchghagh-2.jpg"],
                rating: 4.4,
                visitors: "95k+",
                bestTime: "Jul - Feb",
                activities: ["Photography", "Swimming", "Rock Climbing", "Picnicking"],
                facilities: ["Parking", "Food Stalls", "Rest Areas", "Viewpoints"],
                entryFee: "₹20 per person",
                timings: "7:00 AM - 6:00 PM",
                phone: "+91-651-4567890",
                website: "https://jharkhandtourism.gov.in/panchghagh"
            },
            {
                id: 26,
                name: "Lodh Falls",
                type: "natural",
                coordinates: [23.4833, 85.5167],
                description: "Highest waterfall in Jharkhand with spectacular views",
                images: ["assets/images/lodh-falls-1.jpg", "assets/images/lodh-falls-2.jpg"],
                rating: 4.6,
                visitors: "105k+",
                bestTime: "Jul - Feb",
                activities: ["Photography", "Trekking", "Nature Walk", "Adventure Sports"],
                facilities: ["Parking", "Trekking Guides", "Food Stalls", "Safety Equipment"],
                entryFee: "₹25 per person",
                timings: "7:00 AM - 5:00 PM",
                phone: "+91-651-5678901",
                website: "https://jharkhandtourism.gov.in/lodh-falls"
            },
            // TRIBAL MUSEUMS AND CULTURAL SITES
            {
                id: 27,
                name: "Tribal Research Institute Museum",
                type: "cultural",
                coordinates: [23.3667, 85.3333],
                description: "Comprehensive collection of tribal artifacts and culture",
                images: ["assets/images/tribal-museum-1.jpg", "assets/images/tribal-museum-2.jpg"],
                rating: 4.3,
                visitors: "80k+",
                bestTime: "Oct - Mar",
                activities: ["Museum Tour", "Cultural Learning", "Art Workshops", "Research"],
                facilities: ["Museum Galleries", "Library", "Gift Shop", "Auditorium"],
                entryFee: "₹20 per person",
                timings: "10:00 AM - 5:00 PM",
                phone: "+91-651-6789012",
                website: "https://jharkhandtourism.gov.in/tribal-museum"
            },
            {
                id: 28,
                name: "Tagore Hill, Ranchi",
                type: "cultural",
                coordinates: [23.3800, 85.3200],
                description: "Historic hill where Rabindranath Tagore stayed and wrote",
                images: ["assets/images/tagore-hill-1.jpg", "assets/images/tagore-hill-2.jpg"],
                rating: 4.4,
                visitors: "140k+",
                bestTime: "Oct - Mar",
                activities: ["Literary Tour", "Sunset Views", "Photography", "Cultural Programs"],
                facilities: ["Museum", "Library", "Cafeteria", "Parking"],
                entryFee: "₹10 per person",
                timings: "9:00 AM - 6:00 PM",
                phone: "+91-651-7890123",
                website: "https://jharkhandtourism.gov.in/tagore-hill"
            },
            // ADDITIONAL JAMSHEDPUR ATTRACTIONS
            {
                id: 29,
                name: "Dalma Wildlife Sanctuary",
                type: "wildlife",
                coordinates: [22.8500, 86.0333],
                description: "Famous for elephants, with trekking trails and scenic views",
                images: ["assets/images/dalma-1.jpg", "assets/images/dalma-2.jpg"],
                rating: 4.5,
                visitors: "125k+",
                bestTime: "Oct - Apr",
                activities: ["Elephant Safari", "Trekking", "Bird Watching", "Photography"],
                facilities: ["Safari Vehicles", "Trekking Guides", "Rest House", "Canteen"],
                entryFee: "₹40 per person",
                timings: "6:00 AM - 5:00 PM",
                phone: "+91-657-2778899",
                website: "https://jharkhandtourism.gov.in/dalma"
            },
            {
                id: 30,
                name: "Rankini Temple, Jamshedpur",
                type: "religious",
                coordinates: [22.8200, 86.1900],
                description: "Ancient temple dedicated to Goddess Rankini with scenic surroundings",
                images: ["assets/images/rankini-temple-1.jpg", "assets/images/rankini-temple-2.jpg"],
                rating: 4.3,
                visitors: "95k+",
                bestTime: "Oct - Mar",
                activities: ["Temple Visit", "Religious Ceremonies", "Photography", "Meditation"],
                facilities: ["Temple Complex", "Parking", "Prasad Counter", "Rest Areas"],
                entryFee: "Free",
                timings: "5:00 AM - 9:00 PM",
                phone: "+91-657-2889900",
                website: "https://jharkhandtourism.gov.in/rankini-temple"
            },
            {
                id: 31,
                name: "Keenan Stadium, Jamshedpur",
                type: "cultural",
                coordinates: [22.7900, 86.1800],
                description: "Historic football stadium and premier sports venue",
                images: ["assets/images/keenan-stadium-1.jpg", "assets/images/keenan-stadium-2.jpg"],
                rating: 4.2,
                visitors: "200k+",
                bestTime: "Nov - Mar",
                activities: ["Sports Events", "Stadium Tours", "Football Matches", "Athletic Events"],
                facilities: ["Stadium Tours", "Sports Museum", "Cafeteria", "Parking"],
                entryFee: "₹50 per person (tours)",
                timings: "9:00 AM - 5:00 PM",
                phone: "+91-657-2990011",
                website: "https://jharkhandtourism.gov.in/keenan-stadium"
            },
            // UNIQUE HERITAGE AND ADVENTURE SITES
            {
                id: 32,
                name: "McCluskieganj - Anglo-Indian Heritage",
                type: "cultural",
                coordinates: [23.6167, 84.9000],
                description: "Historic Anglo-Indian settlement with colonial architecture",
                images: ["assets/images/mccluskieganj-1.jpg", "assets/images/mccluskieganj-2.jpg"],
                rating: 4.1,
                visitors: "35k+",
                bestTime: "Nov - Mar",
                activities: ["Heritage Tours", "Colonial Architecture", "Cultural Exchange", "Photography"],
                facilities: ["Heritage Hotels", "Churches", "Community Centers", "Restaurants"],
                entryFee: "Free",
                timings: "24 hours",
                phone: "+91-651-8901234",
                website: "https://jharkhandtourism.gov.in/mccluskieganj"
            },
            {
                id: 33,
                name: "Rajrappa Temple",
                type: "religious",
                coordinates: [23.6333, 85.5167],
                description: "Ancient temple at confluence of rivers with unique architecture",
                images: ["assets/images/rajrappa-1.jpg", "assets/images/rajrappa-2.jpg"],
                rating: 4.4,
                visitors: "180k+",
                bestTime: "Oct - Mar",
                activities: ["Temple Visit", "River Confluence", "Pilgrimage", "Photography"],
                facilities: ["Temple Complex", "Dharamshala", "Parking", "Food Courts"],
                entryFee: "Free",
                timings: "4:00 AM - 10:00 PM",
                phone: "+91-651-9012345",
                website: "https://jharkhandtourism.gov.in/rajrappa"
            },
            {
                id: 34,
                name: "Birsa Munda Park, Ranchi",
                type: "cultural",
                coordinates: [23.3600, 85.3400],
                description: "Memorial park dedicated to tribal hero Birsa Munda",
                images: ["assets/images/birsa-park-1.jpg", "assets/images/birsa-park-2.jpg"],
                rating: 4.3,
                visitors: "160k+",
                bestTime: "Oct - Mar",
                activities: ["Historical Tours", "Cultural Programs", "Memorial Visit", "Gardens"],
                facilities: ["Museum", "Gardens", "Amphitheater", "Cafeteria"],
                entryFee: "₹15 per person",
                timings: "8:00 AM - 7:00 PM",
                phone: "+91-651-0123456",
                website: "https://jharkhandtourism.gov.in/birsa-park"
            },
            // MORE NATURAL ATTRACTIONS
            {
                id: 35,
                name: "Kanke Dam",
                type: "natural",
                coordinates: [23.4167, 85.3833],
                description: "Scenic dam with boating facilities and surrounding hills",
                images: ["assets/images/kanke-dam-1.jpg", "assets/images/kanke-dam-2.jpg"],
                rating: 4.2,
                visitors: "110k+",
                bestTime: "Oct - Apr",
                activities: ["Boating", "Fishing", "Photography", "Picnicking"],
                facilities: ["Boat Club", "Restaurants", "Parking", "Viewpoints"],
                entryFee: "₹20 per person",
                timings: "7:00 AM - 6:00 PM",
                phone: "+91-651-1234567",
                website: "https://jharkhandtourism.gov.in/kanke-dam"
            },
            {
                id: 36,
                name: "Getalsud Dam",
                type: "natural",
                coordinates: [23.2167, 85.2833],
                description: "Beautiful reservoir with water sports and scenic beauty",
                images: ["assets/images/getalsud-1.jpg", "assets/images/getalsud-2.jpg"],
                rating: 4.3,
                visitors: "85k+",
                bestTime: "Nov - Apr",
                activities: ["Water Sports", "Boating", "Fishing", "Photography"],
                facilities: ["Water Sports Center", "Restaurants", "Parking", "Rest Areas"],
                entryFee: "₹25 per person",
                timings: "8:00 AM - 6:00 PM",
                phone: "+91-651-2345678",
                website: "https://jharkhandtourism.gov.in/getalsud"
            },
            // INDUSTRIAL HERITAGE SITES
            {
                id: 37,
                name: "Tata Steel Plant Heritage Tour",
                type: "cultural",
                coordinates: [22.7700, 86.1400],
                description: "Guided tour of India's first steel plant with industrial heritage",
                images: ["assets/images/tata-steel-1.jpg", "assets/images/tata-steel-2.jpg"],
                rating: 4.4,
                visitors: "75k+",
                bestTime: "Oct - Mar",
                activities: ["Industrial Tours", "Heritage Walk", "Steel Making Process", "Museum Visit"],
                facilities: ["Guided Tours", "Industrial Museum", "Visitor Center", "Cafeteria"],
                entryFee: "₹100 per person (advance booking required)",
                timings: "9:00 AM - 4:00 PM (Mon-Fri)",
                phone: "+91-657-3456789",
                website: "https://tatasteel.com/heritage-tours"
            },
            {
                id: 38,
                name: "SAIL Plant, Bokaro",
                type: "cultural",
                coordinates: [23.6400, 86.1700],
                description: "Modern steel plant with educational tours and technology showcase",
                images: ["assets/images/sail-bokaro-1.jpg", "assets/images/sail-bokaro-2.jpg"],
                rating: 4.1,
                visitors: "50k+",
                bestTime: "Nov - Mar",
                activities: ["Industrial Tours", "Technology Learning", "Educational Programs"],
                facilities: ["Visitor Center", "Industrial Museum", "Guided Tours", "Cafeteria"],
                entryFee: "₹75 per person (advance booking required)",
                timings: "9:00 AM - 4:00 PM (Mon-Fri)",
                phone: "+91-6542-4567890",
                website: "https://sail.co.in/bokaro-tours"
            },
            // ADVENTURE AND SPORTS DESTINATIONS
            {
                id: 39,
                name: "Pahari Mandir, Ranchi",
                type: "religious",
                coordinates: [23.4033, 85.4167],
                description: "Hilltop temple with panoramic city views and trekking trails",
                images: ["assets/images/pahari-mandir-1.jpg", "assets/images/pahari-mandir-2.jpg"],
                rating: 4.5,
                visitors: "220k+",
                bestTime: "Oct - Mar",
                activities: ["Temple Visit", "Trekking", "City Views", "Photography"],
                facilities: ["Temple Complex", "Stairs/Steps", "Parking", "Food Stalls"],
                entryFee: "Free",
                timings: "4:00 AM - 10:00 PM",
                phone: "+91-651-5678901",
                website: "https://jharkhandtourism.gov.in/pahari-mandir"
            },
            {
                id: 40,
                name: "Raj Bhavan, Ranchi",
                type: "cultural",
                coordinates: [23.3333, 85.3167],
                description: "Official residence of Governor with beautiful gardens and architecture",
                images: ["assets/images/raj-bhavan-1.jpg", "assets/images/raj-bhavan-2.jpg"],
                rating: 4.0,
                visitors: "45k+",
                bestTime: "Nov - Feb",
                activities: ["Architectural Tour", "Garden Visit", "Photography", "Heritage Walk"],
                facilities: ["Guided Tours", "Gardens", "Museum", "Parking"],
                entryFee: "₹30 per person (prior permission required)",
                timings: "10:00 AM - 4:00 PM (Selected days)",
                phone: "+91-651-6789012",
                website: "https://jharkhandraj.nic.in"
            }
        ];
        
        this.init();
    }
    
    async init() {
        try {
            console.log('Initializing Jharkhand Map...');
            await this.createMap();
            console.log('Map created successfully');
            this.addMarkers();
            console.log('Markers added');
            this.setupEventListeners();
            console.log('Event listeners setup');
            this.addMapControls();
            console.log('Map controls added');
            await this.getUserLocation();
            console.log('Map initialization completed');
        } catch (error) {
            console.error('Error initializing map:', error);
            this.handleMapError(error);
        }
    }

    handleMapError(error) {
        const mapContainer = document.getElementById('jharkhandMap');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 400px; background: #f8f9fa; border-radius: 8px; flex-direction: column;">
                    <div style="color: #dc3545; font-size: 18px; margin-bottom: 10px;">⚠️ Map Loading Error</div>
                    <div style="color: #6c757d; font-size: 14px; text-align: center; max-width: 300px;">
                        Unable to load the interactive map. Please refresh the page or try again later.
                    </div>
                    <button onclick="location.reload()" style="margin-top: 15px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Refresh Page
                    </button>
                </div>
            `;
        }
    }
    
    async createMap() {
        // Check if Leaflet is available
        if (typeof L === 'undefined') {
            throw new Error('Leaflet library not loaded');
        }

        // Check if map container exists
        const mapContainer = document.getElementById('jharkhandMap');
        if (!mapContainer) {
            throw new Error('Map container not found');
        }

        // Ensure container has dimensions
        mapContainer.style.height = '600px';
        mapContainer.style.width = '100%';

        // Initialize the map
        this.map = L.map('jharkhandMap', {
            center: this.jharkhandCenter,
            zoom: 8,
            minZoom: 7,
            maxZoom: 18,
            zoomControl: false,
            attributionControl: false
        });

        // Force map to resize after creation
        setTimeout(() => {
            if (this.map) {
                this.map.invalidateSize();
            }
        }, 100);
        
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
        // Create custom icon based on type with FontAwesome icons
        const iconMap = {
            wildlife: 'fas fa-paw',
            natural: 'fas fa-tint',
            adventure: 'fas fa-mountain',
            religious: 'fas fa-place-of-worship',
            cultural: 'fas fa-landmark',
            tourist: 'fas fa-camera'
        };
        
        const customIcon = L.divIcon({
            className: `custom-marker ${destination.type}`,
            html: `
                <div class="marker-pin">
                    <i class="marker-icon ${iconMap[destination.type] || 'fas fa-map-marker-alt'}"></i>
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
        
        // Add map legend
        this.addMapLegend();
        
        // Add location statistics
        this.updateMapStatistics();
    }
    
    addMapLegend() {
        const legend = L.control({ position: 'bottomleft' });
        
        legend.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'map-legend');
            div.innerHTML = `
                <h4><i class="fas fa-map-marked-alt"></i> Location Types</h4>
                <div class="legend-item">
                    <div class="legend-color marker-wildlife">
                        <i class="fas fa-paw"></i>
                    </div>
                    <span>Wildlife & Nature Reserves</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color marker-natural">
                        <i class="fas fa-tint"></i>
                    </div>
                    <span>Waterfalls & Natural Sites</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color marker-cultural">
                        <i class="fas fa-landmark"></i>
                    </div>
                    <span>Cultural & Heritage Sites</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color marker-religious">
                        <i class="fas fa-place-of-worship"></i>
                    </div>
                    <span>Religious Places</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color marker-adventure">
                        <i class="fas fa-mountain"></i>
                    </div>
                    <span>Adventure & Sports</span>
                </div>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 0.85rem; color: #64748b;">
                    Click markers for details • ${jharkhandMap.destinations.length} locations total
                </div>
            `;
            
            L.DomEvent.disableClickPropagation(div);
            return div;
        };
        
        legend.addTo(this.map);
    }
    
    updateMapStatistics() {
        const stats = {
            total: this.destinations.length,
            wildlife: this.destinations.filter(d => d.type === 'wildlife').length,
            natural: this.destinations.filter(d => d.type === 'natural').length,
            cultural: this.destinations.filter(d => d.type === 'cultural').length,
            religious: this.destinations.filter(d => d.type === 'religious').length,
            adventure: this.destinations.filter(d => d.type === 'adventure').length
        };
        
        // Create stats display above the map
        const mapContainer = document.querySelector('.map-container').parentElement;
        const existingStats = mapContainer.querySelector('.map-stats');
        if (existingStats) existingStats.remove();
        
        const statsHTML = `
            <div class="map-stats">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-map-marked-alt"></i></div>
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">Total Locations</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-paw"></i></div>
                    <div class="stat-number">${stats.wildlife}</div>
                    <div class="stat-label">Wildlife Sanctuaries</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-water"></i></div>
                    <div class="stat-number">${stats.natural}</div>
                    <div class="stat-label">Natural Attractions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-landmark"></i></div>
                    <div class="stat-number">${stats.cultural}</div>
                    <div class="stat-label">Cultural Sites</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-om"></i></div>
                    <div class="stat-number">${stats.religious}</div>
                    <div class="stat-label">Religious Places</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-mountain"></i></div>
                    <div class="stat-number">${stats.adventure}</div>
                    <div class="stat-label">Adventure Spots</div>
                </div>
            </div>
        `;
        
        mapContainer.insertAdjacentHTML('afterbegin', statsHTML);
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
    // Add a small delay to ensure CSS is loaded
    setTimeout(() => {
        const mapElement = document.getElementById('jharkhandMap');
        if (mapElement) {
            console.log('Found map container, initializing...');
            try {
                window.jharkhandMap = new JharkhandMap();
            } catch (error) {
                console.error('Failed to create JharkhandMap:', error);
                // Create a simple fallback map
                createFallbackMap();
            }
        } else {
            console.log('Map container not found');
        }
    }, 100);
});

// Fallback simple map creation
function createFallbackMap() {
    const mapContainer = document.getElementById('jharkhandMap');
    if (mapContainer && typeof L !== 'undefined') {
        try {
            const simpleMap = L.map('jharkhandMap').setView([23.6102, 85.2799], 8);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(simpleMap);
            
            // Add some basic markers
            L.marker([23.6102, 85.2799]).addTo(simpleMap).bindPopup('Ranchi - Capital of Jharkhand');
            L.marker([23.8859, 84.1917]).addTo(simpleMap).bindPopup('Betla National Park');
            L.marker([24.4842, 86.6947]).addTo(simpleMap).bindPopup('Deoghar - Sacred City');
            
            console.log('Fallback map created successfully');
        } catch (error) {
            console.error('Fallback map creation failed:', error);
        }
    }
}