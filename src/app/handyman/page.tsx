"use client"

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Search, Star, MapPin, Clock, Phone, Calendar, CheckCircle, Shield, TrendingUp, Zap, X, Plus, MessageCircle, Moon, Sun, Flame } from 'lucide-react'
import UserButton from '@/components/UserButton'
import { useTheme } from '@/lib/theme-context'

const EnhancedFloatingChat = dynamic(() => import('@/components/EnhancedFloatingChat'), { ssr: false })

const JOBS_STORAGE_KEY = 'seftec-posted-jobs'

interface PostedJob {
  id: string
  jobType: string
  description: string
  area: string
  budget: string
  createdAt: string
}

function getStoredJobs(): PostedJob[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(JOBS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

const SURGE_SERVICES = new Set(['ac repair', 'electrician'])

export default function HandymanPage() {
  const { dm, toggleDarkMode, isDarkMode, mounted } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [handymen, setHandymen] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showJobModal, setShowJobModal] = useState(false)
  const [jobPosted, setJobPosted] = useState(false)
  const [newJob, setNewJob] = useState({ jobType: '', description: '', area: '', budget: '' })
  const searchRef = useRef<HTMLInputElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const categories = [
    { id: 'plumber', name: 'Plumber', emoji: '🔧' },
    { id: 'electrician', name: 'Electrician', emoji: '⚡' },
    { id: 'cleaner', name: 'Cleaner', emoji: '🧹' },
    { id: 'mechanic', name: 'Mechanic', emoji: '🔩' },
    { id: 'ac repair', name: 'AC Repair', emoji: '❄️' },
    { id: 'carpenter', name: 'Carpenter', emoji: '🪚' },
  ]

  const lagosAreas = [
    'Lekki', 'Victoria Island', 'Ikeja', 'Surulere', 'Ajah', 'Gbagada',
    'Yaba', 'Ikoyi', 'Maryland', 'Festac', 'Oshodi', 'Apapa'
  ]

  useEffect(() => { loadHandymen() }, [selectedCategory])

  const loadHandymen = async () => {
    setLoading(true)
    try {
      const service = selectedCategory || 'general'
      const res = await fetch(`/api/search/handymen?service=${service}`)
      const data = await res.json()
      setHandymen(data.handymen || [])
    } catch {} finally { setLoading(false) }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSelectedCategory(searchQuery.trim().toLowerCase() || null)
  }

  const handlePostJob = () => {
    if (!newJob.jobType || !newJob.description || !newJob.area) return
    const job: PostedJob = { id: `job-${Date.now()}`, ...newJob, createdAt: new Date().toISOString() }
    const existing = getStoredJobs()
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify([job, ...existing]))
    setJobPosted(true)
    setTimeout(() => {
      setShowJobModal(false)
      setJobPosted(false)
      setNewJob({ jobType: '', description: '', area: '', budget: '' })
    }, 3000)
  }

  const isSurge = selectedCategory && SURGE_SERVICES.has(selectedCategory)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dm ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>

      <header className={`sticky top-0 z-40 backdrop-blur-lg border-b transition-colors duration-300 ${dm ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-blue-100'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className={`flex items-center gap-3 transition-colors ${dm ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}>
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium hidden sm:inline">Back to Home</span>
            </Link>
            <h1 className={`text-xl font-bold ${
              dm ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
            }`}>
              Handyman Hub 🔧
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors ${dm ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {mounted && isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <UserButton isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${dm ? 'text-white' : 'text-gray-900'}`}>
            AC Dead? Book in 30 Secs.
            <br />
            <span className={`${dm ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
              Done by Dinner. 🔧
            </span>
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${dm ? 'text-gray-300' : 'text-gray-600'}`}>
            Lagos heat no be joke. Get a verified pro to your door — no wahala, no stories.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
          <button
            onClick={() => { searchRef.current?.focus(); setSelectedCategory(null); loadHandymen() }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:shadow-lg transition-all hover:scale-105"
          >
            <Search className="h-4 w-4 inline mr-2" /> Find a Guy Now
          </button>
          <button
            onClick={() => setShowJobModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-bold hover:shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4 inline mr-1" /> Post Your Job
          </button>
          <button
            onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:shadow-lg transition-all hover:scale-105"
          >
            <Star className="h-4 w-4 inline mr-1" /> See Ratings
          </button>
        </div>

        <form onSubmit={handleSearch} className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="What you need? (e.g., 'fix my AC', 'plumber for Lekki')"
            className={`w-full pl-12 pr-28 py-4 rounded-2xl border-2 outline-none text-lg transition-colors ${
              dm
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500'
                : 'border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
            }`}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Search
          </button>
        </form>

        {isSurge && (
          <div className={`flex items-center gap-3 rounded-xl p-3 mb-4 border ${
            dm ? 'bg-orange-900/30 border-orange-700/50 text-orange-300' : 'bg-orange-50 border-orange-200 text-orange-700'
          }`}>
            <Flame className="h-5 w-5 text-orange-500 animate-pulse shrink-0" />
            <p className="text-sm font-semibold">
              High demand for {selectedCategory?.toUpperCase()} right now in Lagos — book fast, pros fill up quick!
            </p>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : dm ? 'bg-gray-800 border border-gray-600 text-gray-300 hover:border-blue-500' : 'bg-white border border-blue-200 text-gray-700 hover:border-blue-400'
            }`}
          >All Services</button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : dm ? 'bg-gray-800 border border-gray-600 text-gray-300 hover:border-blue-500' : 'bg-white border border-blue-200 text-gray-700 hover:border-blue-400'
              }`}
            >
              {cat.emoji} {cat.name}
              {SURGE_SERVICES.has(cat.id) && <Flame className="h-3 w-3 inline ml-1 text-orange-500" />}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className={`rounded-xl p-4 border text-center transition-colors ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}`}>
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className={`font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>₦15k Flat — No Surprises</p>
            <p className={`text-sm ${dm ? 'text-gray-400' : 'text-gray-600'}`}>Transparent pricing, always</p>
          </div>
          <div className={`rounded-xl p-4 border text-center transition-colors ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}`}>
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className={`font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>Real Lagos Reviews</p>
            <p className={`text-sm ${dm ? 'text-gray-400' : 'text-gray-600'}`}>From people in your area</p>
          </div>
          <div className={`rounded-xl p-4 border text-center transition-colors ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}`}>
            <Zap className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className={`font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>Scammers? We Block &apos;Em.</p>
            <p className={`text-sm ${dm ? 'text-gray-400' : 'text-gray-600'}`}>Only verified pros allowed</p>
          </div>
        </div>
      </section>

      <section ref={gridRef} className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${dm ? 'border-blue-400' : 'border-blue-600'}`} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {handymen.map((h) => (
              <div
                key={h.id}
                className={`group rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border ${
                  dm ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-blue-100 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={h.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                      alt={h.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100"
                    />
                    {h.verified && (
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${dm ? 'text-white' : 'text-gray-900'}`}>{h.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className={`text-sm font-semibold ${dm ? 'text-gray-200' : 'text-gray-700'}`}>{h.rating}</span>
                      <span className={`text-xs ${dm ? 'text-gray-500' : 'text-gray-500'}`}>({h.reviews || 45} reviews)</span>
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin className="h-3 w-3" />
                      <span>{h.distance}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className={`text-xs mb-2 font-medium ${dm ? 'text-gray-500' : 'text-gray-500'}`}>SERVICES</p>
                  <div className="flex flex-wrap gap-1">
                    {h.services.map((service: string, i: number) => (
                      <span key={i} className={`px-2 py-1 rounded-full text-xs border ${
                        dm ? 'bg-blue-900/30 text-blue-300 border-blue-700/50' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>{service}</span>
                    ))}
                  </div>
                </div>

                <div className={`grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl ${dm ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div>
                    <div className={`flex items-center gap-1 text-xs mb-1 ${dm ? 'text-gray-500' : 'text-gray-500'}`}>
                      <Clock className="h-3 w-3" /> Availability
                    </div>
                    <p className={`text-sm font-semibold ${dm ? 'text-gray-200' : 'text-gray-900'}`}>{h.availability}</p>
                  </div>
                  <div>
                    <div className={`flex items-center gap-1 text-xs mb-1 ${dm ? 'text-gray-500' : 'text-gray-500'}`}>
                      <span>💰</span> Price Range
                    </div>
                    <p className={`text-sm font-semibold ${dm ? 'text-blue-400' : 'text-blue-600'}`}>{h.price_range}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                    <Calendar className="h-4 w-4 inline mr-1" /> Book Now
                  </button>
                  {h.phone ? (
                    <a
                      href={`https://wa.me/${h.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`py-2.5 px-3 rounded-xl border-2 border-green-500 text-green-600 text-sm font-semibold hover:bg-green-50 transition-all flex items-center gap-1 ${dm ? 'hover:bg-green-900/20' : ''}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">WhatsApp</span>
                    </a>
                  ) : (
                    <button className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                      dm ? 'border-blue-700 text-blue-400 hover:bg-blue-900/30' : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                    }`}>
                      <Phone className="h-4 w-4 inline" />
                    </button>
                  )}
                </div>

                {h.verified && (
                  <div className={`mt-3 pt-3 border-t ${dm ? 'border-gray-700' : 'border-gray-100'}`}>
                    <p className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                      ✓ <span className="font-medium text-green-500">Community Verified</span> by {h.reviews || 45} Lagos users
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
            <h3 className={`text-2xl font-bold mb-2 ${dm ? 'text-gray-300' : 'text-gray-700'}`}>No handymen found</h3>
            <p className={dm ? 'text-gray-500' : 'text-gray-500'}>Try a different service or check back soon!</p>
          </div>
        )}
      </section>

      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`rounded-3xl p-8 max-w-lg w-full shadow-2xl ${dm ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            {jobPosted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h2 className={`text-2xl font-bold mb-2 ${dm ? 'text-white' : 'text-gray-900'}`}>Your Job is Live!</h2>
                <p className={dm ? 'text-gray-400' : 'text-gray-600'}>Pros will reach out on WhatsApp. Sit tight 💪</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Post Your Job 💼
                  </h2>
                  <button onClick={() => setShowJobModal(false)} className={`p-2 rounded-full ${dm ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <X className={`h-5 w-5 ${dm ? 'text-gray-400' : ''}`} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold mb-1 ${dm ? 'text-gray-300' : 'text-gray-700'}`}>Job Type *</label>
                    <select
                      value={newJob.jobType}
                      onChange={e => setNewJob(p => ({ ...p, jobType: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl outline-none ${dm ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' : 'border-blue-200 focus:border-blue-500'}`}
                    >
                      <option value="">Select job type</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical / AC</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="painting">Painting</option>
                      <option value="carpentry">Carpentry</option>
                      <option value="mechanic">Mechanic</option>
                      <option value="general">General Repairs</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-1 ${dm ? 'text-gray-300' : 'text-gray-700'}`}>Description *</label>
                    <textarea
                      value={newJob.description}
                      onChange={e => setNewJob(p => ({ ...p, description: e.target.value }))}
                      placeholder="Describe the job (e.g., 'AC not cooling, makes noise')"
                      rows={3}
                      className={`w-full px-4 py-3 border-2 rounded-xl outline-none resize-none ${dm ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500' : 'border-blue-200 focus:border-blue-500'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-1 ${dm ? 'text-gray-300' : 'text-gray-700'}`}>Area of Lagos *</label>
                    <select
                      value={newJob.area}
                      onChange={e => setNewJob(p => ({ ...p, area: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl outline-none ${dm ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' : 'border-blue-200 focus:border-blue-500'}`}
                    >
                      <option value="">Select your area</option>
                      {lagosAreas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-1 ${dm ? 'text-gray-300' : 'text-gray-700'}`}>Budget Estimate</label>
                    <input
                      type="text"
                      value={newJob.budget}
                      onChange={e => setNewJob(p => ({ ...p, budget: e.target.value }))}
                      placeholder="e.g., ₦10k – ₦20k"
                      className={`w-full px-4 py-3 border-2 rounded-xl outline-none ${dm ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500' : 'border-blue-200 focus:border-blue-500'}`}
                    />
                  </div>
                  <button
                    onClick={handlePostJob}
                    disabled={!newJob.jobType || !newJob.description || !newJob.area}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post Job 🚀
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <section className={`border-t py-16 transition-colors ${dm ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-blue-100'}`}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${dm ? 'text-white' : 'text-gray-900'}`}>
            How It Works in Lagos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${dm ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                <span className={`text-2xl font-bold ${dm ? 'text-blue-400' : 'text-blue-600'}`}>1</span>
              </div>
              <h3 className={`font-bold text-lg mb-2 ${dm ? 'text-white' : 'text-gray-900'}`}>Tell Us the Wahala</h3>
              <p className={dm ? 'text-gray-400' : 'text-gray-600'}>Search or describe what broke. Leo helps you find the right guy.</p>
            </div>
            <div className="text-center">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${dm ? 'bg-purple-900/40' : 'bg-purple-100'}`}>
                <span className={`text-2xl font-bold ${dm ? 'text-purple-400' : 'text-purple-600'}`}>2</span>
              </div>
              <h3 className={`font-bold text-lg mb-2 ${dm ? 'text-white' : 'text-gray-900'}`}>Pick Your Pro</h3>
              <p className={dm ? 'text-gray-400' : 'text-gray-600'}>Real ratings from Lagos people. No fake reviews, no drama.</p>
            </div>
            <div className="text-center">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${dm ? 'bg-green-900/40' : 'bg-green-100'}`}>
                <span className={`text-2xl font-bold ${dm ? 'text-green-400' : 'text-green-600'}`}>3</span>
              </div>
              <h3 className={`font-bold text-lg mb-2 ${dm ? 'text-white' : 'text-gray-900'}`}>Done by Dinner</h3>
              <p className={dm ? 'text-gray-400' : 'text-gray-600'}>WhatsApp the pro, agree on price, get it fixed. Simple.</p>
            </div>
          </div>
        </div>
      </section>

      <EnhancedFloatingChat />
    </div>
  )
}
