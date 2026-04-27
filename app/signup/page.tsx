'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import Beams from '@/components/beams-background'
import { Lock, Mail, User, AlertCircle, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!name.trim()) {
      setError('Please enter your full name')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Mock signup success
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    }, 1500)
  }

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-black px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-95">
          <Beams />
        </div>
        <div className="absolute inset-0 bg-black/40 z-0" />

        <Card className="w-full max-w-md relative z-10 glass-surface shadow-2xl">
          <div className="p-8 sm:p-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-400/20 border border-cyan-300/60 mb-4 mx-auto animate-pulse">
              <CheckCircle className="w-6 h-6 text-cyan-200" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-cyan-100/80 mb-6">Welcome to Legal AI Guide. Redirecting to dashboard...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black px-4 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-95">
        <Beams />
      </div>
      <div className="absolute inset-0 bg-black/40 z-0" />

      <Card className="w-full max-w-md relative z-10 glass-surface shadow-2xl">
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-400/20 border border-cyan-300/60 mb-4 mx-auto">
              <User className="w-6 h-6 text-cyan-200" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-cyan-100/80 text-sm">Join Legal AI Guide Today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-cyan-50 font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-[#081c2d]/70 border-cyan-400/30 text-white placeholder:text-cyan-100/45 focus:border-cyan-300 focus:ring-cyan-300/50"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cyan-50 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-[#081c2d]/70 border-cyan-400/30 text-white placeholder:text-cyan-100/45 focus:border-cyan-300 focus:ring-cyan-300/50"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-cyan-50 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[#081c2d]/70 border-cyan-400/30 text-white placeholder:text-cyan-100/45 focus:border-cyan-300 focus:ring-cyan-300/50"
                  required
                />
              </div>
              <p className="text-xs text-cyan-100/55 mt-1">At least 8 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-cyan-50 font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-[#081c2d]/70 border-cyan-400/30 text-white placeholder:text-cyan-100/45 focus:border-cyan-300 focus:ring-cyan-300/50"
                  required
                />
              </div>
            </div>

            {/* Signup Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400/15 border border-cyan-300/65 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:bg-cyan-300/20 hover:shadow-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t cyan-divider"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#071624] text-cyan-100/65">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-cyan-100/70">
            <Link href="/login" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors">
              Sign in here
            </Link>
          </p>

          {/* Footer */}
          <p className="text-center text-xs text-cyan-100/55 mt-6 pt-6 border-t cyan-divider">
            Your confidential legal consultation partner
          </p>
        </div>
      </Card>
    </div>
  )
}
