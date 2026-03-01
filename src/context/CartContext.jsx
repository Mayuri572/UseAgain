import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("useagain_cart") || "[]");
    } catch { return []; }
  });

  useEffect(() => {
    sessionStorage.setItem("useagain_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (listing) => {
    setItems(prev => {
      if (prev.find(i => i.id === listing.id)) {
        toast("Already in cart!", { icon: "🛒" });
        return prev;
      }
      toast.success("Added to cart!");
      return [...prev, { ...listing, addedAt: new Date().toISOString() }];
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast("Removed from cart", { icon: "🗑️" });
  };

  const addToCart = addItem;
  const removeFromCart = removeItem;
  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + (i.price || 0), 0);

  return (
    <CartContext.Provider value={{ items, addItem, addToCart, removeItem, removeFromCart, clearCart, total, count: items.length }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
