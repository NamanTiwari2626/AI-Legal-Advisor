import { Button } from '@/components/ui/button'
import { LogOut, Copy } from 'lucide-react'

interface NavbarProps {
  onLogout?: () => void
  userName?: string
  referralCode?: string
  referralCount?: number
}

export function Navbar({ onLogout, userName, referralCode, referralCount }: NavbarProps) {
  const displayName = userName || 'User'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleCopyReferral = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
    }
  }

  return (
    <header className="glass-surface border-b cyan-divider shadow-lg relative z-10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/20 border border-cyan-300/60 flex items-center justify-center shadow-lg">
              <span className="text-cyan-100 font-bold text-lg">⚖️</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">AI Legal Advisor</h1>
              <p className="text-xs text-cyan-100/70">Expert Consultation</p>
            </div>
          </div>

          {/* User Profile Section - Center */}
          <div className="flex items-center gap-6 flex-1 justify-center max-w-md">
            <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-300/40 rounded-lg px-4 py-2">
              <div className="w-10 h-10 rounded-full bg-cyan-400/20 border border-cyan-300/60 flex items-center justify-center">
                <span className="text-sm font-bold text-cyan-100">{initials}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <p className="text-xs text-cyan-100/70">
                  Referrals: {referralCount ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {referralCode && (
              <Button
                onClick={handleCopyReferral}
                variant="ghost"
                size="sm"
                className="rounded-lg text-xs hidden sm:flex border border-cyan-300/50 bg-cyan-500/10 hover:bg-cyan-300/20 text-white"
                title={`Copy: ${referralCode}`}
              >
                <Copy className="w-4 h-4 mr-1" />
                Referral
              </Button>
            )}

            <Button
              onClick={onLogout}
              variant="ghost"
              size="icon"
              className="rounded-lg border border-cyan-300/50 bg-cyan-500/10 hover:bg-cyan-300/20 text-white"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
