import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'xh-bg':       '#0A0612',
        'xh-bg2':      '#130B1E',
        'xh-card':     '#1A0F2E',
        'xh-border':   '#2D1B4E',
        'xh-purple':   '#8B5CF6',
        'xh-purple2':  '#A78BFA',
        'xh-gold':     '#D4AF37',
        'xh-gold2':    '#F0CC62',
      },
      backgroundImage: {
        'glow-purple': 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};

export default config;
