/**
 * Authentication service — wraps Firebase Auth with mock fallback
 */
import { USE_MOCK } from "../firebase.js";
import { MOCK_USERS } from "../mockData.js";

let mockCurrentUser = null;
const authListeners = [];

function notifyListeners(user) {
  authListeners.forEach((cb) => cb(user));
}

// ─── Mock Auth ─────────────────────────────────────────────────────────────

export const mockAuth = {
  signInWithEmail: async (email, password) => {
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user || password !== "demo1234") throw new Error("Invalid credentials");
    mockCurrentUser = user;
    notifyListeners(user);
    localStorage.setItem("useagain_mock_user", JSON.stringify(user));
    return user;
  },
  signUpWithEmail: async (email, password, displayName) => {
    const newUser = {
      uid: `user_${Date.now()}`,
      email,
      displayName,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      points: 50,
      trustScore: 10,
      completedDeals: 0,
      avgRating: 0,
    };
    mockCurrentUser = newUser;
    notifyListeners(newUser);
    localStorage.setItem("useagain_mock_user", JSON.stringify(newUser));
    return newUser;
  },
  signInWithGoogle: async () => {
    const user = MOCK_USERS[0];
    mockCurrentUser = user;
    notifyListeners(user);
    localStorage.setItem("useagain_mock_user", JSON.stringify(user));
    return user;
  },
  signOut: async () => {
    mockCurrentUser = null;
    notifyListeners(null);
    localStorage.removeItem("useagain_mock_user");
  },
  onAuthStateChanged: (callback) => {
    authListeners.push(callback);
    const stored = localStorage.getItem("useagain_mock_user");
    if (stored) {
      mockCurrentUser = JSON.parse(stored);
      setTimeout(() => callback(mockCurrentUser), 100);
    } else {
      setTimeout(() => callback(null), 100);
    }
    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx > -1) authListeners.splice(idx, 1);
    };
  },
};

// ─── Real Firebase Auth ────────────────────────────────────────────────────

async function getRealAuth() {
  const { auth, googleProvider } = await import("../firebase.js");
  const { signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signInWithPopup, signOut, onAuthStateChanged, updateProfile } = await import("firebase/auth");
  return { auth, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signInWithPopup, signOut, onAuthStateChanged, updateProfile };
}

export const authService = {
  signInWithEmail: async (email, password) => {
    if (USE_MOCK) return mockAuth.signInWithEmail(email, password);
    const { auth, signInWithEmailAndPassword } = await getRealAuth();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  },
  signUpWithEmail: async (email, password, displayName) => {
    if (USE_MOCK) return mockAuth.signUpWithEmail(email, password, displayName);
    const { auth, createUserWithEmailAndPassword, updateProfile } = await getRealAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    return cred.user;
  },
  signInWithGoogle: async () => {
    if (USE_MOCK) return mockAuth.signInWithGoogle();
    const { auth, googleProvider, signInWithPopup } = await getRealAuth();
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  },
  signOut: async () => {
    if (USE_MOCK) return mockAuth.signOut();
    const { auth, signOut } = await getRealAuth();
    return signOut(auth);
  },
  onAuthStateChanged: (callback) => {
    if (USE_MOCK) return mockAuth.onAuthStateChanged(callback);
    (async () => {
      const { auth, onAuthStateChanged } = await getRealAuth();
      onAuthStateChanged(auth, callback);
    })();
    return () => {};
  },
};
