export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

function clean(v: string | undefined) {
  return (v || '').replace(/[^\x20-\x7E]/g, '').trim()
}

async function omiseFetch(path: string, body: Record<string, string>) {
  const key = clean(process.env.OMISE_SECRET_KEY)
  const auth = Buffer.from(key + ':').toString('base64')
  const res = await fetch('https://api.omise.co' + path, {
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
  const { token, plan, userId } = await req.json()
  const prices: Record<string, number> = { audio: 9900, all: 14900 }
  const amount = prices[plan]
  if (!amount) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  try {
    const charge = await omiseFetch('/charges', {
      amount: String(amount),
      currency: 'thb',
      card: token,
      'metadata[userId]': userId,
      'metadata[plan]': plan,
    })
    if (charge.object === 'error') return NextResponse.json({ error: charge.message }, { status: 500 })
    if (charge.status === 'successful') return NextResponse.json({ success: true, chargeId: charge.id })
    return NextResponse.json({ error: 'Payment failed', status: charge.status }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
