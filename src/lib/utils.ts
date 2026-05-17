export function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #3b1f6e 0%, #1a0f3e 50%, #0d0820 100%)',
  'linear-gradient(135deg, #2d1b69 0%, #1e0a4e 50%, #0a0612 100%)',
  'linear-gradient(135deg, #4a1a6e 0%, #2d0d52 50%, #0f0520 100%)',
  'linear-gradient(135deg, #1a2f6e 0%, #0d1a4e 50%, #050a20 100%)',
];

export function coverGradient(novelId: string): string {
  const index = novelId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % COVER_GRADIENTS.length;
  return COVER_GRADIENTS[index];
}
