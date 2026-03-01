import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService.js";
import { calculateTrustScore } from "../utils/trustScore.js";

const AuthContext = createContext(null);

export const DEMO_CREDENTIALS = {
  email: "demo@useagain.com",
  password: "123456",
};
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = authService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const trustData = calculateTrustScore({
          completedDeals: firebaseUser.completedDeals || 0,
          avgRating: firebaseUser.avgRating || 0,
          emailVerified: firebaseUser.emailVerified || false,
          phoneVerified: firebaseUser.phoneVerified || false,
        });
        setUser({ ...firebaseUser, ...trustData });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    const u = await authService.signInWithEmail(email, password);
    return u;
  };

  const loginWithEmail = login;

  const loginWithGoogle = async () => {
    const u = await authService.signInWithGoogle();
    return u;
  };

  const register = async (email, password, displayName) => {
    const u = await authService.signUpWithEmail(email, password, displayName);
    return u;
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  const updatePoints = (newPoints) => {
    setUser(prev => prev ? { ...prev, points: newPoints } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, loginWithGoogle, register, logout, updatePoints }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
