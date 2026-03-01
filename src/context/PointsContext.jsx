import { createContext, useContext, useState, useCallback } from "react";
import toast from "react-hot-toast";

const PointsContext = createContext(null);

export const POINTS_RULES = {
  PURCHASE: 50,
  SALE: 75,
  SWAP: 100,
  REVIEW: 25,
  LISTING: 20,
  REFERRAL: 200,
};

export function PointsProvider({ children }) {
  const [ledger, setLedger] = useState([]);

  const addPoints = useCallback((amount, reason, userId) => {
    const entry = {
      id: `pts_${Date.now()}`,
      amount,
      reason,
      userId,
      createdAt: new Date().toISOString(),
    };
    setLedger(prev => [entry, ...prev]);
    toast.success(`+${amount} points earned! 🌿`, { duration: 2500 });
    return entry;
  }, []);

  const deductPoints = useCallback((amount, reason, userId) => {
    const entry = {
      id: `pts_${Date.now()}`,
      amount: -amount,
      reason,
      userId,
      createdAt: new Date().toISOString(),
    };
    setLedger(prev => [entry, ...prev]);
    return entry;
  }, []);

  const getUserPoints = useCallback((userId) => {
    return ledger
      .filter(e => e.userId === userId)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [ledger]);

  const awardPoints = useCallback((amount, reason, userId = "global") => {
    return addPoints(amount, reason, userId);
  }, [addPoints]);

  const points = ledger.reduce((sum, e) => sum + e.amount, 0);
  const history = ledger.map((e) => ({
    amount: e.amount,
    reason: e.reason,
    date: e.createdAt,
    userId: e.userId,
  }));

  return (
    <PointsContext.Provider value={{
      ledger,
      addPoints,
      awardPoints,
      deductPoints,
      getUserPoints,
      POINTS_RULES,
      points,
      history,
    }}>
      {children}
    </PointsContext.Provider>
  );
}

export const usePoints = () => {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error("usePoints must be used within PointsProvider");
  return ctx;
};
