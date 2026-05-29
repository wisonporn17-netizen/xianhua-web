import { NextRequest, NextResponse } from 'next/server'
const omise = require('omise')({ secretKey: process.env.OMISE_SECRET_KEY })

export async function POST(req: NextRequest) {
  const { plan, userId } = await req.json()
  const prices: Record<string, number> = { audio: 9900, all: 14900 }
  const amount = prices[plan]
  if (!amount) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  try {
    const source = await omise.sources.create({ amount, currency: 'thb', type: 'promptpay' })
    const charge = await omise.charges.create({
      amount, currency: 'thb', source: source.id,
      metadata: { userId, plan },
      return_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
    })
    return NextResponse.json({ chargeId: charge.id, qrCode: charge.source?.scannable_code?.image?.download_uri, amount: amount / 100 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
