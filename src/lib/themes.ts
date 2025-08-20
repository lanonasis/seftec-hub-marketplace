export type Theme =
  | 'sunset'
  | 'cyberpunk'
  | 'ocean'
  | 'forest'
  | 'monochrome'
  | 'galaxy'

export interface ThemeConfig {
  name: string
  emoji: string
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  gradient: string
  chatBubble: string
  floatingButton: string
}

export const themes: Record<Theme, ThemeConfig> = {
  sunset: {
    name: 'Sunset Glow',
    emoji: '🌅',
    primary: 'from-pink-500 to-orange-500',
    secondary: 'from-purple-500 to-pink-500',
    accent: 'from-orange-400 to-red-500',
    background: 'from-pink-50 via-orange-50 to-yellow-50',
    surface: 'bg-white/90 border-pink-200',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    border: 'border-pink-200',
    gradient: 'bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400',
    chatBubble: 'from-pink-500 to-orange-500',
    floatingButton: 'from-pink-400 via-purple-400 to-orange-400'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    emoji: '🌃',
    primary: 'from-cyan-400 to-blue-500',
    secondary: 'from-purple-500 to-cyan-500',
    accent: 'from-green-400 to-cyan-500',
    background: 'from-gray-900 via-purple-900 to-blue-900',
    surface: 'bg-gray-900/90 border-cyan-500/30',
    text: 'text-cyan-100',
    textSecondary: 'text-cyan-300',
    border: 'border-cyan-500/30',
    gradient: 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500',
    chatBubble: 'from-cyan-500 to-purple-500',
    floatingButton: 'from-cyan-400 via-purple-500 to-pink-500'
  },
  ocean: {
    name: 'Ocean Breeze',
    emoji: '🌊',
    primary: 'from-blue-400 to-teal-500',
    secondary: 'from-teal-500 to-cyan-500',
    accent: 'from-blue-500 to-indigo-500',
    background: 'from-blue-50 via-cyan-50 to-teal-50',
    surface: 'bg-white/90 border-blue-200',
    text: 'text-blue-900',
    textSecondary: 'text-blue-700',
    border: 'border-blue-200',
    gradient: 'bg-gradient-to-r from-blue-400 via-teal-400 to-cyan-400',
    chatBubble: 'from-blue-500 to-teal-500',
    floatingButton: 'from-blue-400 via-teal-400 to-cyan-400'
  },
  forest: {
    name: 'Forest Vibes',
    emoji: '🌲',
    primary: 'from-green-500 to-emerald-600',
    secondary: 'from-emerald-500 to-teal-600',
    accent: 'from-lime-500 to-green-600',
    background: 'from-green-50 via-emerald-50 to-teal-50',
    surface: 'bg-white/90 border-green-200',
    text: 'text-green-900',
    textSecondary: 'text-green-700',
    border: 'border-green-200',
    gradient: 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400',
    chatBubble: 'from-green-500 to-emerald-500',
    floatingButton: 'from-green-400 via-emerald-400 to-teal-400'
  },
  monochrome: {
    name: 'Monochrome',
    emoji: '⚫',
    primary: 'from-gray-700 to-gray-900',
    secondary: 'from-gray-600 to-gray-800',
    accent: 'from-gray-800 to-black',
    background: 'from-gray-50 via-white to-gray-100',
    surface: 'bg-white/90 border-gray-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    gradient: 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800',
    chatBubble: 'from-gray-700 to-gray-900',
    floatingButton: 'from-gray-600 via-gray-700 to-gray-800'
  },
  galaxy: {
    name: 'Galaxy',
    emoji: '🌌',
    primary: 'from-purple-600 to-indigo-700',
    secondary: 'from-indigo-600 to-purple-700',
    accent: 'from-violet-500 to-purple-600',
    background: 'from-indigo-900 via-purple-900 to-pink-900',
    surface: 'bg-indigo-900/90 border-purple-500/30',
    text: 'text-purple-100',
    textSecondary: 'text-purple-300',
    border: 'border-purple-500/30',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
    chatBubble: 'from-purple-600 to-indigo-600',
    floatingButton: 'from-indigo-500 via-purple-500 to-pink-500'
  }
}

export const getThemeClasses = (theme: Theme) => themes[theme]
