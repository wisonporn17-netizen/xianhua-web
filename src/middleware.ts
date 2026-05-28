import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_EMAILS = ['wisonporn2517@gmail.com']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session || !ADMIN_EMAILS.includes(session.user.email || '')) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  
  return res
}

export const config = {
  matcher: ['/admin/:path*']
}
