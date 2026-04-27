'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { ChatMessage } from '@/components/chat-message'
import { ChatInput } from '@/components/chat-input'
import { AIInteractionPanel } from '@/components/ai-interaction-panel'
import Beams from '@/components/beams-background'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  text: string
  isAI: boolean
  timestamp: string
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I assist you today?',
      isAI: true,
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      text: 'I need help understanding contract law',
      isAI: false,
      timestamp: '10:31 AM',
    },
    {
      id: '3',
      text: 'Contract law governs agreements between parties. I can help explain key concepts, enforcement, and dispute resolution. What specific aspect interests you?',
      isAI: true,
      timestamp: '10:32 AM',
    },
  ])

  const [isListening, setIsListening] = useState(false)

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isAI: false,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your question. I can help you understand this better. Let me provide more details based on relevant legal principles and regulations.',
        isAI: true,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, aiMessage])
    }, 800)
  }

  const handleLogout = () => {
    window.location.href = '/login'
  }

  const handleMicClick = () => {
    setIsListening(!isListening)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-90">
        <Beams />
      </div>
      <div className="absolute inset-0 bg-black/45 z-0" />
      <Navbar onLogout={handleLogout} />

      <main className="w-full h-[calc(100vh-64px)] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
          {/* Chat Section - Left Half */}
          <div className="flex flex-col border-r cyan-divider">
            <Card className="flex-1 glass-surface rounded-2xl overflow-hidden flex flex-col m-4 ml-4 mr-2 gap-0">
              {/* Chat Messages */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4 p-4">
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      message={msg.text}
                      isAI={msg.isAI}
                      timestamp={msg.timestamp}
                    />
                  ))}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 border-t cyan-divider">
                <ChatInput onSend={handleSendMessage} />
              </div>
            </Card>
          </div>

          {/* AI Interaction Panel - Right Half */}
          <div className="flex flex-col p-4">
            <AIInteractionPanel isListening={isListening} onMicClick={handleMicClick} />
          </div>
        </div>
      </main>
    </div>
  )
}
