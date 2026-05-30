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

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ ok: false })

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium, premium_until')
    .eq('id', userId)
    .single()

  if (profile?.is_premium && profile?.premium_until) {
    const expiry = new Date(profile.premium_until)
    if (expiry < new Date()) {
      await supabase.from('profiles').update({
        is_premium: false,
        premium_until: null,
      }).eq('id', userId)

      await supabase.from('subscriptions').update({
        status: 'expired',
      }).eq('user_id', userId).eq('status', 'active')

      return NextResponse.json({ expired: true })
    }
  }

  return NextResponse.json({ expired: false })
}
