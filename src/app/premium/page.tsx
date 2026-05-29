'use client'
import { useState } from 'react'
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

const PROMPTPAY = '0849978369'
const ACCOUNT_NAME = 'วิสันต์ สว่างสุข'

export default function PremiumPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [step, setStep] = useState<'select' | 'payment' | 'slip' | 'done'>('select')
  const [slip, setSlip] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const plan = PLANS.find(p => p.id === selected)
  const qrUrl = plan ? `https://promptpay.io/${PROMPTPAY}/${plan.price}` : ''

  const handleSlipUpload = async () => {
    if (!slip || !selected) return
    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }
    const ext = slip.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('slips').upload(fileName, slip)
    if (uploadError) { alert('อัปโหลดสลิปไม่สำเร็จ'); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('slips').getPublicUrl(fileName)
    await supabase.from('subscriptions').insert({
      user_id: user.id, plan: selected, status: 'pending', slip_url: urlData.publicUrl,
    })
    setStep('done')
    setUploading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">✨ สมัครสมาชิก</h1>
          <p className="text-gray-400">เลือกแพ็กเกจที่เหมาะกับคุณ</p>
        </div>

        {step === 'select' && (
          <div className="grid md:grid-cols-2 gap-6">
            {PLANS.map(p => (
              <div key={p.id} onClick={() => setSelected(p.id)}
                className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all ${selected === p.id ? 'border-purple-400 scale-105' : 'border-white/10 hover:border-white/30'} bg-white/5`}>
                {p.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">แนะนำ</div>
                )}
                <div className={`text-2xl font-bold bg-gradient-to-r ${p.color} bg-clip-text text-transparent mb-1`}>{p.name}</div>
                <div className="text-3xl font-bold text-white mb-4">{p.price} <span className="text-sm text-gray-400">บาท/เดือน</span></div>
                <ul className="space-y-2">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span> {f}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="md:col-span-2">
              <button onClick={() => selected && setStep('payment')} disabled={!selected}
                className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg transition-all">
                ดำเนินการต่อ →
              </button>
            </div>
          </div>
        )}

        {step === 'payment' && plan && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
            <p className="text-gray-400 mb-6">สแกน QR Code เพื่อชำระเงิน {plan.price} บาท</p>
            <div className="flex justify-center mb-4">
              <img src={qrUrl} alt="PromptPay QR" className="w-64 h-64 rounded-2xl bg-white p-2" />
            </div>
            <p className="text-gray-400 text-sm mb-1">ชื่อบัญชี: <span className="text-white font-medium">{ACCOUNT_NAME}</span></p>
            <p className="text-gray-400 text-sm mb-8">เบอร์: <span className="text-white font-medium">{PROMPTPAY}</span></p>
            <button onClick={() => setStep('slip')}
              className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all">
              โอนแล้ว อัปโหลดสลิป →
            </button>
          </div>
        )}

        {step === 'slip' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">ส่งสลิปทาง LINE</h2>
            <p className="text-gray-400 mb-8">ส่งสลิปการโอนมาที่ LINE OA ของเรา ทีมงานจะเปิดใช้งานภายใน 24 ชั่วโมง</p>
            <div className="text-6xl mb-6">💬</div>
            <a href="https://line.me/R/ti/p/@155grmlw" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#06C755] hover:bg-[#05a847] text-white font-bold text-lg transition-all">
              ส่งสลิปทาง LINE @155grmlw
            </a>
            <p className="text-gray-500 text-sm mt-4">กรุณาระบุ: ชื่อ-นามสกุล และแพ็กเกจที่เลือก</p>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">ส่งสลิปเรียบร้อยแล้ว!</h2>
            <p className="text-gray-400 mb-8">ทีมงานจะตรวจสอบและเปิดใช้งานภายใน 24 ชั่วโมง</p>
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
