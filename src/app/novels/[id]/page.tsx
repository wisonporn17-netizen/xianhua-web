import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { coverGradient } from '@/lib/utils';
import novelsData from '@/data/novels.json';
import type { Novel } from '@/types';

const novels = novelsData as Novel[];

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return novels.map((n) => ({ id: n.id }));
}

export function generateMetadata({ params }: Props) {
  const novel = novels.find((n) => n.id === params.id);
  if (!novel) return {};
  return {
    title: `${novel.title} – เซียนหัว Audio`,
    description: novel.description || novel.subtitle,
  };
}

export default function NovelPage({ params }: Props) {
  const novel = novels.find((n) => n.id === params.id);
  if (!novel) notFound();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Back */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-gray-400 hover:text-xh-purple2 text-sm transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          กลับหน้าหลัก
        </Link>
      </div>

      {/* Novel Info */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Cover */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="relative w-36 h-52 sm:w-44 sm:h-64 rounded-xl overflow-hidden border border-xh-border shadow-xl shadow-black/40">
              {novel.coverUrl ? (
                <Image src={novel.coverUrl} alt={novel.title} fill className="object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: coverGradient(novel.id) }}
                >
                  <span className="text-xh-gold/50 text-5xl" style={{ textShadow: '0 0 30px rgba(212,175,55,0.4)' }}>
                    ✦
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-1">
              {novel.title}
            </h1>
            {novel.subtitle && (
              <p className="text-xh-gold/70 text-sm mb-3">{novel.subtitle}</p>
            )}
            {novel.description && (
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{novel.description}</p>
            )}
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="text-xh-gold text-xs">✦</span>
              <span className="text-gray-400 text-sm">
                <span className="text-white font-semibold">{novel.episodes.length}</span> ตอน
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Episode List */}
      <main className="max-w-5xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-xh-border" />
          <h2 className="text-gray-400 text-sm font-medium px-2">ตอนทั้งหมด</h2>
          <div className="h-px flex-1 bg-xh-border" />
        </div>

        <div className="space-y-2">
          {novel.episodes.map((episode) => (
            <Link
              key={episode.id}
              href={`/novels/${novel.id}/episodes/${episode.id}`}
              className="group flex items-center gap-4 p-4 rounded-xl bg-xh-card border border-xh-border hover:border-xh-purple/50 hover:bg-xh-purple/5 transition-all"
            >
              {/* Episode number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-xh-border flex items-center justify-center text-xs font-mono text-gray-400 group-hover:bg-xh-purple/20 group-hover:text-xh-purple2 transition-all">
                {String(episode.epNum).padStart(2, '0')}
              </div>

              {/* Play icon */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-xh-border flex items-center justify-center text-gray-500 group-hover:border-xh-purple/60 group-hover:text-xh-purple2 transition-all">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 translate-x-px" fill="currentColor">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate group-hover:text-xh-purple2 transition-colors">
                  {episode.title}
                </p>
              </div>

              {/* Chevron */}
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-gray-600 flex-shrink-0 group-hover:text-xh-purple/60 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
