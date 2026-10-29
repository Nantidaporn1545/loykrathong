import React, { useRef, useEffect } from 'react';
import { KrathongData } from '../types';
import { X, Download, Award, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  krathong: KrathongData;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ krathong, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution canvas dimensions for crisp export
    canvas.width = 1200;
    canvas.height = 850;

    // Background Dark Gold Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 850);
    bgGrad.addColorStop(0, '#060B1E');
    bgGrad.addColorStop(0.5, '#0F1A36');
    bgGrad.addColorStop(1, '#080E24');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 850);

    // Outer Golden Border Frame
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 1140, 790);

    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 1110, 760);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, scaleX: number, scaleY: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scaleX, scaleY);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(60, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 60);
      ctx.arc(30, 30, 20, Math.PI, Math.PI * 1.5);
      ctx.stroke();
      ctx.restore();
    };

    drawCorner(55, 55, 1, 1);
    drawCorner(1145, 55, -1, 1);
    drawCorner(55, 795, 1, -1);
    drawCorner(1145, 795, -1, -1);

    // Header V45 Logo Seal
    ctx.save();
    ctx.beginPath();
    ctx.arc(600, 140, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#060B1E';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('V45', 600, 140);
    ctx.restore();

    // Title Texts
    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ใบประกาศนียบัตร เข้าร่วมกิจกรรม', 600, 230);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('กิจกรรมลอยกระทงออนไลน์ V45', 600, 300);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '22px sans-serif';
    ctx.fillText('ขอมอบใบประกาศนียบัตรฉบับนี้เพื่อแสดงว่า', 600, 370);

    // Employee Name
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(`คุณ ${krathong.nickname}`, 600, 440);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '22px sans-serif';
    ctx.fillText(`สังกัด: ${krathong.department || 'พนักงาน V45'}`, 600, 485);

    // Description
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '20px sans-serif';
    ctx.fillText('ได้ร่วมสืบสานวัฒนธรรมและประเพณีไทย ตกแต่งกระทงและส่งมอบคำอธิษฐานในคืนวันเพ็ญ', 600, 540);

    // Wish Text
    ctx.fillStyle = '#FDE68A';
    ctx.font = 'italic 20px sans-serif';
    ctx.fillText(`"${krathong.wish}"`, 600, 600);

    // Date & Signature line
    ctx.fillStyle = '#94A3B8';
    ctx.font = '18px sans-serif';
    ctx.fillText('ให้ไว้ ณ วันเพ็ญ ขึ้น ๑๕ ค่ำ เดือน ๑๒', 350, 720);
    ctx.fillText('คณะผู้บริหารองค์กร V45', 850, 720);

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(250, 700);
    ctx.lineTo(450, 700);
    ctx.moveTo(750, 700);
    ctx.lineTo(950, 700);
    ctx.stroke();

  }, [krathong]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Certificate-LoyKrathong-V45-${krathong.nickname}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl glass-panel-gold rounded-3xl p-6 border border-amber-400/50 shadow-2xl flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-amber-500/20 mb-4">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
            <Award className="w-5 h-5 text-amber-400" />
            <span>ใบประกาศนียบัตร V45</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-amber-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Canvas Render */}
        <div className="w-full overflow-x-auto flex justify-center my-2 rounded-xl border border-amber-500/30 shadow-inner bg-slate-950 p-2">
          <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg" style={{ maxHeight: '60vh' }} />
        </div>

        {/* Actions */}
        <div className="w-full flex justify-end gap-3 pt-4 border-t border-amber-500/20 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 font-medium text-xs transition-colors"
          >
            ปิด
          </button>

          <button
            onClick={handleDownload}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลดใบประกาศนียบัตร (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
