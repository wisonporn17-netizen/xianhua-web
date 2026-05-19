import Link from 'next/link';
import Image from 'next/image';
import { coverGradient } from '@/lib/utils';
import type { Novel } from '@/types';

export default function NovelCard({ novel, rank }: { novel: Novel; rank?: number }) {
  const episodeCount = novel.episodes.length;

  return (
    <Link href={`/novels/${novel.id}`}
      className="group block rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all duration-300 bg-[#111118] hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">

      {/* Cover */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {novel.coverUrl ? (
          <Image src={novel.coverUrl} alt={novel.title} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: coverGradient(novel.id) }}>
            <div className="text-center select-none">
              <div className="text-xh-gold/60 text-5xl mb-2">✦</div>
              <div className="text-white/40 text-xs font-light tracking-widest px-3 text-center leading-relaxed">
                {novel.title.slice(0, 6)}
              </div>
            </div>
          </div>
        )}

        {/* Rank badge */}
        {rank && (
          <div className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border
            ${rank === 1 ? 'bg-yellow-500 border-yellow-400 text-black' :
              rank === 2 ? 'bg-gray-400 border-gray-300 text-black' :
              rank === 3 ? 'bg-amber-600 border-amber-500 text-white' :
              'bg-black/60 border-white/20 text-white'}`}>
            {rank}
          </div>
        )}

        {/* Episode badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10">
          {episodeCount} ตอน
        </div>

        {/* New badge */}
        {episodeCount > 0 && (
          <div className="absolute bottom-2 left-2 bg-purple-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
            มาแรง
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#111118] to-transparent" />

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-purple-600/90 flex items-center justify-center shadow-lg shadow-purple-500/30 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white translate-x-0.5" fill="currentColor">
              <path d="M8 5.14v14l11-7-11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h2 className="font-bold text-sm text-white leading-snug mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {novel.title}
        </h2>
        {novel.subtitle && (
          <p className="text-purple-400/70 text-[10px] mb-2 truncate">{novel.subtitle}</p>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-gray-400 text-[10px]">4.{Math.floor(Math.random() * 5) + 5}</span>
          </div>
          {/* Waveform */}
          <div className="flex items-end gap-[2px] h-3">
            {[3,5,4,6,3,5,4,6,3,5].map((h, i) => (
              <div key={i} className="w-[2px] bg-purple-500/50 rounded-full group-hover:bg-purple-400 transition-colors"
                style={{ height: `${h}px` }} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
