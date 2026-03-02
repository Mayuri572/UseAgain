// Dashboard.jsx — Community impact dashboard with chart.js
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePoints } from '../context/PointsContext'
import { MOCK_IMPACT_STATS, MOCK_LISTINGS } from '../mockData'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Link } from 'react-router-dom'
import { HiTrendingUp, HiCollection, HiGlobe, HiStar, HiUserGroup, HiRefresh } from 'react-icons/hi'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']

export default function Dashboard() {
  const { user } = useAuth()
  const { points, history } = usePoints()
  const [stats] = useState(MOCK_IMPACT_STATS)
  const [userListings] = useState(MOCK_LISTINGS.filter(l => l.sellerId === user?.uid).length)

  const barData = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Items Traded',
        data: [38, 52, 61, 75, 88, 28],
        backgroundColor: '#0F766E',
        borderRadius: 6,
      },
      {
        label: 'Swaps',
        data: [8, 12, 15, 18, 22, 14],
        backgroundColor: '#A7F3D0',
        borderRadius: 6,
      },
    ],
  }

  const doughnutData = {
    labels: ['Electronics', 'Furniture', 'Clothing', 'Sports', 'Other'],
    datasets: [{
      data: [35, 25, 20, 12, 8],
      backgroundColor: ['#0F766E', '#14b8a6', '#A7F3D0', '#FDE68A', '#e5e7eb'],
      borderWidth: 0,
    }],
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } },
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">
            {user ? `${user.displayName?.split(' ')[0]}'s Dashboard` : 'Community Dashboard'}
          </h1>
          <p className="text-gray-500 text-sm">See your impact and the community's progress</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Link to="/product" className="btn-primary text-sm items-center gap-2 inline-flex">
            Continue Shopping
          </Link>
          <Link to="/rewards" className="items-center gap-2 bg-accent-yellow/30 text-amber-700 px-4 py-2 rounded-xl text-sm font-semibold border border-amber-200 hover:bg-accent-yellow/50 transition inline-flex">
            <HiStar className="w-4 h-4" />
            {points} pts — Redeem Rewards
          </Link>
        </div>
      </div>

      {/* Community Stats */}
      <section aria-label="Community statistics">
        <h2 className="font-heading font-semibold text-lg text-gray-700 mb-4">🌍 Community Impact</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { icon: HiCollection, label: 'Items Traded', value: stats.itemsTraded.toLocaleString(), color: 'text-teal-600', bg: 'bg-teal-50' },
            { icon: HiGlobe, label: 'Waste Diverted', value: `${(stats.kgWasteDiverted / 1000).toFixed(1)}t`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: '🌱', label: 'CO₂ Saved (kg)', value: stats.co2Saved.toLocaleString(), color: 'text-green-600', bg: 'bg-green-50', isEmoji: true },
            { icon: HiUserGroup, label: 'Active Members', value: stats.activeUsers.toLocaleString(), color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: HiRefresh, label: 'Swaps Done', value: stats.swapsCompleted, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map(({ icon: Icon, label, value, color, bg, isEmoji }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                {isEmoji ? <span className="text-xl">{Icon}</span> : <Icon className={`w-5 h-5 ${color}`} />}
              </div>
              <p className={`text-2xl font-bold font-heading ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-gray-900 mb-5">Monthly Activity</h3>
          <Bar data={barData} options={chartOptions} />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-gray-900 mb-5">Category Breakdown</h3>
          <Doughnut data={doughnutData} options={{ ...chartOptions, scales: undefined }} />
        </div>
      </div>

      {/* User stats if logged in */}
      {user && (
        <section aria-label="Your personal stats">
          <h2 className="font-heading font-semibold text-lg text-gray-700 mb-4">📊 Your Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Your Points', value: points, emoji: '⭐' },
              { label: 'Trust Score', value: user.trustScore || 20, emoji: '🛡️' },
              { label: 'Your Listings', value: userListings, emoji: '📦' },
              { label: 'Completed Deals', value: user.completedDeals || 0, emoji: '✅' },
            ].map(({ label, value, emoji }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
                <p className="text-2xl mb-1">{emoji}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Points history */}
          {history.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-gray-900 mb-4">Points History</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {history.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{entry.reason}</p>
                      <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`font-bold ${entry.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {entry.amount > 0 ? '+' : ''}{entry.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {!user && (
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-center text-white">
          <p className="text-3xl mb-3">🌱</p>
          <h3 className="font-heading font-bold text-xl mb-2">Join to Track Your Impact</h3>
          <p className="text-white/80 text-sm mb-5">Sign up to see your personal stats, earn points, and contribute to community goals.</p>
          <Link to="/register" className="inline-block px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-accent transition">
            Create Free Account
          </Link>
        </div>
      )}
    </main>
  )
}
