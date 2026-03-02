// mockData.js — Demo data used when Firebase is not configured
export const MOCK_USERS = [
  { uid: 'user1', displayName: 'Priya Sharma', email: 'priya@demo.com', photoURL: 'https://i.pravatar.cc/150?img=5', points: 320, trustScore: 87, completedDeals: 14, avgRating: 4.8 },
  { uid: 'user2', displayName: 'Arjun Mehta', email: 'arjun@demo.com', photoURL: 'https://i.pravatar.cc/150?img=11', points: 180, trustScore: 62, completedDeals: 8, avgRating: 4.2 },
  { uid: 'user3', displayName: 'Sneha Patil', email: 'sneha@demo.com', photoURL: 'https://i.pravatar.cc/150?img=16', points: 540, trustScore: 95, completedDeals: 23, avgRating: 4.9 },
  { uid: 'user4', displayName: 'Rahul Joshi', email: 'rahul@demo.com', photoURL: 'https://i.pravatar.cc/150?img=33', points: 90, trustScore: 45, completedDeals: 3, avgRating: 3.8 },
  { uid: 'user5', displayName: 'Kavya Nair', email: 'kavya@demo.com', photoURL: 'https://i.pravatar.cc/150?img=44', points: 420, trustScore: 78, completedDeals: 17, avgRating: 4.6 },
]

export const MOCK_LISTINGS = [
  {
    id: 'p1', title: 'Vintage Wooden Bookshelf', category: 'Furniture', condition: 'Good',
    price: 1200, description: 'Solid teak 5-shelf bookcase. Minor scratches on the base. Excellent structure. Self-pickup preferred.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    sellerId: 'user1', sellerName: 'Priya Sharma', sellerPhoto: 'https://i.pravatar.cc/150?img=5',
    swapAllowed: true, swapFor: 'Study table or chair', lat: 18.5204, lng: 73.8567, location: 'Shivajinagar, Pune',
    createdAt: Date.now() - 86400000, views: 47, wishlistCount: 8, trustScore: 87,
  },
  {
    id: 'p2', title: 'Samsung 32" LED TV', category: 'Electronics', condition: 'Like New',
    price: 8500, description: 'Bought 2 years ago, barely used. Remote included, wall mount not included. Works perfectly.',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4e7d9?w=600',
    sellerId: 'user2', sellerName: 'Arjun Mehta', sellerPhoto: 'https://i.pravatar.cc/150?img=11',
    swapAllowed: false, lat: 18.5314, lng: 73.8446, location: 'Deccan, Pune',
    createdAt: Date.now() - 172800000, views: 123, wishlistCount: 22, trustScore: 62,
  },
  {
    id: 'p3', title: 'Trek Mountain Bike', category: 'Sports', condition: 'Good',
    price: 4500, description: '21-speed Trek 820. Serviced 3 months ago. New brake pads. Minor paint wear on frame.',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600',
    sellerId: 'user3', sellerName: 'Sneha Patil', sellerPhoto: 'https://i.pravatar.cc/150?img=16',
    swapAllowed: true, swapFor: 'Badminton rackets or gym equipment', lat: 18.5089, lng: 73.8710, location: 'Kothrud, Pune',
    createdAt: Date.now() - 259200000, views: 89, wishlistCount: 15, trustScore: 95,
  },
  {
    id: 'p4', title: 'Nikon D3500 DSLR Camera', category: 'Electronics', condition: 'Like New',
    price: 22000, description: 'Shutter count under 3000. Kit lens 18-55mm. Bag, charger, 2 batteries included.',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600',
    sellerId: 'user3', sellerName: 'Sneha Patil', sellerPhoto: 'https://i.pravatar.cc/150?img=16',
    swapAllowed: false, lat: 18.5026, lng: 73.8629, location: 'Warje, Pune',
    createdAt: Date.now() - 345600000, views: 201, wishlistCount: 34, trustScore: 95,
  },
  {
    id: 'p5', title: 'Philips Air Fryer 4.1L', category: 'Appliances', condition: 'Good',
    price: 3200, description: 'Used for 8 months. Cleaned thoroughly. All original accessories included.',
    imageUrl: 'https://images.unsplash.com/photo-1648565881895-6de9b3d7c666?w=600',
    sellerId: 'user1', sellerName: 'Priya Sharma', sellerPhoto: 'https://i.pravatar.cc/150?img=5',
    swapAllowed: true, swapFor: 'Instant pot or juicer', lat: 18.5292, lng: 73.8600, location: 'FC Road, Pune',
    createdAt: Date.now() - 432000000, views: 67, wishlistCount: 11, trustScore: 87,
  },
  {
    id: 'p6', title: 'Kindle Paperwhite 10th Gen', category: 'Books & Media', condition: 'Like New',
    price: 5500, description: '8GB, Waterproof. Original box. Used for 6 months, in excellent condition.',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600',
    sellerId: 'user4', sellerName: 'Rahul Joshi', sellerPhoto: 'https://i.pravatar.cc/150?img=33',
    swapAllowed: true, swapFor: 'iPad or tablet', lat: 18.5200, lng: 73.8553, location: 'Shivajinagar, Pune',
    createdAt: Date.now() - 518400000, views: 34, wishlistCount: 5, trustScore: 45,
  },
  {
    id: 'p7', title: 'Office Executive Chair', category: 'Furniture', condition: 'Fair',
    price: 2200, description: 'Ergonomic chair, gas lift works. Small tear on armrest padding. Seat cushion is firm.',
    imageUrl: 'https://images.unsplash.com/photo-1589364222010-dd1d4d33c36b?w=600',
    sellerId: 'user5', sellerName: 'Kavya Nair', sellerPhoto: 'https://i.pravatar.cc/150?img=44',
    swapAllowed: false, lat: 18.5155, lng: 73.8501, location: 'Karve Nagar, Pune',
    createdAt: Date.now() - 604800000, views: 28, wishlistCount: 3, trustScore: 78,
  },
  {
    id: 'p8', title: 'Guitar — Yamaha F310', category: 'Music', condition: 'Good',
    price: 3800, description: 'Acoustic guitar with bag, capo, picks, tuner. Great beginner instrument.',
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600',
    sellerId: 'user2', sellerName: 'Arjun Mehta', sellerPhoto: 'https://i.pravatar.cc/150?img=11',
    swapAllowed: true, swapFor: 'Keyboard or other instruments', lat: 18.5371, lng: 73.8397, location: 'Baner, Pune',
    createdAt: Date.now() - 691200000, views: 56, wishlistCount: 9, trustScore: 62,
  },
  {
    id: 'p9', title: 'Yoga Mat + Blocks Set', category: 'Sports', condition: 'Like New',
    price: 850, description: 'Premium 6mm TPE mat with 2 cork blocks and strap. Used 5-6 times only.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600',
    sellerId: 'user5', sellerName: 'Kavya Nair', sellerPhoto: 'https://i.pravatar.cc/150?img=44',
    swapAllowed: false, lat: 18.5185, lng: 73.8460, location: 'Erandwane, Pune',
    createdAt: Date.now() - 777600000, views: 19, wishlistCount: 4, trustScore: 78,
  },
  {
    id: 'p10', title: 'Collection of 40 Books', category: 'Books & Media', condition: 'Good',
    price: 600, description: 'Mix of fiction, self-help, and classics. Authors: Ruskin Bond, Chetan Bhagat, Haruki Murakami, and more.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
    sellerId: 'user4', sellerName: 'Rahul Joshi', sellerPhoto: 'https://i.pravatar.cc/150?img=33',
    swapAllowed: true, swapFor: 'Other books or board games', lat: 18.5240, lng: 73.8480, location: 'Model Colony, Pune',
    createdAt: Date.now() - 864000000, views: 41, wishlistCount: 6, trustScore: 45,
  },
  {
    id: 'p11', title: 'Honda Activa 5G (2019)', category: 'Vehicle', condition: 'Good',
    price: 42000, description: 'Single owner scooter, insurance valid, recent service done. RC and all documents available.',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600',
    sellerId: 'user2', sellerName: 'Arjun Mehta', sellerPhoto: 'https://i.pravatar.cc/150?img=11',
    swapAllowed: false, lat: 18.5260, lng: 73.8505, location: 'JM Road, Pune',
    createdAt: Date.now() - 920000000, views: 52, wishlistCount: 7, trustScore: 62,
  },
  {
    id: 'p12', title: 'Sterling Silver Pendant Set', category: 'Jewellery', condition: 'Like New',
    price: 1800, description: 'Elegant silver pendant with chain and matching earrings. Worn twice, includes original box.',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
    sellerId: 'user5', sellerName: 'Kavya Nair', sellerPhoto: 'https://i.pravatar.cc/150?img=44',
    swapAllowed: true, swapFor: 'Handcrafted decor items', lat: 18.5174, lng: 73.8478, location: 'Erandwane, Pune',
    createdAt: Date.now() - 980000000, views: 36, wishlistCount: 5, trustScore: 78,
  },
]

export const MOCK_IMPACT_STATS = {
  itemsTraded: 342,
  kgWasteDiverted: 1847,
  co2Saved: 3412,
  activeUsers: 1284,
  swapsCompleted: 89,
}

export const MOCK_CATEGORIES = [
  { name: 'Electronics', image: '/assets/categories/Electronic.png', count: 45 },
  { name: 'Furniture', image: '/assets/categories/Furniture.png', count: 32 },
  { name: 'Clothing', image: '/assets/categories/Clothes.png', count: 67 },
  { name: 'Books & Media', image: '/assets/categories/books_new.png', count: 28 },
  { name: 'Sports', image: '/assets/categories/sports.png', count: 19 },
  { name: 'Appliances', image: '/assets/categories/Appliances.png', count: 24 },
  { name: 'Music', image: '/assets/categories/music_new.png', count: 11 },
  { name: 'Toys & Kids', image: '/assets/categories/Toys.png', count: 38 },
  { name: 'Vehicle', image: '/assets/categories/vehicle.jpeg', count: 14 },
  { name: 'Jewellery', image: '/assets/categories/jewellery.png', count: 17 },
]

export const MOCK_QUOTES = [
  { text: 'One person\'s clutter is another person\'s treasure. Give things a second life locally.', author: 'UseAgain Community' },
  { text: 'Every item reused is one less item in a landfill. Small acts, big impact.', author: 'Eco Council Pune' },
  { text: 'The most sustainable product is one that already exists. Shop secondhand first.', author: 'Circular Economy Network' },
  { text: 'Swap, don\'t shop. Your neighbours have what you need.', author: 'UseAgain Member, Priya S.' },
  { text: 'We saved 1.8 tonnes of waste from landfills last month. Together, we\'re changing things.', author: 'UseAgain Impact Report' },
]

export const MOCK_REWARDS = [
  { id: 'r1', name: '₹50 Amazon Voucher', points: 200, icon: '🛒', available: true },
  { id: 'r2', name: 'Free Coffee at Café Coffee Day', points: 150, icon: '☕', available: true },
  { id: 'r3', name: '₹100 Zomato Credit', points: 350, icon: '🍔', available: true },
  { id: 'r4', name: 'Tree Planted in Your Name', points: 100, icon: '🌳', available: true },
  { id: 'r5', name: 'Zepto Grocery Voucher ₹75', points: 250, icon: '🥦', available: false },
  { id: 'r6', name: 'UseAgain Premium Badge (1 month)', points: 500, icon: '⭐', available: true },
]
export const MOCK_CHATS = [
  {
    id: "chat1",
    participants: ["user1", "user2"],
    messages: [
      {
        senderId: "user1",
        text: "Hi, is the TV still available?",
        timestamp: Date.now() - 600000,
      },
      {
        senderId: "user2",
        text: "Yes, it is available.",
        timestamp: Date.now() - 500000,
      },
    ],
  },
];
