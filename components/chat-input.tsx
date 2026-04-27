'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Mic } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim()) {
      onSend(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a legal question about Indian law..."
          className="resize-none bg-[#081c2d]/70 border-cyan-400/30 text-white placeholder:text-cyan-100/45 focus:border-cyan-300 focus:ring-cyan-300/50 min-h-12 max-h-24"
          rows={1}
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          size="icon"
          className="bg-cyan-500/10 border border-cyan-300/50 hover:bg-cyan-300/20 text-white rounded-lg h-10 w-10"
          title="Voice input"
        >
          <Mic className="w-5 h-5" />
        </Button>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="bg-cyan-400/15 border border-cyan-300/65 hover:bg-cyan-300/20 text-white font-semibold rounded-lg h-10 px-4 transition-all duration-300 shadow-lg hover:shadow-cyan-400/30 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
