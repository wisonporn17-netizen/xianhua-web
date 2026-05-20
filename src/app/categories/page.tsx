import Header from '@/components/Header';
import NovelCard from '@/components/NovelCard';
import { supabase } from '@/lib/supabase';
import type { Novel } from '@/types';

export const revalidate = 0;

export default async function CategoriesPage() {
  const { data } = await supabase.from('novels').select('*, episodes(*)').order('category');
  const novels: any[] = data || [];

  const grouped: Record<string, Novel[]> = {};
  novels.forEach((n) => {
    const cat = n.category || 'อื่นๆ';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({
      id: n.id, title: n.title, subtitle: n.subtitle || '', description: n.description || '',
      coverUrl: n.cover_url,
      episodes: (n.episodes || []).map((e: any) => ({ id: e.id, title: e.title, epNum: e.ep_num, audioUrl: e.audio_url }))
    });
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">🎭</span>
          <h1 className="text-2xl font-bold text-white">หมวดหมู่</h1>
        </div>
        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{cat}</h2>
              <span className="text-xs text-gray-500">{items.length} เรื่อง</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {items.map((n) => <NovelCard key={n.id} novel={n} />)}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
