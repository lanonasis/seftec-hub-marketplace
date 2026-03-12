"use client"

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import VibeFinderService from '@/lib/vibefind-service'
import { SocialEvent } from '@/lib/types'
import { Calendar, MapPin, Users, Heart, Star, Share2, Instagram, Music, Sparkles, TrendingUp, Filter, X, Plus, Flame, Moon, Sun, Zap, Crown } from 'lucide-react'
import UserButton from '@/components/UserButton'
import Link from 'next/link'
import { useTheme } from '@/lib/theme-context'

const EnhancedFloatingChat = dynamic(() => import('@/components/EnhancedFloatingChat'), { ssr: false })

type AttendeeStatus = 'going' | 'interested' | 'not_going'

const RSVP_STORAGE_KEY = 'seftec-rsvp-state'
const SHARE_COUNT_KEY = 'seftec-share-counts'
const CUSTOM_EVENTS_KEY = 'seftec-custom-events'
const INVITE_COUNT_KEY = 'seftec-invite-count'

const BOOSTED_EVENTS = new Set(['e1', 'e3'])

const FOMO_MESSAGES = [
  "🔥 Tunde just RSVPed to Quilox Rooftop — 287 going tonight",
  "👀 23 people joined Owambe on the Island in the last 30 mins",
  "🎟️ Yaba Underground almost full — only 86 tickets left",
  "💃 Your Lekki crew is linking at Escape Friday — you in?",
  "🥃 Invite 5 friends → unlock HYPEKING5 (free drink code)",
  "🏆 Quilox hit 287 RSVPs — biggest Lagos Saturday this month",
  "⚡ Amaka just shared Terrakulture with 4 friends — are you going?",
  "🎵 Afrobeats Night @ Escape dropping a surprise performance at midnight",
]

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const s = localStorage.getItem(key)
    return s ? JSON.parse(s) : fallback
  } catch { return fallback }
}

function setStored(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

function getCrowdBorder(total: number, dm: boolean) {
  if (total >= 200) return dm ? 'border-red-500/60 bg-red-900/20' : 'border-red-500 bg-red-50'
  if (total >= 100) return dm ? 'border-yellow-500/60 bg-yellow-900/20' : 'border-yellow-500 bg-yellow-50'
  return dm ? 'border-green-500/60 bg-green-900/20' : 'border-green-500 bg-green-50'
}

function getCrowdLabel(total: number): { text: string; color: string } {
  if (total >= 200) return { text: 'PACKED', color: 'bg-red-500' }
  if (total >= 100) return { text: 'BUSY', color: 'bg-yellow-500' }
  return { text: 'CHILL', color: 'bg-green-500' }
}

async function doShare(url: string, title: string): Promise<boolean> {
  if (navigator.share) {
    try { await navigator.share({ title, url }); return true } catch { return false }
  }
  try { await navigator.clipboard.writeText(url); return true } catch { return false }
}

function getPromoCode(count: number): { code: string; label: string } | null {
  if (count >= 10) return { code: 'VIP10', label: 'VIP skip-the-line 👑' }
  if (count >= 5) return { code: 'HYPEKING5', label: 'Free drink 🥃' }
  return null
}

export default function VibeFindPage() {
  const { dm, toggleDarkMode, isDarkMode, mounted } = useTheme()
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
  const [fomoMsgIndex, setFomoMsgIndex] = useState(0)
  const [inviteCount, setInviteCount] = useState(0)
  const [fomoToast, setFomoToast] = useState<string | null>(null)
  const [showInviteTracker, setShowInviteTracker] = useState(true)
  const gridRef = useRef<HTMLDivElement>(null)

  const [newEvent, setNewEvent] = useState({
    name: '', date: '', time: '', location: '', category: 'party', description: ''
  })

  useEffect(() => {
    loadEvents()
    setUserAttendance(getStored(RSVP_STORAGE_KEY, {}))
    setShareCounts(getStored(SHARE_COUNT_KEY, {}))
    setInviteCount(getStored(INVITE_COUNT_KEY, 0))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setFomoMsgIndex(i => (i + 1) % FOMO_MESSAGES.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedCategory) loadCategoryEvents()
    else setFilteredEvents(events)
  }, [selectedCategory, events])

  const loadCategoryEvents = async () => {
    if (!selectedCategory) return
    try {
      const filtered = await vibeFind.getEventsByCategory(selectedCategory)
      const custom = getStored<SocialEvent[]>(CUSTOM_EVENTS_KEY, []).filter(e => e.category === selectedCategory)
      setFilteredEvents([...custom, ...filtered])
    } catch {}
  }

  const loadEvents = async () => {
    setLoading(true)
    try {
      const all = await vibeFind.getEvents()
      const custom = getStored<SocialEvent[]>(CUSTOM_EVENTS_KEY, []).map((e: any) => ({
        ...e, date: new Date(e.date), created: new Date(e.created), updated: new Date(e.updated)
      }))
      const combined = [...custom, ...all]
      setEvents(combined)
      setFilteredEvents(combined)
    } catch {} finally { setLoading(false) }
  }

  const handleRSVP = (eventId: string, status: AttendeeStatus) => {
    const newAttendance = { ...userAttendance }
    if (userAttendance[eventId] === status) {
      newAttendance[eventId] = 'not_going'
    } else {
      newAttendance[eventId] = status
    }
    setUserAttendance(newAttendance)
    setStored(RSVP_STORAGE_KEY, newAttendance)

    if (status === 'going') {
      const event = filteredEvents.find(e => e.id === eventId)
      const count = event ? event.attendees.totalGoing : 0
      setFomoToast(`You're in! 🎉 ${count}+ others from Lagos are going tonight`)
      setTimeout(() => setFomoToast(null), 4000)

      if (!leoTriggered && !sessionStorage.getItem('seftec-leo-crosssell-fired')) {
        setLeoTriggered(true)
        sessionStorage.setItem('seftec-leo-crosssell-fired', 'true')
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('leo-inject-message', {
            detail: {
              text: "Post-party and lights go out? 😅 I got a handyman on speed dial 🔧",
              suggestions: ["Take me to Handyman Hub 🔧"]
            }
          }))
        }, 1500)
      }
    }
  }

  const handleShare = async (eventId: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const event = filteredEvents.find(e => e.id === eventId)
    const shared = await doShare(url, event?.title || 'Check out this vibe!')
    if (shared) {
      const newCounts = { ...shareCounts, [eventId]: (shareCounts[eventId] || 0) + 1 }
      setShareCounts(newCounts)
      setStored(SHARE_COUNT_KEY, newCounts)
      const newCount = inviteCount + 1
      setInviteCount(newCount)
      setStored(INVITE_COUNT_KEY, newCount)
    }
  }

  const handleInviteSquad = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const shared = await doShare(url, 'Check out VibeFind — Lagos events!')
    if (shared) {
      setCopiedId('squad')
      const newCount = inviteCount + 1
      setInviteCount(newCount)
      setStored(INVITE_COUNT_KEY, newCount)
      setTimeout(() => setCopiedId(null), 2000)
    }
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
    const existing = getStored<SocialEvent[]>(CUSTOM_EVENTS_KEY, [])
    setStored(CUSTOM_EVENTS_KEY, [customEvent, ...existing])
    setEvents(prev => [customEvent, ...prev])
    setFilteredEvents(prev => [customEvent, ...prev])
    setShowCreateModal(false)
    setNewEvent({ name: '', date: '', time: '', location: '', category: 'party', description: '' })
  }

  const categories = [
    { id: 'party', name: 'Parties', emoji: '🎉' },
    { id: 'food', name: 'Food & Drinks', emoji: '🍖' },
    { id: 'music', name: 'Music', emoji: '🎵' },
    { id: 'nightlife', name: 'Nightlife', emoji: '🌃' },
    { id: 'outdoor', name: 'Outdoor', emoji: '🏖️' },
    { id: 'social', name: 'Social', emoji: '🧖‍♀️' },
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

  const promoCode = getPromoCode(inviteCount)
  const inviteProgress = Math.min(inviteCount, 10)
  const nextMilestone = inviteCount < 5 ? 5 : 10

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      dm ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50'
    }`}>

      {/* FOMO Live Ticker */}
      <div className={`${dm ? 'bg-red-900/80 border-red-700' : 'bg-gradient-to-r from-red-500 to-pink-500'} border-b overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
          <span className="text-white text-xs font-bold uppercase tracking-widest shrink-0 flex items-center gap-1">
            <Zap className="h-3 w-3" /> Live
          </span>
          <div className="relative overflow-hidden flex-1 h-5">
            {FOMO_MESSAGES.map((msg, i) => (
              <p
                key={i}
                className={`absolute inset-0 text-white text-sm font-medium transition-all duration-500 ${
                  i === fomoMsgIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {msg}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* FOMO Toast */}
      {fomoToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-bounce">
          {fomoToast}
        </div>
      )}

      <header className={`sticky top-0 z-40 backdrop-blur-lg border-b transition-colors duration-300 ${
        dm ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-purple-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <h1 className={`text-xl font-bold ${
                  dm ? 'bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'
                }`}>SEFTEC Hub</h1>
              </Link>
              <span className={dm ? 'text-gray-600' : 'text-gray-300'}>|</span>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h2 className={`text-xl font-bold ${
                  dm ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
                }`}>VibeFind</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className={`text-sm transition-colors hidden sm:block ${dm ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>Home</Link>
              <Link href="/handyman" className={`text-sm transition-colors hidden sm:block ${dm ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>Handyman</Link>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  dm ? 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/50' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                <Filter className="h-4 w-4" /> Filters
              </button>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors ${
                  dm ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {mounted && isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <UserButton isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </header>

      {showFilters && (
        <div className={`sticky top-[73px] z-30 backdrop-blur-lg border-b shadow-sm transition-colors duration-300 ${
          dm ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-purple-100'
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-semibold ${dm ? 'text-gray-300' : 'text-gray-700'}`}>Filter by Category</h3>
              <button onClick={() => setShowFilters(false)} className={dm ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : dm ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >All Events</button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : dm ? 'bg-gray-800 border border-gray-600 text-gray-300 hover:border-purple-500' : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300'
                  }`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Lagos, Where You Dey Tonight? 🔥
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-8 ${dm ? 'text-gray-300' : 'text-gray-600'}`}>
            No dull moment. Find the hottest parties, food crawls, and owambe in Lagos. Your squad is waiting. 🎉
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              🔥 See what&apos;s hot now
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
              <Share2 className="h-4 w-4 inline mr-1" />
              {copiedId === 'squad' ? 'Link copied!' : 'Invite squad'}
            </button>
          </div>
          <div className={`flex items-center justify-center gap-6 mt-6 text-sm ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{events.reduce((s, e) => s + e.attendees.totalGoing, 0)}+ going</span>
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

        {/* Invite Tracker */}
        {showInviteTracker && (
          <div className={`relative rounded-2xl p-4 mb-8 border transition-colors duration-300 ${
            dm
              ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-700/50'
              : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
          }`}>
            <button
              onClick={() => setShowInviteTracker(false)}
              className={`absolute top-3 right-3 ${dm ? 'text-gray-500' : 'text-gray-400'}`}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-4">
              <div className="text-2xl">🥃</div>
              <div className="flex-1">
                <p className={`font-bold text-sm mb-1 ${dm ? 'text-white' : 'text-gray-900'}`}>
                  Invite crew → unlock free perks
                </p>
                <p className={`text-xs mb-2 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
                  {inviteCount < 5
                    ? `Invite ${5 - inviteCount} more friend${5 - inviteCount !== 1 ? 's' : ''} to unlock HYPEKING5 (free drink 🥃)`
                    : inviteCount < 10
                      ? `Invite ${10 - inviteCount} more to unlock VIP10 (skip-the-line 👑)`
                      : 'You unlocked all perks! You are the plug 🏆'
                  }
                </p>
                <div className={`h-2 rounded-full overflow-hidden ${dm ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((inviteProgress / nextMilestone) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{inviteCount} invited</span>
                  {promoCode && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      dm ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-700'
                    }`}>
                      Code: {promoCode.code} — {promoCode.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Heat Map strip */}
        {!loading && events.length > 0 && (
          <div className="mb-10">
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${dm ? 'text-white' : 'text-gray-800'}`}>
              <Flame className="h-5 w-5 text-red-500" /> Where Lagos Is Right Now
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-4">
              {[...events]
                .sort((a, b) => b.attendees.totalGoing - a.attendees.totalGoing)
                .map((event) => {
                  const crowd = getCrowdLabel(event.attendees.totalGoing)
                  const isHot = event.attendees.totalGoing >= 200
                  const isBoosted = BOOSTED_EVENTS.has(event.id)
                  return (
                    <div
                      key={`heat-${event.id}`}
                      className={`flex-shrink-0 w-52 rounded-2xl border-2 p-4 cursor-pointer hover:shadow-lg transition-all ${getCrowdBorder(event.attendees.totalGoing, dm)}`}
                      onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1">
                          <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${crowd.color}`}>
                            {crowd.text}
                          </span>
                          {isBoosted && (
                            <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full bg-amber-500">
                              💎
                            </span>
                          )}
                        </div>
                        {isHot && <Flame className="h-4 w-4 text-red-500 animate-pulse" />}
                      </div>
                      <h4 className={`font-bold text-sm truncate ${dm ? 'text-gray-100' : 'text-gray-800'}`}>{event.title}</h4>
                      <p className={`text-xs truncate ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{event.location.name}</p>
                      <p className={`text-xs font-semibold mt-1 ${dm ? 'text-gray-300' : 'text-gray-700'}`}>{event.attendees.totalGoing} going</p>
                    </div>
                  )
                })}
            </div>
            <div className={`flex items-center gap-4 mt-1 text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-500 inline-block" /> 200+ (Packed 🔥)</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-yellow-500 inline-block" /> 100–199 (Busy)</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-500 inline-block" /> Under 100 (Chill)</span>
              <span className="flex items-center gap-1"><span className="text-amber-500">💎</span> Venue Boost</span>
            </div>
          </div>
        )}

        {/* Event Grid */}
        <div ref={gridRef}>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${dm ? 'border-purple-400' : 'border-purple-600'}`} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const isGoing = userAttendance[event.id] === 'going'
                const isInterested = userAttendance[event.id] === 'interested'
                const isHot = event.attendees.totalGoing >= 200
                const isBoosted = BOOSTED_EVENTS.has(event.id)
                const crowd = getCrowdLabel(event.attendees.totalGoing)

                return (
                  <div
                    key={event.id}
                    className={`group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border ${
                      dm
                        ? 'bg-gray-800 border-gray-700 hover:border-purple-500'
                        : 'bg-white border-purple-100 hover:border-purple-300'
                    }`}
                  >
                    <div className="relative overflow-hidden h-52">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Top-right: category */}
                      <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-white text-xs font-bold backdrop-blur-sm bg-gradient-to-r ${getCategoryColor(event.category)}`}>
                        {event.category.toUpperCase()}
                      </div>
                      {/* Top-left: HOT + BOOSTED */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {isHot && (
                          <div className="px-2.5 py-1 rounded-full bg-red-500/90 text-white text-xs font-bold backdrop-blur-sm flex items-center gap-1 animate-pulse">
                            <Flame className="h-3 w-3" /> HOT
                          </div>
                        )}
                        {isBoosted && (
                          <div className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                            <Crown className="h-3 w-3" /> BOOSTED
                          </div>
                        )}
                        {!event.isPublic && (
                          <div className="px-2.5 py-1 rounded-full bg-gray-900/80 text-white text-xs font-bold backdrop-blur-sm">
                            🔒 Exclusive
                          </div>
                        )}
                      </div>
                      {/* Crowd badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-full ${crowd.color}`}>
                          {crowd.text} · {event.attendees.totalGoing} going
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-lg font-bold flex-1 leading-snug ${dm ? 'text-white' : 'text-gray-800'}`}>{event.title}</h3>
                        <div className="flex items-center gap-1 ml-2 shrink-0">
                          <Star className={`h-4 w-4 ${getVibeScoreColor(event.vibeScore)} fill-current`} />
                          <span className={`text-base font-bold ${getVibeScoreColor(event.vibeScore)}`}>{event.vibeScore}</span>
                        </div>
                      </div>
                      <p className={`text-sm mb-4 line-clamp-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>{event.description}</p>

                      <div className="space-y-1.5 mb-4">
                        <div className={`flex items-center gap-2 text-sm ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Calendar className="h-4 w-4 text-purple-500 shrink-0" />
                          <span>{new Date(event.date).toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })} · {event.time}</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                          <MapPin className="h-4 w-4 text-purple-500 shrink-0" />
                          <span className="truncate">{event.location.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-purple-500 font-bold text-base">
                            {event.price.type === 'free' ? '🆓 FREE' : event.price.amount}
                          </span>
                          {event.dressCode && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${dm ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                              👔 {event.dressCode}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {event.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className={`px-2 py-0.5 rounded-full text-xs ${
                            dm ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-50 text-purple-600'
                          }`}>#{tag}</span>
                        ))}
                      </div>

                      {event.socialLinks && (event.socialLinks.instagram || event.socialLinks.tiktok) && (
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700/30">
                          {event.socialLinks.instagram && (
                            <a href={`https://instagram.com/${event.socialLinks.instagram.replace('@', '')}`}
                              target="_blank" rel="noopener noreferrer"
                              className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:shadow-lg transition-all">
                              <Instagram className="h-3.5 w-3.5" />
                            </a>
                          )}
                          {event.socialLinks.tiktok && (
                            <a href={`https://tiktok.com/${event.socialLinks.tiktok.replace('@', '')}`}
                              target="_blank" rel="noopener noreferrer"
                              className={`p-1.5 rounded-lg text-white hover:shadow-lg transition-all ${dm ? 'bg-gray-700' : 'bg-black'}`}>
                              <Music className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleShare(event.id)}
                            className={`ml-auto p-1.5 rounded-lg transition-all ${dm ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRSVP(event.id, 'going')}
                          className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-bold transition-all ${
                            isGoing
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                              : dm
                                ? 'bg-gray-700 text-gray-300 hover:bg-green-900/50 hover:text-green-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
                          }`}
                        >
                          {isGoing ? '✅ Going' : '🙋 I\'m Going'}
                        </button>
                        <button
                          onClick={() => handleRSVP(event.id, 'interested')}
                          className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all ${
                            isInterested
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                              : dm
                                ? 'bg-gray-700 text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                          }`}
                        >
                          <Heart className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => handleShare(event.id)}
                          className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all ${
                            dm
                              ? 'bg-gray-700 text-gray-300 hover:bg-blue-900/50 hover:text-blue-300'
                              : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                        >
                          <Share2 className="h-4 w-4 inline" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`rounded-3xl p-8 max-w-lg w-full shadow-2xl ${dm ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent`}>
                Create Your Rave 🎉
              </h2>
              <button onClick={() => setShowCreateModal(false)} className={`p-2 rounded-full ${dm ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <X className={`h-5 w-5 ${dm ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Event Name *', key: 'name', placeholder: 'e.g., Lekki Beach Owambe', type: 'text' },
                { label: 'Date *', key: 'date', placeholder: '', type: 'date' },
                { label: 'Time', key: 'time', placeholder: 'e.g., 8:00 PM - 2:00 AM', type: 'text' },
                { label: 'Location *', key: 'location', placeholder: 'e.g., Quilox, Victoria Island', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className={`block text-sm font-semibold mb-1 ${dm ? 'text-gray-300' : 'text-gray-700'}`}>{field.label}</label>
                  <input
                    type={field.type}
                    value={newEvent[field.key as keyof typeof newEvent]}
                    onChange={e => setNewEvent(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-colors ${
                      dm
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500'
                        : 'border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                    }`}
                  />
                </div>
              ))}
              <div>
                <label className={`block text-sm font-semibold mb-1 ${dm ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                <select
                  value={newEvent.category}
                  onChange={e => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none ${
                    dm ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'border-purple-200 focus:border-purple-500'
                  }`}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-1 ${dm ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What's the vibe? Who should come?"
                  rows={3}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none resize-none ${
                    dm ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500' : 'border-purple-200 focus:border-purple-500'
                  }`}
                />
              </div>
              <button
                onClick={handleCreateEvent}
                disabled={!newEvent.name || !newEvent.date || !newEvent.location}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Drop It Live 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      <EnhancedFloatingChat />
    </div>
  )
}
