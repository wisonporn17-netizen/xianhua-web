export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function clean(v: string | undefined) {
  return (v || '').replace(/[^\x20-\x7E]/g, '').trim()
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    clean(process.env.SUPABASE_SERVICE_KEY)
  )

  const event = await req.json()
  console.log('WEBHOOK EVENT:', JSON.stringify(event).slice(0, 300))

  const data = event.data || {}
  const isPaid = (event.key === 'charge.complete' || event.key === 'charge.create')
    && (data.status === 'successful' || data.paid === true)

  if (isPaid) {
    const meta = data.metadata || {}
    const userId = meta.userId
    const plan = meta.plan || 'audio'

    console.log('WEBHOOK PAID - userId:', userId, 'plan:', plan)

    if (userId) {
      const expires = new Date()
      expires.setMonth(expires.getMonth() + 1)

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        plan,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expires.toISOString(),
      }, { onConflict: 'user_id' })

      const { error } = await supabase.from('profiles').update({
        is_premium: true,
        premium_until: expires.toISOString(),
      }).eq('id', userId)

      if (error) console.log('WEBHOOK UPDATE ERROR:', error.message)
      else console.log('WEBHOOK SUCCESS - premium activated for', userId)
    }
  }

  return NextResponse.json({ received: true })
}
