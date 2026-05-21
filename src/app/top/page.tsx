import Header from '@/components/Header';
import NovelCard from '@/components/NovelCard';
import { supabase } from '@/lib/supabase';
import type { Novel } from '@/types';

export const revalidate = 0;

export default async function TopPage() {
  // ดึง play count
  const { data: playCounts } = await supabase
    .from('novel_play_counts')
    .select('novel_id, play_count')
    .order('play_count', { ascending: false });

  // ดึงนิยายทั้งหมด
  const { data: novelsData } = await supabase
    .from('novels')
    .select('*, episodes(*)');

  const novels: Novel[] = (novelsData || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    subtitle: n.subtitle || '',
    description: n.description || '',
    coverUrl: n.cover_url,
    episodes: (n.episodes || []).map((e: any) => ({
      id: e.id, title: e.title, epNum: e.ep_num, audioUrl: e.audio_url
    }))
  }));

  // เรียงตาม play_count
  const playMap = new Map((playCounts || []).map((p: any) => [p.novel_id, p.play_count]));
  const sorted = [...novels].sort((a, b) => (playMap.get(b.id) || 0) - (playMap.get(a.id) || 0));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🏆</span>
          <h1 className="text-2xl font-bold text-white">Top Charts</h1>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">เรียงตามยอดฟัง</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sorted.map((n, i) => (
            <div key={n.id} className="relative">
              <NovelCard novel={n} rank={i + 1} />
              {(playMap.get(n.id) || 0) >= 10000 ? (
                <div className="absolute bottom-16 left-3 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">
                  🎧 {playMap.get(n.id)} ครั้ง
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
