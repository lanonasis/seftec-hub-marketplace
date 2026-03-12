"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  mounted: boolean
  dm: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  mounted: false,
  dm: false,
  toggleDarkMode: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('seftec-dark-mode')
      if (stored === 'true') setIsDarkMode(true)
    } catch {}
  }, [])

  const toggleDarkMode = () => {
    const next = !isDarkMode
    setIsDarkMode(next)
    try { localStorage.setItem('seftec-dark-mode', String(next)) } catch {}
  }

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      mounted,
      dm: mounted && isDarkMode,
      toggleDarkMode,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
