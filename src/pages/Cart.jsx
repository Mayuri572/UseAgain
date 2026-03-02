import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePoints } from "../context/PointsContext";
import { HiTrash, HiShoppingCart } from "react-icons/hi";
import toast from "react-hot-toast";

export default function Cart() {
  const { items, loading, removeFromCart, clearCart, total, count } = useCart();
  const { user } = useAuth();
  const { awardPoints } = usePoints();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    toast.success("Proceeding to checkout");
    awardPoints(items.length * 15, "Purchase completed");
    clearCart();
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center text-gray-500">Loading cart...</div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <HiShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="font-heading font-bold text-xl text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some items to get started!</p>
          <Link to="/product" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition">
            Browse Listings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-heading font-bold text-2xl text-gray-900 mb-6">Your Cart ({count})</h1>
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 shadow-sm">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-xl"
              onError={(e) => {
                e.target.src = "https://placehold.co/80x80?text=Item";
              }}
            />
            <div className="flex-1 min-w-0">
              <Link to={`/item/${item.id}`} className="font-semibold text-gray-900 hover:text-primary line-clamp-1">
                {item.title}
              </Link>
              <p className="text-sm text-gray-500">{item.condition} · {item.category}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
              <p className="text-primary font-bold mt-1">₹{item.price?.toLocaleString("en-IN")}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              aria-label={`Remove ${item.title}`}
              className="text-gray-400 hover:text-red-500 transition p-1"
            >
              <HiTrash className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Subtotal ({count} items)</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Platform fee (5%)</span>
          <span>₹{Math.round(total * 0.05).toLocaleString("en-IN")}</span>
        </div>
        <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900 text-lg mb-5">
          <span>Total</span>
          <span className="text-primary">₹{Math.round(total * 1.05).toLocaleString("en-IN")}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition shadow"
        >
          Proceed to Checkout
        </button>
        <button onClick={clearCart} className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-red-500 transition">
          Clear Cart
        </button>
      </div>
    </main>
  );
}
