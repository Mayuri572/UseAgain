// Home.jsx — Main browse/listing feed page
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import QuoteSlider from '../components/QuoteSlider'
import { productService } from "../services/productService";
import { getUserLocation, DEFAULT_LOCATION } from '../utils/geoUtils'
import { MOCK_CATEGORIES } from '../mockData'
import { HiFilter, HiRefresh, HiLocationMarker, HiPlus } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function Home() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const [listings, setListings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION)
  const [locationLoading, setLocationLoading] = useState(false)

  // Filters
  const [category, setCategory] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [swapOnly, setSwapOnly] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadListings()
    tryGetLocation()
  }, [])

  const loadListings = async () => {
    setLoading(true)
    try {
     const data = await productService.getListings();
      setListings(data)
    } catch {
      toast.error('Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  const tryGetLocation = async () => {
    setLocationLoading(true)
    try {
      const loc = await getUserLocation()
      setUserLocation({ ...loc, label: 'Your location' })
    } catch { /* use default */ }
    setLocationLoading(false)
  }

  // Filter & search effect
  useEffect(() => {
    let result = [...listings]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(l =>
        l.title?.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q) ||
        l.category?.toLowerCase().includes(q)
      )
    }
    if (category) result = result.filter(l => l.category === category)
    if (maxPrice) result = result.filter(l => l.price <= parseInt(maxPrice))
    if (swapOnly) result = result.filter(l => l.swapAllowed)

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    else result.sort((a, b) => b.createdAt - a.createdAt)

    setFiltered(result)
  }, [listings, searchQuery, category, maxPrice, swapOnly, sortBy])

  const clearFilters = () => {
    setCategory('')
    setMaxPrice('')
    setSwapOnly(false)
    setSortBy('recent')
  }

  const hasFilters = category || maxPrice || swapOnly || sortBy !== 'recent'

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-16 px-6" aria-label="Hero section">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Buy • Sell • Swap • Donate
            <br />
            <span className="text-accent">— locally</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join Pune's hyperlocal circular marketplace. Give items a second life, earn rewards, and reduce waste in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#listings" className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-accent transition shadow-lg hover:shadow-xl scale-hover">
              Browse Listings
            </a>
            <Link to="/add-product" className="px-6 py-3 bg-accent/20 border border-white/30 text-white font-bold rounded-xl hover:bg-accent/30 transition">
              + Post Item
            </Link>
          </div>

          {/* Impact mini-stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { value: '342+', label: 'Items Traded' },
              { value: '1.8t', label: 'Waste Saved' },
              { value: '1,284', label: 'Members' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-accent">{value}</p>
                <p className="text-xs text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Slider */}
      <QuoteSlider />

      {/* Categories */}
      <section className="py-10 px-4" aria-label="Browse categories">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">Browse by Category</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {MOCK_CATEGORIES.map(({ name, icon, count }) => (
              <button
                key={name}
                onClick={() => setCategory(category === name ? '' : name)}
                aria-pressed={category === name}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition cursor-pointer ${
                  category === name
                    ? 'border-primary bg-accent/20 shadow'
                    : 'border-gray-100 bg-white hover:border-primary/30 hover:bg-bg-neutral'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">{icon}</span>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{name}</span>
                <span className="text-xs text-gray-400">{count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section id="listings" className="py-6 px-4 pb-16" aria-label="Product listings">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-heading font-bold text-xl text-gray-900">
                {searchQuery ? `Results for "${searchQuery}"` : category || 'All Listings'}
              </h2>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                <HiLocationMarker className="w-4 h-4" />
                <span>{locationLoading ? 'Detecting location...' : userLocation.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                aria-label="Sort listings"
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="recent">Most Recent</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              {/* Filter toggle */}
              <button onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition ${
                  hasFilters ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 bg-white text-gray-600 hover:border-primary/50'
                }`}>
                <HiFilter className="w-4 h-4" />
                Filters {hasFilters && '•'}
              </button>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end animate-slide-up">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Max Price (₹)</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  placeholder="e.g. 5000"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={swapOnly} onChange={e => setSwapOnly(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary" />
                <span className="text-sm font-medium text-gray-700">Swap available only</span>
              </label>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
                  <HiRefresh className="w-4 h-4" /> Clear filters
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="font-heading font-bold text-lg text-gray-700 mb-2">No listings found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or be the first to list something!</p>
              <Link to="/add-product" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition">
                <HiPlus className="w-5 h-5" /> Post First Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  userLat={userLocation.lat}
                  userLng={userLocation.lng}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}