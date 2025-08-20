import { NextRequest, NextResponse } from 'next/server'
import SeftecAI from '@/lib/seftec-ai'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const service = searchParams.get('service') || 'general'
    const location = searchParams.get('location')

    // For now, use the mock data in SeftecAI
    // Later this will connect to your real database
    const ai = new SeftecAI('deepseek', 'mock')
    const handymen = await ai.searchHandymen(service, location || undefined)

    return NextResponse.json({
      handymen,
      total: handymen.length,
      service,
      location
    })

  } catch (error) {
    console.error('Handymen search error:', error)

    return NextResponse.json({
      handymen: [],
      total: 0,
      error: 'Failed to search handymen'
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { service, location, urgency } = await req.json()

    // Enhanced search with POST data
    const ai = new SeftecAI('deepseek', 'mock')
    const handymen = await ai.searchHandymen(service, location)

    // Sort by urgency if needed
    if (urgency === 'emergency') {
      return NextResponse.json({
        handymen: handymen.filter(h => h.availability.includes('now') || h.availability.includes('Available')),
        total: handymen.length,
        urgency: true
      })
    }

    return NextResponse.json({
      handymen,
      total: handymen.length,
      service,
      location
    })

  } catch (error) {
    console.error('Handymen POST search error:', error)

    return NextResponse.json({
      handymen: [],
      total: 0,
      error: 'Failed to search handymen'
    }, { status: 500 })
  }
}
