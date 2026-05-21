'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Novel } from '@/types'

export default function HeroBanner({ novels }: { novels: Novel[] }) {
  const [current, setCurrent] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Math.min(novels.length, 4))
    }, 5000)
    return () => clearInterval(timer)
  }, [novels.length])
  const featured = novels[current]
  if (!featured) return null

  return (
    <section className="relative h-[420px] overflow-hidden">
      <div className="absolute inset-0">
        {featured.coverUrl ? (
          <img src={featured.coverUrl} alt={featured.title} className="w-full h-full object-cover opacity-30 sm:opacity-40 transition-all duration-700" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-[#0a0a0f]/60 sm:to-[#0a0a0f]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="max-w-lg">
          <p className="text-xh-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">สัมผัสโลกแห่งการฟังนิยาย</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-3">
            ฟังนิยายเสียงจีน<br />
            <span className="text-purple-400">กำลังภายใน</span>
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed mb-2 max-w-sm">{featured.title}</p>
          <p className="text-gray-400 text-xs leading-relaxed mb-6 max-w-sm line-clamp-2">{featured.description}</p>
          <div className="flex gap-3">
            {featured.episodes[0] && (
              <Link href={`/novels/${featured.id}/episodes/${featured.episodes[0].id}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
                เริ่มฟังเลย
              </Link>
            )}
            <Link href={`/novels/${featured.id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-white text-sm font-medium transition-all">
              <span>☆</span>นิยายยอดนิยม
            </Link>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {novels.slice(0, 4).map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-purple-400' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  )
}
