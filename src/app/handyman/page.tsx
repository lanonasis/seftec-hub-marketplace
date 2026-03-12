"use client"

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Search, Star, MapPin, Clock, Phone, Calendar, CheckCircle, Shield, TrendingUp, Zap, X, Plus, MessageCircle } from 'lucide-react'

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

export default function HandymanPage() {
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
    { id: 'plumber', name: 'Plumber', emoji: '\ud83d\udd27' },
    { id: 'electrician', name: 'Electrician', emoji: '\u26a1' },
    { id: 'cleaner', name: 'Cleaner', emoji: '\ud83e\uddf9' },
    { id: 'mechanic', name: 'Mechanic', emoji: '\ud83d\udd29' },
    { id: 'ac repair', name: 'AC Repair', emoji: '\u2744\ufe0f' },
    { id: 'carpenter', name: 'Carpenter', emoji: '\ud83e\ude9a' },
  ]

  const lagosAreas = [
    'Lekki', 'Victoria Island', 'Ikeja', 'Surulere', 'Ajah', 'Gbagada',
    'Yaba', 'Ikoyi', 'Maryland', 'Festac', 'Oshodi', 'Apapa'
  ]

  useEffect(() => {
    loadHandymen()
  }, [selectedCategory])

  const loadHandymen = async () => {
    setLoading(true)
    try {
      const service = selectedCategory || 'general'
      const response = await fetch(`/api/search/handymen?service=${service}`)
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
      setSelectedCategory(searchQuery.trim().toLowerCase())
    } else {
      setSelectedCategory(null)
    }
  }

  const handleFindGuyNow = () => {
    searchRef.current?.focus()
    if (!searchQuery.trim()) {
      setSelectedCategory(null)
      loadHandymen()
    }
  }

  const handleSeeRatings = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePostJob = () => {
    if (!newJob.jobType || !newJob.description || !newJob.area) return
    const job: PostedJob = {
      id: `job-${Date.now()}`,
      ...newJob,
      createdAt: new Date().toISOString()
    }
    const existing = getStoredJobs()
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify([job, ...existing]))
    setJobPosted(true)
    setTimeout(() => {
      setShowJobModal(false)
      setJobPosted(false)
      setNewJob({ jobType: '', description: '', area: '', budget: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Handyman Hub
            </h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AC Dead? Book in 30 Secs.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Done by Dinner. {'\ud83d\udd27'}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lagos heat no be joke. Get a verified pro to your door &mdash; no wahala, no stories.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
          <button
            onClick={handleFindGuyNow}
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
            onClick={handleSeeRatings}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:shadow-lg transition-all hover:scale-105"
          >
            <Star className="h-4 w-4 inline mr-1" /> See Ratings
          </button>
        </div>

        <form onSubmit={handleSearch} className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What you need? (e.g., 'fix my AC', 'plumber for Lekki')"
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

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-xl p-4 border border-blue-100 text-center">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-bold text-gray-900">{'\u20a6'}15k Flat &mdash; No Surprises</p>
            <p className="text-sm text-gray-600">Transparent pricing, always</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-100 text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-bold text-gray-900">Real Lagos Reviews</p>
            <p className="text-sm text-gray-600">From people in your area</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-100 text-center">
            <Zap className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="font-bold text-gray-900">Scammers? We Block &apos;Em.</p>
            <p className="text-sm text-gray-600">Only verified pros allowed</p>
          </div>
        </div>
      </section>

      <section ref={gridRef} className="max-w-7xl mx-auto px-4 pb-16">
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
                      <span>{handyman.distance}</span>
                    </div>
                  </div>
                </div>

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
                      <span>{'\ud83d\udcb0'}</span>
                      <span>Price Range</span>
                    </div>
                    <p className="text-sm font-semibold text-blue-600">{handyman.price_range}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Book Now
                  </button>
                  {handyman.phone ? (
                    <a
                      href={`https://wa.me/${handyman.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl border-2 border-green-500 text-green-600 text-sm font-semibold hover:bg-green-50 transition-all flex items-center gap-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">WhatsApp</span>
                    </a>
                  ) : (
                    <button className="py-2.5 px-4 rounded-xl border-2 border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-all">
                      <Phone className="h-4 w-4 inline" />
                    </button>
                  )}
                </div>

                {handyman.verified && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600">
                      {'\u2713'} <span className="font-medium text-green-700">Community Verified</span> by {handyman.reviews || 45} Lagos users
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {handymen.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{'\ud83d\udd0d'}</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No handymen found</h3>
            <p className="text-gray-500">Try searching for a different service or check back later!</p>
          </div>
        )}
      </section>

      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            {jobPosted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">{'\u2705'}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Job is Live!</h2>
                <p className="text-gray-600">Pros will reach out on WhatsApp. Sit tight {'\ud83d\udcaa'}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Post Your Job {'\ud83d\udcbc'}
                  </h2>
                  <button onClick={() => setShowJobModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Job Type *</label>
                    <select
                      value={newJob.jobType}
                      onChange={(e) => setNewJob(prev => ({ ...prev, jobType: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={newJob.description}
                      onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the job (e.g., 'AC not cooling, makes noise')"
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Area of Lagos *</label>
                    <select
                      value={newJob.area}
                      onChange={(e) => setNewJob(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    >
                      <option value="">Select your area</option>
                      {lagosAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Budget Estimate</label>
                    <input
                      type="text"
                      value={newJob.budget}
                      onChange={(e) => setNewJob(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="e.g., {'\u20a6'}10k - {'\u20a6'}20k"
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <button
                    onClick={handlePostJob}
                    disabled={!newJob.jobType || !newJob.description || !newJob.area}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post Job {'\ud83d\ude80'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <section className="bg-white border-t border-blue-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works in Lagos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Tell Us the Wahala</h3>
              <p className="text-gray-600">
                Search or describe what broke. Leo helps you find the right guy.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Pick Your Pro</h3>
              <p className="text-gray-600">
                Real ratings from Lagos people. No fake reviews, no drama.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Done by Dinner</h3>
              <p className="text-gray-600">
                WhatsApp the pro, agree on price, get it fixed. Simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      <EnhancedFloatingChat />
    </div>
  )
}
