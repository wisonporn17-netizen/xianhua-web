'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setOpen(false)
    router.push('/')
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

        <div className="relative" ref={ref}>
          {user ? (
            <>
              <button onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-gray-300 text-xs hidden sm:block max-w-[100px] truncate">{user.email}</span>
                <svg viewBox="0 0 24 24" className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-[#13131f] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                  <Link href="/profile" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all">
                    <span>🕐</span>
                    <span className="text-white text-sm">ประวัติการฟัง</span>
                  </Link>
                  <Link href="/profile?tab=favorites" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all">
                    <span>❤️</span>
                    <span className="text-white text-sm">รายการโปรด</span>
                  </Link>
                  <Link href="/profile?tab=account" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all">
                    <span>⚙️</span>
                    <span className="text-white text-sm">บัญชีของฉัน</span>
                  </Link>
                  <div className="border-t border-white/10"/>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-900/20 transition-all text-left">
                    <span>🚪</span>
                    <span className="text-red-400 text-sm">ออกจากระบบ</span>
                  </button>
                </div>
              )}
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
