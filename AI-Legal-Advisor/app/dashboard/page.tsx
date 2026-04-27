'use client'

import { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/navbar'
import { ChatMessage } from '@/components/chat-message'
import { ChatInput } from '@/components/chat-input'
import Beams from '@/components/beams-background'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mic, Volume2, VolumeX, Lightbulb, Scale, Loader2 } from 'lucide-react'
import {
  sendChatMessage,
  speakWithVisemes,
  stopSpeech,
  isAuthenticated,
  getCurrentUser,
  logout,
  type ChatApiResponse,
  type MorphTargets,
  type UserData,
} from '@/lib/api'

// Dynamically import the 3D avatar to avoid SSR issues
const AIAvatar3D = dynamic(() => import('@/components/ai-avatar-3d'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-cyan-300 animate-spin" />
    </div>
  ),
})

interface Message {
  id: string
  text: string
  isAI: boolean
  timestamp: string
  category?: string
  categoryName?: string
  confidence?: number
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([])

  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)
  const [user, setUser] = useState<UserData | null>(null)
  // Use state for morphTargets so Canvas re-renders with new values,
  // but throttled to ~15fps by the api.ts lip sync engine
  const [morphTargets, setMorphTargets] = useState<MorphTargets>({
    jawOpen: 0,
    mouthFunnel: 0,
    mouthPucker: 0,
    mouthSmile: 0,
    mouthStretch: 0,
  })

  const scrollEndRef = useRef<HTMLDivElement>(null)

  // Auth guard + welcome message (client-only to avoid hydration mismatch)
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login'
      return
    }
    setUser(getCurrentUser())
    // Set welcome message only on client to avoid timestamp hydration mismatch
    setMessages([{
      id: '1',
      text: 'Namaste! I\'m your AI Legal Advisor specializing in Indian law. How can I help you today? You can ask me about Criminal Law, Property Rights, Contract Law, Labor Laws, Family Law, Consumer Protection, and more.',
      isAI: true,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }])
  }, [])

  // Auto scroll to bottom smoothly
  useEffect(() => {
    // Small delay to let React finish rendering
    const timer = setTimeout(() => {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 100)
    return () => clearTimeout(timer)
  }, [messages, isLoading])

  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isAI: false,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response: ChatApiResponse = await sendChatMessage(message, sessionId)

      if (response.sessionId) {
        setSessionId(response.sessionId)
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isAI: true,
        timestamp: response.timestamp || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        category: response.category,
        categoryName: response.categoryName,
        confidence: response.confidence,
      }

      setMessages((prev) => [...prev, aiMessage])

      // Speak the response with lip sync
      if (voiceEnabled && response.visemes?.length && response.morphTargets?.length) {
        setIsSpeaking(true)
        speakWithVisemes(
          response.response,
          response.visemes,
          response.morphTargets,
          (morph) => setMorphTargets(morph),
          () => {
            setIsSpeaking(false)
            setMorphTargets({ jawOpen: 0, mouthFunnel: 0, mouthPucker: 0, mouthSmile: 0, mouthStretch: 0 })
          }
        )
      }
    } catch (error) {
      // Fallback response on error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an issue processing your request. Please try again.',
        isAI: true,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, voiceEnabled])

  const handleLogout = () => {
    stopSpeech()
    logout()
  }

  const handleMicClick = () => {
    if (isSpeaking) {
      stopSpeech()
      setIsSpeaking(false)
      setMorphTargets({ jawOpen: 0, mouthFunnel: 0, mouthPucker: 0, mouthSmile: 0, mouthStretch: 0 })
      return
    }
    setIsListening(!isListening)
  }

  const toggleVoice = () => {
    if (isSpeaking) {
      stopSpeech()
      setIsSpeaking(false)
      setMorphTargets({ jawOpen: 0, mouthFunnel: 0, mouthPucker: 0, mouthSmile: 0, mouthStretch: 0 })
    }
    setVoiceEnabled(!voiceEnabled)
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-90">
        <Beams />
      </div>
      <div className="absolute inset-0 bg-black/45 z-0" />
      <Navbar onLogout={handleLogout} userName={user?.name} referralCode={user?.referralCode} referralCount={user?.referralCount} />

      <main className="w-full h-[calc(100vh-64px)] relative z-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full overflow-hidden">
          {/* Chat Section - Left Half */}
          <div className="flex flex-col border-r cyan-divider h-full min-h-0 overflow-hidden">
            <Card className="flex-1 glass-surface rounded-2xl overflow-hidden flex flex-col m-4 ml-4 mr-2 gap-0 min-h-0">
              {/* Chat Messages */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-4 p-4">
                  {messages.map((msg) => (
                    <div key={msg.id}>
                      <ChatMessage
                        message={msg.text}
                        isAI={msg.isAI}
                        timestamp={msg.timestamp}
                      />
                      {msg.isAI && msg.categoryName && msg.confidence && msg.confidence > 0.3 && (
                        <div className="ml-11 mt-1 flex items-center gap-2">
                          <Badge className="text-[10px] bg-cyan-500/15 border-cyan-300/40 text-cyan-200">
                            <Scale className="w-3 h-3 mr-1" />
                            {msg.categoryName}
                          </Badge>
                          <span className="text-[10px] text-cyan-100/50">
                            {Math.round((msg.confidence || 0) * 100)}% confidence
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-3 ml-11">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-cyan-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-cyan-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-cyan-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-cyan-100/50">AI is analyzing your query...</span>
                    </div>
                  )}
                  {/* Invisible scroll anchor */}
                  <div ref={scrollEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input - always visible at bottom */}
              <div className="shrink-0 p-4 border-t cyan-divider">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
              </div>
            </Card>
          </div>

          {/* AI Avatar Panel - Right Half */}
          <div className="flex flex-col p-4 gap-4 h-full min-h-0 overflow-hidden">
            {/* 3D Avatar */}
            <Card className="glass-surface flex-1 rounded-2xl overflow-hidden relative">
              <div className="absolute top-4 left-4 z-10">
                <h2 className="text-lg font-bold text-white">AI Legal Advisor</h2>
                <p className="text-xs text-cyan-100/70">
                  {isSpeaking ? '🗣️ Speaking...' : isListening ? '🎤 Listening...' : '✅ Ready to Help'}
                </p>
              </div>

              {/* Voice toggle */}
              <div className="absolute top-4 right-4 z-10">
                <Button
                  size="icon"
                  onClick={toggleVoice}
                  className="bg-cyan-500/10 border border-cyan-300/50 hover:bg-cyan-300/20 text-white rounded-lg h-9 w-9"
                  title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>

              {/* 3D Avatar Canvas */}
              <div className="w-full h-full min-h-[320px]">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-cyan-300 animate-spin" />
                  </div>
                }>
                  <AIAvatar3D
                    morphTargets={morphTargets}
                    isSpeaking={isSpeaking}
                    isListening={isListening}
                  />
                </Suspense>
              </div>

              {/* Status badge */}
              <div className="absolute bottom-4 left-4 z-10">
                <Badge className={`${isSpeaking ? 'bg-cyan-400/25 border-cyan-200 text-cyan-100 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>
                  {isSpeaking ? '● Speaking' : '● Online'}
                </Badge>
              </div>
            </Card>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleMicClick}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  isSpeaking
                    ? 'bg-red-400/20 border border-red-300/50 text-white hover:bg-red-300/30'
                    : isListening
                    ? 'bg-cyan-300/25 border border-cyan-200 text-white hover:bg-cyan-200/35'
                    : 'bg-cyan-400/15 border border-cyan-300/65 text-white hover:bg-cyan-300/20'
                }`}
              >
                <Mic className="w-4 h-4 mr-2" />
                {isSpeaking ? 'Stop Speaking' : isListening ? 'Stop Listening' : 'Start Voice'}
              </Button>
            </div>

            {/* Quick suggestions */}
            <Card className="glass-surface rounded-xl p-4">
              <p className="text-xs text-cyan-100/60 font-semibold uppercase tracking-wide mb-3">
                <Lightbulb className="w-3.5 h-3.5 inline mr-1" />
                Quick Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {['Property Rights', 'Criminal Law', 'Contract Dispute', 'Labor Rights', 'Consumer Complaint', 'Cyber Crime'].map(topic => (
                  <button
                    key={topic}
                    onClick={() => handleSendMessage(`Tell me about ${topic} in India`)}
                    disabled={isLoading}
                    className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-300/40 text-cyan-200 hover:bg-cyan-300/20 transition-all disabled:opacity-50"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
