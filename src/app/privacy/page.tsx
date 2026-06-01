import Header from '@/components/Header'
import Link from 'next/link'

export const metadata = { title: 'นโยบายความเป็นส่วนตัว | เซียนหัว Xianhua' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">นโยบายความเป็นส่วนตัว</h1>
        <p className="text-gray-400 text-sm mb-10">อัปเดตล่าสุด: 1 มิถุนายน 2567</p>

        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. ข้อมูลที่เราเก็บรวบรวม</h2>
            <p>เราเก็บรวบรวมข้อมูลที่จำเป็นสำหรับการให้บริการ ได้แก่:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>ชื่อและอีเมลที่ใช้สมัครสมาชิก</li>
              <li>ประวัติการชำระเงินและแพ็กเกจที่สมัคร</li>
              <li>ประวัติการฟังและอ่านนิยาย เพื่อบันทึกความคืบหน้า</li>
              <li>ข้อมูลอุปกรณ์และ IP address สำหรับความปลอดภัย</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. การใช้ข้อมูล</h2>
            <p>เราใช้ข้อมูลของท่านเพื่อ:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>ให้บริการฟังและอ่านนิยายตามสิทธิ์ที่ท่านมี</li>
              <li>ประมวลผลการชำระเงินผ่านระบบ Omise</li>
              <li>ส่งอีเมลแจ้งเตือนการต่ออายุสมาชิก</li>
              <li>ปรับปรุงบริการและประสบการณ์ของผู้ใช้</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. การแชร์ข้อมูลกับบุคคลที่สาม</h2>
            <p>เราไม่ขายข้อมูลส่วนตัวของท่านให้กับบุคคลที่สาม เราแชร์ข้อมูลเฉพาะกับ:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li><strong className="text-white">Omise</strong> — ผู้ให้บริการชำระเงิน เพื่อประมวลผลธุรกรรม</li>
              <li><strong className="text-white">Supabase</strong> — ผู้ให้บริการฐานข้อมูลและการยืนยันตัวตน</li>
              <li><strong className="text-white">Vercel</strong> — ผู้ให้บริการ hosting เว็บไซต์</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. การรักษาความปลอดภัย</h2>
            <p>เราใช้มาตรการรักษาความปลอดภัยมาตรฐานอุตสาหกรรม รวมถึงการเข้ารหัส SSL/TLS และการจัดการสิทธิ์การเข้าถึงข้อมูลอย่างเข้มงวด ข้อมูลบัตรเครดิตของท่านถูกประมวลผลโดย Omise โดยตรง เราไม่มีการจัดเก็บข้อมูลบัตรไว้ในระบบของเรา</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. สิทธิ์ของผู้ใช้</h2>
            <p>ท่านมีสิทธิ์:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>ขอดู แก้ไข หรือลบข้อมูลส่วนตัวของท่าน</li>
              <li>ยกเลิกการรับอีเมลแจ้งเตือน</li>
              <li>ลบบัญชีผู้ใช้ของท่าน</li>
            </ul>
            <p className="mt-2">กรุณาติดต่อเราที่ <a href="mailto:support@xianhuanovel.com" className="text-purple-400 hover:underline">support@xianhuanovel.com</a> เพื่อใช้สิทธิ์ดังกล่าว</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. คุกกี้</h2>
            <p>เราใช้คุกกี้เพื่อเก็บข้อมูล session การเข้าสู่ระบบและการตั้งค่าของผู้ใช้ การใช้งานเว็บไซต์ของเราถือว่าท่านยินยอมการใช้คุกกี้ดังกล่าว</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. การเปลี่ยนแปลงนโยบาย</h2>
            <p>เราอาจปรับปรุงนโยบายนี้เป็นครั้งคราว การเปลี่ยนแปลงที่สำคัญจะแจ้งให้ท่านทราบผ่านอีเมลหรือประกาศบนเว็บไซต์</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. ติดต่อเรา</h2>
            <p>หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว กรุณาติดต่อ:</p>
            <div className="mt-2 text-gray-400">
              <p>เซียนหัว Xianhua Audio Novels</p>
              <p>อีเมล: <a href="mailto:support@xianhuanovel.com" className="text-purple-400 hover:underline">support@xianhuanovel.com</a></p>
            </div>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex gap-4 text-sm">
          <Link href="/terms" className="text-purple-400 hover:underline">ข้อกำหนดการใช้งาน</Link>
          <Link href="/" className="text-gray-400 hover:text-white">กลับหน้าหลัก</Link>
        </div>
      </div>
    </div>
  )
}
