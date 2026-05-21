'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Novel {
  id: string
  title: string
  subtitle: string
  coverUrl?: string
  episodes: any[]
}

interface Props {
  novels: Novel[]
  playMap: Record<string, number>
}

const accentMap = [
  'from-yellow-300 to-yellow-600',
  'from-slate-300 to-slate-500', 
  'from-amber-500 to-amber-800',
]

export default function TopThreeCards({ novels, playMap }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  // จัด order: 2, 1, 3
  const display = novels.slice(0, 3)
  const ranks = [1, 2, 3]

  return (
    <div className="grid items-end gap-6 md:grid-cols-3">
      {display.map((novel, i) => {
        const rank = ranks[i]
        const isFirst = rank === 1
        const isHovered = hovered === i
        const otherHovered = hovered !== null && hovered !== i

        // ถ้า hover การ์ดอื่น → หดลงเท่ากันหมด
        // ถ้า hover การ์ดนี้ → ใหญ่ขึ้น
        const scale = isHovered
          ? 'scale-110 z-20'
          : otherHovered
          ? 'scale-95 opacity-80'
          : 'scale-100'

        const height = isHovered
          ? 'h-[420px]'
          : isFirst && !otherHovered
          ? 'h-[400px]'
          : 'h-[360px]'

        const border = isHovered
          ? 'border-yellow-400/70 shadow-[0_0_50px_rgba(250,204,21,.3)]'
          : isFirst && !otherHovered
          ? 'border-yellow-400/70 shadow-[0_0_50px_rgba(250,204,21,.22)]'
          : 'border-white/10'

        const firstEp = novel.episodes[0]

        return (
          <article key={novel.id}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`group relative overflow-hidden rounded-3xl border bg-white/[0.06] transition-all duration-300 cursor-pointer ${scale} ${border}`}>

            {novel.coverUrl && (
              <img src={novel.coverUrl} alt={novel.title}
                className={`w-full object-cover transition-all duration-300 group-hover:scale-105 ${height}`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080811] via-[#080811]/45 to-transparent" />

            {/* Shield Badge */}
            <div className="absolute left-5 top-5 flex flex-col items-center">
              {rank === 1 && <div className="text-yellow-300 text-xl mb-0.5">★</div>}
              <div className={`flex h-14 w-14 items-center justify-center text-2xl font-black text-white shadow-2xl bg-gradient-to-b ${accentMap[rank - 1]}`}
                style={{ clipPath: 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)' }}>
                {rank}
              </div>
            </div>

            {/* Episode count */}
            <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-2 text-sm text-white backdrop-blur-md">
              ▶ {novel.episodes.length} ตอน
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className={`font-bold text-white ${isFirst ? 'text-2xl' : 'text-xl'}`}>{novel.title}</h3>
              {novel.subtitle && <p className="mt-1 text-purple-300 text-sm">{novel.subtitle}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span>⭐ 4.{5 + (rank % 3)}</span>
                <span>📖 {novel.episodes.length} ตอน</span>
                {(playMap[novel.id] || 0) > 0 && (
                  <span>🎧 {playMap[novel.id]} ครั้ง</span>
                )}
              </div>
              {isFirst && firstEp ? (
                <Link href={`/novels/${novel.id}/episodes/${firstEp.id}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 px-7 py-3.5 font-bold text-white shadow-[0_0_30px_rgba(168,85,247,.45)] hover:scale-105 transition">
                  ▶ ฟังตอนล่าสุด
                </Link>
              ) : firstEp ? (
                <Link href={`/novels/${novel.id}/episodes/${firstEp.id}`}
                  className="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full border border-purple-300/40 bg-purple-600/30 text-white backdrop-blur-md hover:bg-purple-500 transition">
                  ▶
                </Link>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}
