import { NextRequest, NextResponse } from 'next/server'
import Omise from 'omise'

export const runtime = 'nodejs'

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY || '',
  omiseVersion: '2019-05-29',
})

export async function POST(req: NextRequest) {
  try {
    const { plan, userId, phone } = await req.json()
    const amount = plan === 'all' ? 14900 : 9900

    const source = await omise.sources.create({
      type: 'truemoney',
      amount,
      currency: 'THB',
      phone_number: phone,
    } as any)

    const charge = await omise.charges.create({
      amount,
      currency: 'THB',
      source: source.id,
      return_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/premium/callback?plan=${plan}&userId=${userId}`,
      metadata: { plan, userId },
    } as any)

    return NextResponse.json({
      authorizeUri: (charge as any).authorize_uri,
      chargeId: charge.id,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
