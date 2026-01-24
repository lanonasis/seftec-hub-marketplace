"use client"

import { useState } from 'react'
import { User, LogOut, Settings, TrendingUp, Menu } from 'lucide-react'
import AuthModal from './AuthModal'
import { useAuth } from '@/lib/auth-context'

interface UserButtonProps {
  isDarkMode?: boolean
}

export default function UserButton({ isDarkMode = false }: UserButtonProps) {
  const { user, logout, login } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
              : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg'
          }`}
        >
          Sign In
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={login}
        />
      </>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          isDarkMode
            ? 'bg-gray-800 hover:bg-gray-700 text-white'
            : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
        }`}
      >
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
          isDarkMode
            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
            : 'bg-gradient-to-r from-pink-500 to-purple-500'
        }`}>
          <span className="text-white font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:inline font-medium">{user.name.split(' ')[0]}</span>
        <Menu className="h-4 w-4" />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-lg z-50 overflow-hidden border ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`px-4 py-3 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {user.name}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user.email}
              </p>
            </div>

            <div className="py-2">
              <button className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
                <User className="h-4 w-4" />
                <span className="text-sm">Profile</span>
              </button>
              <button className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">My Events</span>
              </button>
              <button className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </button>
            </div>

            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <button
                onClick={() => {
                  logout()
                  setShowMenu(false)
                }}
                className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                  isDarkMode
                    ? 'text-red-400 hover:bg-gray-700'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
