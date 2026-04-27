'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import Beams from '@/components/beams-background'
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'
import { login } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      window.location.href = '/onboarding'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
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
              <Lock className="w-6 h-6 text-cyan-200" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Legal AI Guide</h1>
            <p className="text-cyan-100/80 text-sm">Indian Law Assistant</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
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
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400/15 border border-cyan-300/65 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:bg-cyan-300/20 hover:shadow-cyan-400/30 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t cyan-divider"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#071624] text-cyan-100/65">New to Legal AI?</span>
            </div>
          </div>

          {/* Signup Link */}
          <p className="text-center text-cyan-100/70">
            Create an account{' '}
            <Link href="/signup" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors">
              Sign up here
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
