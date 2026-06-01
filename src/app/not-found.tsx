import Link from 'next/link'
import Header from '@/components/Header'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="text-8xl mb-6">⚔️</div>
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <p className="text-xl text-purple-400 font-semibold mb-4">หน้านี้ไม่มีในภพนี้</p>
        <p className="text-gray-500 mb-10 max-w-md">
          เส้นทางที่ท่านเดินทางมานั้นไม่มีอยู่จริง หรืออาจถูกลบออกไปแล้ว กรุณากลับสู่หน้าหลัก
        </p>
        <Link href="/"
          className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all">
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  )
}
