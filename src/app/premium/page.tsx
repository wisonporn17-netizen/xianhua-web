'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

const PLANS = [
  {
    id: 'audio',
    name: '🎧 แพ็กเกจฟังนิยาย',
    price: 99,
    features: ['ฟังนิยายเสียงทุกเรื่อง', 'ทุกตอนไม่มีโฆษณา', 'รองรับทุกอุปกรณ์'],
    color: 'from-purple-600 to-purple-800',
    recommended: false,
  },
  {
    id: 'all',
    name: '📖 แพ็กเกจครบวงจร',
    price: 149,
    features: ['ทุกอย่างในแพ็กเกจฟัง', 'อ่านนิยายทุกเรื่อง', 'ทุกตอนไม่จำกัด'],
    color: 'from-yellow-600 to-orange-700',
    recommended: true,
  },
]

export default function PremiumPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [step, setStep] = useState<'select' | 'payment' | 'done'>('select')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const plan = PLANS.find(p => p.id === selected)

  const handlePromptPay = async () => {
    if (!selected) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }
    const res = await fetch('/api/payment/promptpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: selected, userId: user.id }),
    })
    const data = await res.json()
    if (data.qrCode) setQrCode(data.qrCode)
    setLoading(false)
    setStep('payment')
  }

  // polling เช็ค premium ทุก 4 วินาที
  useEffect(() => {
    if (step !== 'payment') return
    setChecking(true)
    pollRef.current = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single()
      if (profile?.is_premium) {
        clearInterval(pollRef.current!)
        setChecking(false)
        setStep('done')
      }
    }, 4000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [step])

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">✨ สมัครสมาชิก</h1>
          <p className="text-gray-400">เลือกแพ็กเกจที่เหมาะกับคุณ</p>
        </div>

        {step === 'select' && (
          <div className="grid md:grid-cols-2 gap-6">
            {PLANS.map(p => (
              <div key={p.id} onClick={() => setSelected(p.id)}
                className={['rounded-2xl p-6 cursor-pointer border-2 transition-all',
                  selected === p.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'
                ].join(' ')}>
                {p.recommended && (
                  <div className="text-xs text-yellow-400 font-bold mb-2">⭐ แนะนำ</div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                <div className="text-3xl font-bold text-white mb-4">{p.price}<span className="text-base font-normal text-gray-400"> บาท/เดือน</span></div>
                <ul className="space-y-2 mb-4">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="text-green-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="md:col-span-2">
              <button onClick={handlePromptPay} disabled={!selected || loading}
                className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-lg transition-all">
                {loading ? 'กำลังสร้าง QR...' : '📱 จ่ายด้วย PromptPay →'}
              </button>
            </div>
          </div>
        )}

        {step === 'payment' && plan && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
            <p className="text-gray-400 mb-6">สแกน QR Code เพื่อชำระเงิน {plan.price} บาท</p>
            {qrCode ? (
              <div className="flex justify-center mb-6">
                <img src={qrCode} alt="PromptPay QR" className="w-64 h-64 rounded-2xl bg-white p-2" />
              </div>
            ) : (
              <div className="w-64 h-64 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <p className="text-gray-400">กำลังโหลด QR...</p>
              </div>
            )}
            {checking ? (
              <p className="text-gray-400 text-sm mb-8 animate-pulse">⏳ กำลังรอการยืนยันการชำระเงิน...</p>
            ) : (
              <p className="text-gray-400 text-sm mb-8">ระบบจะเปิดใช้งานอัตโนมัติหลังชำระเงิน</p>
            )}
            <button onClick={() => setStep('done')}
              className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all">
              ชำระเงินแล้ว ✓
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">ยินดีต้อนรับสู่ Premium!</h2>
            <p className="text-gray-400 mb-8">เปิดใช้งานเรียบร้อยแล้ว เพลิดเพลินกับทุกเนื้อหาได้เลย</p>
            <button onClick={() => router.push('/')}
              className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all">
              กลับหน้าหลัก
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
