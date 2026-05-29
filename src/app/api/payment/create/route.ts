import { NextRequest, NextResponse } from 'next/server'
const omise = require('omise')({ secretKey: process.env.OMISE_SECRET_KEY })

export async function POST(req: NextRequest) {
  const { token, plan, userId } = await req.json()
  const prices: Record<string, number> = { audio: 9900, all: 14900 }
  const amount = prices[plan]
  if (!amount) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  try {
    const charge = await omise.charges.create({ amount, currency: 'thb', card: token, metadata: { userId, plan } })
    if (charge.status === 'successful') return NextResponse.json({ success: true, chargeId: charge.id })
    return NextResponse.json({ error: 'Payment failed' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
