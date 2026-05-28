import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import FavoriteButton from '@/components/FavoriteButton';
import ShareButton from '@/components/ShareButton';

export const revalidate = 0;

interface Props { params: { id: string } }

export default async function NovelPage({ params }: Props) {
  const { data: novel } = await supabase.from('novels').select('*, episodes(*)').eq('id', params.id).single();
  if (!novel) notFound();

  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, chapter_num, title, is_free')
    .eq('novel_id', params.id)
    .order('chapter_num');
  const episodes = (novel.episodes || []).sort((a: any, b: any) => a.ep_num - b.ep_num);
  const firstEp = episodes[0];

  return (
    <div className="min-h-screen pb-24" style={{
      backgroundImage: novel.cover_url ? `url('${novel.cover_url}')` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-[#0a0a0f]/85 pointer-events-none" />

      <div className="relative z-10">
        <Header />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back */}
          <Link href="/" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            กลับหน้าหลัก
          </Link>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            {/* Cover */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative w-48 h-64 md:w-56 md:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/20">
                {novel.cover_url ? (
                  <Image src={novel.cover_url} alt={novel.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-purple-900 flex items-center justify-center text-5xl">✦</div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Status badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-600/30 text-purple-300 border border-purple-500/30">กำลังดำเนินต่อ</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{novel.title}</h1>
              {novel.subtitle && <p className="text-purple-400 text-sm mb-4">{novel.subtitle}</p>}

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">⭐ <span className="text-white font-medium">{novel.rating || '4.8'}</span></span>
                <span className="flex items-center gap-1">🎧 <span className="text-white font-medium">{episodes.length} ตอน</span></span>
                <span className="flex items-center gap-1">📂 <span className="text-white font-medium">{novel.category || 'กำลังภายใน'}</span></span>
              </div>

              {/* Description */}
              {novel.description && (
                <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-2xl">{novel.description}</p>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {firstEp && (
                  <Link href={`/novels/${novel.id}/episodes/${firstEp.id}`}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all shadow-lg shadow-purple-500/30">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
                    ฟังตอนแรก
                  </Link>
                )}
                {chapters && chapters.length > 0 && (
                  <a href={'/novels/' + novel.id + '/read/' + chapters[0].id}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white font-medium transition-all">
                    📖 อ่านนิยาย
                  </a>
                )}
                <FavoriteButton novelId={novel.id} />
                <ShareButton title={novel.title} />
              </div>
            </div>
          </div>

          {/* Episode List */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <h2 className="text-white font-semibold">ตอนทั้งหมด</h2>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{episodes.length} ตอน</span>
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {episodes.map((episode: any, index: number) => (
                <Link key={episode.id} href={`/novels/${novel.id}/episodes/${episode.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all group">
                  {/* Number */}
                  <div className="w-8 text-center text-gray-500 text-sm font-mono group-hover:hidden">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="w-8 hidden group-hover:flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-400" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition-colors">{episode.title}</p>
                  </div>

                  {/* Free/Lock badge */}
                  {episode.is_free ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-600/20 text-green-400 border border-green-500/30 flex-shrink-0">ฟรี</span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 flex-shrink-0">🔒</span>
                  )}

                  {/* Chevron */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-600 group-hover:text-purple-400 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
