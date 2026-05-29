export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

const OMISE_API = 'https://api.omise.co'

async function omiseFetch(path: string, body: Record<string, string>) {
  const key = process.env.OMISE_SECRET_KEY || ''
  const auth = Buffer.from(key + ':').toString('base64')
  const res = await fetch(OMISE_API + path, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body).toString(),
  })
  return res.json()
}

export async function POST(req: NextRequest) {
  const { plan, userId } = await req.json()
  const prices: Record<string, number> = { audio: 9900, all: 14900 }
  const amount = prices[plan]
  if (!amount) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  try {
    const source = await omiseFetch('/sources', {
      amount: String(amount),
      currency: 'thb',
      type: 'promptpay',
    })
    if (source.object === 'error') return NextResponse.json({ error: source.message }, { status: 500 })

    const charge = await omiseFetch('/charges', {
      amount: String(amount),
      currency: 'thb',
      source: source.id,
      'metadata[userId]': userId,
      'metadata[plan]': plan,
      return_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
    })
    if (charge.object === 'error') return NextResponse.json({ error: charge.message }, { status: 500 })

    const qrCode = charge.source?.scannable_code?.image?.download_uri
    return NextResponse.json({ chargeId: charge.id, qrCode, amount: amount / 100 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
