"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  MessageCircle,
  X,
  Send,
  Mic,
  Heart,
  Sparkles,
  MapPin,
  Clock,
  Star,
  Coffee,
  Moon,
  Sun,
  Loader2
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  suggestions?: string[]
  provider?: string
}

interface FloatingChatProps {
  className?: string
}

// SEFTEC Hub Logo Component
const SeftecLogo = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 36 36" className={className} xmlns="http://www.w3.org/2000/svg">
    <title>SEFTEC Hub Logo</title>
    {/* Navy Blue Base */}
    <path fill="#263E50" d="M33 3c-7-3-15-3-15-3S10 0 3 3C0 18 3 31 18 36c15-5 18-18 15-33z"/>
    {/* Mustard Yellow Shield */}
    <path fill="#DAA520" d="M18 33.884C6.412 29.729 1.961 19.831 4.76 4.444C11.063 2.029 17.928 2 18 2c.071 0 6.958.04 13.24 2.444c2.799 15.387-1.652 25.285-13.24 29.44z"/>
  </svg>
)

const FloatingChat: React.FC<FloatingChatProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey beautiful! 💖 I'm your SEFTEC discovery assistant. What vibe are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: ["Find me unlimited drinks 🍹", "Cool spa getaway 🧘‍♀️", "Find a handyman 🔧", "Fun activities nearby 🎉"]
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [aiProvider, setAIProvider] = useState<'deepseek' | 'perplexity'>('deepseek')
  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    try {
      // Call the real AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          provider: aiProvider
        }),
      })

      const aiResponse = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        provider: aiResponse.provider
      }

      setMessages(prev => [...prev, aiMessage])

    } catch (error) {
      console.error('Chat error:', error)

      // Fallback response if API fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting, but I'm here to help! Try asking me about spots nearby! ✨",
        sender: 'ai',
        timestamp: new Date(),
        suggestions: ["Find unlimited drinks 🍹", "Cool spa getaway 🧘‍♀️", "Find a handyman 🔧", "Late night food 🍕"],
        provider: 'fallback'
      }

      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExpanded) return
    setIsDragging(true)

    const startX = e.clientX - dragPosition.x
    const startY = e.clientY - dragPosition.y

    const handleMouseMove = (e: MouseEvent) => {
      setDragPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      className="fixed z-50 select-none"
      style={{
        left: dragPosition.x + 20,
        top: dragPosition.y + 20,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* Floating Chat Bubble */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 15
              }
            }}
            whileHover={{
              scale: 1.1,
              transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 15
              }
            }}
            whileTap={{ scale: 0.95 }}
            exit={{ scale: 0, opacity: 0 }}
            onMouseDown={handleMouseDown}
            className="relative"
          >
            <Button
              variant="magic"
              size="floating"
              onClick={() => setIsExpanded(true)}
              className={`relative overflow-hidden shadow-2xl ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                  : 'bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400'
              }`}
            >
              <div className={`absolute inset-0 animate-gradient ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                  : 'bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400'
              }`} />

              {/* Your SEFTEC Logo */}
              <SeftecLogo className="relative z-10 h-7 w-7" />

              {/* Pulsing notification badge */}
              <motion.div
                className={`absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <span className="text-xs font-bold">✨</span>
              </motion.div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Chat Interface */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 50
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 20
              }
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 50,
              transition: { duration: 0.2 }
            }}
            className={`w-80 h-96 backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden cursor-default ${
              isDarkMode
                ? 'bg-gray-900/95 border-gray-700'
                : 'bg-white/95 border-pink-100'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              isDarkMode
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-gradient-to-r from-pink-400 to-purple-500'
                }`}>
                  <SeftecLogo className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>SEFTEC Discovery</h3>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>AI: {aiProvider} ✨</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* AI Provider Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAIProvider(aiProvider === 'deepseek' ? 'perplexity' : 'deepseek')}
                  className={`h-8 w-8 text-xs ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-pink-100 text-gray-600'
                  }`}
                  title={`Switch to ${aiProvider === 'deepseek' ? 'Perplexity' : 'DeepSeek'}`}
                >
                  {aiProvider === 'deepseek' ? '🧠' : '🔍'}
                </Button>

                {/* Dark Mode Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`h-8 w-8 ${
                    isDarkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-pink-100 text-gray-600'
                  }`}
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  className={`h-8 w-8 ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-pink-100 text-gray-600'
                  }`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 h-60">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                      message.sender === 'user'
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : isDarkMode
                          ? 'bg-gray-800 text-gray-100 border border-gray-700'
                          : 'bg-gray-50 text-gray-800 border border-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    {message.provider && message.sender === 'ai' && (
                      <p className="text-xs mt-1 opacity-60">
                        powered by {message.provider}
                      </p>
                    )}
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(suggestion)}
                            className={`text-xs rounded-full px-2 py-1 transition-colors ${
                              isDarkMode
                                ? 'bg-white/10 hover:bg-white/20 text-gray-200'
                                : 'bg-white/20 hover:bg-white/30 text-white'
                            }`}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className={`rounded-2xl px-3 py-2 border ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-gray-50 border-gray-100'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Loader2 className={`h-3 w-3 animate-spin ${
                        isDarkMode ? 'text-blue-400' : 'text-pink-400'
                      }`} />
                      <span className="text-xs text-gray-500">AI thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${
              isDarkMode
                ? 'border-gray-700 bg-gray-900/50'
                : 'border-pink-100 bg-white/50'
            }`}>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                    placeholder="Tell me what you're in the mood for..."
                    disabled={isTyping}
                    className={`w-full px-3 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 transition-colors ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-transparent'
                        : 'bg-white/80 border-pink-200 text-gray-800 placeholder-gray-500 focus:ring-pink-300 focus:border-transparent'
                    } ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${
                    isDarkMode
                      ? 'text-blue-400 hover:bg-gray-800'
                      : 'text-pink-500 hover:bg-pink-100'
                  }`}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isTyping || !inputText.trim()}
                  size="icon"
                  className={`h-8 w-8 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                      : 'bg-gradient-to-r from-pink-400 to-purple-500'
                  } ${(isTyping || !inputText.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FloatingChat
