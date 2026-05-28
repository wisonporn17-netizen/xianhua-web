'use client'
import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '@/context/PlayerContext'

const BG_MUSIC_URL = 'https://pub-8fca2b7c08c44b409a2ad87721377e05.r2.dev/Noval%20Xinhua/Jade%20Gate%20Overture%20(1).wav'

export default function BgMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { isPlaying } = usePlayer()
  const [bgPlaying, setBgPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)

  useEffect(() => {
    const audio = new Audio(BG_MUSIC_URL)
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio

    // autoplay หลัง user interaction ครั้งแรก
    const tryPlay = () => {
      audio.play().then(() => setBgPlaying(true)).catch(() => {})
    }
    document.addEventListener('click', tryPlay, { once: true })
    tryPlay()

    return () => {
      audio.pause()
      audio.src = ''
      document.removeEventListener('click', tryPlay)
    }
  }, [])

  // หยุดเมื่อเล่น audio นิยาย, กลับมาเล่นเมื่อหยุด
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setBgPlaying(false)
    } else {
      audio.play().then(() => setBgPlaying(true)).catch(() => {})
    }
  }, [isPlaying])

  // sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-2 border border-white/10">
      <button
        onClick={() => {
          const audio = audioRef.current
          if (!audio) return
          if (bgPlaying) { audio.pause(); setBgPlaying(false) }
          else { audio.play().then(() => setBgPlaying(true)).catch(() => {}) }
        }}
        className="text-white/70 hover:text-white transition-colors text-sm"
      >
        {bgPlaying ? '🎵' : '🔇'}
      </button>
      <input
        type="range" min="0" max="1" step="0.05"
        value={volume}
        onChange={e => setVolume(parseFloat(e.target.value))}
        className="w-16 accent-purple-500"
      />
    </div>
  )
}
