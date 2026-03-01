# UseAgain — Hyperlocal Circular Marketplace

A production-style React + Tailwind frontend for a circular economy marketplace. Buy, sell, swap & donate items locally within 5km of your location.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (demo mode — no Firebase needed)
npm run dev

# 3. Open http://localhost:5173
```

**Demo works out-of-the-box** with mock data. No Firebase account required.

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| priya@demo.com | demo1234 | Trusted seller (72 trust score) |
| rahul@demo.com | demo1234 | Regular user |
| anjali@demo.com | demo1234 | Champion seller (88 trust score) |

## Features

### Implemented (Fully Working)
- ✅ Browse listings with search + filters (category, price range, swap toggle)
- ✅ Geolocation filtering (5km radius using Haversine formula)
- ✅ Product detail pages with condition badges, eco-impact stats
- ✅ Real-time chat between buyers and sellers (simulated Firestore listener)
- ✅ Simulated Escrow buy flow (Cash at Pickup / Secure Payment)
- ✅ Swap request flow with two-way confirmation
- ✅ Reward store with points redemption
- ✅ Community impact dashboard with Chart.js visualizations
- ✅ Trust score system (formula: deals×2 + rating×10 + verification bonuses)
- ✅ Cart with item management
- ✅ Google Sign-in + Email/Password auth (mocked for demo)
- ✅ Add listing with AI price suggestion + category detection
- ✅ Math CAPTCHA on registration
- ✅ Quote slider with auto-rotation
- ✅ Responsive mobile-first design

### Simulated Features (Real API ready)
- 🔧 Image storage: uses URL input / object URLs (switch to Firebase Storage)
- 🔧 AI categorization: mock (see `aiService.js` for Google Vision integration notes)
- 🔧 Firebase Auth: mocked (set `VITE_USE_MOCK=false` with real keys to enable)
- 🔧 Firestore listeners: simulated (real implementation is prepared in `firebase.js`)
- 🔧 Escrow payments: simulated (integrate Razorpay for production)

## Firebase Setup (Optional)

1. Create project at https://console.firebase.google.com
2. Enable **Authentication** (Email/Password + Google)
3. Enable **Firestore Database**
4. Register a web app, copy config
5. Copy `.env.example` to `.env` and paste your keys
6. Set `VITE_USE_MOCK=false` in `.env`

**Firestore Security Rules** (paste in Firebase Console):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /listings/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
    match /chats/{chatId}/messages/{msgId} {
      allow read, write: if request.auth != null 
        && request.auth.uid in resource.data.participants;
    }
    match /orders/{id} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Seeding Demo Data

```bash
# View mock data (no Firebase needed)
node scripts/seedData.js

# Unit tests
node scripts/runTests.js

# Or set --test flag on individual utils:
node src/utils/co2Calculator.js --test
node src/utils/geoUtils.js --test
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Navbar.jsx     # Sticky nav with search, cart badge, auth
│   ├── Footer.jsx     # Links + community impact stats
│   ├── ProductCard.jsx # Listing card with wishlist, buy, chat
│   ├── QuoteSlider.jsx # Auto-rotating quotes (5s interval)
│   ├── ChatBox.jsx    # Real-time chat UI with Firestore listener
│   ├── ProtectedRoute.jsx # Auth guard for private routes
│   └── Captcha.jsx    # Math CAPTCHA for registration
├── pages/             # Route-level page components
│   ├── Home.jsx       # Hero + categories + listing grid with filters
│   ├── Login.jsx      # Email + Google auth form
│   ├── Register.jsx   # Registration with CAPTCHA
│   ├── Dashboard.jsx  # Community stats + Chart.js visuals
│   ├── AddProduct.jsx # Listing form with AI suggestions + geolocation
│   ├── ProductDetails.jsx # Listing view + buy/swap/chat
│   ├── Cart.jsx       # Cart management
│   ├── Wishlist.jsx   # Saved items
│   ├── Swap.jsx       # Swap-only listings marketplace
│   ├── RewardStore.jsx # Points redemption store
│   └── Profile.jsx   # User profile + trust score
├── context/           # React Context providers
│   ├── AuthContext.jsx # User session, login/logout/register
│   ├── CartContext.jsx # Cart state (sessionStorage-backed)
│   └── PointsContext.jsx # Points ledger + earning rules
├── services/          # Data layer
│   ├── mockData.js    # All demo data (10 listings, 5 users, rewards)
│   ├── productService.js # CRUD + filtering (Firestore-ready)
│   ├── authService.js # Auth operations with mock fallback
│   ├── chatService.js # Real-time chat with listener simulation
│   └── aiService.js   # Price suggestion + image categorization
└── utils/             # Pure utility functions
    ├── co2Calculator.js # CO₂ & waste diversion calculations
    ├── trustScore.js    # Trust score formula + badge styling
    └── geoUtils.js      # Haversine distance + geolocation API
```

## Design System

| Token | Value |
|-------|-------|
| Primary | `#0F766E` (teal) |
| Accent | `#A7F3D0` (mint) |
| Accent Yellow | `#FDE68A` |
| Background | `#F3F7FA` |
| Text | `#111827` |
| Fonts | Poppins (headings) + Inter (body) |

## Production Checklist

- [ ] Replace mock Firebase with real Firebase credentials
- [ ] Configure Firestore security rules
- [ ] Integrate Razorpay for real escrow payments
- [ ] Replace `aiService.js` mocks with Google Vision API
- [ ] Enable Firebase Storage (Blaze plan) for real image uploads
- [ ] Add server-side validation for orders
- [ ] Set up Firebase App Check to prevent abuse
- [ ] Configure Google Maps Geocoding API for real reverse geocoding
- [ ] Add rate limiting on chat messages
- [ ] Integrate geofirestore for server-side radius queries at scale

## 5-Minute Demo Checklist

1. **Home** — See hero, rotating quotes, 10 categories, listing grid
2. **Filter** — Click "Electronics", enable "Swap Only", set max price ₹5000
3. **Login** — Sign in as `priya@demo.com / demo1234`
4. **Product** — Click Sony Headphones → see eco impact, chat, buy/swap buttons
5. **Buy Flow** — Click Buy Now → choose "Secure Payment" → confirm → see toast
6. **Add Listing** — Post Item → upload photo → see AI price suggestion
7. **Dashboard** — See Chart.js impact graphs, your stats
8. **Rewards** — Claim a reward (needs points from deals above)
