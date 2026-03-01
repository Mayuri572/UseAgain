// Register.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePoints } from '../context/PointsContext'
import Captcha from '../components/Captcha'
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'

export default function Register() {
  const { register, loginWithGoogle } = useAuth()
  const { awardPoints } = usePoints()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [captchaValid, setCaptchaValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agree, setAgree] = useState(false)

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Enter your name'); return }
    if (!form.email) { toast.error('Enter your email'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    if (form.password !== form.confirm) { toast.error('Passwords don\'t match'); return }
    if (!captchaValid) { toast.error('Please complete the CAPTCHA'); return }
    if (!agree) { toast.error('Please accept the terms'); return }

    setLoading(true)
    try {
      await register(form.email, form.password, form.name)
      awardPoints(50, 'Welcome bonus for joining UseAgain!')
      toast.success('Account created! Welcome to UseAgain 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await loginWithGoogle()
      awardPoints(50, 'Welcome bonus for joining UseAgain!')
      toast.success('Welcome to UseAgain! 🎉')
      navigate('/')
    } catch {
      toast.error('Google sign-up failed')
    }
  }

  return (
    <main className="min-h-screen bg-bg-neutral flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow">
              <span className="text-white font-heading font-bold text-2xl">U</span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-gray-900">Join UseAgain</h1>
            <p className="text-gray-500 text-sm mt-1">Create your free account. Get 50 points on signup!</p>
          </div>

          {/* Google */}
          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-bg-neutral transition mb-4">
            <FcGoogle className="w-5 h-5" /> Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or fill in details</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input id="name" type="text" value={form.name} onChange={update('name')}
                    placeholder="Your name" autoComplete="name" required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input id="reg-email" type="email" value={form.email} onChange={update('email')}
                    placeholder="you@example.com" autoComplete="email" required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-pass" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input id="reg-pass" type={showPass ? 'text' : 'password'} value={form.password} onChange={update('password')}
                    placeholder="Min 6 characters" autoComplete="new-password" required
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <button type="button" onClick={() => setShowPass(!showPass)} aria-label="Toggle password"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input id="confirm" type="password" value={form.confirm} onChange={update('confirm')}
                    placeholder="Repeat password" autoComplete="new-password" required
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      form.confirm && form.confirm !== form.password ? 'border-red-400' : 'border-gray-200'
                    }`} />
                </div>
              </div>

              {/* CAPTCHA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verify you're human</label>
                <Captcha onValidate={setCaptchaValid} />
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-primary rounded" />
                <span className="text-xs text-gray-600">
                  I agree to UseAgain's{' '}
                  <span className="text-primary underline cursor-pointer">Terms of Service</span> and{' '}
                  <span className="text-primary underline cursor-pointer">Privacy Policy</span>
                </span>
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary-dark transition shadow-sm disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account — Get 50 Points!'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}