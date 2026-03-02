import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineHeart, HiHeart, HiOutlineLocationMarker, HiOutlineChatAlt2,
  HiOutlineRefresh, HiOutlineBadgeCheck } from "react-icons/hi";
import { useCart } from "../context/CartContext.jsx";
import { formatDistance } from "../utils/geoUtils.js";
import { getTrustBadgeClasses } from "../utils/trustScore.js";
import toast from "react-hot-toast";

const CONDITION_COLORS = {
  "like-new": "bg-green-100 text-green-700",
  good: "bg-blue-100 text-blue-700",
  fair: "bg-yellow-100 text-yellow-700",
  poor: "bg-red-100 text-red-700",
};

const CONDITION_LABELS = {
  "like-new": "Like New",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

export default function ProductCard({ listing, product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const item = listing || product || {};
  const {
    id, title, price, condition, category, images = [],
    sellerName, sellerTrustScore = 0, swapAllowed,
    distance, wishlistCount = 0,
  } = item;

  const trustBadgeClass = getTrustBadgeClasses(sellerTrustScore);

  return (
    <article className="card group overflow-hidden flex flex-col animate-fade-in" aria-label={`Listing: ${title}`}>
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
        <Link to={`/item/${id}`}>
          <img
            src={imgError ? "https://via.placeholder.com/400x300?text=No+Image" : (images[0] || "https://via.placeholder.com/400x300?text=No+Image")}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Overlay badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={`badge border ${CONDITION_COLORS[condition] || "bg-gray-100 text-gray-600"}`}>
            {CONDITION_LABELS[condition] || condition}
          </span>
          {swapAllowed && (
            <span className="badge bg-primary/10 text-primary border border-primary/20">
              <HiOutlineRefresh className="text-xs" /> Swap OK
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow hover:scale-110 transition-transform"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
        >
          {wishlisted
            ? <HiHeart className="text-red-500 text-lg" />
            : <HiOutlineHeart className="text-gray-600 text-lg" />
          }
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <Link to={`/item/${id}`} className="group/title">
          <h3 className="font-semibold text-text-neutral text-sm leading-snug line-clamp-2 group-hover/title:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="font-poppins font-bold text-lg text-primary">₹{price?.toLocaleString()}</span>
        </div>

        {/* Seller + distance */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <div className="flex items-center gap-1">
            <span className={`badge border text-xs px-1.5 py-0.5 ${trustBadgeClass}`}>
              <HiOutlineBadgeCheck className="text-xs" />
              {sellerTrustScore}
            </span>
            <span className="truncate max-w-[80px]">{sellerName}</span>
          </div>
          {distance != null && (
            <span className="flex items-center gap-0.5 text-gray-500">
              <HiOutlineLocationMarker className="text-xs" />
              {formatDistance(distance)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => {
              toast.success("Proceeding to checkout");
              navigate(`/item/${id}?buy=1`);
            }}
            className="flex-1 btn-primary text-xs py-1.5"
            aria-label={`Buy ${title} now`}
          >
            Buy Now
          </button>
          <Link
            to={`/item/${id}`}
            className="p-1.5 border border-gray-200 rounded-lg hover:bg-bg-neutral transition-colors"
            aria-label="Chat with seller"
          >
            <HiOutlineChatAlt2 className="text-gray-600" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Skeleton loader for product cards */
export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="shimmer aspect-[4/3] rounded-t-2xl" />
      <div className="p-3 space-y-2">
        <div className="shimmer h-4 rounded w-3/4" />
        <div className="shimmer h-4 rounded w-1/2" />
        <div className="shimmer h-6 rounded w-1/3" />
        <div className="shimmer h-8 rounded-lg" />
      </div>
    </div>
  );
}
