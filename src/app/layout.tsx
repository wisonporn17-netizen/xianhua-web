import type { Metadata } from 'next';
import './globals.css';
import { PlayerProvider } from '@/context/PlayerContext';
import MiniPlayer from '@/components/MiniPlayer';

export const metadata: Metadata = {
  title: 'เซียนหัว Xianhua Audio',
  description: 'ฟังนิยายเสียงเซียนหัว – นิยายจีนแปลไทย',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-xh-bg text-white antialiased">
        <PlayerProvider>
          {children}
          <MiniPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}
