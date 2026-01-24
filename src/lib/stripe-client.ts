export async function createPaymentIntent(amount: number, metadata?: Record<string, string>) {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'usd',
        metadata,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create payment intent')
    }

    return data
  } catch (error: any) {
    console.error('Payment error:', error)
    throw error
  }
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function parsePrice(priceString: string): number {
  // Parse strings like "$25", "$89", "Free" etc.
  if (priceString.toLowerCase() === 'free') return 0

  const match = priceString.match(/\d+/)
  return match ? parseInt(match[0]) : 0
}
