'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const navItems = [
  { label: 'หน้าแรก', href: '/' },
  { label: 'นิยายทั้งหมด', href: '/novels' },
  { label: 'หมวดหมู่', href: '/categories' },
  { label: 'Top Charts', href: '/top' },
  { label: 'ล่าสุด', href: '/latest' },
]

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <span className="text-xh-gold text-xl leading-none">✦</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-wide">เซียนหัว</span>
              <span className="font-light text-purple-400 text-sm tracking-widest">XIANHUA</span>
            </div>
            <p className="text-[9px] text-gray-500 tracking-[0.2em] uppercase -mt-0.5">Audio Novels</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                pathname === item.href
                  ? 'text-white font-medium border-b-2 border-xh-gold rounded-none'
                  : 'text-gray-400 hover:text-white'
              }`}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xs hidden sm:flex">
          <div className="relative w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="ค้นหานิยาย, ผู้เขียน..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
        </form>

        {/* User */}
        <div className="ml-auto relative flex-shrink-0" ref={ref}>
          {user ? (
            <>
              <button onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-gray-300 text-sm hidden sm:block max-w-[100px] truncate">
                  {user.email?.split('@')[0]}
                </span>
                <svg viewBox="0 0 24 24" className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-52 bg-[#13131f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-white text-sm font-medium truncate">{user.email}</p>
                    <p className="text-gray-500 text-xs mt-0.5">สมาชิกทั่วไป</p>
                  </div>
                  <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all">
                    <span>🕐</span><span className="text-white text-sm">ประวัติการฟัง</span>
                  </Link>
                  <Link href="/profile?tab=favorites" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all">
                    <span>❤️</span><span className="text-white text-sm">รายการโปรด</span>
                  </Link>
                  <Link href="/profile?tab=account" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all">
                    <span>⚙️</span><span className="text-white text-sm">บัญชีของฉัน</span>
                  </Link>
                  <div className="border-t border-white/5"/>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-900/20 transition-all text-left">
                    <span>🚪</span><span className="text-red-400 text-sm">ออกจากระบบ</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link href="/auth" className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all">
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
