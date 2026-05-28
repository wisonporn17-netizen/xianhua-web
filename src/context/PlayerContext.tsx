'use client'
import { getSignedAudioUrl } from '@/lib/getSignedUrl'
import { createContext, useContext, useState, useRef, useEffect } from 'react'

interface Track {
  novelId: string
  episodeId: string
  title: string
  novelTitle: string
  coverUrl?: string
  audioUrl: string
}

interface PlayerContextType {
  track: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  isLoading: boolean
  play: (track: Track, startTime?: number) => void
  togglePlay: () => void
  seek: (time: number) => void
  skip: (seconds: number) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime))
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration))
    audio.addEventListener('canplay', () => setIsLoading(false))
    audio.addEventListener('waiting', () => setIsLoading(true))
    audio.addEventListener('playing', () => setIsLoading(false))
    audio.addEventListener('ended', () => setIsPlaying(false))
    return () => { audio.pause(); audio.src = '' }
  }, [])

  const play = async (newTrack: Track, startTime?: number) => {
    const audio = audioRef.current
    if (!audio) return

    // ถ้าเป็น track เดียวกัน แค่กดเล่น
    if (track?.episodeId === newTrack.episodeId && audio.src) {
      audio.play()
      setIsPlaying(true)
      return
    }

    setIsLoading(true)
    setTrack(newTrack)
    const signedUrl = await getSignedAudioUrl(newTrack.audioUrl)
    setCurrentTime(startTime || 0)
    audio.src = signedUrl

    const onReady = () => {
      if (startTime && startTime > 0) audio.currentTime = startTime
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }

    audio.addEventListener('loadedmetadata', onReady, { once: true })
    audio.load()
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) { audio.pause(); setIsPlaying(false) }
    else { audio.play(); setIsPlaying(true) }
  }

  const seek = (time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
    setCurrentTime(time)
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration)
  }

  return (
    <PlayerContext.Provider value={{ track, isPlaying, currentTime, duration, isLoading, play, togglePlay, seek, skip }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
