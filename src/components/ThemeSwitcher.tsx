"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { themes, Theme, getThemeClasses } from '@/lib/themes'
import { Palette, ChevronDown } from 'lucide-react'

interface ThemeSwitcherProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
  className?: string
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const currentThemeConfig = getThemeClasses(currentTheme)

  const themeOrder: Theme[] = ['sunset', 'cyberpunk', 'ocean', 'forest', 'monochrome', 'galaxy']

  return (
    <div className={`relative ${className}`}>
      {/* Theme Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full backdrop-blur-sm border-2 transition-all duration-300 ${
          currentTheme === 'cyberpunk' || currentTheme === 'galaxy'
            ? 'bg-gray-900/80 border-purple-500/50 text-purple-300'
            : 'bg-white/80 border-gray-200 text-gray-700 hover:border-gray-300'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${currentThemeConfig.gradient}`} />
          <Palette className="h-4 w-4" />
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-3 w-3" />
          </motion.div>
        </div>
      </motion.button>

      {/* Theme Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full mt-2 right-0 p-3 rounded-2xl backdrop-blur-xl border shadow-2xl z-50 ${
              currentTheme === 'cyberpunk' || currentTheme === 'galaxy'
                ? 'bg-gray-900/90 border-purple-500/30'
                : 'bg-white/90 border-gray-200'
            }`}
          >
            <div className="grid grid-cols-2 gap-2 min-w-[280px]">
              {themeOrder.map((theme) => {
                const config = getThemeClasses(theme)
                const isActive = theme === currentTheme

                return (
                  <motion.button
                    key={theme}
                    onClick={() => {
                      onThemeChange(theme)
                      setIsOpen(false)
                    }}
                    className={`relative p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'ring-2 ring-offset-2 ring-blue-500'
                        : 'hover:scale-105'
                    }`}
                    whileHover={{ scale: isActive ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Theme Preview */}
                    <div className={`h-12 w-full rounded-lg bg-gradient-to-r ${config.gradient} mb-2 relative overflow-hidden`}>
                      {/* Animated sparkles for some themes */}
                      {theme === 'galaxy' && (
                        <div className="absolute inset-0">
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white rounded-full"
                              style={{
                                left: `${20 + (i * 10)}%`,
                                top: `${20 + (i * 7)}%`,
                              }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Floating elements for cyberpunk */}
                      {theme === 'cyberpunk' && (
                        <motion.div
                          className="absolute inset-0 opacity-30"
                          animate={{
                            backgroundPosition: ['0% 0%', '100% 100%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                          style={{
                            backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(0,255,255,0.3) 50%, transparent 70%)',
                            backgroundSize: '20px 20px',
                          }}
                        />
                      )}
                    </div>

                    {/* Theme Info */}
                    <div className="text-left">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-lg">{config.emoji}</span>
                        <span className={`text-sm font-medium ${
                          currentTheme === 'cyberpunk' || currentTheme === 'galaxy'
                            ? 'text-white'
                            : 'text-gray-800'
                        }`}>
                          {config.name}
                        </span>
                      </div>

                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`text-xs ${
                            currentTheme === 'cyberpunk' || currentTheme === 'galaxy'
                              ? 'text-purple-300'
                              : 'text-gray-500'
                          }`}
                        >
                          Active
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-3 pt-3 border-t border-gray-200/20">
              <button
                onClick={() => {
                  // Cycle to next theme
                  const currentIndex = themeOrder.indexOf(currentTheme)
                  const nextIndex = (currentIndex + 1) % themeOrder.length
                  onThemeChange(themeOrder[nextIndex])
                  setIsOpen(false)
                }}
                className={`w-full p-2 rounded-lg text-sm transition-colors ${
                  currentTheme === 'cyberpunk' || currentTheme === 'galaxy'
                    ? 'text-purple-300 hover:bg-purple-500/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🎲 Surprise Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeSwitcher
