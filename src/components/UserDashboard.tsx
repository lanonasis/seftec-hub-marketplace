"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  User,
  Trophy,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  Heart,
  Settings,
  Edit3,
  Award,
  Zap,
  Target,
  BarChart3,
  Gift,
  X
} from 'lucide-react'
import { UserStats, Badge, Achievement, LEVELS } from '@/lib/gamification'
import { Theme, getThemeClasses } from '@/lib/themes'

interface UserDashboardProps {
  isOpen: boolean
  onClose: () => void
  userStats: UserStats
  theme: Theme
  onStatsUpdate?: (stats: UserStats) => void
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  isOpen,
  onClose,
  userStats,
  theme,
  onStatsUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'settings'>('overview')
  const themeConfig = getThemeClasses(theme)
  const isDarkTheme = theme === 'cyberpunk' || theme === 'galaxy'

  const levelProgress = ((userStats.totalPoints - userStats.currentLevel.minPoints) /
    (userStats.currentLevel.maxPoints - userStats.currentLevel.minPoints)) * 100

  const nextLevel = LEVELS.find(l => l.level === userStats.currentLevel.level + 1)
  const pointsToNext = nextLevel ? nextLevel.minPoints - userStats.totalPoints : 0

  const recentBadges = userStats.badges.slice(-3)
  const completedAchievements = userStats.achievements.filter(a => a.completed)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Dashboard Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden ${
              isDarkTheme
                ? 'bg-gray-900 border border-purple-500/30'
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b ${
              isDarkTheme
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-gradient-to-r from-pink-50 to-purple-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${themeConfig.primary} flex items-center justify-center text-2xl font-bold text-white`}>
                    {userStats.currentLevel.icon}
                  </div>
                  <div>
                    <h1 className={`text-2xl font-bold ${themeConfig.text}`}>
                      Welcome back!
                    </h1>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${userStats.currentLevel.color} text-white`}>
                        {userStats.currentLevel.name}
                      </span>
                      <span className={`text-sm ${themeConfig.textSecondary}`}>
                        {userStats.totalPoints} XP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Level Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${themeConfig.textSecondary}`}>
                    Progress to {nextLevel?.name || 'Max Level'}
                  </span>
                  <span className={`text-sm font-medium ${themeConfig.text}`}>
                    {Math.round(levelProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${themeConfig.primary} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                {nextLevel && (
                  <p className={`text-xs mt-1 ${themeConfig.textSecondary}`}>
                    {pointsToNext} XP to next level
                  </p>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={`flex border-b ${
              isDarkTheme ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'achievements', label: 'Achievements', icon: Trophy },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                    activeTab === id
                      ? isDarkTheme
                        ? 'border-b-2 border-purple-500 text-purple-400'
                        : 'border-b-2 border-blue-500 text-blue-600'
                      : isDarkTheme
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Bookings', value: userStats.totalBookings, icon: Calendar, color: 'from-blue-500 to-blue-600' },
                      { label: 'Reviews Left', value: userStats.totalReviews, icon: Star, color: 'from-yellow-500 to-yellow-600' },
                      { label: 'Current Streak', value: `${userStats.streak} days`, icon: Zap, color: 'from-orange-500 to-orange-600' },
                      { label: 'Badges Earned', value: userStats.badges.length, icon: Award, color: 'from-purple-500 to-purple-600' }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-2xl ${
                          isDarkTheme ? 'bg-gray-800' : 'bg-white'
                        } border shadow-sm`}
                      >
                        <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
                          <stat.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className={`text-2xl font-bold ${themeConfig.text}`}>
                          {stat.value}
                        </div>
                        <div className={`text-sm ${themeConfig.textSecondary}`}>
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Achievements */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${themeConfig.text}`}>
                      Recent Badges
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {recentBadges.map((badge, index) => (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-xl border ${
                            isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{badge.icon}</div>
                            <h4 className={`font-semibold ${themeConfig.text}`}>
                              {badge.name}
                            </h4>
                            <p className={`text-xs ${themeConfig.textSecondary}`}>
                              {badge.description}
                            </p>
                            <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs ${
                              badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                              badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                              badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              <Star className="h-3 w-3" />
                              {badge.rarity}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Level Perks */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${themeConfig.text}`}>
                      Current Level Perks
                    </h3>
                    <div className={`p-4 rounded-xl border ${
                      isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`h-10 w-10 rounded-full bg-gradient-to-r ${userStats.currentLevel.color} flex items-center justify-center text-lg`}>
                          {userStats.currentLevel.icon}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${themeConfig.text}`}>
                            {userStats.currentLevel.name}
                          </h4>
                          <p className={`text-sm ${themeConfig.textSecondary}`}>
                            Level {userStats.currentLevel.level}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {userStats.currentLevel.perks.map((perk, index) => (
                          <li key={index} className={`flex items-center gap-2 text-sm ${themeConfig.textSecondary}`}>
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${themeConfig.text}`}>
                      All Badges ({userStats.badges.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userStats.badges.map((badge, index) => (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 rounded-xl border ${
                            isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-4xl mb-3">{badge.icon}</div>
                            <h4 className={`font-semibold mb-1 ${themeConfig.text}`}>
                              {badge.name}
                            </h4>
                            <p className={`text-sm mb-3 ${themeConfig.textSecondary}`}>
                              {badge.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                                badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                                badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                <Star className="h-3 w-3" />
                                {badge.rarity}
                              </span>
                              <span className={`text-sm font-medium ${themeConfig.text}`}>
                                +{badge.points} XP
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Progress Achievements */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${themeConfig.text}`}>
                      Progress Tracking
                    </h3>
                    <div className="space-y-3">
                      {userStats.achievements.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 rounded-xl border ${
                            isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-semibold ${themeConfig.text}`}>
                              {achievement.title}
                            </h4>
                            <span className={`text-sm ${themeConfig.textSecondary}`}>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <p className={`text-sm mb-3 ${themeConfig.textSecondary}`}>
                            {achievement.description}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-full bg-gradient-to-r ${themeConfig.primary} rounded-full transition-all duration-500`}
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            />
                          </div>
                          {achievement.completed && (
                            <div className="flex items-center gap-1 mt-2 text-green-600">
                              <Trophy className="h-4 w-4" />
                              <span className="text-sm font-medium">Completed!</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${themeConfig.text}`}>
                      Profile Settings
                    </h3>
                    <div className={`p-4 rounded-xl border ${
                      isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
                            Display Name
                          </label>
                          <input
                            type="text"
                            placeholder="Your display name"
                            className={`w-full p-3 rounded-lg border ${
                              isDarkTheme
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
                            Favorite Categories
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['Restaurants', 'Spas', 'Nightlife', 'Services', 'Shopping'].map(category => (
                              <button
                                key={category}
                                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                  category === userStats.favoriteCategory
                                    ? `bg-gradient-to-r ${themeConfig.primary} text-white border-transparent`
                                    : isDarkTheme
                                      ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${themeConfig.text}`}>
                      Notifications
                    </h3>
                    <div className={`p-4 rounded-xl border ${
                      isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="space-y-4">
                        {[
                          { label: 'New badge earned', description: 'Get notified when you unlock achievements' },
                          { label: 'Level up alerts', description: 'Celebrate when you reach a new level' },
                          { label: 'Booking reminders', description: 'Reminders for upcoming appointments' },
                          { label: 'Special offers', description: 'Exclusive deals and promotions' }
                        ].map((setting, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className={`font-medium ${themeConfig.text}`}>{setting.label}</p>
                              <p className={`text-sm ${themeConfig.textSecondary}`}>{setting.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default UserDashboard
