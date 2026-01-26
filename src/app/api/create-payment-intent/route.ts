import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', metadata } = await request.json()

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey || stripeSecretKey === 'your_stripe_secret_key_here') {
      // Demo mode - return mock payment intent
      return NextResponse.json({
        clientSecret: `demo_secret_${Date.now()}`,
        paymentIntentId: `pi_demo_${Date.now()}`,
        demoMode: true,
        message: 'Running in demo mode. Add your Stripe keys to .env.local for real payments.'
      })
    }

    // Real Stripe integration
    const stripe = require('stripe')(stripeSecretKey)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      demoMode: false,
    })
  } catch (error: any) {
    console.error('Payment Intent Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
