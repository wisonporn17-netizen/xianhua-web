'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PremiumPage() {
  const [user, setUser] = useState<any>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [premiumUntil, setPremiumUntil] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) { router.push('/auth'); return }
      setUser(data.user)
      const { data: profile } = await supabase.from('profiles').select('is_premium, premium_until').eq('id', data.user.id).single()
      if (profile?.is_premium && new Date(profile.premium_until) > new Date()) {
        setIsPremium(true)
        setPremiumUntil(new Date(profile.premium_until).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }))
      }
      setLoading(false)
    }
    init()
  }, [])

  const handleCancel = async () => {
    if (!confirm('ยืนยันการยกเลิก Premium?')) return
    setCancelling(true)
    await supabase.from('profiles').update({ is_premium: false }).eq('id', user.id)
    setIsPremium(false)
    setCancelling(false)
    alert('ยกเลิก Premium เรียบร้อยแล้ว')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Back */}
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          กลับหน้าโปรไฟล์
        </Link>

        {isPremium ? (
          /* === หน้าสมาชิก Premium === */
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="relative rounded-2xl overflow-hidden p-8 border border-yellow-500/20"
              style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)' }}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)' }} />
              <div className="relative flex flex-col sm:flex-row items-center gap-6">
                <div className="text-7xl">👑</div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">⭐ PREMIUM ACTIVE</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-1">Premium Plus</h1>
                  <p className="text-gray-300">สมาชิกของคุณใช้งานได้ถึง <span className="text-yellow-400 font-medium">{premiumUntil}</span></p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h2 className="text-white font-semibold mb-5">สิทธิพิเศษที่คุณได้รับ</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '🚫', title: 'ไม่มีโฆษณา', desc: 'ฟังได้อย่างเต็มที่ไม่มีสะดุด' },
                  { icon: '🔓', title: 'ฟังได้ทุกตอน', desc: 'เข้าถึงทุกตอนไม่มีล็อค' },
                  { icon: '⬇️', title: 'ดาวน์โหลดออฟไลน์', desc: 'ฟังได้ทุกที่ไม่ต้องใช้เน็ต' },
                  { icon: '🎙️', title: 'เสียงคุณภาพสูง', desc: 'เสียงคมชัดระดับ HD' },
                  { icon: '⚡', title: 'ฟังได้ก่อนใคร', desc: 'เข้าถึงตอนใหม่ก่อนทุกคน' },
                  { icon: '🎖️', title: 'Badge พิเศษ', desc: 'แสดงสถานะ Premium ในโปรไฟล์' },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-purple-900/50 flex items-center justify-center text-xl flex-shrink-0">{b.icon}</div>
                    <div>
                      <p className="text-white text-sm font-medium">{b.title}</p>
                      <p className="text-gray-400 text-xs">{b.desc}</p>
                    </div>
                    <span className="ml-auto text-green-400 text-sm">✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel Section */}
            <div className="bg-red-900/10 rounded-2xl border border-red-500/20 p-6">
              <h2 className="text-white font-semibold mb-2">ยกเลิกการสมัครสมาชิก</h2>
              <p className="text-gray-400 text-sm mb-4">หากยกเลิก คุณจะยังสามารถใช้สิทธิ์ Premium ได้จนถึงวันที่ {premiumUntil}</p>
              <button onClick={handleCancel} disabled={cancelling}
                className="px-6 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-sm font-medium transition-all disabled:opacity-50">
                {cancelling ? 'กำลังยกเลิก...' : 'ยกเลิก Premium'}
              </button>
            </div>
          </div>
        ) : (
          /* === หน้าสมัคร Premium === */
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👑</div>
              <h1 className="text-3xl font-bold text-white mb-2">อัปเกรดเป็น Premium</h1>
              <p className="text-gray-400">ปลดล็อคทุกตอน ฟังได้ไม่จำกัด</p>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Monthly */}
              <div className="relative bg-white/5 rounded-2xl border-2 border-purple-500 p-6">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">แนะนำ</div>
                <h3 className="text-white font-bold text-lg mb-1">รายเดือน</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-white">79</span>
                  <span className="text-gray-400">บาท/เดือน</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {['ฟังได้ทุกตอน', 'ไม่มีโฆษณา', 'เสียง HD', 'ยกเลิกได้ทุกเมื่อ'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all">
                  สมัครเดือนละ 79 บาท
                </button>
              </div>

              {/* Yearly */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-white font-bold text-lg mb-1">รายปี</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-white">699</span>
                  <span className="text-gray-400">บาท/ปี</span>
                </div>
                <p className="text-green-400 text-xs mb-4">ประหยัด 249 บาท (26%)</p>
                <ul className="space-y-2 mb-6">
                  {['ฟังได้ทุกตอน', 'ไม่มีโฆษณา', 'เสียง HD', 'ฟังได้ก่อนใคร'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-xl border border-white/20 hover:border-purple-500 text-white font-medium transition-all">
                  สมัครปีละ 699 บาท
                </button>
              </div>
            </div>

            {/* Note */}
            <p className="text-center text-gray-500 text-xs">
              ระบบชำระเงินอยู่ระหว่างพัฒนา — ติดต่อ Admin เพื่อสมัคร Premium
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
