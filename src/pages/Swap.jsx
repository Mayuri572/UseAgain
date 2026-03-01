// Swap.jsx — Browse swap-enabled listings
import { useState, useEffect } from 'react'
import { fetchListings } from '../services/productService'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import { HiRefresh } from 'react-icons/hi'

export default function Swap() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
      .then(all => setListings(all.filter(l => l.swapAllowed)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
            <HiRefresh className="w-6 h-6 text-accent" />
          </div>
          <h1 className="font-heading font-bold text-2xl">Swap Marketplace</h1>
        </div>
        <p className="text-white/80 max-w-xl">
          Exchange items without spending money! Browse items with swap enabled, and offer something you own in return. Both parties confirm the swap and earn reward points.
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm">
          {['No money needed', 'Earn swap points', 'Two-way confirmation', 'Safe & tracked'].map(f => (
            <span key={f} className="bg-white/10 px-3 py-1.5 rounded-lg text-accent">{f}</span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { step: '1', title: 'Find an item', desc: 'Browse swap-enabled listings' },
          { step: '2', title: 'Make an offer', desc: 'Describe what you\'ll give in return' },
          { step: '3', title: 'Confirm & swap!', desc: 'Both confirm — earn 25 points each' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-2">{step}</div>
            <p className="font-semibold text-sm text-gray-900">{title}</p>
            <p className="text-xs text-gray-500 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">
        Available for Swap ({loading ? '...' : listings.length})
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {listings.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </main>
  )
}