import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

interface Props {
  params: { id: string; episodeId: string };
}

export default async function EpisodePage({ params }: Props) {
  const { data: novel } = await supabase
    .from('novels')
    .select('*, episodes(*)')
    .eq('id', params.id)
    .single();

  if (!novel) notFound();

  const episodes = novel.episodes || [];
  const episodeIndex = episodes.findIndex((e: any) => e.id === params.episodeId);
  if (episodeIndex === -1) notFound();

  const episode = episodes[episodeIndex];
  const prevEpisode = episodes[episodeIndex - 1] ?? null;
  const nextEpisode = episodes[episodeIndex + 1] ?? null;

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link href={`/novels/${novel.id}`} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-xh-purple2 text-sm transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {novel.title}
        </Link>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <p className="text-xh-gold/60 text-xs tracking-widest uppercase mb-1">{novel.title}</p>
            <h1 className="text-white font-bold text-lg leading-snug">{episode.title}</h1>
          </div>

          <AudioPlayer audioUrl={episode.audio_url} title={episode.title} coverUrl={novel.cover_url} novelId={novel.id} episodeId={episode.id} />

          <div className="flex gap-3 mt-6">
            {prevEpisode ? (
              <Link href={`/novels/${novel.id}/episodes/${prevEpisode.id}`} className="flex-1 flex items-center gap-2 p-3 rounded-xl bg-xh-card border border-xh-border hover:border-xh-purple/50 transition-all group">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500 group-hover:text-xh-purple2 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <div className="min-w-0">
                  <p className="text-gray-600 text-[10px]">ตอนก่อนหน้า</p>
                  <p className="text-white text-xs truncate group-hover:text-xh-purple2 transition-colors">{prevEpisode.title}</p>
                </div>
              </Link>
            ) : <div className="flex-1" />}

            {nextEpisode ? (
              <Link href={`/novels/${novel.id}/episodes/${nextEpisode.id}`} className="flex-1 flex items-center justify-end gap-2 p-3 rounded-xl bg-xh-card border border-xh-border hover:border-xh-purple/50 transition-all group text-right">
                <div className="min-w-0">
                  <p className="text-gray-600 text-[10px]">ตอนถัดไป</p>
                  <p className="text-white text-xs truncate group-hover:text-xh-purple2 transition-colors">{nextEpisode.title}</p>
                </div>
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500 group-hover:text-xh-purple2 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </div>
      </main>
    </div>
  );
}
