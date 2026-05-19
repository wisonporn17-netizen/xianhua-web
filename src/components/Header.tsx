'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <header className="sticky top-0 z-50 bg-xh-bg/80 backdrop-blur-md border-b border-xh-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xh-gold text-lg leading-none group-hover:text-xh-gold2 transition-colors">✦</span>
          <span className="font-bold text-base text-white tracking-wide">เซียนหัว</span>
          <span className="font-light text-xh-purple2 text-base tracking-widest">XIANHUA</span>
          <span className="text-xh-gold/60 text-xs ml-0.5 tracking-wider">AUDIO</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-gray-400 text-xs hidden sm:block truncate max-w-[120px]">{user.email}</span>
              <button onClick={handleLogout} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10">
                ออกจากระบบ
              </button>
            </>
          ) : (
            <Link href="/auth" className="text-xs px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white">
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
