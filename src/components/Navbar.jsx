import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import {
  HiOutlineShoppingCart,
  HiOutlineSearch,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineHeart,
  HiOutlinePlus,
} from "react-icons/hi";
import { MdOutlineRecycling } from "react-icons/md";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/product?search=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="UseAgain Home">
            <MdOutlineRecycling className="text-primary text-3xl" />
            <span className="font-poppins font-bold text-lg sm:text-xl text-primary block">
              Use<span className="text-text-neutral">Again</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:flex">
            <div className="relative w-full">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search listings near you…"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-bg-neutral"
                aria-label="Search listings"
              />
            </div>
          </form>

          <div className="hidden lg:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/product">Product</NavLink>
            <NavLink to="/rewards">Rewards</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </div>

          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            {user && (
              <Link to="/add-product" className="btn-primary text-sm hidden sm:flex items-center gap-1.5 py-2">
                <HiOutlinePlus /> Post Item
              </Link>
            )}

            <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-bg-neutral transition-colors" aria-label="Wishlist">
              <HiOutlineHeart className="text-xl text-gray-600" />
            </Link>

            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-bg-neutral transition-colors" aria-label={`Cart, ${count} items`}>
              <HiOutlineShoppingCart className="text-xl text-gray-600" />
              {count > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-bg-neutral transition-colors"
                  aria-label="Profile menu"
                  aria-expanded={profileOpen}
                >
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt={user.displayName || "User avatar"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-accent"
                  />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-sm truncate">{user.displayName}</p>
                      <p className="text-xs text-gray-500">{user.points || 0} points</p>
                    </div>
                    <MenuLink to="/profile" icon={<HiOutlineUser />} label="Profile" onClick={() => setProfileOpen(false)} />
                    <MenuLink to="/dashboard" icon={<HiOutlineUser />} label="My Dashboard" onClick={() => setProfileOpen(false)} />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <HiOutlineLogout /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2">
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-bg-neutral"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiOutlineX className="text-xl" /> : <HiOutlineMenu className="text-xl" />}
            </button>
          </div>
        </div>

        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search listings…"
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-bg-neutral"
              />
            </div>
          </form>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 space-y-1">
            {[["Home", "/"], ["Product", "/product"], ["Rewards", "/rewards"], ["Dashboard", "/dashboard"]].map(
              ([label, to]) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-text-neutral hover:bg-bg-neutral rounded-lg"
                >
                  {label}
                </Link>
              )
            )}
            {user && (
              <Link
                to="/add-product"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-semibold text-primary"
              >
                + Post Item
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-bg-neutral rounded-lg transition-colors">
      {children}
    </Link>
  );
}

function MenuLink({ to, icon, label, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-bg-neutral transition-colors">
      {icon} {label}
    </Link>
  );
}
