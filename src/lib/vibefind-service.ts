// VibeFind Service - Social Event Discovery for SEFTEC Hub
import { SocialEvent, EventAttendee, VibeProfile, EventFilter } from './types'

class VibeFinderService {
  private mockAttendees: EventAttendee[] = [
    {
      id: 'u1',
      name: 'Emma Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150&h=150&fit=crop&crop=face',
      username: '@emmac',
      isVerified: true,
      mutualFriends: 5,
      socialHandle: '@emmachen_',
      joinedAt: new Date(),
      status: 'going'
    },
    {
      id: 'u2',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      username: '@alexr',
      isVerified: false,
      mutualFriends: 2,
      socialHandle: '@alex_rivr',
      joinedAt: new Date(),
      status: 'going'
    },
    {
      id: 'u3',
      name: 'Maya Patel',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      username: '@mayap',
      isVerified: true,
      mutualFriends: 8,
      socialHandle: '@maya.patel',
      joinedAt: new Date(),
      status: 'interested'
    },
    {
      id: 'u4',
      name: 'Jordan Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      username: '@jordank',
      isVerified: false,
      mutualFriends: 3,
      socialHandle: '@jordankim',
      joinedAt: new Date(),
      status: 'going'
    }
  ]

  private mockEvents: SocialEvent[] = [
    {
      id: 'e1',
      title: 'Rooftop Sunset Party 🌅',
      description: 'Join us for the ultimate sunset vibes with unlimited drinks, live DJ, and the most Instagram-worthy views in the city! Come for the sunset, stay for the night ✨',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop',
      category: 'party',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      time: '6:00 PM - 11:00 PM',
      location: {
        name: 'Sky Lounge Downtown',
        address: '123 High Street, 25th Floor',
        distance: '0.8mi'
      },
      host: {
        id: 'h1',
        name: 'Sky Events',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
        isVerified: true,
        followers: 2500
      },
      attendees: {
        going: this.mockAttendees.filter(a => a.status === 'going'),
        interested: this.mockAttendees.filter(a => a.status === 'interested'),
        totalGoing: 47,
        totalInterested: 23
      },
      price: {
        type: 'paid',
        amount: '$25',
        currency: 'USD'
      },
      tags: ['Rooftop', 'Sunset', 'Drinks', 'DJ', 'Photo Ops', 'City Views'],
      vibeScore: 9.2,
      socialLinks: {
        instagram: '@skyevents_official',
        tiktok: '@skyevents'
      },
      isPublic: true,
      maxAttendees: 150,
      minAge: 21,
      dressCode: 'Smart Casual / Cocktail',
      whatToExpect: [
        'Open bar 6-8pm',
        'Live DJ set',
        'Photo booth',
        '360° city views',
        'Light appetizers',
        'Meet amazing people!'
      ],
      created: new Date(),
      updated: new Date()
    },
    {
      id: 'e2',
      title: 'Late Night Food Crawl 🌙',
      description: 'Explore the city\'s best late-night eats with fellow foodies! We\'ll hit 4 spots ending at the secret speakeasy that everyone\'s talking about 🤫',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop',
      category: 'food',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      time: '9:00 PM - 1:00 AM',
      location: {
        name: 'Food District',
        address: 'Starting at Main & 5th',
        distance: '0.3mi'
      },
      host: {
        id: 'h2',
        name: 'Foodie Adventures',
        avatar: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=150&h=150&fit=crop',
        isVerified: true,
        followers: 1200
      },
      attendees: {
        going: this.mockAttendees.slice(0, 2),
        interested: this.mockAttendees.slice(2),
        totalGoing: 18,
        totalInterested: 31
      },
      price: {
        type: 'paid',
        amount: '$35',
        currency: 'USD'
      },
      tags: ['Food Tour', 'Late Night', 'Hidden Gems', 'Speakeasy', 'Group Fun'],
      vibeScore: 8.7,
      socialLinks: {
        instagram: '@foodie_adventures',
        snapchat: 'foodieadv'
      },
      isPublic: true,
      maxAttendees: 25,
      minAge: 18,
      whatToExpect: [
        '4 unique food stops',
        'Local guide included',
        'Secret speakeasy access',
        'Group photos',
        'New foodie friends',
        'Instagram stories galore'
      ],
      created: new Date(),
      updated: new Date()
    },
    {
      id: 'e3',
      title: 'Beach Bonfire & Vibes 🔥',
      description: 'Nothing beats a beach bonfire with good music, s\'mores, and chill people. Bring your guitar, your stories, and your best energy! 🏖️',
      image: 'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=600&h=400&fit=crop',
      category: 'outdoor',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      time: '7:30 PM - 11:00 PM',
      location: {
        name: 'Sunset Beach',
        address: 'Sunset Beach Park, Fire Pit #3',
        distance: '2.1mi'
      },
      host: {
        id: 'h3',
        name: 'Beach Collective',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        isVerified: false,
        followers: 850
      },
      attendees: {
        going: this.mockAttendees.slice(1, 3),
        interested: this.mockAttendees.slice(0, 1),
        totalGoing: 22,
        totalInterested: 15
      },
      price: {
        type: 'free'
      },
      tags: ['Beach', 'Bonfire', 'Music', 'S\'mores', 'Sunset', 'Chill Vibes'],
      vibeScore: 8.9,
      socialLinks: {
        instagram: '@beachcollective',
        tiktok: '@beachvibes'
      },
      isPublic: true,
      maxAttendees: 30,
      minAge: 16,
      whatToExpect: [
        'Bonfire setup provided',
        'S\'mores ingredients',
        'Acoustic music session',
        'Beach games',
        'Sunset photos',
        'Relaxed atmosphere'
      ],
      created: new Date(),
      updated: new Date()
    },
    {
      id: 'e4',
      title: 'Underground Electronic Night 🎧',
      description: 'Secret location revealed 2 hours before. Deep house, techno, and the most immersive sound system in the city. For true electronic music lovers only.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
      category: 'nightlife',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      time: '10:00 PM - 4:00 AM',
      location: {
        name: 'Secret Location',
        address: 'Location revealed to attendees',
        distance: '~1.5mi'
      },
      host: {
        id: 'h4',
        name: 'Underground Events',
        avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
        isVerified: true,
        followers: 5200
      },
      attendees: {
        going: this.mockAttendees.slice(0, 3),
        interested: this.mockAttendees.slice(3),
        totalGoing: 89,
        totalInterested: 156
      },
      price: {
        type: 'paid',
        amount: '$40',
        currency: 'USD'
      },
      tags: ['Electronic', 'Underground', 'Deep House', 'Techno', 'Late Night', 'Exclusive'],
      vibeScore: 9.5,
      socialLinks: {
        instagram: '@underground_events',
        discord: 'underground-electronic'
      },
      isPublic: false,
      maxAttendees: 200,
      minAge: 21,
      dressCode: 'All Black Preferred',
      whatToExpect: [
        'World-class DJs',
        'Immersive sound system',
        'Secret location',
        'No photos policy',
        'Pure music experience',
        'Electronic music community'
      ],
      created: new Date(),
      updated: new Date()
    },
    {
      id: 'e5',
      title: 'Brunch & Bottomless Mimosas 🥂',
      description: 'Sunday funday with unlimited mimosas, amazing food, and the cutest brunch crowd! Perfect for making new friends and Instagram content 📸',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop',
      category: 'social',
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      time: '11:00 AM - 3:00 PM',
      location: {
        name: 'Garden Terrace',
        address: '456 Bloom Street, Terrace Level',
        distance: '0.6mi'
      },
      host: {
        id: 'h5',
        name: 'Brunch Society',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
        isVerified: true,
        followers: 3100
      },
      attendees: {
        going: this.mockAttendees.slice(1),
        interested: this.mockAttendees.slice(0, 1),
        totalGoing: 34,
        totalInterested: 19
      },
      price: {
        type: 'paid',
        amount: '$45',
        currency: 'USD'
      },
      tags: ['Brunch', 'Mimosas', 'Social', 'Instagram', 'Garden', 'Sunday Funday'],
      vibeScore: 8.4,
      socialLinks: {
        instagram: '@brunchsociety',
        tiktok: '@brunchvibes'
      },
      isPublic: true,
      maxAttendees: 50,
      minAge: 21,
      dressCode: 'Brunch Chic',
      whatToExpect: [
        'Unlimited mimosas',
        'Gourmet brunch menu',
        'Garden setting',
        'Live acoustic music',
        'Photo-worthy setup',
        'Meet brunch lovers'
      ],
      created: new Date(),
      updated: new Date()
    }
  ]

  // Get all events with optional filtering
  async getEvents(filter?: EventFilter): Promise<SocialEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay

    let filteredEvents = [...this.mockEvents]

    if (filter) {
      if (filter.category?.length) {
        filteredEvents = filteredEvents.filter(event =>
          filter.category!.includes(event.category)
        )
      }

      if (filter.priceRange) {
        filteredEvents = filteredEvents.filter(event => {
          switch (filter.priceRange) {
            case 'free':
              return event.price.type === 'free'
            case 'under_20':
              return event.price.type === 'free' ||
                     (event.price.amount && parseInt(event.price.amount.replace('$', '')) <= 20)
            case 'under_50':
              return event.price.type === 'free' ||
                     (event.price.amount && parseInt(event.price.amount.replace('$', '')) <= 50)
            default:
              return true
          }
        })
      }

      if (filter.vibeScore) {
        filteredEvents = filteredEvents.filter(event => event.vibeScore >= filter.vibeScore!)
      }

      if (filter.hasSpace) {
        filteredEvents = filteredEvents.filter(event =>
          !event.maxAttendees || event.attendees.totalGoing < event.maxAttendees
        )
      }
    }

    return filteredEvents
  }

  // Get single event by ID
  async getEvent(id: string): Promise<SocialEvent | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.mockEvents.find(event => event.id === id) || null
  }

  // Join/leave event
  async toggleEventAttendance(
    eventId: string,
    userId: string,
    status: 'going' | 'interested' | 'not_going'
  ): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500))

    // In real app, this would update the database
    const event = this.mockEvents.find(e => e.id === eventId)
    if (!event) return false

    // Simulate attendance update
    if (status === 'going') {
      event.attendees.totalGoing += 1
    } else if (status === 'interested') {
      event.attendees.totalInterested += 1
    }

    return true
  }

  // Get trending events
  async getTrendingEvents(): Promise<SocialEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.mockEvents
      .sort((a, b) => b.vibeScore - a.vibeScore)
      .slice(0, 3)
  }

  // Get events by category
  async getEventsByCategory(category: string): Promise<SocialEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.mockEvents.filter(event => event.category === category)
  }

  // Search events
  async searchEvents(query: string): Promise<SocialEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    const lowercaseQuery = query.toLowerCase()

    return this.mockEvents.filter(event =>
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery) ||
      event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      event.location.name.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Get user's events (going/interested)
  async getUserEvents(userId: string): Promise<{
    going: SocialEvent[]
    interested: SocialEvent[]
  }> {
    await new Promise(resolve => setTimeout(resolve, 300))

    // In real app, filter based on user's actual attendance
    return {
      going: this.mockEvents.slice(0, 2),
      interested: this.mockEvents.slice(2, 4)
    }
  }
}

export const vibeFinderService = new VibeFinderService()
export default VibeFinderService
