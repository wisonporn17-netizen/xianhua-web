'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AudioPlayer from './AudioPlayer'
import Link from 'next/link'

interface Props {
  isFree: boolean
  accessLevel?: string
  audioUrl: string
  title: string
  coverUrl?: string
  novelId: string
  episodeId: string
  novelTitle: string
}

export default function LockedEpisode({ isFree, accessLevel = 'premium', ...props }: Props) {
  const [user, setUser] = useState<any>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        setUser(userData.user)
        // เช็ค Premium
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium, premium_until')
          .eq('id', userData.user.id)
          .single()
        if (profile?.is_premium && new Date(profile.premium_until) > new Date()) {
          setIsPremium(true)
        }
      }
      setLoading(false)
    }
    checkUser()
  }, [])

  if (loading) return <div className="text-center text-gray-500 py-20">กำลังโหลด...</div>

  const level = accessLevel || (isFree ? 'free' : 'premium')

  // ฟรี -> ทุกคนเข้าได้
  if (level === 'free') return <AudioPlayer {...props} />

  // สมาชิก -> ต้อง login
  if (level === 'member') {
    if (user) return <AudioPlayer {...props} />
    return (
      <div className="bg-xh-card rounded-3xl p-8 border border-blue-500/20 text-center">
        <div className="text-6xl mb-4">👤</div>
        <h3 className="text-white font-bold text-lg mb-2">ตอนสำหรับสมาชิก</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          เข้าสู่ระบบเพื่อฟังตอนนี้<br />
          ฟรี! ไม่มีค่าใช้จ่าย
        </p>
        <Link href="/auth" className="inline-block px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all">
          เข้าสู่ระบบ / สมัครสมาชิก
        </Link>
      </div>
    )
  }

  // premium -> ต้อง premium
  if (isPremium) return <AudioPlayer {...props} />

  // login แล้วแต่ไม่ premium
  if (user) {
    return (
      <div className="bg-xh-card rounded-3xl p-8 border border-yellow-500/20 text-center">
        <div className="text-6xl mb-4">👑</div>
        <h3 className="text-white font-bold text-lg mb-2">ตอนสำหรับสมาชิก Premium</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          สมัคร Premium เพื่อฟังตอนนี้<br />
          เริ่มต้นเพียง 99 บาท/เดือน
        </p>
        <Link href="/premium" className="inline-block px-6 py-3 rounded-full bg-yellow-600 hover:bg-yellow-500 text-white font-medium text-sm transition-all">
          สมัคร Premium
        </Link>
      </div>
    )
  }

  // ไม่ login
  return (
    <div className="bg-xh-card rounded-3xl p-8 border border-yellow-500/20 text-center">
      <div className="text-6xl mb-4">🔒</div>
      <h3 className="text-white font-bold text-lg mb-2">ตอนสำหรับสมาชิก Premium</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        เข้าสู่ระบบและสมัคร Premium เพื่อฟังตอนนี้
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/auth" className="inline-block px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all">
          เข้าสู่ระบบ
        </Link>
        <Link href="/premium" className="inline-block px-6 py-3 rounded-full bg-yellow-600 hover:bg-yellow-500 text-white font-medium text-sm transition-all">
          สมัคร Premium
        </Link>
      </div>
    </div>
  )
}
