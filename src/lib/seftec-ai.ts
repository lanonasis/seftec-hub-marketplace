// AI Service for SEFTEC Discovery
import axios from 'axios'

export type AIProvider = 'deepseek' | 'perplexity' | 'openrouter'

export interface AIResponse {
  text: string
  suggestions?: string[]
  tools_used?: string[]
  confidence?: number
}

export interface HandymanResult {
  id: string
  name: string
  rating: number
  price_range: string
  distance: string
  services: string[]
  availability: string
  verified: boolean
  image?: string
  phone?: string
  reviews?: number
}

export interface BusinessResult {
  id: string
  name: string
  rating: number
  price: string
  distance: string
  tags: string[]
  time: string
  image?: string
  type: 'restaurant' | 'spa' | 'bar' | 'service' | 'handyman'
}

class SeftecAI {
  private apiKey: string
  private provider: AIProvider
  private baseUrl: string

  constructor(provider: AIProvider = 'deepseek', apiKey: string) {
    this.provider = provider
    this.apiKey = apiKey
    this.baseUrl = this.getBaseUrl(provider)
  }

  private getBaseUrl(provider: AIProvider): string {
    switch (provider) {
      case 'deepseek':
        return 'https://api.deepseek.com/v1'
      case 'perplexity':
        return 'https://api.perplexity.ai'
      case 'openrouter':
        return 'https://openrouter.ai/api/v1'
      default:
        return 'https://api.deepseek.com/v1'
    }
  }

  private getSystemPrompt(): string {
    return `You are the SEFTEC Discovery Assistant, a helpful AI that helps GenZ users discover amazing local experiences, services, and products. You're fun, conversational, and always ready to help users find exactly what they're looking for.

## Core Personality:
- Speak like a knowledgeable local friend who knows all the best spots
- Use emojis naturally but not excessively
- Be enthusiastic but authentic
- Understand GenZ language and preferences
- Always prioritize user safety and verified businesses

## Available Tools:
- database_search: Search verified local businesses
- handyman_search: Find skilled handymen and service providers
- web_search: Find real-time information
- price_check: Get current pricing
- availability_check: Check real-time availability

## Response Strategy:
1. Understand what the user really wants
2. Search for the best options
3. Provide specific details with ratings, pricing, distance
4. Include actionable next steps (book, call, directions)
5. Suggest 3-4 follow-up options

## Tone Examples:
❌ "I found 3 establishments with beverage offerings"
✅ "Ooh, I found some amazing spots! 🍹 Check out 'The Rooftop' - they have unlimited cocktails 5-8pm for $25!"

Remember: You're curating experiences that make users' lives better!`
  }

  async chat(message: string, context?: any): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.provider === 'deepseek' ? 'deepseek-chat' : 'llama-3.1-sonar-small-128k-online',
          messages: [
            { role: 'system', content: this.getSystemPrompt() },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const aiText = response.data.choices[0].message.content

      // Generate smart suggestions based on the response
      const suggestions = this.generateSuggestions(message, aiText)

      return {
        text: aiText,
        suggestions,
        tools_used: ['ai_reasoning'],
        confidence: 0.85
      }
    } catch (error) {
      console.error('AI API Error:', error)
      return {
        text: "I'm having trouble connecting right now, but I'm here to help! Try asking me about local spots, handymen, or experiences nearby! ✨",
        suggestions: ["Find unlimited drinks 🍹", "Cool spa getaway 🧘‍♀️", "Find a handyman 🔧", "Late night food 🍕"],
        confidence: 0.1
      }
    }
  }

  private generateSuggestions(userMessage: string, aiResponse: string): string[] {
    const message = userMessage.toLowerCase()

    if (message.includes('drink') || message.includes('bar')) {
      return ["Show me more bars 🍻", "What's the vibe like? 🎵", "Any food options? 🍕", "Book this spot! 🎉"]
    }

    if (message.includes('spa') || message.includes('massage')) {
      return ["Book this deal! 💖", "See photos 📸", "Check availability 📅", "Other spa options 🧘‍♀️"]
    }

    if (message.includes('handyman') || message.includes('plumber') || message.includes('fix')) {
      return ["See their profile 👤", "Check reviews ⭐", "Get estimate 💰", "Book now 📞"]
    }

    if (message.includes('food') || message.includes('pizza') || message.includes('eat')) {
      return ["Order now! 🍕", "See the menu 📋", "Check reviews ⭐", "Other food spots 🍽️"]
    }

    return ["Tell me more! 💭", "Show nearby options 📍", "Check prices 💰", "What else? ✨"]
  }

  // Mock database search - replace with real database later
  async searchBusinesses(query: string, type?: string): Promise<BusinessResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockBusinesses: BusinessResult[] = [
      {
        id: '1',
        name: 'The Rooftop Vibes',
        rating: 4.8,
        price: '$25',
        distance: '0.3mi',
        tags: ['Unlimited Drinks', 'Instagram Worthy', 'Sunset Views'],
        time: '5-8pm Happy Hour',
        type: 'bar'
      },
      {
        id: '2',
        name: 'Zen Garden Spa',
        rating: 4.9,
        price: '$89',
        distance: '0.7mi',
        tags: ['Self Care', 'Aesthetic', 'Deals'],
        time: 'Open Now',
        type: 'spa'
      },
      {
        id: '3',
        name: 'Tony\'s Pizza Lab',
        rating: 4.7,
        price: '$12',
        distance: '0.5mi',
        tags: ['Late Night', 'Giant Slices', 'Quick Delivery'],
        time: 'Open till 2am',
        type: 'restaurant'
      }
    ]

    return mockBusinesses.filter(business =>
      business.name.toLowerCase().includes(query.toLowerCase()) ||
      business.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
  }

  // Mock handyman search - replace with real database later
  async searchHandymen(service: string, location?: string): Promise<HandymanResult[]> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockHandymen: HandymanResult[] = [
      {
        id: 'h1',
        name: 'Chidi the Plumber',
        rating: 4.9,
        price_range: '₦12k–₦18k',
        distance: 'Lekki Phase 1',
        services: ['Plumbing', 'Leak Repair', 'Emergency Service', 'Pipe Fitting'],
        availability: 'Available now',
        verified: true,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        phone: '2348012345678',
        reviews: 67
      },
      {
        id: 'h2',
        name: 'Tunde Electrical Works',
        rating: 4.8,
        price_range: '₦10k–₦20k',
        distance: 'Victoria Island',
        services: ['Electrical', 'AC Repair', 'Generator Servicing', 'Wiring'],
        availability: 'Tomorrow morning',
        verified: true,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        phone: '2348023456789',
        reviews: 52
      },
      {
        id: 'h3',
        name: 'Blessing Home Repairs',
        rating: 4.7,
        price_range: '₦8k–₦15k',
        distance: 'Ikeja',
        services: ['General Repairs', 'Painting', 'Carpentry', 'Tiling'],
        availability: 'This weekend',
        verified: true,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150&h=150&fit=crop&crop=face',
        phone: '2348034567890',
        reviews: 38
      },
      {
        id: 'h4',
        name: 'Emeka AC & Cooling',
        rating: 4.9,
        price_range: '₦15k flat',
        distance: 'Surulere',
        services: ['AC Repair', 'AC Installation', 'Refrigerator Repair', 'Electrical'],
        availability: 'Available now',
        verified: true,
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
        phone: '2348045678901',
        reviews: 91
      },
      {
        id: 'h5',
        name: 'Yemi Clean Team',
        rating: 4.6,
        price_range: '₦10k–₦25k',
        distance: 'Ajah',
        services: ['Deep Cleaning', 'Fumigation', 'Laundry Service', 'Cleaner'],
        availability: 'Same day',
        verified: true,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
        phone: '2348056789012',
        reviews: 44
      },
      {
        id: 'h6',
        name: 'Ade Mechanics',
        rating: 4.8,
        price_range: '₦5k–₦30k',
        distance: 'Gbagada',
        services: ['Mechanic', 'Car Repairs', 'Panel Beating', 'Auto Electrical'],
        availability: 'Available now',
        verified: true,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        phone: '2348067890123',
        reviews: 73
      }
    ]

    if (service.toLowerCase() === 'general') {
      return mockHandymen
    }

    return mockHandymen.filter(handyman =>
      handyman.services.some(s => s.toLowerCase().includes(service.toLowerCase()))
    )
  }
}

export default SeftecAI
