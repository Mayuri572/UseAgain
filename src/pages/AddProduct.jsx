// AddProduct.jsx — Form to create a new listing
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePoints } from '../context/PointsContext'
import { productService } from "../services/productService";
import { categorizeImage, suggestPrice } from '../services/aiService'
import { getUserLocation, DEFAULT_LOCATION } from '../utils/geoUtils'
import { MOCK_CATEGORIES } from '../mockData'
import { HiPhotograph, HiSparkles, HiLocationMarker, HiRefresh } from 'react-icons/hi'
import toast from 'react-hot-toast'

const CONDITIONS = ['Like New', 'Good', 'Fair']

export default function AddProduct() {
  const { user } = useAuth()
  const { awardPoints } = usePoints()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '', description: '', category: '', condition: 'Good',
    price: '', imageUrl: '', swapAllowed: false, swapFor: '',
    location: '', lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng,
  })
  const [aiLoading, setAiLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: value }))
    setErrors(err => ({ ...err, [field]: '' }))
  }

  const getLocation = async () => {
    setLocationLoading(true)
    try {
      const { lat, lng } = await getUserLocation()
      setForm(f => ({ ...f, lat, lng, location: 'Your current location' }))
      toast.success('Location detected!')
    } catch {
      toast.error('Could not detect location. Using default.')
    } finally {
      setLocationLoading(false)
    }
  }

  const handleAISuggest = async () => {
    if (!form.title && !form.category) {
      toast('Enter a title first for AI suggestions', { icon: 'ℹ️' })
      return
    }
    setAiLoading(true)
    try {
      const catResult = await categorizeImage(null, { title: form.title, description: form.description })
      const priceResult = await suggestPrice({ category: catResult.category, condition: form.condition, title: form.title })
      setForm(f => ({
        ...f,
        category: catResult.category,
        price: priceResult.suggestedPrice.toString(),
      }))
      toast.success(`AI suggested: ${catResult.category}, ₹${priceResult.suggestedPrice}`)
    } catch {
      toast.error('AI suggestion failed')
    } finally {
      setAiLoading(false)
    }
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.category) e.category = 'Select a category'
    if (!form.price || isNaN(form.price) || form.price <= 0) e.price = 'Enter a valid price'
    if (!form.description.trim()) e.description = 'Add a description'
    if (!form.imageUrl.trim()) e.imageUrl = 'Add an image URL'
    if (!form.location.trim()) e.location = 'Add a location'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); toast.error('Fix the highlighted errors'); return }

    setSubmitting(true)
    try {
      await createListing({
        ...form,
        price: parseInt(form.price),
        sellerId: user.uid,
        sellerName: user.displayName,
        sellerPhoto: user.photoURL,
        trustScore: user.trustScore || 50,
      })
      awardPoints(30, `New listing posted: ${form.title}`)
      toast.success('Listing posted! +30 points 🎉')
      navigate('/')
    } catch {
      toast.error('Failed to post listing. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-heading font-bold text-2xl text-gray-900 mb-2">Post an Item</h1>
      <p className="text-gray-500 text-sm mb-8">List something you no longer need. Earn points and help the community!</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* AI Suggest */}
        <div className="bg-accent/20 border border-accent rounded-xl p-4 flex items-center gap-4">
          <HiSparkles className="w-6 h-6 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">AI Auto-Fill</p>
            <p className="text-xs text-gray-600">Enter a title and let AI suggest category & price</p>
          </div>
          <button type="button" onClick={handleAISuggest} disabled={aiLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-60">
            {aiLoading ? '...' : 'Suggest'}
          </button>
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
            Item Photo URL <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <HiPhotograph className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input id="imageUrl" type="url" value={form.imageUrl} onChange={update('imageUrl')}
              placeholder="https://... (paste any image URL)"
              className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.imageUrl ? 'border-red-400' : 'border-gray-200'}`} />
          </div>
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-xl border" onError={e => e.target.style.display='none'} />
          )}
          {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
          <p className="text-xs text-gray-400 mt-1">Tip: Upload to Imgur, Google Photos, or any image host and paste the link.</p>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input id="title" type="text" value={form.title} onChange={update('title')}
            placeholder="e.g. Vintage Wooden Bookshelf" maxLength={100}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.title ? 'border-red-400' : 'border-gray-200'}`} />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select id="category" value={form.category} onChange={update('category')}
              className={`w-full px-3 py-3 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary ${errors.category ? 'border-red-400' : 'border-gray-200'}`}>
              <option value="">Select...</option>
              {MOCK_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1.5">Condition</label>
            <select id="condition" value={form.condition} onChange={update('condition')}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary">
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input id="price" type="number" value={form.price} onChange={update('price')}
              placeholder="0" min="0"
              className={`w-full pl-8 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.price ? 'border-red-400' : 'border-gray-200'}`} />
          </div>
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea id="desc" value={form.description} onChange={update('description')} rows={4} maxLength={1000}
            placeholder="Describe the item — age, any defects, what's included, pickup/delivery preferences..."
            className={`w-full px-4 py-3 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary ${errors.description ? 'border-red-400' : 'border-gray-200'}`} />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Swap toggle */}
        <div className="bg-bg-neutral rounded-xl p-4">
          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <div className={`w-12 h-6 rounded-full relative transition-colors ${form.swapAllowed ? 'bg-primary' : 'bg-gray-300'}`}
              onClick={() => setForm(f => ({ ...f, swapAllowed: !f.swapAllowed }))}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.swapAllowed ? 'translate-x-7' : 'translate-x-1'}`} />
            </div>
            <input type="checkbox" checked={form.swapAllowed} onChange={update('swapAllowed')} className="sr-only" aria-label="Allow swap" />
            <div>
              <p className="text-sm font-medium text-gray-900">Open to Swap</p>
              <p className="text-xs text-gray-500">Allow other users to offer items in exchange</p>
            </div>
            <span className="ml-auto">
              <HiRefresh className={`w-5 h-5 ${form.swapAllowed ? 'text-primary' : 'text-gray-400'}`} />
            </span>
          </label>
          {form.swapAllowed && (
            <input type="text" value={form.swapFor} onChange={update('swapFor')} placeholder="What would you like in exchange? (optional)"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
            Pickup Location <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input id="location" type="text" value={form.location} onChange={update('location')}
                placeholder="e.g. Kothrud, Pune"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.location ? 'border-red-400' : 'border-gray-200'}`} />
            </div>
            <button type="button" onClick={getLocation} disabled={locationLoading}
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-primary hover:text-primary transition disabled:opacity-60 shrink-0">
              {locationLoading ? '...' : '📍 Detect'}
            </button>
          </div>
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
        </div>

        {/* Submit */}
        <button type="submit" disabled={submitting}
          className="w-full py-4 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary-dark transition shadow hover:shadow-md disabled:opacity-60">
          {submitting ? 'Posting...' : 'Post Listing — Earn 30 Points!'}
        </button>
      </form>
    </main>
  )
}