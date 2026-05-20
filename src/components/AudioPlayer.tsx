'use client';

import { useEffect, useRef } from 'react';
import { formatTime } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { usePlayer } from '@/context/PlayerContext';
import Image from 'next/image';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  coverUrl?: string;
  novelId?: string;
  episodeId?: string;
  novelTitle?: string;
}

export default function AudioPlayer({ audioUrl, title, coverUrl, novelId, episodeId, novelTitle }: AudioPlayerProps) {
  const { track, isPlaying, currentTime, duration, isLoading, play, togglePlay, seek, skip } = usePlayer();
  const userIdRef = useRef<string | null>(null);
  const currentTimeRef = useRef(0);

  // sync currentTime ไปยัง ref เพื่อใช้ใน timer
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  // โหลด user id
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      userIdRef.current = data.user?.id || null;
    });
  }, []);

  // โหลดและเล่น
  useEffect(() => {
    if (!novelId || !episodeId || !novelTitle) return;
    if (track?.episodeId === episodeId) return;

    const loadAndPlay = async () => {
      const { data: userData } = await supabase.auth.getUser();
      let startTime = 0;
      if (userData.user) {
        userIdRef.current = userData.user.id;
        const { data } = await supabase
          .from('listening_history')
          .select('playback_position')
          .eq('user_id', userData.user.id)
          .eq('episode_id', episodeId)
          .single();
        if (data?.playback_position > 5) startTime = data.playback_position;
      }
      play({ novelId, episodeId, title, novelTitle, coverUrl, audioUrl }, startTime);
    };
    loadAndPlay();
  }, [episodeId]);

  // บันทึก position ทุก 5 วินาที — ไม่มี currentTime ใน dependency
  useEffect(() => {
    if (!isPlaying || !novelId || !episodeId) return;
    if (track?.episodeId !== episodeId) return;
    if (!userIdRef.current) return;

    const timer = setInterval(async () => {
      const pos = currentTimeRef.current;
      if (pos < 1) return;
      await supabase.from('listening_history').upsert({
        user_id: userIdRef.current,
        novel_id: novelId,
        episode_id: episodeId,
        playback_position: pos,
        listened_at: new Date().toISOString(),
      }, { onConflict: 'user_id,episode_id' });
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, episodeId, track?.episodeId]);

  const isCurrentTrack = track?.episodeId === episodeId;
  const displayTime = isCurrentTrack ? currentTime : 0;
  const displayDuration = isCurrentTrack ? duration : 0;
  const playing = isCurrentTrack && isPlaying;
  const loading = isCurrentTrack && isLoading;
  const progress = displayDuration > 0 ? (displayTime / displayDuration) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-xh-card rounded-3xl p-8 border border-xh-border shadow-2xl shadow-xh-purple/10">
        <div className="flex justify-center mb-6">
          {coverUrl ? (
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-lg"
              style={{ boxShadow: playing ? '0 0 40px rgba(139,92,246,0.5)' : '0 0 20px rgba(139,92,246,0.2)', transition: 'box-shadow 0.5s' }}>
              <Image src={coverUrl} alt={title} fill className="object-cover" />
              {playing && <span className="absolute inset-0 rounded-2xl border-2 border-xh-purple/40 animate-ping" />}
            </div>
          ) : (
            <div className="relative w-28 h-28 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(circle at 35% 35%, #A78BFA, #5B21B6 60%, #2D1B4E)', boxShadow: playing ? '0 0 40px rgba(139,92,246,0.5)' : '0 0 20px rgba(139,92,246,0.2)', transition: 'box-shadow 0.5s' }}>
              <span className="text-xh-gold text-4xl select-none">✦</span>
              {playing && <span className="absolute inset-0 rounded-full border-2 border-xh-purple/40 animate-ping" />}
            </div>
          )}
        </div>

        <p className="text-xh-gold text-xs text-center tracking-[0.2em] uppercase mb-1 font-medium">
          {playing ? '▶ กำลังเล่น' : '—— หยุดชั่วคราว ——'}
        </p>
        <h2 className="text-white text-center font-semibold text-base leading-snug mb-8 px-2 line-clamp-2">{title}</h2>

        <div className="mb-6">
          <input type="range" className="audio-slider" min={0} max={displayDuration || 100} step={0.5} value={displayTime}
            onChange={(e) => seek(Number(e.target.value))}
            onMouseUp={(e) => seek(Number(e.currentTarget.value))}
            style={{ background: `linear-gradient(to right, #8B5CF6 ${progress}%, #2D1B4E ${progress}%)` }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
            <span>{formatTime(displayTime)}</span>
            <span>{displayDuration > 0 ? formatTime(displayDuration) : '--:--'}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8">
          <button onClick={() => skip(-10)} className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-xh-purple2 active:scale-95 transition-all">
            <div className="w-11 h-11 rounded-full border border-xh-border hover:border-xh-purple/50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.83" /></svg>
            </div>
            <span className="text-[11px] font-medium">-10s</span>
          </button>

          <button onClick={togglePlay} disabled={loading}
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-white transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', boxShadow: '0 4px 24px rgba(109,40,217,0.5)' }}>
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : playing ? (
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.5" /><rect x="14" y="4" width="4" height="16" rx="1.5" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-7 h-7 translate-x-0.5" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
            )}
          </button>

          <button onClick={() => skip(10)} className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-xh-purple2 active:scale-95 transition-all">
            <div className="w-11 h-11 rounded-full border border-xh-border hover:border-xh-purple/50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-.49-3.83" /></svg>
            </div>
            <span className="text-[11px] font-medium">+10s</span>
          </button>
        </div>
      </div>
    </div>
  );
}
