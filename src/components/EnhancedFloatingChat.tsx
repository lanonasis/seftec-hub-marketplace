"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Send, Loader2, Trash2, ChevronDown } from 'lucide-react'
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
const IDLE_TIMEOUT_MS = 10000

const LeoAvatar = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 36 36" className={className} xmlns="http://www.w3.org/2000/svg">
    <title>Leo</title>
    <path fill="#263E50" d="M33 3c-7-3-15-3-15-3S10 0 3 3C0 18 3 31 18 36c15-5 18-18 15-33z"/>
    <path fill="#DAA520" d="M18 33.884C6.412 29.729 1.961 19.831 4.76 4.444C11.063 2.029 17.928 2 18 2c.071 0 6.958.04 13.24 2.444c2.799 15.387-1.652 25.285-13.24 29.44z"/>
  </svg>
)

const GripHandle = ({ isDarkTheme }: { isDarkTheme: boolean }) => (
  <div className="flex items-center justify-center gap-[3px] py-1.5">
    {[0,1,2,3,4,5].map(i => (
      <div
        key={i}
        className={`h-[3px] w-[3px] rounded-full ${isDarkTheme ? 'bg-gray-500' : 'bg-gray-300'}`}
      />
    ))}
  </div>
)

const TypingIndicator = ({ isDarkTheme }: { isDarkTheme: boolean }) => (
  <div className="flex items-center space-x-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className={`h-2 w-2 rounded-full ${isDarkTheme ? 'bg-yellow-400' : 'bg-pink-400'}`}
        animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
      />
    ))}
  </div>
)

const EnhancedFloatingChat: React.FC<EnhancedFloatingChatProps> = ({
  className,
  initialTheme = 'cyberpunk'
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>(initialTheme)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartYRef = useRef<number>(0)
  const dragConstraintRef = useRef<HTMLDivElement>(null)

  const dragControls = useDragControls()
  const panelX = useMotionValue(0)
  const panelY = useMotionValue(0)

  const themeConfig = getThemeClasses(currentTheme)
  const isDarkTheme = currentTheme === 'cyberpunk' || currentTheme === 'galaxy'

  const defaultWelcomeMessage: Message = {
    id: '1',
    text: "Yo babe 👀 what's the move tonight? Vibes or fixes?",
    sender: 'ai',
    timestamp: new Date(),
    suggestions: ["Party tonight 🎉", "Rooftop drinks 🥂", "Need a plumber 🔧", "Food crawl 🍜"]
  }

  const collapse = useCallback(() => setIsExpanded(false), [])

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      if (!isHovered) collapse()
    }, IDLE_TIMEOUT_MS)
  }, [collapse, isHovered])

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMessages = localStorage.getItem(STORAGE_KEY)
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
        if (savedMessages) {
          const parsed = JSON.parse(savedMessages)
          const hydrated = parsed.map((msg: Message) => ({ ...msg, timestamp: new Date(msg.timestamp) }))
          setMessages(hydrated.length > 0 ? hydrated : [defaultWelcomeMessage])
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
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)) } catch {}
    }
  }, [messages, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      try { localStorage.setItem(THEME_STORAGE_KEY, currentTheme) } catch {}
    }
  }, [currentTheme, isInitialized])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isExpanded) {
      panelX.set(0)
      panelY.set(0)
      setTimeout(() => inputRef.current?.focus(), 120)
      resetIdleTimer()
    } else {
      clearIdleTimer()
    }
    return () => clearIdleTimer()
  }, [isExpanded])

  useEffect(() => {
    if (isHovered && idleTimerRef.current) {
      clearIdleTimer()
    } else if (!isHovered && isExpanded) {
      resetIdleTimer()
    }
  }, [isHovered])

  const handleClearConversation = () => {
    setMessages([defaultWelcomeMessage])
    resetIdleTimer()
  }

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim()
    if (!messageText || isTyping) return

    resetIdleTimer()
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
        .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, conversationHistory }),
      })

      const aiResponse = await response.json()
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        provider: aiResponse.provider
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Ugh, signal dropped 😤 but yo—party or fix? I got you.",
        sender: 'ai',
        timestamp: new Date(),
        suggestions: ["Party tonight 🎉", "Rooftop drinks 🥂", "Need a plumber 🔧", "Food crawl 🍜"],
        provider: 'fallback'
      }])
    } finally {
      setIsTyping(false)
      resetIdleTimer()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isTyping) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientY - touchStartYRef.current
    if (delta > 60) collapse()
  }

  const startDrag = (e: React.PointerEvent) => {
    dragControls.start(e)
  }

  return (
    <>
      {/* Full-viewport drag constraint boundary */}
      <div
        ref={dragConstraintRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 40 }}
      />

      {/* Floating button — collapsed state */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            className={`fixed z-50 ${className || ''}`}
            style={{ bottom: 20, right: 20, pointerEvents: 'auto' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Button
              variant="magic"
              size="floating"
              onClick={() => setIsExpanded(true)}
              className={`relative overflow-hidden shadow-2xl bg-gradient-to-r ${themeConfig.floatingButton} h-14 w-14 rounded-full`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${themeConfig.floatingButton}`} />
              <LeoAvatar className="relative z-10 h-7 w-7" />
              <motion.div
                className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-400 rounded-full flex items-center justify-center text-[9px] font-black text-gray-900"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                LEO
              </motion.div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded chat panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={dragConstraintRef}
            dragMomentum={false}
            dragElastic={0.04}
            onDragStart={() => { setIsDragging(true); clearIdleTimer() }}
            onDragEnd={() => { setIsDragging(false); resetIdleTimer() }}
            className="fixed z-50"
            style={{
              bottom: 20,
              right: 20,
              x: panelX,
              y: panelY,
              pointerEvents: 'auto',
              touchAction: 'none',
            }}
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`
                w-[90vw] max-w-[360px] flex flex-col
                backdrop-blur-xl rounded-3xl shadow-2xl border
                ${themeConfig.surface}
                ${isDragging ? 'shadow-[0_20px_60px_rgba(0,0,0,0.35)]' : ''}
              `}
              style={{
                height: 'min(520px, calc(100dvh - 100px))',
                background: isDarkTheme
                  ? 'linear-gradient(135deg, rgba(17,24,39,0.98) 0%, rgba(30,41,59,0.98) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)'
              }}
            >
              {/* ── Drag grip strip ── */}
              <div
                onPointerDown={startDrag}
                className={`shrink-0 cursor-grab active:cursor-grabbing select-none rounded-t-3xl overflow-hidden ${
                  isDarkTheme ? 'bg-gray-800/80' : 'bg-gray-50/80'
                }`}
                title="Drag to move"
              >
                <GripHandle isDarkTheme={isDarkTheme} />
              </div>

              {/* ── Header ── */}
              <div
                onPointerDown={startDrag}
                className={`flex items-center justify-between px-4 py-2.5 border-b shrink-0 cursor-grab active:cursor-grabbing select-none ${
                  isDarkTheme ? 'bg-gray-800/60 border-gray-700' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-100'
                }`}
              >
                <div className="flex items-center gap-3 pointer-events-none">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center bg-gradient-to-r ${themeConfig.primary} ring-2 ring-yellow-400/40`}>
                    <LeoAvatar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${themeConfig.text}`}>Leo 🦁</h3>
                    <p className={`text-xs ${themeConfig.textSecondary}`}>your Lagos plug ✦</p>
                  </div>
                </div>

                <div className="flex items-center gap-1" onPointerDown={e => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearConversation}
                    className={`h-8 w-8 ${isDarkTheme ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-orange-100 text-gray-500'}`}
                    title="Clear chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>

                  <ThemeSwitcher
                    currentTheme={currentTheme}
                    onThemeChange={setCurrentTheme}
                    className="scale-75"
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={collapse}
                    className={`h-8 w-8 rounded-full ${isDarkTheme ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-orange-100 text-gray-600'}`}
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* ── Messages ── */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0"
                onPointerDown={e => e.stopPropagation()}
                onMouseMove={resetIdleTimer}
                onTouchMove={resetIdleTimer}
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
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
                                  : 'bg-white hover:bg-orange-50 text-gray-700 border border-gray-200 shadow-sm'
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
                    initial={{ opacity: 0, y: 8 }}
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

              {/* ── Input bar ── */}
              <div
                className={`p-3 border-t shrink-0 rounded-b-3xl ${
                  isDarkTheme ? 'border-gray-700 bg-gray-900/60' : 'border-orange-100 bg-white/90'
                }`}
                onPointerDown={e => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => { setInputText(e.target.value); resetIdleTimer() }}
                    onKeyDown={handleKeyDown}
                    onFocus={resetIdleTimer}
                    placeholder="Tell Leo what you need..."
                    disabled={isTyping}
                    className={`flex-1 px-4 py-2.5 border rounded-full text-sm focus:outline-none focus:ring-2 transition-all ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-400'
                        : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-orange-300'
                    } ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={isTyping || !inputText.trim()}
                    size="icon"
                    className={`h-10 w-10 shrink-0 rounded-full bg-gradient-to-r ${themeConfig.primary} shadow-md transition-all ${
                      (isTyping || !inputText.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'
                    }`}
                  >
                    {isTyping
                      ? <Loader2 className="h-4 w-4 animate-spin text-white" />
                      : <Send className="h-4 w-4 text-white" />
                    }
                  </Button>
                </div>
                <button
                  onClick={collapse}
                  className={`w-full flex items-center justify-center gap-1 mt-2 text-[11px] transition-opacity opacity-30 hover:opacity-60 ${themeConfig.textSecondary}`}
                >
                  <ChevronDown className="h-3 w-3" />
                  swipe down or tap to close · auto-hides after 10s
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default EnhancedFloatingChat
