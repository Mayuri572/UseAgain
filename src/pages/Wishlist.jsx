// Wishlist.jsx
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { HiHeart } from 'react-icons/hi'
import { Link } from 'react-router-dom'

export default function Wishlist() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('useagain_wishlist') || '[]')
    setItems(saved)
  }, [])

  if (items.length === 0) return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <HiHeart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="font-heading font-bold text-xl text-gray-700 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-400 mb-6">Heart items you like to save them here.</p>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold">Browse Listings</Link>
      </div>
    </main>
  )

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-heading font-bold text-2xl text-gray-900 mb-6">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {items.map(item => <ProductCard key={item.id} product={item} />)}
      </div>
    </main>
  )
}