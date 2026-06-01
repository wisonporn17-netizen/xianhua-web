import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© 2569 เซียนหัว Xianhua Audio Novels</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</Link>
          <Link href="/terms" className="hover:text-white transition-colors">ข้อกำหนดการใช้งาน</Link>
          <a href="mailto:support@xianhuanovel.com" className="hover:text-white transition-colors">ติดต่อเรา</a>
        </div>
      </div>
    </footer>
  )
}
