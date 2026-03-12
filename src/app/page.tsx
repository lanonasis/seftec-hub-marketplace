"use client"

import dynamic from 'next/dynamic'
import UserButton from '@/components/UserButton'
import { Moon, Sun, Sparkles, Wrench, ArrowRight, Zap, Shield, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const EnhancedFloatingChat = dynamic(() => import('@/components/EnhancedFloatingChat'), { ssr: false })

const heroSlides = [
  {
    line1: "Yo, Lagos \u2014",
    line2: "where's your next vibe? \ud83d\udd25",
    subtitle: "Real events. Real handymen. No cap, no wahala."
  },
  {
    line1: "Everything You Need.",
    line2: "Everyone You Trust.",
    subtitle: "Real services. Real experiences. Real people."
  },
]

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const alreadyOpened = sessionStorage.getItem('seftec-leo-auto-opened')
    if (!alreadyOpened) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('leo-auto-open', {
          detail: {
            message: "Babe, vibe or fix? Tell me \ud83d\udc40",
            onReply: (text: string) => {
              const lower = text.toLowerCase()
              if (lower.includes('party') || lower.includes('vibe') || lower.includes('event') || lower.includes('rave')) {
                router.push('/vibefind')
              } else if (lower.includes('fix') || lower.includes('ac') || lower.includes('handyman') || lower.includes('plumb') || lower.includes('electric')) {
                router.push('/handyman')
              }
            }
          }
        }))
        sessionStorage.setItem('seftec-leo-auto-opened', 'true')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [router])

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900'
        : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'
    }`}>
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

      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-16 relative min-h-[200px] flex flex-col items-center justify-center">
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
                i === heroIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {slide.line1}
                <br />
                <span className={`${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent'
                }`}>
                  {slide.line2}
                </span>
              </h2>
              <p className={`text-xl md:text-2xl max-w-2xl mx-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {slide.subtitle}
              </p>
            </div>
          ))}
          <div className="flex gap-2 mt-[180px]">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === heroIndex
                    ? `w-8 ${isDarkMode ? 'bg-purple-400' : 'bg-purple-500'}`
                    : `w-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Link href="/handyman">
            <div className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
              isDarkMode
                ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-700/50 hover:border-blue-500'
                : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 hover:border-blue-400 hover:shadow-2xl'
            }`}>
              <div className="relative z-10">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${
                  isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
                }`}>
                  <Wrench className={`h-7 w-7 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Something Broke? We Got You {'\ud83d\udd27'}
                </h3>
                <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  AC dead? Pipe burst? Book a verified pro in 30 secs. No stories.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Plumbers', 'Electricians', 'AC Repair', 'Mechanics'].map((service) => (
                    <span
                      key={service}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <div className={`flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Find a Guy Now <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          <Link href="/vibefind">
            <div className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
              isDarkMode
                ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50 hover:border-purple-500'
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 hover:border-purple-400 hover:shadow-2xl'
            }`}>
              <div className="relative z-10">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${
                  isDarkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'
                }`}>
                  <Sparkles className={`h-7 w-7 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Where&apos;s the Vibe Tonight? {'\u2728'}
                </h3>
                <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Parties, food crawls, rooftop vibes &mdash; find where Lagos is linking up.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Parties', 'Food Tours', 'Live Music', 'Owambe'].map((vibe) => (
                    <span
                      key={vibe}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {vibe}
                    </span>
                  ))}
                </div>
                <div className={`flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  Show Me the Vibes <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
              isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
            }`}>
              <Shield className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Scammers Here
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Every pro is verified. We block the rubbish ones.
            </p>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
              isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'
            }`}>
              <Zap className={`h-6 w-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
            <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Fast Like Lagos Traffic Isn&apos;t
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Book a pro or RSVP to a rave in under 30 seconds
            </p>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <Users className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Community Rated
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Real reviews from real Lagos people. No fake 5-stars.
            </p>
          </div>
        </div>
      </section>

      <EnhancedFloatingChat />
    </div>
  )
}
