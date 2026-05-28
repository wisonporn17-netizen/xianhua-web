'use client'
import { useState } from 'react'
import Link from 'next/link'

const PER_PAGE = 50

export default function ChapterList({ novelId, chapters }: { novelId: string, chapters: any[] }) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(chapters.length / PER_PAGE)
  const visible = chapters.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  return (
    <div id="read-section" className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden mt-6">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <h2 className="text-white font-semibold">📖 อ่านนิยาย</h2>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{chapters.length} บท</span>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${page === i ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
                {i * PER_PAGE + 1}–{Math.min((i + 1) * PER_PAGE, chapters.length)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="divide-y divide-white/5">
        {visible.map((chapter: any) => (
          <Link key={chapter.id} href={`/novels/${novelId}/read/${chapter.id}`}
            className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all group">
            <div className="w-8 text-center text-gray-500 text-sm font-mono group-hover:hidden">
              {String(chapter.chapter_num).padStart(2, '0')}
            </div>
            <div className="w-8 hidden group-hover:flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-400" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition-colors">{chapter.title}</p>
            </div>
            {chapter.is_free ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-600/20 text-green-400 border border-green-500/30 flex-shrink-0">ฟรี</span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 flex-shrink-0">🔒</span>
            )}
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-600 group-hover:text-purple-400 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
