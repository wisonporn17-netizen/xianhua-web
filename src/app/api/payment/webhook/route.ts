export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const event = await req.json()

  // จ่ายเงินสำเร็จ
  if (event.key === 'charge.complete' && event.data?.status === 'successful') {
    const meta = event.data.metadata || {}
    const userId = meta.userId
    const plan = meta.plan
    if (!userId) return NextResponse.json({ received: true })

    const expires = new Date()
    expires.setMonth(expires.getMonth() + 1)

    await supabase.from('subscriptions').upsert({
      user_id: userId,
      plan,
      status: 'active',
      started_at: new Date().toISOString(),
      expires_at: expires.toISOString(),
    }, { onConflict: 'user_id' })

    await supabase.from('profiles').update({
      is_premium: true,
      premium_until: expires.toISOString(),
    }).eq('id', userId)
  }

  return NextResponse.json({ received: true })
}
