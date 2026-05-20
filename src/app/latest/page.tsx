import Header from '@/components/Header';
import NovelCard from '@/components/NovelCard';
import { supabase } from '@/lib/supabase';
import type { Novel } from '@/types';

export const revalidate = 0;

export default async function LatestPage() {
  const { data } = await supabase.from('novels').select('*, episodes(*)').order('created_at', { ascending: false });
  const novels: Novel[] = (data || []).map((n: any) => ({
    id: n.id, title: n.title, subtitle: n.subtitle || '', description: n.description || '',
    coverUrl: n.cover_url,
    episodes: (n.episodes || []).map((e: any) => ({ id: e.id, title: e.title, epNum: e.ep_num, audioUrl: e.audio_url }))
  }));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🆕</span>
          <h1 className="text-2xl font-bold text-white">ล่าสุด</h1>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">เพิ่งมาใหม่</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {novels.map((n) => <NovelCard key={n.id} novel={n} />)}
        </div>
      </main>
    </div>
  );
}
