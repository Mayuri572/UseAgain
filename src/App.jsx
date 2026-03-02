import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { PointsProvider } from "./context/PointsContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Swap from "./pages/Swap.jsx";
import RewardStore from "./pages/RewardStore.jsx";
import Profile from "./pages/Profile.jsx";
import ListingsPage from "./pages/ListingsPage.jsx";
import DonatePage from "./pages/DonatePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <PointsProvider>
            <div className="flex flex-col min-h-screen">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: { borderRadius: "12px", background: "#111827", color: "#fff", fontSize: "14px" },
                  success: { iconTheme: { primary: "#A7F3D0", secondary: "#0F766E" } },
                }}
              />
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product" element={<ListingsPage />} />
                  <Route path="/product/:category" element={<ListingsPage />} />
                  <Route path="/donate" element={<DonatePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/item/:id" element={<ProductDetails />} />
                  <Route path="/swap" element={<Swap />} />
                  <Route path="/rewards" element={<RewardStore />} />
                  <Route path="/cart" element={<OrdersPage />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                  } />
                  <Route path="/add-product" element={
                    <ProtectedRoute><AddProduct /></ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute><Profile /></ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </PointsProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
