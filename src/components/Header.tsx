import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-xh-bg/80 backdrop-blur-md border-b border-xh-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xh-gold text-lg leading-none group-hover:text-xh-gold2 transition-colors">✦</span>
          <span className="font-bold text-base text-white tracking-wide">เซียนหัว</span>
          <span className="font-light text-xh-purple2 text-base tracking-widest">XIANHUA</span>
          <span className="text-xh-gold/60 text-xs ml-0.5 tracking-wider">AUDIO</span>
        </Link>
      </div>
    </header>
  );
}
