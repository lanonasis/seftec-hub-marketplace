"use client"

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import VibeFinderService from '@/lib/vibefind-service'
import { SocialEvent } from '@/lib/types'
import { Calendar, MapPin, Users, DollarSign, Heart, Star, Share2, Instagram, Music, Sparkles, TrendingUp, Filter, X, Plus, Flame } from 'lucide-react'
import UserButton from '@/components/UserButton'
import Link from 'next/link'

const EnhancedFloatingChat = dynamic(() => import('@/components/EnhancedFloatingChat'), { ssr: false })

type AttendeeStatus = 'going' | 'interested' | 'not_going'

const RSVP_STORAGE_KEY = 'seftec-rsvp-state'
const SHARE_COUNT_KEY = 'seftec-share-counts'
const CUSTOM_EVENTS_KEY = 'seftec-custom-events'

function getStoredRSVPs(): Record<string, AttendeeStatus> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(RSVP_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch { return {} }
}

function getStoredShareCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(SHARE_COUNT_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch { return {} }
}

function getStoredCustomEvents(): SocialEvent[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CUSTOM_EVENTS_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return parsed.map((e: any) => ({ ...e, date: new Date(e.date), created: new Date(e.created), updated: new Date(e.updated) }))
  } catch { return [] }
}

function getCrowdColor(totalGoing: number): string {
  if (totalGoing >= 200) return 'border-red-500 bg-red-50'
  if (totalGoing >= 100) return 'border-yellow-500 bg-yellow-50'
  return 'border-green-500 bg-green-50'
}

function getCrowdLabel(totalGoing: number): { text: string; color: string } {
  if (totalGoing >= 200) return { text: 'PACKED', color: 'bg-red-500' }
  if (totalGoing >= 100) return { text: 'BUSY', color: 'bg-yellow-500' }
  return { text: 'CHILL', color: 'bg-green-500' }
}

async function shareUrl(url: string, title: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ title, url })
      return true
    } catch { return false }
  }
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch { return false }
}

export default function VibeFindPage() {
  const [events, setEvents] = useState<SocialEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<SocialEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [userAttendance, setUserAttendance] = useState<Record<string, AttendeeStatus>>({})
  const [shareCounts, setShareCounts] = useState<Record<string, number>>({})
  const [vibeFind] = useState(() => new VibeFinderService())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [leoTriggered, setLeoTriggered] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const [newEvent, setNewEvent] = useState({
    name: '', date: '', time: '', location: '', category: 'party', description: ''
  })

  useEffect(() => {
    loadEvents()
    setUserAttendance(getStoredRSVPs())
    setShareCounts(getStoredShareCounts())
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryEvents()
    } else {
      setFilteredEvents(events)
    }
  }, [selectedCategory, events])

  const loadCategoryEvents = async () => {
    if (!selectedCategory) return
    try {
      const filtered = await vibeFind.getEventsByCategory(selectedCategory)
      const customEvents = getStoredCustomEvents().filter(e => e.category === selectedCategory)
      setFilteredEvents([...customEvents, ...filtered])
    } catch (error) {
      console.error('Failed to filter events:', error)
    }
  }

  const loadEvents = async () => {
    setLoading(true)
    try {
      const allEvents = await vibeFind.getEvents()
      const customEvents = getStoredCustomEvents()
      const combined = [...customEvents, ...allEvents]
      setEvents(combined)
      setFilteredEvents(combined)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRSVP = (eventId: string, status: AttendeeStatus) => {
    const newAttendance = { ...userAttendance }
    if (userAttendance[eventId] === status) {
      newAttendance[eventId] = 'not_going'
    } else {
      newAttendance[eventId] = status
    }
    setUserAttendance(newAttendance)
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(newAttendance))

    if (status === 'going' && !leoTriggered && !sessionStorage.getItem('seftec-leo-crosssell-fired')) {
      setLeoTriggered(true)
      sessionStorage.setItem('seftec-leo-crosssell-fired', 'true')
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('leo-inject-message', {
          detail: {
            text: "Post-party and lights go out? \ud83d\ude05 I got a handyman on speed dial \ud83d\udd27",
            suggestions: ["Take me to Handyman Hub \ud83d\udd27"]
          }
        }))
      }, 1500)
    }
  }

  const handleShareForFriend = async (eventId: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const event = filteredEvents.find(e => e.id === eventId)
    const shared = await shareUrl(url, event?.title || 'Check out this vibe!')
    if (shared) {
      const newCounts = { ...shareCounts, [eventId]: (shareCounts[eventId] || 0) + 1 }
      setShareCounts(newCounts)
      localStorage.setItem(SHARE_COUNT_KEY, JSON.stringify(newCounts))
    }
  }

  const handleInviteSquad = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const shared = await shareUrl(url, 'Check out VibeFind - Lagos events!')
    if (shared) {
      setCopiedId('squad')
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.date || !newEvent.location) return
    const customEvent: SocialEvent = {
      id: `custom-${Date.now()}`,
      title: newEvent.name,
      description: newEvent.description || 'A new vibe created by the community!',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
      category: newEvent.category as SocialEvent['category'],
      date: new Date(newEvent.date),
      time: newEvent.time || 'TBD',
      location: { name: newEvent.location, address: newEvent.location, distance: 'Lagos' },
      host: { id: 'user', name: 'You', avatar: '', isVerified: false },
      attendees: { going: [], interested: [], totalGoing: 1, totalInterested: 0 },
      price: { type: 'free' },
      tags: [newEvent.category],
      vibeScore: 7.0,
      socialLinks: {},
      isPublic: true,
      whatToExpect: [],
      created: new Date(),
      updated: new Date()
    }

    const existingCustom = getStoredCustomEvents()
    const updated = [customEvent, ...existingCustom]
    localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(updated))

    setEvents(prev => [customEvent, ...prev])
    setFilteredEvents(prev => [customEvent, ...prev])
    setShowCreateModal(false)
    setNewEvent({ name: '', date: '', time: '', location: '', category: 'party', description: '' })
  }

  const categories = [
    { id: 'party', name: 'Parties', emoji: '\ud83c\udf89' },
    { id: 'food', name: 'Food & Drinks', emoji: '\ud83c\udf55' },
    { id: 'music', name: 'Music', emoji: '\ud83c\udfb5' },
    { id: 'nightlife', name: 'Nightlife', emoji: '\ud83c\udf03' },
    { id: 'outdoor', name: 'Outdoor', emoji: '\ud83c\udfd6\ufe0f' },
    { id: 'social', name: 'Social', emoji: '\ud83e\uddd8\u200d\u2640\ufe0f' },
  ]

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      party: 'from-pink-500 to-purple-500',
      food: 'from-orange-500 to-red-500',
      music: 'from-blue-500 to-cyan-500',
      nightlife: 'from-indigo-500 to-purple-500',
      outdoor: 'from-green-500 to-teal-500',
      social: 'from-emerald-500 to-green-500',
      culture: 'from-purple-500 to-indigo-500',
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
                Home
              </Link>
              <Link href="/handyman" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                Handyman
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

      {showFilters && (
        <div className="sticky top-[73px] z-30 bg-white/95 backdrop-blur-lg border-b border-purple-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Filter by Category</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
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

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Lagos, Where You Dey Tonight? {'\ud83d\udd25'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            No dull moment. Find the hottest parties, food crawls, and owambe in Lagos. Your squad is waiting. {'\ud83c\udf89'}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={scrollToGrid}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              {'\ud83d\udd25'} See what&apos;s hot now
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              <Plus className="h-4 w-4 inline mr-1" /> Create your own rave
            </button>
            <button
              onClick={handleInviteSquad}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              <Share2 className="h-4 w-4 inline mr-1" /> {copiedId === 'squad' ? 'Link copied!' : 'Invite squad'}
            </button>
          </div>
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
              <span>Curated for Lagos</span>
            </div>
          </div>
        </div>

        {!loading && events.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Flame className="h-5 w-5 text-red-500" /> Heat Map &mdash; Where Lagos Is Right Now
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[...events]
                .sort((a, b) => b.attendees.totalGoing - a.attendees.totalGoing)
                .map((event) => {
                  const crowd = getCrowdLabel(event.attendees.totalGoing)
                  return (
                    <div
                      key={`heat-${event.id}`}
                      className={`flex-shrink-0 w-56 rounded-2xl border-2 p-4 transition-all hover:shadow-lg cursor-pointer ${getCrowdColor(event.attendees.totalGoing)}`}
                      onClick={scrollToGrid}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${crowd.color}`}>
                          {crowd.text}
                        </span>
                        <span className="text-sm font-bold text-gray-700">{event.attendees.totalGoing} going</span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-800 truncate">{event.title}</h4>
                      <p className="text-xs text-gray-500 truncate">{event.location.name}</p>
                    </div>
                  )
                })}
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-500 inline-block"></span> 200+ going (Packed)</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-yellow-500 inline-block"></span> 100-199 (Busy)</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-500 inline-block"></span> &lt;100 (Chill)</span>
            </div>
          </div>
        )}

        <div ref={gridRef}>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const isGoing = userAttendance[event.id] === 'going'
                const isInterested = userAttendance[event.id] === 'interested'
                const eventShareCount = shareCounts[event.id] || 0

                return (
                  <div
                    key={event.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-300"
                  >
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
                            {'\ud83d\udd25'} TRENDING
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>

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

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-purple-500" />
                          <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'short', month: 'short', day: 'numeric'
                            })} {'\u2022'} {event.time}
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
                            <span className="text-xs text-gray-400">{'\u2022'} {event.maxAttendees} max</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-purple-500" />
                          <span className="font-semibold text-purple-700">
                            {event.price.type === 'free' ? 'FREE' : event.price.amount}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {event.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {event.socialLinks && (
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                          {event.socialLinks.instagram && (
                            <a href={`https://instagram.com/${event.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                              className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:shadow-lg transition-all">
                              <Instagram className="h-4 w-4" />
                            </a>
                          )}
                          {event.socialLinks.tiktok && (
                            <a href={`https://tiktok.com/${event.socialLinks.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                              className="p-2 bg-black rounded-lg text-white hover:shadow-lg transition-all">
                              <Music className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleInviteSquad()}
                            className="ml-auto p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-all"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRSVP(event.id, isGoing ? 'not_going' : 'going')}
                          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                            isGoing
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                        >
                          {isGoing ? '\u2713 Going' : "I'm Going!"}
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

                      {isGoing && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                          <p className="text-sm font-bold text-purple-800 mb-2">
                            Drag 5 friends {'\u2192'} unlock free shots {'\ud83c\udf89'}
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleShareForFriend(event.id)}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                            >
                              <Share2 className="h-3 w-3 inline mr-1" /> Share with a friend
                            </button>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className={`h-3 w-3 rounded-full ${
                                    i <= Math.min(eventShareCount, 5)
                                      ? 'bg-purple-500'
                                      : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-purple-600 font-semibold ml-1">
                                {Math.min(eventShareCount, 5)}/5 friends
                              </span>
                            </div>
                          </div>
                          {eventShareCount >= 5 && (
                            <p className="text-xs text-green-600 font-bold mt-2">{'\ud83c\udf89'} Free shots unlocked! Show this at the door.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{'\ud83d\ude22'}</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-500">Try selecting a different category or check back later!</p>
          </div>
        )}
      </section>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Your Own Rave {'\ud83c\udf89'}
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Event Name *</label>
                <input
                  type="text"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Rooftop Party at Eko Atlantic"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Lekki Phase 1, Victoria Island"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Vibe Category</label>
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                >
                  <option value="party">Party</option>
                  <option value="food">Food & Drinks</option>
                  <option value="music">Music</option>
                  <option value="nightlife">Nightlife</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="social">Social</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell people what to expect..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                />
              </div>
              <button
                onClick={handleCreateEvent}
                disabled={!newEvent.name || !newEvent.date || !newEvent.location}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Drop the Rave {'\ud83d\ude80'}
              </button>
            </div>
          </div>
        </div>
      )}

      <EnhancedFloatingChat />

      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 py-16 mt-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Lagos Never Sleeps {'\ud83c\udf03'}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            New vibes drop every day. Don&apos;t be the last to know.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
          >
            Create Your Own Rave
          </button>
        </div>
      </section>
    </div>
  )
}
