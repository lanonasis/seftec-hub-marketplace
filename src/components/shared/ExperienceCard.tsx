import React from 'react'
import { Heart, MapPin, Star } from 'lucide-react'

export interface ExperienceData {
  id: number | string
  name: string
  image: string
  rating: number
  price: string
  distance: string
  tags: string[]
  time: string
}

interface ExperienceCardProps {
  experience: ExperienceData
  isDarkMode?: boolean
  onLike?: (experienceId: number | string) => void
  onBook?: (experienceId: number | string) => void
  className?: string
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  isDarkMode = false,
  onLike,
  onBook,
  className = ""
}) => {
  return (
    <div
      onClick={() => onBook?.(experience.id)}
      className={`group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border cursor-pointer ${
        isDarkMode
          ? 'bg-gray-800/50 border-gray-700 hover:border-blue-400'
          : 'bg-white border-pink-100 hover:border-pink-200'
      } ${className}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={experience.image}
          alt={experience.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onLike?.(experience.id)
            }}
            className={`h-8 w-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${
              isDarkMode ? 'bg-gray-900/70 hover:bg-gray-800' : 'bg-white/90 hover:bg-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} hover:text-red-500 transition-colors`} />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
            {experience.time}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold text-lg ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>{experience.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>{experience.rating}</span>
          </div>
        </div>

        <div className={`flex items-center gap-4 text-sm mb-3 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{experience.distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`font-semibold ${
              isDarkMode ? 'text-blue-400' : 'text-pink-600'
            }`}>{experience.price}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {experience.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs ${
                isDarkMode
                  ? 'bg-blue-900/30 text-blue-300'
                  : 'bg-pink-50 text-pink-600'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExperienceCard
