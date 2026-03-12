import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const SYSTEM_PROMPT = `You are Leo, Lagos' flirty vibe scout. Text like 2am DMs: fast, cocky, 'babe', 'yo', 'let's roll'. Under 25 words. Tease hard, make 'em blush.

Party? "Quilox lit—200 going. Free shot if you drag squad?"
Fix? "AC dead? ₦15k, 4.9 stars, shows today—no scam. WhatsApp?"

Safety: verified only. You're the plug—keep it easy, fun, safe. Always end with a next step.`

function generateSuggestions(userMessage: string): string[] {
  const msg = userMessage.toLowerCase()

  if (msg.includes('party') || msg.includes('club') || msg.includes('quilox') || msg.includes('rave') || msg.includes('vibe') || msg.includes('night') || msg.includes('crafty')) {
    return ["Where's the after-party? 🔥", "Invite my squad?", "Show me rooftops 🌃", "Free entry spots?"]
  }

  if (msg.includes('drink') || msg.includes('bar') || msg.includes('rooftop') || msg.includes('cocktail')) {
    return ["More rooftop spots 🥂", "Which is cheapest?", "Happy hour vibes?", "Food too? 🍜"]
  }

  if (msg.includes('ac') || msg.includes('air con') || msg.includes('electrician') || msg.includes('light') || msg.includes('power')) {
    return ["Get his WhatsApp 📲", "Any cheaper options?", "How fast can he come?", "See reviews ⭐"]
  }

  if (msg.includes('plumber') || msg.includes('pipe') || msg.includes('leak') || msg.includes('fix') || msg.includes('repair')) {
    return ["Get his number 📞", "How much roughly?", "Can he come today?", "See his rating ⭐"]
  }

  if (msg.includes('food') || msg.includes('eat') || msg.includes('hungry') || msg.includes('crawl') || msg.includes('suya')) {
    return ["Best suya spots 🍖", "Late night options?", "Cheap eats?", "Delivery or dine? 🛵"]
  }

  if (msg.includes('spa') || msg.includes('massage') || msg.includes('relax')) {
    return ["Book it now 💆", "Cheaper options?", "Couples massage?", "See photos 📸"]
  }

  return ["What else you need? 👀", "More Lagos spots?", "Find me something fun 🎉", "Quick fix needed? 🔧"]
}

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY

    if (!apiKey) {
      const suggestions = generateSuggestions(message)
      return NextResponse.json({
        text: "Babe, my signal's dead rn 😭 but I'm back soon—what's the vibe? Party or fix?",
        suggestions,
        provider: 'fallback'
      })
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    })

    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_completion_tokens: 120,
    })

    const aiText = response.choices[0]?.message?.content || "Yo, what's the move babe? 👀"
    const suggestions = generateSuggestions(message)

    return NextResponse.json({
      text: aiText,
      suggestions,
      provider: 'openai'
    })

  } catch (error) {
    console.error('Chat API Error:', error)

    return NextResponse.json({
      text: "Ugh, signal dropped 😤 but yo—party or fix? I got you either way.",
      suggestions: ["Party tonight 🎉", "Rooftop drinks 🥂", "Need a plumber 🔧", "Food crawl 🍜"],
      provider: 'fallback'
    }, { status: 200 })
  }
}
