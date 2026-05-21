import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import TopThreeCards from '@/components/TopThreeCards';
import type { Novel } from '@/types';

export const revalidate = 0;

const accentMap = [
  'from-yellow-300 to-orange-500',
  'from-slate-400 to-blue-500',
  'from-amber-300 to-yellow-600',
]

const popularCategories = [
  ['กำลังภายใน', 'text-emerald-400'],
  ['แดนเซียน', 'text-purple-400'],
  ['เทพเซียน', 'text-amber-400'],
  ['ระบบ', 'text-blue-400'],
  ['ย้อนเวลา', 'text-pink-400'],
]

export default async function TopPage() {
  const { data: playCounts } = await supabase
    .from('novel_play_counts')
    .select('novel_id, play_count')
    .order('play_count', { ascending: false });

  const { data: novelsData } = await supabase.from('novels').select('*, episodes(*)');

  const novels: Novel[] = (novelsData || []).map((n: any) => ({
    id: n.id, title: n.title, subtitle: n.subtitle || '',
    description: n.description || '', coverUrl: n.cover_url,
    episodes: (n.episodes || []).map((e: any) => ({ id: e.id, title: e.title, epNum: e.ep_num, audioUrl: e.audio_url }))
  }));

  const playMap = new Map((playCounts || []).map((p: any) => [p.novel_id, p.play_count]));
  const sorted = [...novels].sort((a, b) => (playMap.get(b.id) || 0) - (playMap.get(a.id) || 0));

  const rest = sorted.slice(3, 10);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070711] text-white">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(147,51,234,.18),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(250,204,21,.10),transparent_28%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] [background-size:80px_80px]" />

      <Header />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8 py-10">
        {/* Title + Filters */}
        <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div className="flex items-center gap-5">
            <div className="text-5xl md:text-6xl drop-shadow-[0_0_28px_rgba(250,204,21,.35)]">🏆</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Top Charts</h1>
              <p className="mt-2 text-slate-400">จัดอันดับนิยายเสียงยอดนิยม เรียงตามยอดฟังสะสม</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-2xl border border-purple-400/30 bg-purple-500/10 px-5 py-2.5 text-purple-200 text-sm">เรียงตามยอดฟัง ▾</button>
            <button className="rounded-2xl border border-yellow-400/50 bg-yellow-400/10 px-6 py-2.5 font-semibold text-yellow-300 text-sm">รายวัน</button>
            <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-2.5 text-slate-300 text-sm">รายสัปดาห์</button>
            <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-2.5 text-slate-300 text-sm">รายเดือน</button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
          <section>
            {/* Top 3 */}
            <TopThreeCards novels={sorted.slice(0,3)} playMap={Object.fromEntries(playMap)} />

            {/* อันดับ 4-10 */}
            {rest.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
                {rest.map((novel, i) => {
                  const rank = i + 4;
                  const firstEp = novel.episodes[0];
                  return (
                    <Link key={novel.id} href={`/novels/${novel.id}`}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] transition hover:-translate-y-2 hover:border-purple-400/50 hover:shadow-[0_20px_50px_rgba(147,51,234,.22)]">
                      {novel.coverUrl && (
                        <img src={novel.coverUrl} alt={novel.title} className="h-[200px] w-full object-cover transition duration-500 group-hover:scale-110" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080811] via-transparent to-transparent" />
                      <div className="absolute left-3 top-3 rounded-xl border border-purple-300/30 bg-purple-700 px-2.5 py-1.5 text-base font-black text-white">{rank}</div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="line-clamp-2 text-sm font-bold text-white">{novel.title}</h4>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
                          <span>⭐ 4.{Math.floor(Math.random() * 3) + 5}</span>
                          <span>🎧 {novel.episodes.length} ตอน</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="hidden xl:block space-y-6">
            {/* หมวดหมู่ยอดนิยม */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="mb-5 flex items-center gap-3 text-xl font-bold text-white">⭐ หมวดหมู่ยอดนิยม</h3>
              <div className="space-y-4">
                {popularCategories.map(([name, color], idx) => (
                  <Link key={name} href="/categories"
                    className="flex items-center justify-between text-sm hover:opacity-80 transition-all">
                    <div className="flex items-center gap-3 text-slate-300">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/10 ${color}`}>{idx + 1}</span>
                      {name}
                    </div>
                    <span className="text-slate-400">→</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* กำลังมาแรง */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="mb-5 flex items-center gap-3 text-xl font-bold text-white">🔥 กำลังมาแรง</h3>
              <div className="space-y-4">
                {sorted.slice(0, 3).map((novel, i) => (
                  <Link key={novel.id} href={`/novels/${novel.id}`}
                    className="flex items-center gap-4 hover:opacity-80 transition-all">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-yellow-400/60 text-yellow-300 text-sm">{i + 1}</span>
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                      {novel.coverUrl && <img src={novel.coverUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white text-sm">{novel.title}</p>
                      <p className="text-xs text-slate-400">{novel.episodes.length} ตอน</p>
                    </div>
                    <span className="rounded-lg bg-purple-500/20 px-2 py-1 text-xs text-purple-300">↑{(i + 1) * 12}</span>
                  </Link>
                ))}
              </div>
              <Link href="/top" className="mt-5 block text-purple-300 hover:text-purple-200 text-sm">ดูเพิ่มเติม ›</Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}
