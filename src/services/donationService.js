import { USE_MOCK } from "../firebase.js";

let mockDonations = [];

export const donationService = {
  submitDonation: async (payload) => {
    const donation = {
      id: `donation_${Date.now()}`,
      userId: payload.userId || null,
      itemType: payload.itemType,
      estimatedValue: payload.estimatedValue,
      pickupPreferred: payload.pickupPreferred,
      message: payload.message || "",
      createdAt: new Date().toISOString(),
      name: payload.name || "",
      email: payload.email || "",
    };

    if (USE_MOCK) {
      mockDonations.unshift(donation);
      return donation;
    }

    const { db } = await import("../firebase.js");
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
    await addDoc(collection(db, "donations"), {
      userId: donation.userId,
      itemType: donation.itemType,
      estimatedValue: donation.estimatedValue,
      pickupPreferred: donation.pickupPreferred,
      message: donation.message,
      createdAt: serverTimestamp(),
      name: donation.name,
      email: donation.email,
    });
    return donation;
  },
};

export const submitDonation = (payload) => donationService.submitDonation(payload);
