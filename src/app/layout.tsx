import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'เซียนหัว Xianhua Audio',
  description: 'ฟังนิยายเสียงเซียนหัว – นิยายจีนแปลไทย',
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
        {children}
      </body>
    </html>
  );
}
