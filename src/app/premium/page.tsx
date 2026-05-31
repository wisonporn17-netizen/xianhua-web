'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { PromptPayIcon, VisaIcon, MastercardIcon, TrueMoneyIcon } from '@/components/PaymentIcons'

const PLANS = [
  {
    id: 'audio',
    name: '🎧 แพ็กเกจฟังนิยาย',
    price: 99,
    features: ['ฟังนิยายเสียงทุกเรื่อง', 'ทุกตอนไม่มีโฆษณา', 'รองรับทุกอุปกรณ์'],
    recommended: false,
  },
  {
    id: 'all',
    name: '📖 แพ็กเกจครบวงจร',
    price: 149,
    features: ['ทุกอย่างในแพ็กเกจฟัง', 'อ่านนิยายทุกเรื่อง', 'ทุกตอนไม่จำกัด'],
    recommended: true,
  },
]

declare global {
  interface Window { OmiseCard: any }
}

export default function PremiumPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [step, setStep] = useState<'select' | 'payment' | 'done'>('select')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [payMethod, setPayMethod] = useState<'promptpay' | 'card' | 'truemoney'>('promptpay')
  const [tmPhone, setTmPhone] = useState('')
  const [tmError, setTmError] = useState('')
  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const plan = PLANS.find(p => p.id === selected)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.omise.co/omise.js'
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

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

  const handleCard = async () => {
    if (!selected) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }
    window.OmiseCard.configure({
      publicKey: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || '',
    })
    window.OmiseCard.open({
      frameLabel: 'เซียนหัว Xianhua',
      submitLabel: `ชำระ ${plan?.price} บาท`,
      currency: 'THB',
      amount: (plan?.price || 0) * 100,
      onCreateTokenSuccess: async (token: string) => {
        setLoading(true)
        const res = await fetch('/api/payment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, plan: selected, userId: user.id }),
        })
        const data = await res.json()
        setLoading(false)
        if (data.success) setStep('done')
        else alert('ชำระเงินไม่สำเร็จ: ' + (data.error || 'กรุณาลองใหม่'))
      },
    })
  }

  const handleTrueMoney = async () => {
    if (!selected) return
    const phone = tmPhone.replace(/\D/g, '')
    if (phone.length !== 10) { setTmError('กรุณาใส่เบอร์โทรศัพท์ 10 หลัก'); return }
    setTmError('')
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }
    const res = await fetch('/api/payment/truemoney', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: selected, userId: user.id, phone }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.authorizeUri) {
      window.location.href = data.authorizeUri
    } else {
      setTmError('เกิดข้อผิดพลาด: ' + (data.error || 'กรุณาลองใหม่'))
    }
  }

  useEffect(() => {
    if (step !== 'payment' || payMethod !== 'promptpay') return
    setChecking(true)
    pollRef.current = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles').select('is_premium').eq('id', user.id).single()
      if (profile?.is_premium) {
        clearInterval(pollRef.current!)
        setChecking(false)
        setStep('done')
      }
    }, 4000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [step, payMethod])

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
                {p.recommended && <div className="text-xs text-yellow-400 font-bold mb-2">⭐ แนะนำ</div>}
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

            <div className="md:col-span-2 mt-2">
              <p className="text-gray-400 text-sm mb-3 text-center">เลือกวิธีชำระเงิน</p>
              <div className="grid grid-cols-3 gap-3 mb-4">

                {/* PromptPay */}
                <button onClick={() => setPayMethod('promptpay')}
                  className={['py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1',
                    payMethod === 'promptpay' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'
                  ].join(' ')}>
                  <PromptPayIcon size={28} />
                  <span className="text-xs text-gray-300 font-medium">PromptPay</span>
                </button>

                {/* บัตรเครดิต */}
                <button onClick={() => setPayMethod('card')}
                  className={['py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1',
                    payMethod === 'card' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'
                  ].join(' ')}>
                  <div className="flex items-center gap-1">
                    <VisaIcon size={28} />
                    <MastercardIcon size={22} />
                  </div>
                  <span className="text-xs text-gray-300 font-medium">บัตรเครดิต</span>
                </button>

                {/* TrueMoney */}
                <button onClick={() => setPayMethod('truemoney')}
                  className={['py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1',
                    payMethod === 'truemoney' ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'
                  ].join(' ')}>
                  <TrueMoneyIcon size={28} />
                  <span className="text-xs text-gray-300 font-medium">TrueMoney</span>
                </button>

              </div>

              {payMethod === 'truemoney' && (
                <div className="mb-4">
                  <input
                    type="tel"
                    value={tmPhone}
                    onChange={e => setTmPhone(e.target.value)}
                    placeholder="เบอร์โทรที่ผูก TrueMoney (เช่น 0812345678)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm"
                  />
                  {tmError && <p className="text-red-400 text-xs mt-1">{tmError}</p>}
                </div>
              )}

              <button
                onClick={payMethod === 'promptpay' ? handlePromptPay : payMethod === 'card' ? handleCard : handleTrueMoney}
                disabled={!selected || loading}
                className={['w-full py-4 rounded-xl disabled:opacity-40 text-white font-bold text-lg transition-all',
                  payMethod === 'truemoney' ? 'bg-orange-600 hover:bg-orange-500' :
                  payMethod === 'card' ? 'bg-purple-600 hover:bg-purple-500' :
                  'bg-blue-700 hover:bg-blue-600'
                ].join(' ')}>
                {loading ? 'กำลังดำเนินการ...' :
                  payMethod === 'promptpay' ? '📱 จ่ายด้วย PromptPay →' :
                  payMethod === 'card' ? '💳 จ่ายด้วยบัตร →' :
                  '🧡 จ่ายด้วย TrueMoney →'}
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
