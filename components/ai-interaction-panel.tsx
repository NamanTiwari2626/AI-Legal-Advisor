'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic, Volume2, Lightbulb } from 'lucide-react'

interface AIInteractionPanelProps {
  isListening?: boolean
  onMicClick?: () => void
}

export function AIInteractionPanel({ isListening = false, onMicClick }: AIInteractionPanelProps) {
  return (
    <Card className="glass-surface h-full flex flex-col justify-between p-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white mb-2">AI Assistant</h2>
        <p className="text-sm text-cyan-100/70">Live Interaction Mode</p>
      </div>

      {/* Center - Status Indicator */}
      <div className="flex flex-col items-center justify-center gap-4 flex-1">
        <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
          isListening 
            ? 'bg-cyan-500/20 border-2 border-cyan-300' 
            : 'bg-cyan-500/10 border-2 border-cyan-300/50'
        }`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isListening ? 'bg-cyan-300' : 'bg-cyan-500/55'
          }`}>
            <Mic className="w-6 h-6 text-slate-950" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-white">
            {isListening ? 'Listening...' : 'Ready to Help'}
          </p>
          <p className="text-xs text-cyan-100/65 mt-1">Click mic to start talking</p>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-cyan-300 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-white font-medium">Legal Insights</p>
            <p className="text-xs text-cyan-100/65">Get instant answers to your questions</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Volume2 className="w-5 h-5 text-cyan-300 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-white font-medium">Voice Support</p>
            <p className="text-xs text-cyan-100/65">Speak naturally for better interaction</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={onMicClick}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          isListening
            ? 'bg-cyan-300/25 border border-cyan-200 text-white hover:bg-cyan-200/35'
            : 'bg-cyan-400/15 border border-cyan-300/65 text-white hover:bg-cyan-300/20'
        }`}
      >
        {isListening ? 'Stop Listening' : 'Start Interaction'}
      </Button>
    </Card>
  )
}
