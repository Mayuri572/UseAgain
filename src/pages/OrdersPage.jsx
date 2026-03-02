import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserOrders, updateOrderStatus } from "../services/productService.js";

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getUserOrders(user.uid);
        if (active) setOrders(data);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [user, navigate]);

  const confirmPickup = async (orderId) => {
    try {
      const updated = await updateOrderStatus(orderId, "COMPLETED");
      setOrders((prev) => prev.map((order) => (order.id === orderId ? updated : order)));
      toast.success("Order marked as completed");
    } catch {
      toast.error("Failed to update order");
    }
  };

  return (
    <main className="bg-bg-neutral min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-poppins text-3xl font-bold text-gray-900">Cart / Orders</h1>
        <p className="text-gray-600 mt-1">Track your current transactions and confirm pickups.</p>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-gray-600">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
            <p className="text-gray-900">No orders yet.</p>
            <Link
              to="/product"
              className="inline-flex mt-4 btn-primary"
            >
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border border-gray-100 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p className="text-gray-900 font-medium">{order.productTitle || order.listingId}</p>
                  <p className="text-sm text-gray-600">Seller: {order.sellerName || order.sellerId || "Unknown"}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleString()} • {order.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  {order.status !== "COMPLETED" && (
                    <button
                      type="button"
                      onClick={() => confirmPickup(order.id)}
                      className="rounded-lg bg-primary text-white px-3 py-2 text-sm font-semibold hover:bg-primary-dark transition-colors"
                    >
                      Confirm Pickup
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING_PICKUP: "bg-yellow-100 text-yellow-800",
    HELD: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}
