"use client"

import dynamic from 'next/dynamic'
import UserButton from '@/components/UserButton'
import { Moon, Sun, Sparkles, Wrench, ArrowRight, Zap, Shield, Users } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const EnhancedFloatingChat = dynamic(() => import('@/components/EnhancedFloatingChat'), { ssr: false })

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900'
        : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-lg border-b transition-colors duration-500 ${
        isDarkMode
          ? 'bg-gray-900/80 border-gray-700'
          : 'bg-white/80 border-pink-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500'
              }`}>
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className={`text-xl font-bold ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'
              }`}>
                SEFTEC Hub
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <UserButton isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Everything You Need.
            <br />
            <span className={`${
              isDarkMode
                ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent'
            }`}>
              Everyone You Trust.
            </span>
          </h2>
          <p className={`text-xl md:text-2xl max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Real services. Real experiences. Real people.
          </p>
        </div>

        {/* Two Hero Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Handyman Services Card */}
          <Link href="/handyman">
            <div className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
              isDarkMode
                ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-700/50 hover:border-blue-500'
                : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 hover:border-blue-400 hover:shadow-2xl'
            }`}>
              <div className="relative z-10">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${
                  isDarkMode
                    ? 'bg-blue-500/20'
                    : 'bg-blue-500/10'
                }`}>
                  <Wrench className={`h-7 w-7 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>

                <h3 className={`text-2xl font-bold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Get Anything Done
                </h3>

                <p className={`text-lg mb-6 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Quality handymen you can trust. Rated by real people who've been there.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {['Plumbers', 'Electricians', 'Cleaners', 'Mechanics'].map((service) => (
                    <span
                      key={service}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode
                          ? 'bg-blue-900/40 text-blue-300'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {service}
                    </span>
                  ))}
                </div>

                <div className={`flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Find Your Pro <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Background gradient animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          {/* VibeFind Card */}
          <Link href="/vibefind">
            <div className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
              isDarkMode
                ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50 hover:border-purple-500'
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 hover:border-purple-400 hover:shadow-2xl'
            }`}>
              <div className="relative z-10">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${
                  isDarkMode
                    ? 'bg-purple-500/20'
                    : 'bg-purple-500/10'
                }`}>
                  <Sparkles className={`h-7 w-7 ${
                    isDarkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>

                <h3 className={`text-2xl font-bold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Discover Your Vibe
                </h3>

                <p className={`text-lg mb-6 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Find events, meet people, and experience the best your city has to offer.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {['Parties', 'Food Tours', 'Live Music', 'Social'].map((vibe) => (
                    <span
                      key={vibe}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode
                          ? 'bg-purple-900/40 text-purple-300'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {vibe}
                    </span>
                  ))}
                </div>

                <div className={`flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  Explore Events <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Background gradient animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
              isDarkMode
                ? 'bg-green-500/20'
                : 'bg-green-100'
            }`}>
              <Shield className={`h-6 w-6 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
            <h4 className={`font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Verified Pros
            </h4>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Background-checked and rated by real customers
            </p>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
              isDarkMode
                ? 'bg-orange-500/20'
                : 'bg-orange-100'
            }`}>
              <Zap className={`h-6 w-6 ${
                isDarkMode ? 'text-orange-400' : 'text-orange-600'
              }`} />
            </div>
            <h4 className={`font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Instant Booking
            </h4>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Get help fast or discover events happening tonight
            </p>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
              isDarkMode
                ? 'bg-blue-500/20'
                : 'bg-blue-100'
            }`}>
              <Users className={`h-6 w-6 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <h4 className={`font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Community Verified
            </h4>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Recommended by people you can trust
            </p>
          </div>
        </div>
      </section>

      {/* Floating Chat */}
      <EnhancedFloatingChat />
    </div>
  )
}
