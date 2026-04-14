'use client'

import { useState } from 'react'
import { useSignIn, useSignUp } from '@clerk/nextjs'
import { LogIn, UserPlus, Loader2, MailCheck, ArrowLeft } from 'lucide-react'

type Mode = 'signin' | 'signup' | 'verify'

export default function AuthSection() {
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn()
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp()

  const [mode, setMode]         = useState<Mode>('signin')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp]           = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next)
    setError('')
    setOtp('')
  }

  // ── Sign In ────────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signInLoaded || !signIn) return
    setLoading(true)
    setError('')

    try {
      const result = await signIn.create({ identifier: email, password })
      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId })
      }
    } catch (err: unknown) {
      const e = err as { errors?: { longMessage?: string; message?: string }[] }
      setError(e.errors?.[0]?.longMessage || e.errors?.[0]?.message || 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  // ── Sign Up ────────────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUpLoaded || !signUp) return
    setLoading(true)
    setError('')

    try {
      await signUp.create({ emailAddress: email, password })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setMode('verify')
    } catch (err: unknown) {
      const e = err as { errors?: { longMessage?: string; message?: string }[] }
      setError(e.errors?.[0]?.longMessage || e.errors?.[0]?.message || 'Sign up failed.')
    } finally {
      setLoading(false)
    }
  }

  // ── OTP Verification ───────────────────────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUpLoaded || !signUp) return
    setLoading(true)
    setError('')

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: otp })
      if (result.status === 'complete') {
        await setSignUpActive({ session: result.createdSessionId })
      }
    } catch (err: unknown) {
      const e = err as { errors?: { longMessage?: string; message?: string }[] }
      setError(e.errors?.[0]?.longMessage || e.errors?.[0]?.message || 'Invalid code.')
    } finally {
      setLoading(false)
    }
  }

  // ── Verify Screen ──────────────────────────────────────────────────────────
  if (mode === 'verify') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-3">
            <MailCheck className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-base">Check your email</h3>
          <p className="text-xs text-gray-400 mt-1">
            We sent a 6-digit code to <span className="font-semibold text-black">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
              Verification Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-center tracking-[0.5em] font-bold focus:ring-2 focus:ring-black outline-none transition-all"
              required
            />
          </div>

          {error && (
            <p className="text-[11px] text-center text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
          </button>

          <button
            type="button"
            onClick={() => switchMode('signup')}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] text-gray-400 hover:text-black font-medium transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>
        </form>
      </div>
    )
  }

  // ── Sign In / Sign Up Screen ───────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@xalimartgroup.sn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
            required
          />
        </div>

        {error && (
          <p className="text-[11px] text-center text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : mode === 'signin' ? (
            <><LogIn className="w-4 h-4" /> Sign In</>
          ) : (
            <><UserPlus className="w-4 h-4" /> Create Account</>
          )}
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-[11px] text-gray-400 hover:text-black font-medium transition-colors"
          >
            {mode === 'signin'
              ? "Don't have an account? Create one"
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </form>
    </div>
  )
}
