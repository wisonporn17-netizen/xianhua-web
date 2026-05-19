import Header from '@/components/Header';
import NovelCard from '@/components/NovelCard';
import { supabase } from '@/lib/supabase';
import type { Novel } from '@/types';

export const revalidate = 0

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

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)',
          }}
        />
        <div className="relative text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            เซียนหัว <span className="text-xh-purple">Xianhua</span>
          </h1>
          <p className="text-xh-gold/80 tracking-[0.3em] text-sm uppercase font-light mb-4">
            Audio Novels
          </p>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            ฟังนิยายจีนแนวปลูกฝังและวิถีเซียน พากย์ไทย
          </p>
        </div>
      </section>

      {/* Novel Grid */}
      <main className="max-w-5xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-white font-semibold text-lg">นิยายทั้งหมด</h2>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
            {novels.length} เรื่อง
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {novels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      </main>

      <footer className="border-t border-xh-border py-6 text-center text-gray-600 text-xs">
        <span className="text-xh-gold/40">✦</span>
        <span className="mx-2">เซียนหัว Xianhua Audio</span>
        <span className="text-xh-gold/40">✦</span>
      </footer>
    </div>
  );
}
