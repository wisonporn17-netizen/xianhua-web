import Header from '@/components/Header';
import NovelCard from '@/components/NovelCard';
import { supabase } from '@/lib/supabase';
import type { Novel } from '@/types';
import Link from 'next/link';
import HeroBanner from '@/components/HeroBanner';

export const revalidate = 0;

async function getNovels(): Promise<Novel[]> {
  const { data: novels } = await supabase
    .from('novels')
    .select('*, episodes(*)')
    .order('created_at');
  if (!novels) return [];
  return novels.map((n) => ({
    id: n.id,
    title: n.title,
    subtitle: n.subtitle || '',
    description: n.description || '',
    coverUrl: n.cover_url,
    episodes: (n.episodes || []).map((e: any) => ({
      id: e.id,
      title: e.title,
      epNum: e.ep_num,
      audioUrl: e.audio_url,
    })),
  }));
}

export default async function HomePage() {
  const novels = await getNovels();
  const featured = novels[0];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <HeroBanner novels={novels} />

      {/* นิยายทั้งหมด */}
      <main className="max-w-7xl mx-auto px-4 pb-20 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-lg">🔥</span>
            <h2 className="text-white font-semibold text-lg">นิยายทั้งหมด</h2>
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{novels.length} เรื่อง</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {novels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      </main>
    </div>
  );
}
