import { NextRequest, NextResponse } from 'next/server'
import SeftecAI from '@/lib/seftec-ai'

export async function POST(req: NextRequest) {
  try {
    const { message, provider = 'deepseek' } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get API key from environment variables
    const apiKey = provider === 'deepseek'
      ? process.env.DEEPSEEK_API_KEY
      : process.env.PERPLEXITY_API_KEY

    if (!apiKey) {
      console.warn(`No API key found for ${provider}, using fallback response`)
      return NextResponse.json({
        text: "I'm here to help! Let me find some amazing spots for you... 🌟 What are you in the mood for?",
        suggestions: ["Find unlimited drinks 🍹", "Cool spa getaway 🧘‍♀️", "Find a handyman 🔧", "Late night food 🍕"],
        provider: 'fallback'
      })
    }

    const ai = new SeftecAI(provider, apiKey)
    const response = await ai.chat(message)

    return NextResponse.json({
      ...response,
      provider
    })

  } catch (error) {
    console.error('Chat API Error:', error)

    return NextResponse.json({
      text: "I'm having a little trouble right now, but I'm still here to help! ✨ What kind of experience are you looking for?",
      suggestions: ["Find me drinks 🍹", "Spa day 💆‍♀️", "Need a handyman 🔧", "Food spots 🍕"],
      provider: 'error'
    }, { status: 200 }) // Return 200 so the chat doesn't break
  }
}
