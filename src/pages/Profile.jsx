// Profile.jsx
import { useAuth } from '../context/AuthContext'
import { usePoints } from '../context/PointsContext'
import { getTrustBadge, computeTrustScore } from '../utils/trustScore'
import { MOCK_LISTINGS } from '../mockData'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { HiStar, HiShieldCheck, HiMail, HiLocationMarker } from 'react-icons/hi'

export default function Profile() {
  const { user } = useAuth()
  const { points } = usePoints()

  const trustScore = computeTrustScore({
    completedDeals: user?.completedDeals || 0,
    avgRating: user?.avgRating || 0,
    isEmailVerified: true,
  })
  const badge = getTrustBadge(trustScore)
  const myListings = MOCK_LISTINGS.filter(l => l.sellerId === user?.uid)

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Profile card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=0F766E&color=fff&size=128`}
            alt={user?.displayName}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-accent shadow"
          />
          <div className="flex-1">
            <h1 className="font-heading font-bold text-2xl text-gray-900">{user?.displayName}</h1>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <HiMail className="w-4 h-4" /> {user?.email}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${badge.bg} ${badge.color}`}>
                {badge.emoji} {badge.label} Seller
              </span>
              <span className="bg-accent-yellow/30 text-amber-700 text-sm px-3 py-1 rounded-full font-semibold">
                ⭐ {points} points
              </span>
            </div>
          </div>
          <Link to="/add-product" className="hidden sm:block bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition">
            + Post Item
          </Link>
        </div>

        {/* Trust score bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Trust Score</span>
            <span className="font-bold text-primary">{trustScore}/100</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000"
              style={{ width: `${trustScore}%` }} role="progressbar" aria-valuenow={trustScore} aria-valuemax={100} />
          </div>
          <p className="text-xs text-gray-400 mt-2">Complete more deals and get verified to boost your score</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
          {[
            { label: 'Completed Deals', value: user?.completedDeals || 0 },
            { label: 'Avg Rating', value: user?.avgRating ? `${user.avgRating}★` : 'No ratings yet' },
            { label: 'Listings Posted', value: myListings.length },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-bold text-xl text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My Listings */}
      <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">My Listings</h2>
      {myListings.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-gray-500 text-sm mb-4">You haven't posted any listings yet.</p>
          <Link to="/add-product" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-dark transition inline-block">
            Post Your First Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {myListings.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </main>
  )
}