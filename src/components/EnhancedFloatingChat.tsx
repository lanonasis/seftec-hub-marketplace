"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  X,
  Send,
  Sparkles,
  Loader2,
  Trash2,
  Minimize2
} from 'lucide-react'
import { themes, Theme, getThemeClasses } from '@/lib/themes'
import ThemeSwitcher from '@/components/ThemeSwitcher'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  suggestions?: string[]
  provider?: string
}

interface EnhancedFloatingChatProps {
  className?: string
  initialTheme?: Theme
}

const STORAGE_KEY = 'seftec-chat-messages'
const THEME_STORAGE_KEY = 'seftec-chat-theme'

const SeftecLogo = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 36 36" className={className} xmlns="http://www.w3.org/2000/svg">
    <title>SEFTEC Hub Logo</title>
    <path fill="#263E50" d="M33 3c-7-3-15-3-15-3S10 0 3 3C0 18 3 31 18 36c15-5 18-18 15-33z"/>
    <path fill="#DAA520" d="M18 33.884C6.412 29.729 1.961 19.831 4.76 4.444C11.063 2.029 17.928 2 18 2c.071 0 6.958.04 13.24 2.444c2.799 15.387-1.652 25.285-13.24 29.44z"/>
  </svg>
)

const TypingIndicator = ({ isDarkTheme }: { isDarkTheme: boolean }) => (
  <div className="flex items-center space-x-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className={`h-2 w-2 rounded-full ${isDarkTheme ? 'bg-blue-400' : 'bg-pink-400'}`}
        animate={{
          y: [0, -6, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.15,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
)

const EnhancedFloatingChat: React.FC<EnhancedFloatingChatProps> = ({
  className,
  initialTheme = 'sunset'
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>(initialTheme)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const themeConfig = getThemeClasses(currentTheme)
  const isDarkTheme = currentTheme === 'cyberpunk' || currentTheme === 'galaxy'

  const defaultWelcomeMessage: Message = {
    id: '1',
    text: "Hey there! 💖 I'm your SEFTEC discovery assistant. What vibe are you feeling today?",
    sender: 'ai',
    timestamp: new Date(),
    suggestions: ["Find me unlimited drinks 🍹", "Cool spa getaway 🧘‍♀️", "Find a handyman 🔧", "Fun activities nearby 🎉"]
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMessages = localStorage.getItem(STORAGE_KEY)
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
        
        if (savedMessages) {
          const parsed = JSON.parse(savedMessages)
          const hydratedMessages = parsed.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(hydratedMessages.length > 0 ? hydratedMessages : [defaultWelcomeMessage])
        } else {
          setMessages([defaultWelcomeMessage])
        }
        
        if (savedTheme && themes[savedTheme as Theme]) {
          setCurrentTheme(savedTheme as Theme)
        }
      } catch {
        setMessages([defaultWelcomeMessage])
      }
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      } catch {}
    }
  }, [messages, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, currentTheme)
      } catch {}
    }
  }, [currentTheme, isInitialized])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isExpanded])

  const handleClearConversation = () => {
    setMessages([defaultWelcomeMessage])
  }

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim()
    if (!messageText || isTyping) return

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
      const conversationHistory = messages
        .filter(m => m.sender === 'user' || m.sender === 'ai')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationHistory
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isTyping) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={`fixed z-50 ${className || ''}`} style={{ bottom: 20, right: 20 }}>
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="relative"
          >
            <Button
              variant="magic"
              size="floating"
              onClick={() => setIsExpanded(true)}
              className={`relative overflow-hidden shadow-2xl bg-gradient-to-r ${themeConfig.floatingButton} animate-gradient h-14 w-14 rounded-full`}
            >
              <div className={`absolute inset-0 animate-gradient bg-gradient-to-r ${themeConfig.floatingButton}`} />
              <SeftecLogo className="relative z-10 h-7 w-7" />
              <motion.div
                className="absolute -top-1 -right-1 h-4 w-4 bg-red-400 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles className="h-2 w-2 text-white" />
              </motion.div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`
              w-[340px] sm:w-[380px] 
              h-[500px] sm:h-[520px] 
              backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden 
              flex flex-col
              ${themeConfig.surface}
            `}
            style={{
              background: isDarkTheme
                ? 'linear-gradient(135deg, rgba(17,24,39,0.98) 0%, rgba(75,85,99,0.98) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)'
            }}
          >
            <div className={`flex items-center justify-between p-4 border-b shrink-0 ${
              isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center bg-gradient-to-r ${themeConfig.primary}`}>
                  <SeftecLogo className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${themeConfig.text}`}>
                    SEFTEC Assistant
                  </h3>
                  <p className={`text-xs ${themeConfig.textSecondary}`}>
                    Powered by AI ✨
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearConversation}
                  className={`h-8 w-8 ${isDarkTheme ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-pink-100 text-gray-500'}`}
                  title="Clear conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <ThemeSwitcher
                  currentTheme={currentTheme}
                  onThemeChange={setCurrentTheme}
                  className="scale-75"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  className={`h-8 w-8 ${isDarkTheme ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-pink-100 text-gray-500'}`}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? `bg-gradient-to-r ${themeConfig.chatBubble} text-white shadow-md`
                        : isDarkTheme
                          ? 'bg-gray-800 text-gray-100 border border-gray-700 shadow-sm'
                          : 'bg-gray-50 text-gray-800 border border-gray-100 shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    {message.suggestions && message.sender === 'ai' && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(suggestion)}
                            disabled={isTyping}
                            className={`text-xs rounded-full px-3 py-1.5 transition-all font-medium ${
                              isDarkTheme
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
                                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
                            } ${isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className={`rounded-2xl px-4 py-3 border ${
                    isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'
                  }`}>
                    <TypingIndicator isDarkTheme={isDarkTheme} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={`p-4 border-t shrink-0 ${
              isDarkTheme ? 'border-gray-700 bg-gray-900/50' : 'border-pink-100 bg-white/80'
            }`}>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    disabled={isTyping}
                    className={`w-full px-4 py-3 border rounded-full text-sm focus:outline-none focus:ring-2 transition-all ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400'
                        : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500 focus:ring-pink-300'
                    } ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isTyping || !inputText.trim()}
                  size="icon"
                  className={`h-11 w-11 rounded-full bg-gradient-to-r ${themeConfig.primary} shadow-md transition-all ${
                    (isTyping || !inputText.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  {isTyping ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <Send className="h-5 w-5 text-white" />
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

export default EnhancedFloatingChat
