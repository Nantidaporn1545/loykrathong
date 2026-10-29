import { KrathongData } from '../types';

export function exportKrathongPNG(krathong: KrathongData) {
  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background Gradient
  const bg = ctx.createLinearGradient(0, 0, 1000, 1000);
  bg.addColorStop(0, '#04091A');
  bg.addColorStop(0.5, '#0B1838');
  bg.addColorStop(1, '#050B1E');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1000, 1000);

  // Decorative Moon in background
  ctx.save();
  ctx.beginPath();
  ctx.arc(500, 220, 120, 0, Math.PI * 2);
  ctx.fillStyle = '#FEF3C7';
  ctx.shadowColor = '#FBBF24';
  ctx.shadowBlur = 60;
  ctx.fill();
  ctx.restore();

  // Water reflection
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
  ctx.beginPath();
  ctx.ellipse(500, 720, 380, 100, 0, 0, Math.PI * 2);
  ctx.fill();

  // Header Title
  ctx.fillStyle = '#FCD34D';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('กิจกรรมลอยกระทงออนไลน์ V45', 500, 100);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '22px sans-serif';
  ctx.fillText(`กระทงของ คุณ ${krathong.nickname} (${krathong.department || 'V45'})`, 500, 140);

  // Wish Quote Box
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(150, 760, 700, 140, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FDE68A';
  ctx.font = 'italic 22px sans-serif';
  ctx.fillText(`"${krathong.wish}"`, 500, 835);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '18px sans-serif';
  ctx.fillText('สุขสันต์วันลอยกระทงจาก V45 Corporate Events', 500, 940);

  // Render SVG Krathong onto Canvas
  // Generate SVG string corresponding to Krathong
  const svgContainer = document.createElement('div');
  // We can convert SVG element to data URL and drawImage
  const svgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="500" height="500">
      <style>
        .candle-flame { fill: #F59E0B; }
        .gold-petal { fill: #FBBF24; stroke: #D97706; }
      </style>
      <circle cx="150" cy="200" r="100" fill="rgba(245,158,11,0.2)" />
      <circle cx="150" cy="180" r="70" fill="#F59E0B" />
      <rect x="144" y="80" width="12" height="70" fill="#FEF08A" rx="2" />
      <circle cx="150" cy="65" r="16" fill="#FBBF24" />
      <path d="M150 45 C142 58 142 68 150 72 C158 68 158 58 150 45 Z" fill="#EF4444" />
      <text x="150" y="240" fill="#FFFBEB" font-size="16" font-weight="bold" text-anchor="middle">${krathong.nickname}</text>
    </svg>
  `;

  const img = new Image();
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    ctx.drawImage(img, 250, 250, 500, 500);
    URL.revokeObjectURL(url);

    const link = document.createElement('a');
    link.download = `Krathong-V45-${krathong.nickname}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  img.src = url;
}
