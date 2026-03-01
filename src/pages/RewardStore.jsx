// RewardStore.jsx — Redeem points for rewards
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePoints } from '../context/PointsContext'
import { MOCK_REWARDS } from '../mockData'
import { HiStar } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function RewardStore() {
  const { user } = useAuth()
  const { points, deductPoints } = usePoints()
  const navigate = useNavigate()
  const [redeeming, setRedeeming] = useState(null)
  const [confirmItem, setConfirmItem] = useState(null)

  const handleRedeem = async (reward) => {
    if (!user) { navigate('/login'); return }
    if (points < reward.points) { toast.error('Not enough points!'); return }
    setRedeeming(reward.id)
    // Simulate claim creation
    await new Promise(r => setTimeout(r, 800))
    deductPoints(reward.points, `Redeemed: ${reward.name}`)
    toast.success(`🎉 Claimed! "${reward.name}" — check your email soon.`)
    setConfirmItem(null)
    setRedeeming(null)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Rewards Store</h1>
          <p className="text-gray-500 text-sm">Redeem your points for real-world rewards</p>
        </div>
        <div className="flex items-center gap-2 bg-accent-yellow/30 border border-amber-200 px-4 py-3 rounded-xl">
          <HiStar className="w-5 h-5 text-amber-500" />
          <div>
            <p className="font-bold text-amber-800 text-lg">{points}</p>
            <p className="text-xs text-amber-600">Available Points</p>
          </div>
        </div>
      </div>

      {/* How to earn */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-5 mb-8 text-white">
        <h2 className="font-semibold mb-3">How to Earn Points</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
          {[
            { action: 'Join UseAgain', pts: '+50' },
            { action: 'Post a listing', pts: '+30' },
            { action: 'Complete a sale', pts: '+20' },
            { action: 'Complete a swap', pts: '+25' },
          ].map(({ action, pts }) => (
            <div key={action} className="bg-white/10 rounded-xl p-3">
              <p className="text-accent font-bold text-lg">{pts}</p>
              <p className="text-white/80 text-xs mt-1">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {!user && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-center text-sm">
          <Link to="/login" className="text-primary font-semibold">Log in</Link> to redeem rewards with your points.
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_REWARDS.map(reward => {
          const canAfford = points >= reward.points
          return (
            <div key={reward.id} className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col ${!reward.available ? 'opacity-60' : ''} ${canAfford && reward.available ? 'border-primary/30' : 'border-gray-100'}`}>
              <div className="text-4xl mb-3">{reward.icon}</div>
              <h3 className="font-heading font-semibold text-gray-900 mb-1">{reward.name}</h3>
              <div className="flex items-center gap-1 mt-auto pt-4">
                <HiStar className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-amber-600">{reward.points} pts</span>
              </div>
              <button
                onClick={() => reward.available && setConfirmItem(reward)}
                disabled={!reward.available || !canAfford || !user}
                className={`mt-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  !reward.available ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : canAfford && user ? 'bg-primary text-white hover:bg-primary-dark shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {!reward.available ? 'Out of Stock' : !user ? 'Login to Redeem' : !canAfford ? `Need ${reward.points - points} more pts` : 'Redeem'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Confirm Modal */}
      {confirmItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <p className="text-4xl text-center mb-3">{confirmItem.icon}</p>
            <h2 className="font-heading font-bold text-xl text-center mb-1">Confirm Redemption</h2>
            <p className="text-center text-gray-600 text-sm mb-5">
              Redeem <strong>{confirmItem.name}</strong> for <strong>{confirmItem.points} points</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmItem(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">Cancel</button>
              <button onClick={() => handleRedeem(confirmItem)} disabled={redeeming === confirmItem.id}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-60">
                {redeeming === confirmItem.id ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}