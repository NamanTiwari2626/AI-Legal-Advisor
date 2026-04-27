'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Stepper, { Step } from '@/components/stepper'
import Beams from '@/components/beams-background'
import { Scale, Mail, Phone, Shield, MessageSquare, ArrowRight, Check, Loader2 } from 'lucide-react'
import { isAuthenticated, getCurrentUser, type UserData } from '@/lib/api'

export default function OnboardingPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [verifyMethod, setVerifyMethod] = useState<'email' | 'phone'>('email')
  const [verifyInput, setVerifyInput] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [chatPermGranted, setChatPermGranted] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    const u = getCurrentUser()
    setUser(u)
    if (u?.email) setVerifyInput(u.email)
  }, [router])

  const handleSendOtp = () => {
    setIsVerifying(true)
    // Simulate OTP send
    setTimeout(() => {
      setOtpSent(true)
      setIsVerifying(false)
    }, 1500)
  }

  const handleVerifyOtp = () => {
    setIsVerifying(true)
    // Simulate OTP verification (accept any 4+ digit code)
    setTimeout(() => {
      if (otp.length >= 4) {
        setOtpVerified(true)
      }
      setIsVerifying(false)
    }, 1200)
  }

  const handleGoToChat = () => {
    router.push('/dashboard')
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-90">
        <Beams />
      </div>
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-6 py-4 border-b border-cyan-500/20">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-300/40 flex items-center justify-center">
          <Scale className="w-5 h-5 text-cyan-200" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">LAwBOTie</h1>
          <p className="text-[11px] text-cyan-100/50">AI Legal Advisor Setup</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex-1 relative z-10 flex items-center justify-center overflow-hidden">
        <Stepper
          initialStep={1}
          onFinalStepCompleted={handleGoToChat}
          backButtonText="Back"
          nextButtonText="Next"
        >
          {/* ─── Step 1: Welcome ─── */}
          <Step>
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-300/30 flex items-center justify-center mx-auto">
                <Scale className="w-8 h-8 text-cyan-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Welcome{user?.name ? `, ${user.name}` : ''}! 🙏
                </h2>
                <p className="text-sm text-cyan-100/60 leading-relaxed max-w-sm mx-auto">
                  LAwBOTie is your AI-powered legal advisor specializing in Indian law.
                  Let&apos;s get you set up in just a few steps.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['Criminal Law', 'Property Rights', 'Contract Law', 'Family Law', 'Cyber Crime'].map(topic => (
                  <span
                    key={topic}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-500/8 border border-cyan-300/25 text-cyan-200/70"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </Step>

          {/* ─── Step 2: Verification ─── */}
          <Step>
            <div className="space-y-5 py-2">
              <div className="text-center">
                <h2 className="text-lg font-bold text-white mb-1">Verify Your Identity</h2>
                <p className="text-xs text-cyan-100/50">
                  We need to verify your {verifyMethod} for secure communication
                </p>
              </div>

              {/* Toggle email/phone */}
              <div className="flex rounded-xl overflow-hidden border border-cyan-300/20 mx-auto max-w-[280px]">
                <button
                  onClick={() => { setVerifyMethod('email'); setOtpSent(false); setOtpVerified(false) }}
                  className={`flex-1 py-2 text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    verifyMethod === 'email'
                      ? 'bg-cyan-500/20 text-cyan-100 border-r border-cyan-300/20'
                      : 'text-cyan-100/40 hover:text-cyan-100/60'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <button
                  onClick={() => { setVerifyMethod('phone'); setOtpSent(false); setOtpVerified(false) }}
                  className={`flex-1 py-2 text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    verifyMethod === 'phone'
                      ? 'bg-cyan-500/20 text-cyan-100'
                      : 'text-cyan-100/40 hover:text-cyan-100/60'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" /> Phone
                </button>
              </div>

              {/* Input */}
              <div className="space-y-3">
                <input
                  type={verifyMethod === 'email' ? 'email' : 'tel'}
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                  placeholder={verifyMethod === 'email' ? 'your@email.com' : '+91 XXXXXXXXXX'}
                  disabled={otpSent}
                  className="w-full px-4 py-2.5 rounded-xl bg-cyan-500/5 border border-cyan-300/20 text-white text-sm placeholder:text-cyan-100/30 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/30 transition-all disabled:opacity-50"
                />

                {!otpSent ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={!verifyInput.trim() || isVerifying}
                    className="w-full py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-300/40 text-cyan-100 text-sm font-medium hover:bg-cyan-300/20 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Send Verification Code</>
                    )}
                  </button>
                ) : !otpVerified ? (
                  <div className="space-y-3">
                    <p className="text-xs text-emerald-400/80 text-center">
                      ✓ Code sent to {verifyInput}
                    </p>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter verification code"
                      maxLength={6}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-500/5 border border-cyan-300/20 text-white text-sm text-center tracking-[0.3em] placeholder:text-cyan-100/30 placeholder:tracking-normal focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/30 transition-all"
                    />
                    <button
                      onClick={handleVerifyOtp}
                      disabled={otp.length < 4 || isVerifying}
                      className="w-full py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-300/40 text-cyan-100 text-sm font-medium hover:bg-cyan-300/20 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {isVerifying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>Verify Code</>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2 text-emerald-400 text-sm">
                    <Check className="w-4 h-4" />
                    <span>Verified successfully!</span>
                  </div>
                )}
              </div>
            </div>
          </Step>

          {/* ─── Step 3: Chat Permission ─── */}
          <Step>
            <div className="space-y-5 py-2">
              <div className="text-center">
                <h2 className="text-lg font-bold text-white mb-1">Chat Permissions</h2>
                <p className="text-xs text-cyan-100/50">
                  Grant permissions to enable AI legal consultation
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: MessageSquare,
                    title: 'AI Chat Access',
                    desc: 'Allow AI to provide legal information and guidance',
                    required: true,
                  },
                  {
                    icon: Shield,
                    title: 'Data Privacy',
                    desc: 'Your conversations are encrypted and private',
                    required: true,
                  },
                  {
                    icon: Scale,
                    title: 'Legal Disclaimer',
                    desc: 'AI advice is informational only, not a substitute for professional legal counsel',
                    required: true,
                  },
                ].map((perm, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      chatPermGranted
                        ? 'bg-cyan-500/10 border-cyan-300/30'
                        : 'bg-white/[0.02] border-white/10 hover:border-cyan-300/25'
                    }`}
                    onClick={() => setChatPermGranted(true)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-300/20 flex items-center justify-center shrink-0 mt-0.5">
                      <perm.icon className="w-4 h-4 text-cyan-300/80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{perm.title}</p>
                      <p className="text-[11px] text-cyan-100/45 leading-relaxed">{perm.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                      chatPermGranted
                        ? 'border-cyan-400 bg-cyan-400/20'
                        : 'border-white/20'
                    }`}>
                      {chatPermGranted && <Check className="w-3 h-3 text-cyan-300" />}
                    </div>
                  </div>
                ))}

                {!chatPermGranted && (
                  <button
                    onClick={() => setChatPermGranted(true)}
                    className="w-full py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-300/40 text-cyan-100 text-sm font-medium hover:bg-cyan-300/20 transition-all"
                  >
                    Accept All & Continue
                  </button>
                )}

                {chatPermGranted && (
                  <p className="text-xs text-emerald-400/70 text-center flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> All permissions granted
                  </p>
                )}
              </div>
            </div>
          </Step>

          {/* ─── Step 4: Chat Now ─── */}
          <Step>
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-300/30 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">You&apos;re All Set! 🎉</h2>
                <p className="text-sm text-cyan-100/60 leading-relaxed max-w-xs mx-auto">
                  Your AI Legal Advisor is ready. Start a conversation about any Indian law topic.
                </p>
              </div>

              <button
                onClick={handleGoToChat}
                className="group mx-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500/25 to-cyan-400/15 border border-cyan-300/50 text-white font-semibold text-sm hover:from-cyan-500/35 hover:to-cyan-400/25 hover:shadow-lg hover:shadow-cyan-500/15 transition-all duration-300"
              >
                <MessageSquare className="w-4 h-4 text-cyan-300" />
                Chat Now
                <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  )
}
