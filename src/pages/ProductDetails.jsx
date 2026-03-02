// ProductDetails.jsx — Full listing detail page with buy/swap/chat
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { fetchListingById, createOrder, createSwapRequest } from '../services/productService'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { usePoints } from '../context/PointsContext'
import ChatBox from '../components/ChatBox'
import { getTrustBadge } from '../utils/trustScore'
import { calculateCO2Saved, co2Equivalent, formatImpact } from '../utils/co2Calculator'
import { HiLocationMarker, HiChat, HiShoppingCart, HiRefresh, HiShare, HiHeart, HiStar } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function ProductDetails() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const openChat = searchParams.get('chat') === '1'
  const openBuy = searchParams.get('buy') === '1'

  const { user } = useAuth()
  const { addToCart, items } = useCart()
  const { awardPoints } = usePoints()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(openChat)
  const [showBuyModal, setShowBuyModal] = useState(openBuy)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [swapDescription, setSwapDescription] = useState('')
  const [purchasing, setPurchasing] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [id])

  useEffect(() => {
    if (openBuy) setShowBuyModal(true)
  }, [openBuy])

  useEffect(() => {
    if (product) {
      const saved = JSON.parse(localStorage.getItem('useagain_wishlist') || '[]')
      setWishlisted(saved.some(i => i.id === product.id))
    }
  }, [product])

  const loadProduct = async () => {
    setLoading(true)
    try {
      const data = await fetchListingById(id)
      setProduct(data)
    } catch {
      toast.error('Failed to load listing')
    } finally {
      setLoading(false)
    }
  }

  const handleWishlist = () => {
    if (!user) { navigate('/login'); return }
    const saved = JSON.parse(localStorage.getItem('useagain_wishlist') || '[]')
    if (wishlisted) {
      localStorage.setItem('useagain_wishlist', JSON.stringify(saved.filter(i => i.id !== product.id)))
      setWishlisted(false)
      toast('Removed from wishlist')
    } else {
      localStorage.setItem('useagain_wishlist', JSON.stringify([...saved, product]))
      setWishlisted(true)
      toast.success('Added to wishlist ❤️')
    }
  }

  const handleBuy = async () => {
    if (!user) { navigate('/login'); return }
    setPurchasing(true)
    try {
      const orderId = await createOrder({
        listingId: product.id,
        listingTitle: product.title,
        buyerId: user.uid,
        sellerId: product.sellerId,
        amount: product.price,
        paymentMethod,
        commission: Math.round(product.price * 0.05),
      })
      awardPoints(20, `Purchase: ${product.title}`)
      toast.success(`Order placed! ${paymentMethod === 'secure' ? 'Payment held in escrow.' : 'Meet seller for cash pickup.'}`)
      setShowBuyModal(false)
      navigate('/dashboard')
    } catch {
      toast.error('Failed to place order')
    } finally {
      setPurchasing(false)
    }
  }

  const handleSwapRequest = async () => {
    if (!user) { navigate('/login'); return }
    if (!swapDescription.trim()) { toast.error('Describe what you\'re offering to swap'); return }
    try {
      await createSwapRequest({
        listingId: product.id,
        listingTitle: product.title,
        requesterId: user.uid,
        requesterName: user.displayName,
        ownerId: product.sellerId,
        offerDescription: swapDescription,
      })
      awardPoints(10, `Swap request sent for: ${product.title}`)
      toast.success('Swap request sent! The seller will review and respond.')
      setShowSwapModal(false)
    } catch {
      toast.error('Failed to send swap request')
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-2/3" />
            <div className="h-10 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-5xl mb-4">😕</p>
          <h2 className="font-heading font-bold text-xl text-gray-700 mb-2">Listing not found</h2>
          <Link to="/" className="text-primary underline">Browse all listings</Link>
        </div>
      </div>
    )
  }

  const badge = getTrustBadge(product.trustScore || 50)
  const co2 = calculateCO2Saved(product.category, product.condition)
  const equiv = co2Equivalent(co2)
  const inCart = items.some(i => i.id === product.id)

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium truncate">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <div className="aspect-square bg-bg-neutral rounded-2xl overflow-hidden">
            <img src={product.imageUrl || product.images?.[0] || 'https://placehold.co/600x600?text=No+Image'} alt={product.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://placehold.co/600x600?text=No+Image' }}
            />
          </div>
          {/* Impact badge */}
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Buying this saves {formatImpact(co2)}</p>
              <p className="text-xs text-emerald-700">≈ {equiv.kmsNotDriven} km not driven, or {equiv.treeMonths} months of a tree's work</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{product.category}</span>
              <h1 className="font-heading font-bold text-2xl text-gray-900 mt-1">{product.title}</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={handleWishlist} aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`p-2 border rounded-xl transition ${wishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'}`}>
                <HiHeart className="w-5 h-5" />
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
                aria-label="Share listing" className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-primary hover:border-primary/30 transition">
                <HiShare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-primary mb-4">₹{product.price?.toLocaleString('en-IN')}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.bg} ${badge.color}`}>
              {badge.emoji} {badge.label} Seller
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
              {product.condition}
            </span>
            {product.swapAllowed && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-accent text-primary flex items-center gap-1">
                <HiRefresh className="w-3 h-3" /> Swap Available
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            {product.swapAllowed && product.swapFor && (
              <p className="mt-2 text-sm text-primary font-medium">Looking to swap for: {product.swapFor}</p>
            )}
          </div>

          {/* Seller */}
          <div className="flex items-center gap-3 p-4 bg-bg-neutral rounded-xl mb-6">
            <img src={product.sellerPhoto || `https://ui-avatars.com/api/?name=${product.sellerName}&background=0F766E&color=fff`}
              alt={product.sellerName} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-gray-900">{product.sellerName}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <HiLocationMarker className="w-3 h-3" />
                <span>{product.location}</span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="flex items-center gap-1 text-amber-500">
                <HiStar className="w-4 h-4" />
                <span className="font-semibold text-sm">{product.trustScore || 50}/100</span>
              </div>
              <p className="text-xs text-gray-400">Trust Score</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { if (!user) { navigate('/login'); return }; toast.success('Proceeding to checkout'); setShowBuyModal(true) }}
                className="py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition shadow-sm hover:shadow">
                Buy Now
              </button>
              <button onClick={() => { addToCart(product) }}
                disabled={inCart}
                className={`py-3 rounded-xl font-semibold border-2 transition ${inCart ? 'border-gray-200 text-gray-400 bg-gray-50' : 'border-primary text-primary hover:bg-primary/5'}`}>
                <span className="flex items-center justify-center gap-1.5">
                  <HiShoppingCart className="w-4 h-4" />
                  {inCart ? 'In Cart' : 'Add to Cart'}
                </span>
              </button>
            </div>
            {product.swapAllowed && (
              <button onClick={() => { if (!user) { navigate('/login'); return }; setShowSwapModal(true) }}
                className="w-full py-3 bg-accent text-primary rounded-xl font-semibold hover:bg-accent/70 transition flex items-center justify-center gap-2 border border-accent">
                <HiRefresh className="w-4 h-4" /> Offer Swap
              </button>
            )}
            <button onClick={() => { if (!user) { navigate('/login'); return }; setShowChat(!showChat) }}
              className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-bg-neutral transition flex items-center justify-center gap-2">
              <HiChat className="w-4 h-4" /> {showChat ? 'Hide Chat' : 'Message Seller'}
            </button>
          </div>
        </div>
      </div>

      {/* Chat */}
      {showChat && (
        <div className="mt-8 animate-slide-up">
          <h2 className="font-heading font-semibold text-lg text-gray-900 mb-4">Chat with Seller</h2>
          <ChatBox listing={product} onClose={() => setShowChat(false)} />
        </div>
      )}

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby="buy-modal-title">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-slide-up">
            <h2 id="buy-modal-title" className="font-heading font-bold text-xl mb-4">Confirm Purchase</h2>
            <div className="bg-bg-neutral rounded-xl p-4 mb-5">
              <p className="font-semibold text-gray-900">{product.title}</p>
              <p className="text-2xl font-bold text-primary mt-1">₹{product.price?.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500 mt-1">Platform commission (5%): ₹{Math.round(product.price * 0.05)}</p>
            </div>

            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-3">Payment Method</p>
              <div className="space-y-2">
                {[
                  { value: 'secure', label: 'Secure Escrow', desc: 'Payment held safely until pickup confirmed' },
                  { value: 'cash', label: 'Cash at Pickup', desc: 'Pay in person when collecting the item' },
                ].map(({ value, label, desc }) => (
                  <label key={value}
                    className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition ${paymentMethod === value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={value} checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)} className="mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowBuyModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-bg-neutral">
                Cancel
              </button>
              <button onClick={handleBuy} disabled={purchasing}
                className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-60">
                {purchasing ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby="swap-modal-title">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-slide-up">
            <h2 id="swap-modal-title" className="font-heading font-bold text-xl mb-2">Offer a Swap</h2>
            <p className="text-sm text-gray-500 mb-4">Tell the seller what you'd like to trade in exchange for <strong>{product.title}</strong></p>
            {product.swapFor && (
              <div className="bg-accent/30 rounded-xl p-3 mb-4 text-sm text-primary font-medium">
                Seller is looking for: {product.swapFor}
              </div>
            )}
            <textarea
              value={swapDescription}
              onChange={e => setSwapDescription(e.target.value)}
              placeholder="Describe your item(s) — name, condition, estimated value..."
              rows={4} maxLength={500}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowSwapModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold">
                Cancel
              </button>
              <button onClick={handleSwapRequest}
                className="flex-1 py-3 bg-accent text-primary rounded-xl text-sm font-semibold hover:bg-accent/70 transition">
                Send Swap Request
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
