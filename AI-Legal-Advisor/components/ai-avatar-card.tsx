import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Volume2 } from 'lucide-react'

interface AIAvatarCardProps {
  name?: string
  status?: string
}

export function AIAvatarCard({ name = 'Legal AI Assistant', status = 'Active' }: AIAvatarCardProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 overflow-hidden shadow-xl h-full">
      <div className="p-6 flex flex-col h-full">
        {/* Avatar */}
        <div className="mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg mx-auto mb-4">
            <Zap className="w-10 h-10 text-slate-900" />
          </div>

          {/* Wave Animation */}
          <div className="flex items-end justify-center gap-1 h-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-amber-500 to-amber-400 rounded-full"
                style={{
                  height: `${20 + i * 8}px`,
                  animation: `wave 0.8s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30">
            {status}
          </Badge>
        </div>

        {/* Expertise */}
        <div className="flex-1">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-3">Expertise</p>
          <ul className="space-y-2">
            {['Corporate Law', 'Property Rights', 'Criminal Law', 'Contracts'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Voice Button */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <button className="w-full bg-slate-700/50 hover:bg-slate-700 text-amber-400 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
            <Volume2 className="w-4 h-4" />
            Activate Voice
          </button>
        </div>

        <style jsx>{`
          @keyframes wave {
            0%, 100% {
              transform: scaleY(1);
            }
            50% {
              transform: scaleY(0.5);
            }
          }
        `}</style>
      </div>
    </Card>
  )
}
