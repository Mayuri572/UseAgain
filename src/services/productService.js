/**
 * Product/Listing service — wraps Firestore with mock fallback
 */
import { USE_MOCK } from "../firebase.js";
import { MOCK_LISTINGS } from "../mockData.js";

let mockListings = [...MOCK_LISTINGS];

// ─── Mock Implementation ───────────────────────────────────────────────────

export const productService = {
  getListings: async (filters = {}) => {       
    await delay(300);
    let results = [...mockListings];
    if (filters.category) results = results.filter(l => l.category === filters.category);
    if (filters.swapAllowed) results = results.filter(l => l.swapAllowed);
    if (filters.minPrice !== undefined) results = results.filter(l => l.price >= filters.minPrice);
    if (filters.maxPrice !== undefined) results = results.filter(l => l.price <= filters.maxPrice);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(l =>
        l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
      );
    }
    return results;
  },

  getListing: async (id) => {
    await delay(200);
    return mockListings.find(l => l.id === id) || null;
  },

  addListing: async (data, userId) => {
    await delay(400);
    const newListing = {
      id: `listing_${Date.now()}`,
      ...data,
      sellerId: userId,
      status: "active",
      views: 0,
      wishlistCount: 0,
      createdAt: new Date().toISOString(),
    };
    mockListings.unshift(newListing);
    return newListing;
  },

  // ✅ Added this to fix your error
  createListing: async (data, userId) => {
    return productService.addListing(data, userId);
  },

  updateListing: async (id, data) => {
    await delay(300);
    const idx = mockListings.findIndex(l => l.id === id);
    if (idx === -1) throw new Error("Listing not found");
    mockListings[idx] = { ...mockListings[idx], ...data };
    return mockListings[idx];
  },

  deleteListing: async (id) => {
    await delay(200);
    mockListings = mockListings.filter(l => l.id !== id);
  },

  getUserListings: async (userId) => {
    await delay(300);
    return mockListings.filter(l => l.sellerId === userId);
  },

  incrementViews: async (id) => {
    const listing = mockListings.find(l => l.id === id);
    if (listing) listing.views = (listing.views || 0) + 1;
  },

  createOrder: async (listingId, buyerId, paymentMethod) => {
    await delay(400);
    return {
      id: `order_${Date.now()}`,
      listingId,
      buyerId,
      paymentMethod,
      status: paymentMethod === "secure" ? "HELD" : "PENDING_PICKUP",
      createdAt: new Date().toISOString(),
    };
  },

  completeOrder: async (orderId) => {
    await delay(300);
    return { id: orderId, status: "COMPLETED" };
  },

  createSwapRequest: async (listingId, requesterId, offeredListingId) => {
    await delay(400);
    return {
      id: `swap_${Date.now()}`,
      listingId,
      requesterId,
      offeredListingId,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
  },

  subscribeToListings: (callback, filters = {}) => {
    productService.getListings(filters).then(callback);
    const interval = setInterval(async () => {
      const data = await productService.getListings(filters);
      callback(data);
    }, 30000);
    return () => clearInterval(interval);
  },
};

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export const fetchListings = (filters = {}) => productService.getListings(filters);

export const fetchListingById = (id) => productService.getListing(id);

export const createListing = (data, userId) =>
  productService.createListing(data, userId || data?.sellerId);

export const createOrder = (payloadOrListingId, maybeBuyerId, maybePaymentMethod) => {
  if (typeof payloadOrListingId === "object" && payloadOrListingId !== null) {
    const { listingId, buyerId, paymentMethod } = payloadOrListingId;
    return productService.createOrder(listingId, buyerId, paymentMethod);
  }
  return productService.createOrder(payloadOrListingId, maybeBuyerId, maybePaymentMethod);
};

export const createSwapRequest = (payloadOrListingId, maybeRequesterId, maybeOfferedListingId) => {
  if (typeof payloadOrListingId === "object" && payloadOrListingId !== null) {
    const { listingId, requesterId, offeredListingId } = payloadOrListingId;
    return productService.createSwapRequest(listingId, requesterId, offeredListingId);
  }
  return productService.createSwapRequest(payloadOrListingId, maybeRequesterId, maybeOfferedListingId);
};
