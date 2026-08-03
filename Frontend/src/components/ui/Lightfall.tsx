import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface LightBeam {
  x: number;
  y: number;
  length: number;
  speed: number;
  width: number;
  opacity: number;
  colorType: 'primary' | 'secondary' | 'accent';
}

export const Lightfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Create a high-density matrix of falling light beams
    const beamCount = 55;
    const beams: LightBeam[] = Array.from({ length: beamCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      length: 90 + Math.random() * 180,
      speed: 1.2 + Math.random() * 2.8,
      width: 1.2 + Math.random() * 2.2,
      opacity: 0.25 + Math.random() * 0.65,
      colorType: Math.random() > 0.6 ? 'secondary' : Math.random() > 0.3 ? 'primary' : 'accent',
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      
      // Theme-adaptive photon coloring
      const colorMap = {
        primary: isDark ? '59, 130, 246' : '245, 158, 11',    // Blue vs Gold Amber
        secondary: isDark ? '147, 51, 234' : '99, 102, 241',  // Electric Violet vs Deep Indigo
        accent: isDark ? '6, 182, 212' : '239, 68, 68',       // Cyan Photon vs Royal Crimson
      };

      beams.forEach((beam) => {
        beam.y += beam.speed;

        // Reset beam when its tail clears the floor
        if (beam.y - beam.length > height) {
          beam.y = -Math.random() * 300 - beam.length;
          beam.x = Math.random() * width;
          beam.speed = 1.2 + Math.random() * 2.8;
        }

        const rgb = colorMap[beam.colorType];

        // Draw cascading light tail with gradient opacity decay
        const grad = ctx.createLinearGradient(beam.x, beam.y, beam.x, beam.y - beam.length);
        grad.addColorStop(0, `rgba(${rgb}, ${beam.opacity})`);
        grad.addColorStop(0.2, `rgba(${rgb}, ${beam.opacity * 0.6})`);
        grad.addColorStop(1, `rgba(${rgb}, 0)`);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(beam.x, beam.y - beam.length);
        ctx.strokeStyle = grad;
        ctx.lineWidth = beam.width;
        ctx.lineCap = 'round';

        // Glowing laser head bloom
        ctx.shadowBlur = isDark ? 18 : 12;
        ctx.shadowColor = `rgba(${rgb}, ${beam.opacity * 0.9})`;
        ctx.stroke();

        // Render laser photon head orb
        ctx.beginPath();
        ctx.arc(beam.x, beam.y, beam.width * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#ffffff' : `rgba(${rgb}, 1)`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(${rgb}, 1)`;
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700 opacity-90 dark:opacity-100"
      style={{ mixBlendMode: theme === 'dark' ? 'screen' : 'normal' }}
    />
  );
};
