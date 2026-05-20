'use client'
import { usePlayer } from '@/context/PlayerContext'
import { formatTime } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MiniPlayer() {
  const { track, isPlaying, currentTime, duration, togglePlay, seek, skip } = usePlayer()
  const pathname = usePathname()

  if (!track) return null
  if (pathname?.includes('/episodes/')) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#13131f]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
      <div className="relative h-0.5 bg-white/10 cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          seek(((e.clientX - rect.left) / rect.width) * duration)
        }}>
        <div className="h-full bg-purple-500 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link href={`/novels/${track.novelId}/episodes/${track.episodeId}`} className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
            {track.coverUrl ? (
              <Image src={track.coverUrl} alt={track.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-purple-900 flex items-center justify-center text-purple-300">✦</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{track.title}</p>
            <p className="text-gray-400 text-xs truncate">{track.novelTitle}</p>
          </div>
        </Link>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={() => skip(-10)} className="text-gray-400 hover:text-white transition-colors hidden sm:block">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.83"/>
            </svg>
          </button>
          <button onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white transition-all">
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1.5"/>
                <rect x="14" y="4" width="4" height="16" rx="1.5"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5 translate-x-0.5" fill="currentColor">
                <path d="M8 5.14v14l11-7-11-7z"/>
              </svg>
            )}
          </button>
          <button onClick={() => skip(10)} className="text-gray-400 hover:text-white transition-colors hidden sm:block">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-3.83"/>
            </svg>
          </button>
        </div>

        <div className="text-gray-400 text-xs font-mono hidden sm:block flex-shrink-0">
          {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '--:--'}
        </div>
      </div>
    </div>
  )
}
