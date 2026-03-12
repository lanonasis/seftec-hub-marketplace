// VibeFind Service - Social Event Discovery for SEFTEC Hub — Lagos Edition
import { SocialEvent, EventAttendee, EventFilter } from './types'

class VibeFinderService {
  private mockAttendees: EventAttendee[] = [
    {
      id: 'u1',
      name: 'Tunde Bakare',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      username: '@tundeb_lagos',
      isVerified: true,
      mutualFriends: 8,
      socialHandle: '@tundeb_lagos',
      joinedAt: new Date(),
      status: 'going'
    },
    {
      id: 'u2',
      name: 'Amaka Osei',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150&h=150&fit=crop&crop=face',
      username: '@amaka_o',
      isVerified: true,
      mutualFriends: 5,
      socialHandle: '@amaka_o',
      joinedAt: new Date(),
      status: 'going'
    },
    {
      id: 'u3',
      name: 'Dami Adeyemi',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      username: '@dami_lagos',
      isVerified: false,
      mutualFriends: 3,
      socialHandle: '@dami_lagos',
      joinedAt: new Date(),
      status: 'interested'
    },
    {
      id: 'u4',
      name: 'Emeka Okafor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      username: '@emeka.ok',
      isVerified: false,
      mutualFriends: 2,
      socialHandle: '@emeka.ok',
      joinedAt: new Date(),
      status: 'going'
    }
  ]

  private mockEvents: SocialEvent[] = [
    {
      id: 'e1',
      title: 'Quilox Rooftop Saturday 🌅',
      description: 'The plug for VI Saturday nights. Unlimited cocktails from 8–10pm, resident DJ Spinall on the decks, and the best skyline view in Lagos. You know the vibe — don\'t miss it.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop',
      category: 'party',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: '8:00 PM - 2:00 AM',
      location: {
        name: 'Quilox Club, Victoria Island',
        address: '3 Ozumba Mbadiwe Ave, Victoria Island',
        distance: 'VI'
      },
      host: {
        id: 'h1',
        name: 'Quilox Lagos',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
        isVerified: true,
        followers: 52000
      },
      attendees: {
        going: this.mockAttendees.filter(a => a.status === 'going'),
        interested: this.mockAttendees.filter(a => a.status === 'interested'),
        totalGoing: 287,
        totalInterested: 94
      },
      price: {
        type: 'paid',
        amount: '₦15,000',
        currency: 'NGN'
      },
      tags: ['Rooftop', 'DJ Spinall', 'Cocktails', 'Victoria Island', 'Premium'],
      vibeScore: 9.6,
      socialLinks: {
        instagram: '@quiloxlagos',
        tiktok: '@quilox_vi'
      },
      isPublic: true,
      maxAttendees: 400,
      minAge: 21,
      dressCode: 'Smart Casual / No Slippers',
      whatToExpect: [
        'Unlimited cocktails 8–10pm',
        'DJ Spinall live set',
        'Rooftop views of Lagos',
        'Celebrity sightings',
        'Photo booth',
        'Signature Quilox cocktails'
      ],
      created: new Date(),
      updated: new Date()
    },
    {
      id: 'e2',
      title: 'Afrobeats Night @ Escape 🎵',
      description: 'Escape Nightclub brings Lagos the hottest Afrobeats/Amapiano Friday. Rema, Asake, Burna vibes all night. Lekki, this one is for you — come correct.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
      category: 'music',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      time: '10:00 PM - 4:00 AM',
      location: {
        name: 'Escape Nightclub, Lekki',
        address: '3 Isaac John St, Lekki Phase 1',
        distance: 'Lekki'
      },
      host: {
        id: 'h2',
        name: 'Escape Lagos',
        avatar: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=150&h=150&fit=crop',
        isVerified: true,
        followers: 38000
      },
      attendees: {
        going: this.mockAttendees.slice(0, 3),
        interested: this.mockAttendees.slice(3),
        totalGoing: 196,
        totalInterested: 78
      },
      price: {
        type: 'paid',
        amount: '₦8,500',
        currency: 'NGN'
      },
      tags: ['Afrobeats', 'Amapiano', 'Lekki', 'Live DJ', 'Dance Floor'],
      vibeScore: 9.1,
      socialLinks: {
        instagram: '@escape_lagos',
        tiktok: '@escape_lagos_'
      },
      isPublic: true,
      maxAttendees: 350,
      minAge: 18,
      dressCode: 'Casual Fly',
      whatToExpect: [
        'Top Afrobeats DJs',
        'Massive dance floor',
        'VIP tables available',
        'Bar menu with Lagos specials',
        'Packed crowd energy',
        'Midnight surprise performance'
      ],
      created: new Date(),
      updated: new Date()
    },
    {
      id: 'e3',
      title: 'Owambe on the Island 👑',
      description: 'Big boy owambe energy. Jollof rice flowing, live band, fully lit. Dress your best — Lagos finest will be in the building. This is not a small thing.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
      category: 'social',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: '4:00 PM - 11:00 PM',
      location: {
        name: 'Eko Hotel Grounds, Victoria Island',
        address: 'Plot 1415 Adetokunbo Ademola St, V.I.',
        distance: 'VI'
      },
      host: {
        id: 'h3',
        name: 'Lagos Social Club',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        isVerified: true,
        followers: 21000
      },
      attendees: {
        going: this.mockAttendees,
        interested: this.mockAttendees.slice(0, 2),
        totalGoing: 342,
        totalInterested: 120
      },
      price: {
        type: 'paid',
        amount: '₦12,000',
        currency: 'NGN'
      },
      tags: ['Owambe', 'Live Band', 'Jollof', 'Island', 'Networking', 'Lagos Finest'],
      vibeScore: 9.3,
      socialLinks: {
        instagram: '@lagossocialclub',
      },
      isPublic: true,
      maxAttendees: 500,
      minAge: 20,
      dressCode: 'Aso-oke / Smart Traditional / Cocktail',
      whatToExpect: [
        'Full owambe buffet',
        'Live highlife band',
        'Fuji DJ set',
        'Open bar 4–6pm',
        'Dance floor',
        'Lagos big man energy'
      ],
      created: new Date(),
      updated: new Date()
    },
    {
      id: 'e4',
      title: 'Suya & Pepper Soup Crawl 🍖',
      description: 'We dey find the best suya in Lagos. Starting at Tantalizers Surulere, ending at that spot on Ikorodu Road everyone pretends not to know. Come hungry. No cap.',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop',
      category: 'food',
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      time: '7:00 PM - 11:00 PM',
      location: {
        name: 'Starting: Tantalizers Surulere',
        address: 'Bode Thomas St, Surulere',
        distance: 'Surulere'
      },
      host: {
        id: 'h4',
        name: 'Lagos Foodies',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
        isVerified: true,
        followers: 14500
      },
      attendees: {
        going: this.mockAttendees.slice(0, 2),
        interested: this.mockAttendees.slice(2),
        totalGoing: 67,
        totalInterested: 43
      },
      price: {
        type: 'free'
      },
      tags: ['Suya', 'Pepper Soup', 'Food Tour', 'Surulere', 'Lagos Street Food', 'Free'],
      vibeScore: 8.4,
      socialLinks: {
        instagram: '@lagosfoodies_ng',
        tiktok: '@lagosfoodies'
      },
      isPublic: true,
      maxAttendees: 30,
      minAge: 16,
      whatToExpect: [
        '4 suya spots in one night',
        'Local guide included',
        'Cold drinks at each stop',
        'Nigerian street food',
        'Group photos',
        'Hidden gem discoveries'
      ],
      created: new Date(),
      updated: new Date()
    },
    {
      id: 'e5',
      title: 'Terrakulture Art & Afropop 🎨',
      description: 'Art meets music. Terrakulture Arena brings together emerging Lagos artists and live Afropop performances. Culture, vibes, and conversations. See you there.',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
      category: 'music',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      time: '3:00 PM - 9:00 PM',
      location: {
        name: 'Terrakulture Arena, Victoria Island',
        address: 'Plot 1376 Tiamiyu Savage St, V.I.',
        distance: 'VI'
      },
      host: {
        id: 'h5',
        name: 'Terrakulture',
        avatar: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=150&h=150&fit=crop',
        isVerified: true,
        followers: 9800
      },
      attendees: {
        going: this.mockAttendees.slice(1, 3),
        interested: this.mockAttendees.slice(0, 1),
        totalGoing: 128,
        totalInterested: 55
      },
      price: {
        type: 'paid',
        amount: '₦5,000',
        currency: 'NGN'
      },
      tags: ['Art', 'Afropop', 'Culture', 'Live Music', 'Gallery', 'Victoria Island'],
      vibeScore: 8.9,
      socialLinks: {
        instagram: '@terrakulture',
        tiktok: '@terrakulture_ng'
      },
      isPublic: true,
      maxAttendees: 250,
      minAge: 16,
      whatToExpect: [
        'Live art installations',
        'Afropop live performances',
        'Art market & vendors',
        'Photography zone',
        'Food & drinks',
        'Meet Lagos creatives'
      ],
      created: new Date(),
      updated: new Date()
    },
    {
      id: 'e6',
      title: 'Yaba Underground Rave 🎧',
      description: 'Secret Yaba location. Afro-house, electronic, deep cuts only. No location until 2 hours before. For the real ones. Dress code: all dark. No wahala.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      category: 'nightlife',
      date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      time: '11:00 PM - 5:00 AM',
      location: {
        name: 'Secret Location, Yaba',
        address: 'Address revealed 2hrs before',
        distance: 'Yaba'
      },
      host: {
        id: 'h6',
        name: 'Yaba Underground',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        isVerified: true,
        followers: 12400
      },
      attendees: {
        going: this.mockAttendees.slice(0, 3),
        interested: this.mockAttendees.slice(3),
        totalGoing: 214,
        totalInterested: 189
      },
      price: {
        type: 'paid',
        amount: '₦7,500',
        currency: 'NGN'
      },
      tags: ['Underground', 'Afro-House', 'Electronic', 'Secret', 'Yaba', 'Late Night'],
      vibeScore: 9.4,
      socialLinks: {
        instagram: '@yabaunderground_',
      },
      isPublic: false,
      maxAttendees: 300,
      minAge: 18,
      dressCode: 'All Dark / No Slippers',
      whatToExpect: [
        'Secret Yaba warehouse',
        'Afro-house & deep electronic',
        'No photos policy',
        'Pure underground energy',
        'Midnight reveal of location',
        'Lagos music heads only'
      ],
      created: new Date(),
      updated: new Date()
    }
  ]

  async getEvents(filter?: EventFilter): Promise<SocialEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    let filteredEvents = [...this.mockEvents]
    if (filter) {
      if (filter.category?.length) {
        filteredEvents = filteredEvents.filter(event => filter.category!.includes(event.category))
      }
      if (filter.priceRange) {
        filteredEvents = filteredEvents.filter(event => {
          switch (filter.priceRange) {
            case 'free': return event.price.type === 'free'
            case 'under_20': return event.price.type === 'free' || (event.price.amount && parseInt(event.price.amount.replace(/[₦,]/g, '')) <= 20000)
            case 'under_50': return event.price.type === 'free' || (event.price.amount && parseInt(event.price.amount.replace(/[₦,]/g, '')) <= 50000)
            default: return true
          }
        })
      }
      if (filter.vibeScore) filteredEvents = filteredEvents.filter(e => e.vibeScore >= filter.vibeScore!)
      if (filter.hasSpace) filteredEvents = filteredEvents.filter(e => !e.maxAttendees || e.attendees.totalGoing < e.maxAttendees)
    }
    return filteredEvents
  }

  async getEvent(id: string): Promise<SocialEvent | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.mockEvents.find(event => event.id === id) || null
  }

  async toggleEventAttendance(eventId: string, userId: string, status: 'going' | 'interested' | 'not_going'): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const event = this.mockEvents.find(e => e.id === eventId)
    if (!event) return false
    if (status === 'going') event.attendees.totalGoing += 1
    else if (status === 'interested') event.attendees.totalInterested += 1
    return true
  }

  async getTrendingEvents(): Promise<SocialEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...this.mockEvents].sort((a, b) => b.vibeScore - a.vibeScore).slice(0, 3)
  }

  async getEventsByCategory(category: string): Promise<SocialEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.mockEvents.filter(event => event.category === category)
  }

  async searchEvents(query: string): Promise<SocialEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    const q = query.toLowerCase()
    return this.mockEvents.filter(event =>
      event.title.toLowerCase().includes(q) ||
      event.description.toLowerCase().includes(q) ||
      event.tags.some(tag => tag.toLowerCase().includes(q)) ||
      event.location.name.toLowerCase().includes(q)
    )
  }

  async getUserEvents(userId: string): Promise<{ going: SocialEvent[]; interested: SocialEvent[] }> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      going: this.mockEvents.slice(0, 2),
      interested: this.mockEvents.slice(2, 4)
    }
  }
}

export const vibeFinderService = new VibeFinderService()
export default VibeFinderService
