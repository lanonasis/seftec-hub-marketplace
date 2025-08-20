export interface UserLevel {
  level: number
  name: string
  minPoints: number
  maxPoints: number
  color: string
  icon: string
  perks: string[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  condition: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  points: number
  badge?: string
  progress: number
  maxProgress: number
  completed: boolean
  dateCompleted?: Date
}

export interface UserStats {
  totalPoints: number
  currentLevel: UserLevel
  badges: Badge[]
  achievements: Achievement[]
  streak: number
  totalBookings: number
  totalReviews: number
  favoriteCategory: string
}

export const LEVELS: UserLevel[] = [
  {
    level: 1,
    name: 'Explorer',
    minPoints: 0,
    maxPoints: 99,
    color: 'from-gray-400 to-gray-500',
    icon: '🌱',
    perks: ['Basic chat features', 'Browse all services']
  },
  {
    level: 2,
    name: 'Adventurer',
    minPoints: 100,
    maxPoints: 299,
    color: 'from-green-400 to-green-500',
    icon: '🚀',
    perks: ['Priority chat responses', '5% booking discount', 'Early access to new features']
  },
  {
    level: 3,
    name: 'Connoisseur',
    minPoints: 300,
    maxPoints: 599,
    color: 'from-blue-400 to-blue-500',
    icon: '💎',
    perks: ['Personalized recommendations', '10% booking discount', 'VIP customer support']
  },
  {
    level: 4,
    name: 'Trendsetter',
    minPoints: 600,
    maxPoints: 999,
    color: 'from-purple-400 to-purple-500',
    icon: '👑',
    perks: ['Exclusive experiences', '15% booking discount', 'Beta feature access']
  },
  {
    level: 5,
    name: 'Influencer',
    minPoints: 1000,
    maxPoints: 1999,
    color: 'from-pink-400 to-pink-500',
    icon: '🌟',
    perks: ['Partner benefits', '20% booking discount', 'Custom AI personality']
  },
  {
    level: 6,
    name: 'Legend',
    minPoints: 2000,
    maxPoints: Infinity,
    color: 'from-yellow-400 to-orange-500',
    icon: '🔥',
    perks: ['All perks unlocked', '25% booking discount', 'Lifetime premium features']
  }
]

export const BADGES: Badge[] = [
  // Discovery Badges
  {
    id: 'first_chat',
    name: 'First Contact',
    description: 'Had your first AI conversation',
    icon: '💬',
    rarity: 'common',
    points: 10,
    condition: 'Send first message to AI'
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Booked a service after 10 PM',
    icon: '🦉',
    rarity: 'common',
    points: 15,
    condition: 'Book service between 10 PM - 6 AM'
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Booked a service before 7 AM',
    icon: '🐦',
    rarity: 'common',
    points: 15,
    condition: 'Book service between 5 AM - 7 AM'
  },

  // Social Badges
  {
    id: 'reviewer',
    name: 'Critic',
    description: 'Left your first review',
    icon: '⭐',
    rarity: 'common',
    points: 20,
    condition: 'Leave first review'
  },
  {
    id: 'super_reviewer',
    name: 'Super Critic',
    description: 'Left 10 helpful reviews',
    icon: '🌟',
    rarity: 'rare',
    points: 100,
    condition: 'Leave 10 reviews'
  },

  // Booking Badges
  {
    id: 'first_booking',
    name: 'First Timer',
    description: 'Made your first booking',
    icon: '🎉',
    rarity: 'common',
    points: 25,
    condition: 'Complete first booking'
  },
  {
    id: 'regular',
    name: 'Regular',
    description: 'Made 5 successful bookings',
    icon: '🔄',
    rarity: 'rare',
    points: 75,
    condition: 'Complete 5 bookings'
  },
  {
    id: 'power_user',
    name: 'Power User',
    description: 'Made 25 successful bookings',
    icon: '⚡',
    rarity: 'epic',
    points: 200,
    condition: 'Complete 25 bookings'
  },

  // Special Badges
  {
    id: 'streak_warrior',
    name: 'Streak Warrior',
    description: 'Used the platform for 7 days in a row',
    icon: '🔥',
    rarity: 'rare',
    points: 150,
    condition: 'Login 7 consecutive days'
  },
  {
    id: 'explorer',
    name: 'Category Explorer',
    description: 'Tried services from 5 different categories',
    icon: '🗺️',
    rarity: 'epic',
    points: 180,
    condition: 'Book from 5 different categories'
  },
  {
    id: 'beta_tester',
    name: 'Beta Tester',
    description: 'Joined during the beta period',
    icon: '🧪',
    rarity: 'legendary',
    points: 500,
    condition: 'Join during beta'
  }
]

export class GamificationEngine {
  static calculateLevel(points: number): UserLevel {
    return LEVELS.find(level =>
      points >= level.minPoints && points <= level.maxPoints
    ) || LEVELS[0]
  }

  static getPointsToNextLevel(currentPoints: number): number {
    const currentLevel = this.calculateLevel(currentPoints)
    const nextLevel = LEVELS.find(level => level.level === currentLevel.level + 1)

    if (!nextLevel) return 0
    return nextLevel.minPoints - currentPoints
  }

  static getLevelProgress(points: number): number {
    const level = this.calculateLevel(points)
    const progress = (points - level.minPoints) / (level.maxPoints - level.minPoints)
    return Math.min(progress * 100, 100)
  }

  static checkBadgeEarned(badgeId: string, userStats: UserStats): boolean {
    const badge = BADGES.find(b => b.id === badgeId)
    if (!badge) return false

    // Check if user already has this badge
    if (userStats.badges.some(b => b.id === badgeId)) return false

    // Badge-specific logic
    switch (badgeId) {
      case 'first_chat':
        return true // Awarded when user sends first message

      case 'first_booking':
        return userStats.totalBookings >= 1

      case 'regular':
        return userStats.totalBookings >= 5

      case 'power_user':
        return userStats.totalBookings >= 25

      case 'reviewer':
        return userStats.totalReviews >= 1

      case 'super_reviewer':
        return userStats.totalReviews >= 10

      case 'streak_warrior':
        return userStats.streak >= 7

      default:
        return false
    }
  }

  static awardPoints(
    currentStats: UserStats,
    points: number,
    reason: string
  ): {
    newStats: UserStats
    levelUp: boolean
    newBadges: Badge[]
    message: string
  } {
    const oldLevel = currentStats.currentLevel
    const newPoints = currentStats.totalPoints + points
    const newLevel = this.calculateLevel(newPoints)
    const levelUp = newLevel.level > oldLevel.level

    // Check for new badges
    const newBadges: Badge[] = []
    BADGES.forEach(badge => {
      if (this.checkBadgeEarned(badge.id, { ...currentStats, totalPoints: newPoints })) {
        newBadges.push(badge)
      }
    })

    const newStats: UserStats = {
      ...currentStats,
      totalPoints: newPoints,
      currentLevel: newLevel,
      badges: [...currentStats.badges, ...newBadges]
    }

    let message = `+${points} points for ${reason}!`
    if (levelUp) {
      message += ` 🎉 Level up! You're now a ${newLevel.name}!`
    }
    if (newBadges.length > 0) {
      message += ` 🏆 New badge${newBadges.length > 1 ? 's' : ''}: ${newBadges.map(b => b.name).join(', ')}!`
    }

    return {
      newStats,
      levelUp,
      newBadges,
      message
    }
  }

  static getRandomReward(): {
    type: 'points' | 'badge' | 'discount'
    value: number | string
    message: string
  } {
    const rewards = [
      { type: 'points' as const, value: 50, message: '🎁 Surprise! +50 bonus points!' },
      { type: 'points' as const, value: 25, message: '✨ Lucky you! +25 points!' },
      { type: 'discount' as const, value: '10%', message: '💰 10% off your next booking!' },
      { type: 'discount' as const, value: '5%', message: '🎯 5% discount unlocked!' }
    ]

    return rewards[Math.floor(Math.random() * rewards.length)]
  }
}

// Point values for different actions
export const POINT_VALUES = {
  FIRST_CHAT: 10,
  CHAT_MESSAGE: 1,
  FIRST_BOOKING: 25,
  BOOKING_COMPLETED: 15,
  REVIEW_LEFT: 20,
  HELPFUL_REVIEW: 10,
  SHARE_EXPERIENCE: 5,
  DAILY_LOGIN: 5,
  STREAK_BONUS: 10,
  CATEGORY_FIRST_TRY: 15,
  PERFECT_RATING_GIVEN: 25,
  FRIEND_REFERRED: 100
}
