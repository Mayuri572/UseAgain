import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db, USE_MOCK } from "../firebase.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);
const GUEST_CART_KEY = "useagain_cart";

function sanitizeCartItem(listing) {
  return {
    id: listing.id,
    title: listing.title,
    price: Number(listing.price) || 0,
    imageUrl: listing.imageUrl || listing.images?.[0] || "",
    condition: listing.condition || "",
    category: listing.category || "",
    sellerId: listing.sellerId || null,
    sellerName: listing.sellerName || "",
  };
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGuestCart = useCallback(() => {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(GUEST_CART_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const saveGuestCart = useCallback((nextItems) => {
    sessionStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextItems));
  }, []);

  const loadUserCartFromFirestore = useCallback(async (uid) => {
    const cartRef = collection(db, "users", uid, "cart");
    const snapshot = await getDocs(cartRef);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title || "",
        price: Number(data.price) || 0,
        imageUrl: data.imageUrl || "",
        condition: data.condition || "",
        category: data.category || "",
        sellerId: data.sellerId || null,
        sellerName: data.sellerName || "",
        quantity: Number(data.quantity) > 0 ? Number(data.quantity) : 1,
      };
    });
  }, []);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      setLoading(true);
      try {
        if (user?.uid && !USE_MOCK && db) {
          const cloudItems = await loadUserCartFromFirestore(user.uid);
          if (active) setItems(cloudItems);
        } else {
          const guestItems = loadGuestCart();
          if (active) setItems(guestItems);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, [user?.uid, loadGuestCart, loadUserCartFromFirestore]);

  const persistItems = useCallback(
    async (nextItems) => {
      if (user?.uid && !USE_MOCK && db) {
        // Persist each entry to users/{uid}/cart/{itemId}
        await Promise.all(
          nextItems.map((item) =>
            setDoc(doc(db, "users", user.uid, "cart", item.id), {
              title: item.title,
              price: item.price,
              imageUrl: item.imageUrl,
              condition: item.condition,
              category: item.category,
              sellerId: item.sellerId,
              sellerName: item.sellerName,
              quantity: item.quantity || 1,
              updatedAt: new Date().toISOString(),
            })
          )
        );
      } else {
        saveGuestCart(nextItems);
      }
    },
    [user?.uid, saveGuestCart]
  );

  const addItem = useCallback(
    async (listing) => {
      const cleaned = sanitizeCartItem(listing);
      const prevItems = [...items];
      const existing = prevItems.find((i) => i.id === cleaned.id);

      const nextItems = existing
        ? prevItems.map((i) => (i.id === cleaned.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i))
        : [...prevItems, { ...cleaned, quantity: 1, addedAt: new Date().toISOString() }];

      setItems(nextItems); // instant UI update
      try {
        await persistItems(nextItems);
        toast.success("Product added to cart");
      } catch {
        setItems(prevItems); // rollback on failure
        toast.error("Failed to add product to cart");
      }
    },
    [items, persistItems]
  );

  const removeItem = useCallback(
    async (id) => {
      const prevItems = [...items];
      const nextItems = prevItems.filter((i) => i.id !== id);
      setItems(nextItems); // instant UI update

      try {
        if (user?.uid && !USE_MOCK && db) {
          await deleteDoc(doc(db, "users", user.uid, "cart", id));
        } else {
          saveGuestCart(nextItems);
        }
        toast("Removed from cart", { icon: "🗑️" });
      } catch {
        setItems(prevItems);
        toast.error("Failed to remove item");
      }
    },
    [items, user?.uid, saveGuestCart]
  );

  const clearCart = useCallback(async () => {
    const prevItems = [...items];
    setItems([]);
    try {
      if (user?.uid && !USE_MOCK && db) {
        await Promise.all(prevItems.map((item) => deleteDoc(doc(db, "users", user.uid, "cart", item.id))));
      } else {
        saveGuestCart([]);
      }
    } catch {
      setItems(prevItems);
      toast.error("Failed to clear cart");
    }
  }, [items, user?.uid, saveGuestCart]);

  const total = items.reduce((sum, i) => sum + (Number(i.price) || 0) * (i.quantity || 1), 0);
  const count = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        addToCart: addItem,
        removeItem,
        removeFromCart: removeItem,
        clearCart,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
