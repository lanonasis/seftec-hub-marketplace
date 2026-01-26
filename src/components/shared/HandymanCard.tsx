import React from 'react'
import { Star, Clock, CheckCircle, Calendar, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface HandymanData {
  id: string
  name: string
  rating: number
  price_range: string
  distance: string
  services: string[]
  availability: string
  verified: boolean
  image?: string
}

interface HandymanCardProps {
  handyman: HandymanData
  isDarkMode?: boolean
  onBook?: (handymanId: string) => void
  onCall?: (handymanId: string) => void
  className?: string
}

const HandymanCard: React.FC<HandymanCardProps> = ({
  handyman,
  isDarkMode = false,
  onBook,
  onCall,
  className = ""
}) => {
  return (
    <div
      className={`group rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border ${
        isDarkMode
          ? 'bg-gray-900/50 border-gray-700 hover:border-blue-400'
          : 'bg-white border-blue-100 hover:border-blue-200'
      } ${className}`}
    >
      {/* Header with photo and basic info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <img
            src={handyman.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
            alt={handyman.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {handyman.verified && (
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>{handyman.name}</h3>
          <div className="flex items-center gap-1 mb-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>{handyman.rating}</span>
          </div>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{handyman.distance} away</p>
        </div>
      </div>

      {/* Services */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {handyman.services.map((service: string, index: number) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs ${
                isDarkMode
                  ? 'bg-blue-900/30 text-blue-300'
                  : 'bg-blue-50 text-blue-600'
              }`}
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Price and Availability */}
      <div className={`flex items-center justify-between mb-4 text-sm ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{handyman.availability}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`font-semibold ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>{handyman.price_range}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => onBook?.(handyman.id)}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
            isDarkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Calendar className="h-4 w-4 inline mr-1" />
          Book Now
        </Button>
        <Button
          variant="outline"
          onClick={() => onCall?.(handyman.id)}
          className={`py-2 px-4 rounded-full border text-sm font-medium transition-colors ${
            isDarkMode
              ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Phone className="h-4 w-4 inline mr-1" />
          Call
        </Button>
      </div>
    </div>
  )
}

export default HandymanCard
