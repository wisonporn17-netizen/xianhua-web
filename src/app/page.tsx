import Header from '@/components/Header';
import NovelCard from '@/components/NovelCard';
import novelsData from '@/data/novels.json';
import type { Novel } from '@/types';

const novels = novelsData as Novel[];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-xh-gold/50" />
            <span className="text-xh-gold text-2xl">✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-xh-gold/50" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            <span className="text-white">เซียนหัว </span>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #8B5CF6, #A78BFA, #D4AF37)' }}
            >
              Xianhua
            </span>
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
          <span className="text-xs text-xh-purple2 bg-xh-purple/10 border border-xh-purple/20 px-2 py-0.5 rounded-full">
            {novels.length} เรื่อง
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {novels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-xh-border py-6 text-center text-gray-600 text-xs">
        <span className="text-xh-gold/40">✦</span>
        <span className="mx-2">เซียนหัว Xianhua Audio</span>
        <span className="text-xh-gold/40">✦</span>
      </footer>
    </div>
  );
}
