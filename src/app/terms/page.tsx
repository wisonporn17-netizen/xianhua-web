import Header from '@/components/Header'
import Link from 'next/link'

export const metadata = { title: 'ข้อกำหนดการใช้งาน | เซียนหัว Xianhua' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">ข้อกำหนดการใช้งาน</h1>
        <p className="text-gray-400 text-sm mb-10">อัปเดตล่าสุด: 1 มิถุนายน 2567</p>

        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. การยอมรับข้อกำหนด</h2>
            <p>การใช้งานเว็บไซต์ xianhuanovel.com ("บริการ") ถือว่าท่านยอมรับข้อกำหนดการใช้งานฉบับนี้ทุกประการ หากท่านไม่ยอมรับ กรุณาหยุดใช้งานบริการ</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. บัญชีผู้ใช้</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>ท่านต้องมีอายุ 13 ปีขึ้นไปเพื่อสมัครใช้งาน</li>
              <li>ท่านรับผิดชอบในการรักษาความลับของรหัสผ่าน</li>
              <li>บัญชีไม่สามารถโอนให้ผู้อื่นได้</li>
              <li>เราขอสงวนสิทธิ์ระงับบัญชีที่ละเมิดข้อกำหนด</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. การสมัครสมาชิก Premium</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>สมาชิก Premium มีระยะเวลา 30 วันนับจากวันชำระเงิน</li>
              <li>ไม่มีการต่ออายุอัตโนมัติ ท่านต้องชำระเงินใหม่เมื่อหมดอายุ</li>
              <li>ราคาและแพ็กเกจอาจเปลี่ยนแปลงได้โดยแจ้งล่วงหน้า</li>
              <li>ไม่มีการคืนเงินหลังจากชำระเงินแล้ว ยกเว้นกรณีที่บริการมีปัญหาเกิดจากทางเรา</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. ทรัพย์สินทางปัญญา</h2>
            <p>เนื้อหาทั้งหมดบนเว็บไซต์ รวมถึงนิยาย เสียง รูปภาพ และซอฟต์แวร์ เป็นทรัพย์สินของเซียนหัว Xianhua หรือเจ้าของลิขสิทธิ์ที่เกี่ยวข้อง ห้ามทำซ้ำ ดัดแปลง หรือเผยแพร่โดยไม่ได้รับอนุญาต</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. ข้อห้ามในการใช้งาน</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>ห้าม download หรือบันทึกเสียงนิยายโดยไม่ได้รับอนุญาต</li>
              <li>ห้ามแชร์บัญชีกับผู้อื่น</li>
              <li>ห้ามใช้ bot หรือโปรแกรมอัตโนมัติเพื่อเข้าถึงบริการ</li>
              <li>ห้ามพยายาม bypass ระบบความปลอดภัย</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. การชำระเงิน</h2>
            <p>การชำระเงินดำเนินการผ่าน Omise ซึ่งเป็นผู้ให้บริการชำระเงินที่ได้รับอนุญาตจากธนาคารแห่งประเทศไทย ข้อมูลบัตรของท่านถูกเข้ารหัสและประมวลผลโดย Omise โดยตรง ตามมาตรฐาน PCI DSS</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. การจำกัดความรับผิด</h2>
            <p>เราไม่รับผิดชอบต่อความเสียหายที่เกิดจากการใช้งานหรือไม่สามารถใช้งานบริการได้ รวมถึงความเสียหายทางอ้อมหรือความเสียหายพิเศษใดๆ</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. กฎหมายที่ใช้บังคับ</h2>
            <p>ข้อกำหนดนี้อยู่ภายใต้กฎหมายไทย ข้อพิพาทใดๆ ให้อยู่ในอำนาจของศาลไทย</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. ติดต่อเรา</h2>
            <div className="text-gray-400">
              <p>เซียนหัว Xianhua Audio Novels</p>
              <p>อีเมล: <a href="mailto:support@xianhuanovel.com" className="text-purple-400 hover:underline">support@xianhuanovel.com</a></p>
            </div>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex gap-4 text-sm">
          <Link href="/privacy" className="text-purple-400 hover:underline">นโยบายความเป็นส่วนตัว</Link>
          <Link href="/" className="text-gray-400 hover:text-white">กลับหน้าหลัก</Link>
        </div>
      </div>
    </div>
  )
}
