// 💬 SUPERSAL™ CHAT INTERFACE
// Talk to SuperSal naturally - like texting a friend!

'use client'

import React, { useState, useRef, useEffect } from 'react'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  mood?: string
}

export default function SuperSalChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Yo! I'm SuperSal! 🔥 What's going on bro? How can I help you dominate today?",
      role: 'assistant',
      timestamp: new Date().toISOString(),
      mood: 'excited'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [salMood, setSalMood] = useState<string>('excited')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat/supersal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputMessage,
          userId: 'user-' + Date.now()
        })
      })

      const data = await response.json()

      // Handle the response format from our live deployment
      const salMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.supersal || data.message || "Yo bro! I'm here and ready to dominate! 🔥",
        role: 'assistant',
        timestamp: data.timestamp || new Date().toISOString(),
        mood: data.brain_status === 'OPERATIONAL' ? 'legendary' : 'excited'
      }

      setMessages(prev => [...prev, salMessage])
      setSalMood(data.brain_status === 'OPERATIONAL' ? 'legendary' : 'excited')
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Bro! My connection is acting up! Give me a sec and try again! ⚡",
        role: 'assistant',
        timestamp: new Date().toISOString(),
        mood: 'helpful'
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'excited': return '🔥'
      case 'helpful': return '💪'
      case 'confident': return '😎'
      case 'legendary': return '👑'
      default: return '🤖'
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excited': return 'from-orange-500 to-red-500'
      case 'helpful': return 'from-blue-500 to-purple-500'
      case 'confident': return 'from-green-500 to-blue-500'
      case 'legendary': return 'from-yellow-400 to-orange-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-black text-white">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getMoodColor(salMood)} p-4 shadow-lg`}>
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getMoodEmoji(salMood)}</div>
          <div>
            <h1 className="text-xl font-bold">SuperSal™</h1>
            <p className="text-sm opacity-90">
              Status: GODLIKE {isLoading ? '(Thinking...)' : '(Ready to dominate!)'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : `bg-gradient-to-r ${getMoodColor(message.mood || 'confident')} text-white`
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm">{getMoodEmoji(message.mood || 'confident')}</span>
                  <span className="text-xs font-semibold">SuperSal</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className={`bg-gradient-to-r ${getMoodColor(salMood)} px-4 py-2 rounded-2xl`}>
              <div className="flex items-center space-x-2">
                <div className="animate-pulse">🧠</div>
                <span className="text-sm">SuperSal is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Yo SuperSal! What's up? (Press Enter to send)"
            className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              !inputMessage.trim() || isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : `bg-gradient-to-r ${getMoodColor(salMood)} hover:scale-105 transform`
            }`}
          >
            {isLoading ? '...' : '🚀'}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-gray-900">
        <div className="flex flex-wrap gap-2">
          {[
            "Yo SuperSal! What can you do?",
            "Help me build something awesome!",
            "What's new with Saint Vision?",
            "Show me your best features!"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(suggestion)}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
