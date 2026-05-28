'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Props {
  novel: any
  chapter: any
  chapters: any[]
  prev: any
  next: any
}

export default function ReadingView({ novel, chapter, chapters, prev, next }: Props) {
  const [fontSize, setFontSize] = useState(18)
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('readTheme') as any) || 'dark'
    }
    return 'dark'
  })
  const [showChapters, setShowChapters] = useState(false)

  const themes = {
    dark: { bg: 'bg-[#111118]', text: 'text-gray-200', panel: 'bg-[#1a1a2e]' },
    sepia: { bg: 'bg-[#f4e8d0]', text: 'text-[#3d2b1f]', panel: 'bg-[#ede0c8]' },
    light: { bg: 'bg-white', text: 'text-gray-800', panel: 'bg-gray-100' },
  }

  const t = themes[theme]

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} transition-colors duration-300`}>
      {/* Toolbar */}
      <div className={`sticky top-16 z-40 ${t.panel} border-b border-white/10 px-4 py-3`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/novels/${novel.id}`} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
            ← {novel.title}
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setFontSize(f => Math.max(14, f - 2))} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm">A-</button>
            <span className="text-xs text-gray-400 w-8 text-center">{fontSize}</span>
            <button onClick={() => setFontSize(f => Math.min(28, f + 2))} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm">A+</button>
            <div className="flex items-center gap-1 ml-2">
              {(['dark', 'sepia', 'light'] as const).map(th => (
                <button key={th} onClick={() => { setTheme(th); localStorage.setItem('readTheme', th) }}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${theme === th ? 'border-purple-400 scale-110' : 'border-white/20'} ${th === 'dark' ? 'bg-[#111118]' : th === 'sepia' ? 'bg-[#f4e8d0]' : 'bg-white'}`} />
              ))}
            </div>
            <button onClick={() => setShowChapters(!showChapters)} className="ml-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs">☰ สารบัญ</button>
          </div>
        </div>
      </div>

      {/* Chapters Sidebar */}
      {showChapters && (
        <div className="fixed inset-0 z-50" onClick={() => setShowChapters(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className={`absolute right-0 top-0 bottom-0 w-72 ${t.panel} overflow-y-auto`} onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-white/10">
              <h3 className="font-bold">สารบัญ</h3>
              <p className="text-xs text-gray-400">{chapters.length} ตอน</p>
            </div>
            {chapters.map(ch => (
              <Link key={ch.id} href={`/novels/${novel.id}/read/${ch.id}`}
                onClick={() => setShowChapters(false)}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all ${ch.id === chapter.id ? 'bg-purple-600/20 text-purple-300' : ''}`}>
                <span className="text-xs text-gray-500 w-8">ตอน {ch.chapter_num}</span>
                <span className="text-sm truncate">{ch.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <p className="text-purple-400 text-sm mb-2">ตอนที่ {chapter.chapter_num}</p>
          <h1 className="text-2xl md:text-3xl font-bold">{chapter.title}</h1>
          <div className="mt-4 flex justify-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          </div>
        </div>

        <div 
          className="leading-relaxed whitespace-pre-wrap select-none"
          style={{ fontSize: fontSize + 'px', lineHeight: '2', userSelect: 'none', WebkitUserSelect: 'none' }}
          onCopy={e => e.preventDefault()}
          onContextMenu={e => e.preventDefault()}
          onDragStart={e => e.preventDefault()}
        >
          {chapter.content}
        </div>

        <div className="flex gap-4 mt-16 pt-8 border-t border-white/10">
          {prev ? (
            <Link href={`/novels/${novel.id}/read/${prev.id}`}
              className="flex-1 flex items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
              <span>←</span>
              <div><p className="text-xs text-gray-400">ตอนก่อนหน้า</p><p className="text-sm font-medium truncate">{prev.title}</p></div>
            </Link>
          ) : <div className="flex-1" />}
          {next ? (
            <Link href={`/novels/${novel.id}/read/${next.id}`}
              className="flex-1 flex items-center justify-end gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-right">
              <div><p className="text-xs text-gray-400">ตอนถัดไป</p><p className="text-sm font-medium truncate">{next.title}</p></div>
              <span>→</span>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </div>
    </div>
  )
}
