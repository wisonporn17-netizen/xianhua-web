import Link from 'next/link';
import Image from 'next/image';
import { coverGradient } from '@/lib/utils';
import type { Novel } from '@/types';

export default function NovelCard({ novel }: { novel: Novel }) {
  const episodeCount = novel.episodes.length;

  return (
    <Link
      href={`/novels/${novel.id}`}
      className="group block rounded-2xl overflow-hidden border border-xh-border hover:border-xh-purple/60 transition-all duration-300 bg-xh-card hover:shadow-lg hover:shadow-xh-purple/10 hover:-translate-y-0.5"
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {novel.coverUrl ? (
          <Image
            src={novel.coverUrl}
            alt={novel.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: coverGradient(novel.id) }}
          >
            <div className="text-center select-none">
              <div className="text-xh-gold/60 text-5xl mb-2">✦</div>
              <div className="text-white/40 text-xs font-light tracking-widest px-3 text-center leading-relaxed">
                {novel.title.slice(0, 6)}
              </div>
            </div>
          </div>
        )}
        {/* Episode badge */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-xh-gold text-xs font-semibold px-2 py-1 rounded-full border border-xh-gold/30">
          {episodeCount} ตอน
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-xh-card to-transparent" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h2 className="font-bold text-sm text-white leading-snug mb-1 line-clamp-2 group-hover:text-xh-purple2 transition-colors">
          {novel.title}
        </h2>
        {novel.subtitle && (
          <p className="text-xh-gold/60 text-[11px] mb-2 truncate">{novel.subtitle}</p>
        )}
        {novel.description && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{novel.description}</p>
        )}
      </div>
    </Link>
  );
}
