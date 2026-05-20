import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { coverGradient } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

interface Props { params: { id: string } }

export default async function NovelPage({ params }: Props) {
  const { data: novel } = await supabase.from('novels').select('*, episodes(*)').eq('id', params.id).single();
  if (!novel) notFound();
  const episodes = (novel.episodes || []).sort((a: any, b: any) => a.ep_num - b.ep_num);

  return (
    <div className="min-h-screen pb-24">
      <Header />
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-xh-purple2 text-sm">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          กลับหน้าหลัก
        </Link>
      </div>

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="relative w-36 h-52 sm:w-44 sm:h-64 rounded-xl overflow-hidden border border-xh-border shadow-xl">
              {novel.cover_url ? (
                <Image src={novel.cover_url} alt={novel.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: coverGradient(novel.id) }}>
                  <span className="text-xh-gold/50 text-5xl">✦</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{novel.title}</h1>
            {novel.subtitle && <p className="text-xh-gold/70 text-sm mb-3">{novel.subtitle}</p>}
            {novel.description && <p className="text-gray-400 text-sm mb-4">{novel.description}</p>}
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="text-xh-gold text-xs">✦</span>
              <span className="text-gray-400 text-sm"><span className="text-white font-semibold">{episodes.length}</span> ตอน</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-xh-border" />
          <h2 className="text-gray-400 text-sm font-medium px-2">ตอนทั้งหมด</h2>
          <div className="h-px flex-1 bg-xh-border" />
        </div>

        <div className="space-y-2">
          {episodes.map((episode: any) => (
            <Link key={episode.id} href={`/novels/${novel.id}/episodes/${episode.id}`}
              className="group flex items-center gap-4 p-4 rounded-xl bg-xh-card border border-xh-border hover:border-xh-purple/50 transition-all">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-xh-border flex items-center justify-center text-xs font-mono text-gray-400">
                {String(episode.ep_num).padStart(2, '0')}
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-xh-border flex items-center justify-center text-gray-500">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{episode.title}</p>
              </div>
              {episode.is_free ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-600/20 text-green-400 border border-green-500/30">ฟรี</span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-yellow-600/20 text-yellow-400 border border-yellow-500/30">🔒 สมาชิก</span>
              )}
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
