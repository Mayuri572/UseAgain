/**
 * Firestore Seed Script for UseAgain
 * 
 * Usage (with Firebase configured):
 *   node scripts/seedData.js
 * 
 * Prerequisites:
 *   1. Set GOOGLE_APPLICATION_CREDENTIALS env var to your service account JSON
 *   2. npm install firebase-admin
 *   3. Update projectId below
 */

const MOCK_LISTINGS = [
  { title: "Sony WH-1000XM4 Headphones", category: "electronics", condition: "like-new", price: 8500, swapAllowed: true },
  { title: "Wooden Study Table", category: "furniture", condition: "good", price: 2800 },
  { title: "Harry Potter Complete Box Set", category: "books", condition: "good", price: 650, swapAllowed: true },
  { title: "Yoga Mat + Blocks Set", category: "sports", condition: "like-new", price: 1200, swapAllowed: true },
  { title: "Instant Pot Duo 6qt", category: "kitchen", condition: "good", price: 3200 },
  { title: "Trek Mountain Bike", category: "sports", condition: "like-new", price: 12000, swapAllowed: true },
  { title: "Dell XPS 15 Laptop", category: "electronics", condition: "good", price: 75000 },
  { title: "IKEA KALLAX Shelf", category: "furniture", condition: "fair", price: 1500, swapAllowed: true },
  { title: "Lego Technic 42138", category: "toys", condition: "like-new", price: 2200, swapAllowed: true },
  { title: "Bosch Power Drill", category: "tools", condition: "like-new", price: 1800 },
];

const MOCK_USERS = [
  { email: "priya@demo.com", displayName: "Priya Sharma", points: 850, trustScore: 72 },
  { email: "rahul@demo.com", displayName: "Rahul Mehta", points: 420, trustScore: 48 },
  { email: "anjali@demo.com", displayName: "Anjali Patil", points: 1200, trustScore: 88 },
];

const IMPACT_STATS = {
  itemsTraded: 247,
  kgWasteDiverted: 1840,
  co2Saved: 3120,
  activeUsers: 1240,
  communitySwaps: 89,
  totalListings: 428,
};

// Firebase Admin SDK version
async function seedFirestore() {
  try {
    const admin = await import("firebase-admin");
    admin.initializeApp({ projectId: "your-project-id" }); // ← Update this
    const db = admin.firestore();
    const batch = db.batch();

    // Seed users
    for (const user of MOCK_USERS) {
      batch.set(db.collection("users").doc(), user);
    }

    // Seed listings
    for (const listing of MOCK_LISTINGS) {
      batch.set(db.collection("listings").doc(), {
        ...listing,
        location: { lat: 18.5204 + Math.random() * 0.05, lng: 73.8567 + Math.random() * 0.05 },
        status: "active",
        createdAt: admin.firestore.Timestamp.now(),
        views: Math.floor(Math.random() * 200),
      });
    }

    // Seed impact stats
    batch.set(db.collection("impactStats").doc("global"), IMPACT_STATS);

    await batch.commit();
    console.log("✅ Seeded Firestore successfully!");
    console.log(`  - ${MOCK_USERS.length} users`);
    console.log(`  - ${MOCK_LISTINGS.length} listings`);
    console.log("  - 1 impactStats document");
  } catch (err) {
    console.log("⚠️  Firebase Admin not configured. Using mock data in app instead.");
    console.log("Demo mode is active — mock data is embedded in src/services/mockData.js");
  }
}

// Mock JSON export (used by app in demo mode)
const mockJSON = {
  users: MOCK_USERS,
  listings: MOCK_LISTINGS,
  impactStats: IMPACT_STATS,
};

console.log("📦 Mock data summary:");
console.log(JSON.stringify(mockJSON, null, 2));

seedFirestore();
