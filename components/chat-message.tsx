import { cn } from '@/lib/utils'
import { MessageCircle, Zap } from 'lucide-react'

interface ChatMessageProps {
  message: string
  isAI: boolean
  timestamp?: string
}

export function ChatMessage({ message, isAI, timestamp }: ChatMessageProps) {
  return (
    <div className={cn('flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2', isAI ? 'justify-start' : 'justify-end')}>
      {isAI && (
        <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-400/20 border border-cyan-300/60 flex items-center justify-center shadow-lg">
          <Zap className="w-4 h-4 text-cyan-100" />
        </div>
      )}

      <div
        className={cn(
          'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-xl border',
          isAI
            ? 'bg-cyan-500/10 border-cyan-300/35 text-slate-100'
            : 'bg-cyan-400/20 border-cyan-200/60 text-white'
        )}
      >
        <p className="text-sm leading-relaxed">{message}</p>
        {timestamp && <p className={cn('text-xs mt-1.5 opacity-70', isAI ? 'text-cyan-100/65' : 'text-cyan-50/85')}>{timestamp}</p>}
      </div>

      {!isAI && (
        <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-300/50 flex items-center justify-center shadow-lg">
          <MessageCircle className="w-4 h-4 text-cyan-100" />
        </div>
      )}
    </div>
  )
}
