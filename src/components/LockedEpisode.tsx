'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AudioPlayer from './AudioPlayer'
import Link from 'next/link'

interface Props {
  isFree: boolean
  audioUrl: string
  title: string
  coverUrl?: string
  novelId: string
  episodeId: string
  novelTitle: string
}

export default function LockedEpisode({ isFree, ...props }: Props) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center text-gray-500 py-20">กำลังโหลด...</div>

  // ถ้าฟรี หรือ login แล้ว -> เล่นได้
  if (isFree || user) {
    return <AudioPlayer {...props} />
  }

  // ไม่ login + ไม่ใช่ตอนฟรี -> แสดงให้ login
  return (
    <div className="bg-xh-card rounded-3xl p-8 border border-yellow-500/20 text-center">
      <div className="text-6xl mb-4">🔒</div>
      <h3 className="text-white font-bold text-lg mb-2">ตอนสำหรับสมาชิก</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        เข้าสู่ระบบเพื่อฟังตอนนี้<br />
        ฟรี! ไม่มีค่าใช้จ่าย
      </p>
      <Link href="/auth" className="inline-block px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all">
        เข้าสู่ระบบ / สมัครสมาชิก
      </Link>
    </div>
  )
}
