import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard.jsx";
import { productService } from "../services/productService.js";
import { DEFAULT_LOCATION, getUserLocation, calculateDistance } from "../utils/geoUtils.js";
import toast from "react-hot-toast";

export default function ListingsPage() {
  const { category: categoryParam } = useParams();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const decodedCategory = categoryParam ? decodeURIComponent(categoryParam) : "";

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const loc = await getUserLocation();
        if (active) setUserLocation(loc);
      } catch {
        // Keep default location
      }
    };
    init();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const filters = {};
        if (decodedCategory) filters.category = decodedCategory;
        if (search) filters.search = search;

        const data = await productService.getListings(filters);
        const nearby = data
          .map((item) => {
            const hasCoords = typeof item.lat === "number" && typeof item.lng === "number";
            const distance = hasCoords
              ? calculateDistance(userLocation.lat, userLocation.lng, item.lat, item.lng)
              : null;
            return { ...item, distance };
          })
          .filter((item) => item.distance == null || item.distance <= 5);

        // If strict radius yields nothing (common when user is outside demo city),
        // fall back to category/search results so Browse never appears empty.
        const results = nearby.length > 0 ? nearby : data.map((item) => ({ ...item, distance: null }));
        if (active) setListings(results);
      } catch {
        toast.error("Failed to load listings");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [decodedCategory, search, userLocation]);

  const title = useMemo(() => {
    if (decodedCategory) return decodedCategory;
    return "All Products";
  }, [decodedCategory]);

  return (
    <main className="bg-bg-neutral min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="font-poppins text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600">
              {search ? `Results for "${search}" within 5 km` : "Listings within 5 km of your location"}
            </p>
          </div>
          <Link
            to="/product"
            className="rounded-lg border border-gray-200 text-gray-700 px-3 py-2 text-sm hover:bg-white transition-colors"
          >
            Clear category
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
            <p className="text-gray-900 text-lg font-medium">No listings found in this radius.</p>
            <p className="text-gray-500 mt-1">Try another category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {listings.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
