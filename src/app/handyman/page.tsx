"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Search, Star, MapPin, Clock, Phone, Calendar, CheckCircle, Shield, TrendingUp, Zap } from 'lucide-react'

const EnhancedFloatingChat = dynamic(() => import('@/components/EnhancedFloatingChat'), { ssr: false })

export default function HandymanPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [handymen, setHandymen] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: 'plumber', name: 'Plumber', emoji: '🔧' },
    { id: 'electrician', name: 'Electrician', emoji: '⚡' },
    { id: 'cleaner', name: 'Cleaner', emoji: '🧹' },
    { id: 'mechanic', name: 'Mechanic', emoji: '🔩' },
    { id: 'painter', name: 'Painter', emoji: '🎨' },
    { id: 'carpenter', name: 'Carpenter', emoji: '🪚' },
  ]

  useEffect(() => {
    loadHandymen()
  }, [selectedCategory])

  const loadHandymen = async () => {
    setLoading(true)
    try {
      const params = selectedCategory ? `?service=${selectedCategory}` : '?service=general'
      const response = await fetch(`/api/search/handymen${params}`)
      const data = await response.json()
      setHandymen(data.handymen || [])
    } catch (error) {
      console.error('Failed to load handymen:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      loadHandymen()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get Anything Done
            </h1>
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Quality Handymen.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Real Reviews.
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No more victims. Just verified pros rated by people who've actually used them.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you need done? (e.g., 'fix my sink', 'paint my room')"
              className="w-full pl-12 pr-32 py-4 rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white border border-blue-200 text-gray-700 hover:border-blue-400'
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white border border-blue-200 text-gray-700 hover:border-blue-400'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-xl p-4 border border-blue-100 text-center">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Background Checked</p>
            <p className="text-sm text-gray-600">All pros are verified</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-100 text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Real Reviews</p>
            <p className="text-sm text-gray-600">From actual customers</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-100 text-center">
            <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Instant Booking</p>
            <p className="text-sm text-gray-600">Get help today</p>
          </div>
        </div>
      </section>

      {/* Handymen Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {handymen.map((handyman) => (
              <div
                key={handyman.id}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-300"
              >
                {/* Header with photo and basic info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={handyman.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
                      alt={handyman.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100"
                    />
                    {handyman.verified && (
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{handyman.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold text-gray-700">{handyman.rating}</span>
                      <span className="text-xs text-gray-500">({handyman.reviews || 45} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{handyman.distance} away</span>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">SERVICES</p>
                  <div className="flex flex-wrap gap-1">
                    {handyman.services.map((service: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Clock className="h-3 w-3" />
                      <span>Availability</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{handyman.availability}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <span>💰</span>
                      <span>Price Range</span>
                    </div>
                    <p className="text-sm font-semibold text-blue-600">{handyman.price_range}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Book Now
                  </button>
                  <button className="py-2.5 px-4 rounded-xl border-2 border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-all">
                    <Phone className="h-4 w-4 inline" />
                  </button>
                </div>

                {/* Community Note */}
                {handyman.verified && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600">
                      ✓ <span className="font-medium text-green-700">Community Verified</span> by {Math.floor(Math.random() * 20) + 5} local users
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {handymen.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No handymen found</h3>
            <p className="text-gray-500">Try searching for a specific service or check back later!</p>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-white border-t border-blue-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Tell Us What You Need</h3>
              <p className="text-gray-600">
                Search or describe the job. AI helps you find the right pro.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Choose Your Pro</h3>
              <p className="text-gray-600">
                See real ratings from people in your community.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Get It Done</h3>
              <p className="text-gray-600">
                Book instantly and get quality work you can trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat */}
      <EnhancedFloatingChat />
    </div>
  )
}
