// Event and Social Discovery Types for SEFTEC Hub

export interface SocialEvent {
  id: string
  title: string
  description: string
  image: string
  category: 'party' | 'nightlife' | 'music' | 'social' | 'outdoor' | 'food' | 'culture'
  date: Date
  time: string
  location: {
    name: string
    address: string
    distance: string
    coordinates?: { lat: number; lng: number }
  }
  host: {
    id: string
    name: string
    avatar: string
    isVerified: boolean
    followers?: number
  }
  attendees: {
    going: EventAttendee[]
    interested: EventAttendee[]
    totalGoing: number
    totalInterested: number
  }
  price: {
    type: 'free' | 'paid' | 'donation'
    amount?: string
    currency?: string
  }
  tags: string[]
  vibeScore: number // 1-10 rating for how fun/exciting the event is
  socialLinks: {
    instagram?: string
    tiktok?: string
    snapchat?: string
    discord?: string
  }
  isPublic: boolean
  maxAttendees?: number
  minAge?: number
  dressCode?: string
  whatToExpect: string[]
  created: Date
  updated: Date
}

export interface EventAttendee {
  id: string
  name: string
  avatar: string
  username: string
  isVerified: boolean
  mutualFriends?: number
  socialHandle?: string
  joinedAt: Date
  status: 'going' | 'interested' | 'maybe'
}

export interface VibeProfile {
  id: string
  name: string
  username: string
  avatar: string
  bio: string
  age?: number
  location: string
  vibePreferences: string[]
  socialLinks: {
    instagram?: string
    tiktok?: string
    snapchat?: string
  }
  stats: {
    eventsAttended: number
    eventsHosted: number
    followers: number
    following: number
  }
  badges: string[]
  isVerified: boolean
  lastActive: Date
}

export interface EventFilter {
  category?: string[]
  date?: 'today' | 'tomorrow' | 'weekend' | 'next_week'
  priceRange?: 'free' | 'under_20' | 'under_50' | 'any'
  distance?: number // in miles
  vibeScore?: number // minimum vibe score
  tags?: string[]
  hasSpace?: boolean // only events with available spots
}

export interface SocialConnection {
  id: string
  type: 'follow' | 'friend' | 'mutual'
  user: VibeProfile
  connectedAt: Date
  mutualConnections: number
}

// Event Creation Types
export interface CreateEventData {
  title: string
  description: string
  category: SocialEvent['category']
  date: Date
  time: string
  location: {
    name: string
    address: string
  }
  price: SocialEvent['price']
  tags: string[]
  isPublic: boolean
  maxAttendees?: number
  minAge?: number
  dressCode?: string
  whatToExpected: string[]
  socialLinks?: SocialEvent['socialLinks']
}

// Chat Integration Types
export interface EventChatMessage {
  id: string
  eventId: string
  sender: EventAttendee
  message: string
  timestamp: Date
  type: 'text' | 'image' | 'link' | 'system'
  reactions?: {
    emoji: string
    users: string[]
  }[]
}

export interface EventUpdate {
  id: string
  eventId: string
  type: 'new_attendee' | 'location_change' | 'time_change' | 'cancelled' | 'reminder'
  message: string
  timestamp: Date
  data?: any
}
