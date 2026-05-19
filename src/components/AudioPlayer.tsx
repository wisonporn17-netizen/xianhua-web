'use client';

import { useState, useRef, useEffect } from 'react';
import { formatTime } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  coverUrl?: string;
  novelId?: string;
  episodeId?: string;
}

export default function AudioPlayer({ audioUrl, title, coverUrl, novelId, episodeId }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDragging = useRef(false);
  const historyId = useRef<string | null>(null);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => { if (!isDragging.current) setCurrentTime(audio.currentTime); };
    const onLoadedMetadata = () => { setDuration(audio.duration); setIsLoading(false); };
    const onCanPlay = () => setIsLoading(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onEnded = () => setIsPlaying(false);
    const onError = () => { setError('ไม่สามารถโหลดไฟล์เสียงได้'); setIsLoading(false); };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // โหลด position ที่หยุดไว้
  useEffect(() => {
    if (!novelId || !episodeId) return;
    const loadPosition = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data } = await supabase
        .from('listening_history')
        .select('id, playback_position')
        .eq('user_id', userData.user.id)
        .eq('episode_id', episodeId)
        .order('listened_at', { ascending: false })
        .limit(1)
        .single();
      if (data && data.playback_position > 0) {
        historyId.current = data.id;
        const audio = audioRef.current;
        if (audio) audio.currentTime = data.playback_position;
        setCurrentTime(data.playback_position);
      }
    };
    loadPosition();
  }, [novelId, episodeId]);

  const recordHistory = async () => {
    if (!novelId || !episodeId) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data } = await supabase.from('listening_history').insert({
      user_id: userData.user.id,
      novel_id: novelId,
      episode_id: episodeId,
      playback_position: audioRef.current?.currentTime || 0,
    }).select().single();
    if (data) historyId.current = data.id;
  };

  const savePosition = async () => {
    if (!historyId.current || !audioRef.current) return;
    await supabase.from('listening_history')
      .update({ playback_position: audioRef.current.currentTime })
      .eq('id', historyId.current);
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      await savePosition();
      if (saveTimer.current) clearInterval(saveTimer.current);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        if (!historyId.current) await recordHistory();
        // บันทึก position ทุก 10 วินาที
        saveTimer.current = setInterval(savePosition, 10000);
      } catch { setError('ไม่สามารถเล่นไฟล์เสียงได้'); }
    }
  };

  const handleSeekInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    isDragging.current = true;
    setCurrentTime(Number(e.target.value));
  };

  const commitSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
    isDragging.current = false;
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration || 0);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="bg-xh-card rounded-3xl p-8 border border-xh-border shadow-2xl shadow-xh-purple/10">
        <div className="flex justify-center mb-6">
          {coverUrl ? (
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-lg"
              style={{ boxShadow: isPlaying ? '0 0 40px rgba(139,92,246,0.5)' : '0 0 20px rgba(139,92,246,0.2)', transition: 'box-shadow 0.5s' }}>
              <Image src={coverUrl} alt={title} fill className="object-cover" />
              {isPlaying && <span className="absolute inset-0 rounded-2xl border-2 border-xh-purple/40 animate-ping" />}
            </div>
          ) : (
            <div className="relative w-28 h-28 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(circle at 35% 35%, #A78BFA, #5B21B6 60%, #2D1B4E)', boxShadow: isPlaying ? '0 0 40px rgba(139,92,246,0.5)' : '0 0 20px rgba(139,92,246,0.2)', transition: 'box-shadow 0.5s' }}>
              <span className="text-xh-gold text-4xl select-none">✦</span>
              {isPlaying && <span className="absolute inset-0 rounded-full border-2 border-xh-purple/40 animate-ping" />}
            </div>
          )}
        </div>

        <p className="text-xh-gold text-xs text-center tracking-[0.2em] uppercase mb-1 font-medium">
          {isPlaying ? '▶ กำลังเล่น' : '—— หยุดชั่วคราว ——'}
        </p>
        <h2 className="text-white text-center font-semibold text-base leading-snug mb-8 px-2 line-clamp-2">{title}</h2>

        {error ? (
          <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 text-red-300 text-center text-sm">{error}</div>
        ) : (
          <>
            <div className="mb-6">
              <input type="range" className="audio-slider" min={0} max={duration || 100} step={0.5} value={currentTime}
                onChange={handleSeekInput}
                onMouseUp={(e) => commitSeek(Number(e.currentTarget.value))}
                onTouchEnd={(e) => commitSeek(Number((e.currentTarget as HTMLInputElement).value))}
                style={{ background: `linear-gradient(to right, #8B5CF6 ${progress}%, #2D1B4E ${progress}%)` }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8">
              <button onClick={() => skip(-10)} className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-xh-purple2 active:scale-95 transition-all">
                <div className="w-11 h-11 rounded-full border border-xh-border hover:border-xh-purple/50 flex items-center justify-center transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.83" /></svg>
                </div>
                <span className="text-[11px] font-medium">-10s</span>
              </button>

              <button onClick={togglePlay} disabled={isLoading}
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-white transition-all active:scale-95 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', boxShadow: '0 4px 24px rgba(109,40,217,0.5)' }}>
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.5" /><rect x="14" y="4" width="4" height="16" rx="1.5" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-7 h-7 translate-x-0.5" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
                )}
              </button>

              <button onClick={() => skip(10)} className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-xh-purple2 active:scale-95 transition-all">
                <div className="w-11 h-11 rounded-full border border-xh-border hover:border-xh-purple/50 flex items-center justify-center transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-.49-3.83" /></svg>
                </div>
                <span className="text-[11px] font-medium">+10s</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
