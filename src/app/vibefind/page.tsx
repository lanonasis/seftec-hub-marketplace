"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import VibeFinderService from '@/lib/vibefind-service'
import { SocialEvent } from '@/lib/types'
import { Calendar, MapPin, Users, DollarSign, Heart, Star, Share2, Instagram, Music, Sparkles, TrendingUp, Filter, X } from 'lucide-react'
import UserButton from '@/components/UserButton'
import Link from 'next/link'

const EnhancedFloatingChat = dynamic(() => import('@/components/EnhancedFloatingChat'), { ssr: false })

type AttendeeStatus = 'going' | 'interested' | 'not_going'

export default function VibeFindPage() {
  const [events, setEvents] = useState<SocialEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<SocialEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [userAttendance, setUserAttendance] = useState<Record<string, AttendeeStatus>>({})
  const [vibeFind] = useState(() => new VibeFinderService())

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryEvents()
    } else {
      setFilteredEvents(events)
    }
  }, [selectedCategory])

  const loadCategoryEvents = async () => {
    if (!selectedCategory) return
    try {
      const filtered = await vibeFind.getEventsByCategory(selectedCategory)
      setFilteredEvents(filtered)
    } catch (error) {
      console.error('Failed to filter events:', error)
    }
  }

  const loadEvents = async () => {
    setLoading(true)
    try {
      const allEvents = await vibeFind.getEvents()
      setEvents(allEvents)
      setFilteredEvents(allEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRSVP = (eventId: string, status: AttendeeStatus) => {
    setUserAttendance(prev => ({
      ...prev,
      [eventId]: status
    }))
    // In a real app, this would call an API
    console.log(`RSVP'd ${status} to event ${eventId}`)
  }

  const categories = [
    { id: 'party', name: 'Parties', emoji: '🎉' },
    { id: 'food', name: 'Food & Drinks', emoji: '🍕' },
    { id: 'music', name: 'Music', emoji: '🎵' },
    { id: 'sports', name: 'Sports', emoji: '⚽' },
    { id: 'art', name: 'Art & Culture', emoji: '🎨' },
    { id: 'wellness', name: 'Wellness', emoji: '🧘‍♀️' },
  ]

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      party: 'from-pink-500 to-purple-500',
      food: 'from-orange-500 to-red-500',
      music: 'from-blue-500 to-cyan-500',
      sports: 'from-green-500 to-teal-500',
      art: 'from-purple-500 to-indigo-500',
      wellness: 'from-emerald-500 to-green-500',
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  const getVibeScoreColor = (score: number) => {
    if (score >= 9) return 'text-purple-500'
    if (score >= 8) return 'text-pink-500'
    if (score >= 7) return 'text-blue-500'
    return 'text-gray-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  SEFTEC Hub
                </h1>
              </Link>
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  VibeFind
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                Marketplace
              </Link>
              <Link href="/vibefind" className="text-sm text-purple-600 font-semibold">
                Events
              </Link>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="sticky top-[73px] z-30 bg-white/95 backdrop-blur-lg border-b border-purple-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Filter by Category</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Events
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300'
                  }`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Discover Your Next Vibe
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find events, meet people, and experience the best your city has to offer. From underground parties to food tours, we've got your social calendar covered! 🎉
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{events.reduce((sum, e) => sum + e.attendees.totalGoing, 0)}+ going</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>{events.length} events this week</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Curated just for you</span>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const userStatus = userAttendance[event.id]
              const isGoing = userStatus === 'going'
              const isInterested = userStatus === 'interested'

              return (
                <div
                  key={event.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-300"
                >
                  {/* Event Image */}
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-white text-xs font-bold backdrop-blur-sm bg-gradient-to-r ${getCategoryColor(event.category)}`}>
                      {event.category.toUpperCase()}
                    </div>
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      {event.vibeScore >= 9 && (
                        <div className="px-3 py-1.5 rounded-full bg-red-500/90 text-white text-xs font-bold backdrop-blur-sm animate-pulse">
                          🔥 TRENDING
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800 flex-1">{event.title}</h3>
                      <div className="flex items-center gap-1 ml-2">
                        <Star className={`h-5 w-5 ${getVibeScoreColor(event.vibeScore)} fill-current`} />
                        <span className={`text-lg font-bold ${getVibeScoreColor(event.vibeScore)}`}>
                          {event.vibeScore}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span>
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })} • {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        <span className="truncate">{event.location.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span>{event.attendees.totalGoing} going</span>
                        {event.maxAttendees && (
                          <span className="text-xs text-gray-400">• {event.maxAttendees} max</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-purple-500" />
                        <span className="font-semibold text-purple-700">
                          {event.price.type === 'free' ? 'FREE' : event.price.amount}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {event.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Social Links */}
                    {event.socialLinks && (
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                        {event.socialLinks.instagram && (
                          <a
                            href={event.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:shadow-lg transition-all"
                          >
                            <Instagram className="h-4 w-4" />
                          </a>
                        )}
                        {event.socialLinks.tiktok && (
                          <a
                            href={event.socialLinks.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-black rounded-lg text-white hover:shadow-lg transition-all"
                          >
                            <Music className="h-4 w-4" />
                          </a>
                        )}
                        <button className="ml-auto p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-all">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* RSVP Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRSVP(event.id, isGoing ? 'not_going' : 'going')}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                          isGoing
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                      >
                        {isGoing ? '✓ Going' : 'I\'m Going!'}
                      </button>
                      <button
                        onClick={() => handleRSVP(event.id, isInterested ? 'not_going' : 'interested')}
                        className={`p-3 rounded-xl transition-all ${
                          isInterested
                            ? 'bg-pink-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isInterested ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-500">Try selecting a different category or check back later!</p>
          </div>
        )}
      </section>

      {/* Floating Chat */}
      <EnhancedFloatingChat />

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 py-16 mt-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Vibe?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of people discovering the best events in your city. Your next adventure is just a click away!
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105">
            Create Your Profile
          </button>
        </div>
      </section>
    </div>
  )
}
