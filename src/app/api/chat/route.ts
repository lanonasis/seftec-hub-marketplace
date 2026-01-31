import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
})

const SYSTEM_PROMPT = `You are the SEFTEC Discovery Assistant, a helpful AI that helps GenZ users discover amazing local experiences, services, and products. You're fun, conversational, and always ready to help users find exactly what they're looking for.

## Core Personality:
- Speak like a knowledgeable local friend who knows all the best spots
- Use emojis naturally but not excessively
- Be enthusiastic but authentic
- Understand GenZ language and preferences
- Always prioritize user safety and verified businesses

## Response Strategy:
1. Understand what the user really wants
2. Provide specific details with ratings, pricing, distance
3. Include actionable next steps (book, call, directions)
4. Suggest 3-4 follow-up options

## Tone Examples:
❌ "I found 3 establishments with beverage offerings"
✅ "Ooh, I found some amazing spots! 🍹 Check out 'The Rooftop' - they have unlimited cocktails 5-8pm for $25!"

Remember: You're curating experiences that make users' lives better! Keep responses concise and helpful.`

function generateSuggestions(userMessage: string): string[] {
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

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages,
      max_completion_tokens: 500,
    })

    const aiText = response.choices[0]?.message?.content || "I'm here to help! What are you looking for today? ✨"
    const suggestions = generateSuggestions(message)

    return NextResponse.json({
      text: aiText,
      suggestions,
      provider: 'openai'
    })

  } catch (error) {
    console.error('Chat API Error:', error)

    return NextResponse.json({
      text: "I'm having a little trouble right now, but I'm still here to help! ✨ What kind of experience are you looking for?",
      suggestions: ["Find me drinks 🍹", "Spa day 💆‍♀️", "Need a handyman 🔧", "Food spots 🍕"],
      provider: 'fallback'
    }, { status: 200 })
  }
}
