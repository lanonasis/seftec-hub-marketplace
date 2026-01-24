"use client"

import dynamic from 'next/dynamic'
import UserButton from '@/components/UserButton'
import { Heart, MapPin, Star, Clock, Users, Moon, Sun, Wrench, Phone, CheckCircle, Calendar, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const EnhancedFloatingChat = dynamic(() => import('@/components/EnhancedFloatingChat'), { ssr: false })

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [handymen, setHandymen] = useState<any[]>([])
  const [loadingHandymen, setLoadingHandymen] = useState(false)

  const mockSpots = [
    {
      id: 1,
      name: "The Rooftop Vibes",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
      rating: 4.8,
      price: "$25",
      distance: "0.3mi",
      tags: ["Unlimited Drinks", "Instagram Worthy", "Sunset Views"],
      time: "5-8pm Happy Hour"
    },
    {
      id: 2,
      name: "Zen Garden Spa",
      image: "https://images.unsplash.com/photo-1596178060810-2d5825dda8d7?w=400&h=300&fit=crop",
      rating: 4.9,
      price: "$89",
      distance: "0.7mi",
      tags: ["Self Care", "Aesthetic", "Deals"],
      time: "Open Now"
    },
    {
      id: 3,
      name: "Tony's Pizza Lab",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      rating: 4.7,
      price: "$12",
      distance: "0.5mi",
      tags: ["Late Night", "Giant Slices", "Quick Delivery"],
      time: "Open till 2am"
    },
    {
      id: 4,
      name: "Neon Night Market",
      image: "https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=400&h=300&fit=crop",
      rating: 4.6,
      price: "Free",
      distance: "1.2mi",
      tags: ["Night Market", "Food Trucks", "Live Music"],
      time: "7pm-12am"
    },
    {
      id: 5,
      name: "Artisan Coffee Co",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
      rating: 4.8,
      price: "$8",
      distance: "0.2mi",
      tags: ["Study Spot", "WiFi", "Aesthetic Lattes"],
      time: "6am-10pm"
    },
    {
      id: 6,
      name: "Secret Garden Bar",
      image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=300&fit=crop",
      rating: 4.9,
      price: "$35",
      distance: "0.9mi",
      tags: ["Hidden Gem", "Cocktails", "Garden Setting"],
      time: "6pm-1am"
    }
  ]

  // Load handymen data
  useEffect(() => {
    const loadHandymen = async () => {
      setLoadingHandymen(true)
      try {
        const response = await fetch('/api/search/handymen?service=general')
        const data = await response.json()
        setHandymen(data.handymen || [])
      } catch (error) {
        console.error('Failed to load handymen:', error)
      } finally {
        setLoadingHandymen(false)
      }
    }

    loadHandymen()
  }, [])

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
              <Link href="/" className={`text-sm font-semibold transition-colors ${
                isDarkMode ? 'text-blue-400' : 'text-pink-600'
              }`}>
                Marketplace
              </Link>
              <Link href="/vibefind" className={`flex items-center gap-1 text-sm transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-pink-600'
              }`}>
                <Sparkles className="h-4 w-4" />
                <span>VibeFind</span>
              </Link>
              <button className={`text-sm transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-pink-600'
              }`}>
                Saved
              </button>

              {/* Dark Mode Toggle */}
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

              {/* User Button */}
              <UserButton isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className={`text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            What's your
            <span className={`${
              isDarkMode
                ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'
            }`}> vibe </span>
            today?
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Let AI help you discover amazing experiences nearby. Drag the chat bubble around and ask for anything! ✨
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            "🍹 Unlimited drinks",
            "🧘‍♀️ Spa getaway",
            "🍕 Late night food",
            "☕ Study spots",
            "🎉 Fun tonight",
            "💆‍♀️ Self care"
          ].map((action, index) => (
            <button
              key={index}
              className={`px-4 py-2 backdrop-blur-sm border rounded-full text-sm transition-all duration-200 ${
                isDarkMode
                  ? 'bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700/50 hover:border-blue-400'
                  : 'bg-white/80 border-pink-200 text-gray-700 hover:bg-pink-50 hover:border-pink-300'
              }`}
            >
              {action}
            </button>
          ))}
        </div>
      </section>

      {/* Spots Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSpots.map((spot) => (
            <div
              key={spot.id}
              className={`group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border ${
                isDarkMode
                  ? 'bg-gray-800/50 border-gray-700 hover:border-blue-400'
                  : 'bg-white border-pink-100 hover:border-pink-200'
              }`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <button className={`h-8 w-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${
                    isDarkMode ? 'bg-gray-900/70 hover:bg-gray-800' : 'bg-white/90 hover:bg-white'
                  }`}>
                    <Heart className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                    {spot.time}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-semibold text-lg ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>{spot.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>{spot.rating}</span>
                  </div>
                </div>

                <div className={`flex items-center gap-4 text-sm mb-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{spot.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`font-semibold ${
                      isDarkMode ? 'text-blue-400' : 'text-pink-600'
                    }`}>{spot.price}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {spot.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs ${
                        isDarkMode
                          ? 'bg-blue-900/30 text-blue-300'
                          : 'bg-pink-50 text-pink-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Handyman Section */}
      <section className={`py-16 border-t ${
        isDarkMode
          ? 'bg-gray-800/30 border-gray-700'
          : 'bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wrench className={`h-8 w-8 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h2 className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Need a
                <span className={`${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
                }`}> Handyman</span>?
              </h2>
            </div>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Find verified local pros for any job. All handymen are background-checked and highly rated! ✅
            </p>
          </div>

          {loadingHandymen ? (
            <div className="flex justify-center items-center py-12">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                isDarkMode ? 'border-blue-400' : 'border-blue-600'
              }`}></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {handymen.map((handyman) => (
                <div
                  key={handyman.id}
                  className={`group rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border ${
                    isDarkMode
                      ? 'bg-gray-900/50 border-gray-700 hover:border-blue-400'
                      : 'bg-white border-blue-100 hover:border-blue-200'
                  }`}
                >
                  {/* Header with photo and basic info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={handyman.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
                        alt={handyman.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {handyman.verified && (
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>{handyman.name}</h3>
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-700'
                        }`}>{handyman.rating}</span>
                      </div>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{handyman.distance} away</p>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {handyman.services.map((service: string, index: number) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs ${
                            isDarkMode
                              ? 'bg-blue-900/30 text-blue-300'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price and Availability */}
                  <div className={`flex items-center justify-between mb-4 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{handyman.availability}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>{handyman.price_range}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                      isDarkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Book Now
                    </button>
                    <button className={`py-2 px-4 rounded-full border text-sm font-medium transition-colors ${
                      isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}>
                      <Phone className="h-4 w-4 inline mr-1" />
                      Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Chat */}
      <EnhancedFloatingChat />

      {/* Demo Instructions */}
      <div className={`fixed bottom-4 left-4 backdrop-blur-sm border rounded-2xl p-4 max-w-sm shadow-lg transition-colors duration-500 ${
        isDarkMode
          ? 'bg-gray-900/80 border-gray-700'
          : 'bg-white/90 border-pink-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-400 to-purple-500'
              : 'bg-gradient-to-r from-pink-400 to-purple-500'
          }`}>
            <span className="text-white text-xs">💡</span>
          </div>
          <h4 className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Try the Magic!</h4>
        </div>
        <ul className={`text-sm space-y-1 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <li>• Click your SEFTEC logo bubble to open chat</li>
          <li>• Drag it anywhere on screen!</li>
          <li>• Toggle AI providers (🧠 DeepSeek / 🔍 Perplexity)</li>
          <li>• Ask: "Find me a handyman" or "unlimited drinks"</li>
          <li>• Perfect for your mum's eyes! 👀</li>
        </ul>
      </div>
    </div>
  )
}
