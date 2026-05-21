import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import type { Novel } from '@/types';

export const revalidate = 0;

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

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3, 10);

  const rankColors = ['#f59e0b', '#9ca3af', '#b45309'];
  const rankIcons = ['👑', '🥈', '🥉'];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Title */}
        <div className="flex items-center gap-4 mb-8">
          <div className="text-4xl">🏆</div>
          <div>
            <h1 className="text-3xl font-bold text-white">Top Charts</h1>
            <p className="text-gray-400 text-sm">เรียงตามยอดฟังสะสม</p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Top 3 */}
            <div className="grid grid-cols-3 gap-4 mb-6 items-end">
              {/* อันดับ 2 */}
              {top3[1] && (
                <Link href={`/novels/${top3[1].id}`} className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-gray-400/50 transition-all h-64">
                  <img src={top3[1].coverUrl || ''} alt={top3[1].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-black font-bold text-sm">2</div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-sm truncate">{top3[1].title}</p>
                    <p className="text-gray-400 text-xs">{top3[1].episodes.length} ตอน</p>
                    {(playMap.get(top3[1].id) || 0) >= 10000 && (
                      <p className="text-gray-300 text-xs mt-1">🎧 {playMap.get(top3[1].id)?.toLocaleString()} ครั้ง</p>
                    )}
                  </div>
                </Link>
              )}

              {/* อันดับ 1 - ใหญ่สุด */}
              {top3[0] && (
                <Link href={`/novels/${top3[0].id}`} className="group relative rounded-2xl overflow-hidden border-2 border-yellow-500/50 hover:border-yellow-400 transition-all h-80 shadow-2xl shadow-yellow-500/20">
                  <img src={top3[0].coverUrl || ''} alt={top3[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-3xl">👑</span>
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-sm mt-1">1</div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold truncate">{top3[0].title}</p>
                    <p className="text-gray-300 text-xs">{top3[0].subtitle}</p>
                    <p className="text-yellow-400 text-xs mt-1">{top3[0].episodes.length} ตอน</p>
                    {(playMap.get(top3[0].id) || 0) >= 10000 && (
                      <p className="text-yellow-300 text-xs mt-1">🎧 {playMap.get(top3[0].id)?.toLocaleString()} ครั้ง</p>
                    )}
                    <div className="mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">🔥 ฟังตอนล่าสุด</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* อันดับ 3 */}
              {top3[2] && (
                <Link href={`/novels/${top3[2].id}`} className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-amber-600/50 transition-all h-64">
                  <img src={top3[2].coverUrl || ''} alt={top3[2].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-sm truncate">{top3[2].title}</p>
                    <p className="text-gray-400 text-xs">{top3[2].episodes.length} ตอน</p>
                    {(playMap.get(top3[2].id) || 0) >= 10000 && (
                      <p className="text-gray-300 text-xs mt-1">🎧 {playMap.get(top3[2].id)?.toLocaleString()} ครั้ง</p>
                    )}
                  </div>
                </Link>
              )}
            </div>

            {/* อันดับ 4-10 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {rest.map((novel, i) => (
                <Link key={novel.id} href={`/novels/${novel.id}`}
                  className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all bg-white/5">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img src={novel.coverUrl || ''} alt={novel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-purple-600/80 flex items-center justify-center text-white text-xs font-bold">
                      {i + 4}
                    </div>
                    {(playMap.get(novel.id) || 0) >= 10000 && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        🎧 {playMap.get(novel.id)?.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white text-xs font-medium truncate">{novel.title}</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">{novel.episodes.length} ตอน</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-72 flex-shrink-0 hidden lg:block space-y-4">
            {/* หมวดหมู่ยอดนิยม */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span>⭐</span>
                <h3 className="text-white font-semibold">หมวดหมู่ยอดนิยม</h3>
              </div>
              {['กำลังภายใน', 'แดนเซียน', 'เทพเซียน', 'ระบบ', 'ย้อนเวลา'].map((cat, i) => (
                <Link key={cat} href={`/categories`}
                  className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 hover:opacity-80 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-400 text-xs font-bold">{i + 1}</div>
                    <span className="text-gray-300 text-sm">{cat}</span>
                  </div>
                  <span className="text-purple-400 text-xs">→</span>
                </Link>
              ))}
            </div>

            {/* กำลังมาแรง */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span>🔥</span>
                <h3 className="text-white font-semibold">กำลังมาแรง</h3>
              </div>
              {sorted.slice(0, 3).map((novel, i) => (
                <Link key={novel.id} href={`/novels/${novel.id}`}
                  className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0 hover:opacity-80 transition-all">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={novel.coverUrl || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{novel.title}</p>
                    <p className="text-gray-500 text-[10px]">{novel.episodes.length} ตอน</p>
                  </div>
                  <span className="text-green-400 text-xs">↑{(i + 1) * 12}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
