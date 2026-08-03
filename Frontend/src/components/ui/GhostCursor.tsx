import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface PhotonParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  maxLife: number;
  life: number;
}

export const GhostCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      lastX: width / 2,
      lastY: height / 2,
      speed: 0,
      isHovering: false,
      isClicked: false,
    };

    const halo = {
      x: width / 2,
      y: height / 2,
      radius: 18,
      targetRadius: 18,
      angle: 0,
    };

    const particles: PhotonParticle[] = [];
    const maxParticles = 80; // Rich particle density cap

    const darkColors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#38bdf8', '#a855f7', '#ec4899', '#6366f1'];
    const lightColors = ['#4f46e5', '#0284c7', '#7c3aed', '#2563eb', '#9333ea', '#db2777'];

    const getColors = () => (theme === 'dark' ? darkColors : lightColors);

    let lastHoverCheckTime = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.lastX = mouse.targetX;
      mouse.lastY = mouse.targetY;
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      const dx = mouse.targetX - mouse.lastX;
      const dy = mouse.targetY - mouse.lastY;
      mouse.speed = Math.min(Math.hypot(dx, dy), 40);

      // Throttled DOM hover check (every 60ms)
      const now = performance.now();
      if (now - lastHoverCheckTime > 60) {
        lastHoverCheckTime = now;
        const target = e.target as HTMLElement | null;
        if (target) {
          const interactiveSelector = 'button, a, input, select, textarea, [role="button"], .cursor-pointer';
          mouse.isHovering = !!target.closest(interactiveSelector);
        }
      }

      // Spawn rich ambient photon particles on cursor movement
      if (mouse.speed > 1.2 && particles.length < maxParticles) {
        const colors = getColors();
        const spawnCount = mouse.speed > 10 ? 3 : 2;

        for (let i = 0; i < spawnCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const driftSpeed = 0.6 + Math.random() * 2.2;
          particles.push({
            x: mouse.targetX + (Math.random() - 0.5) * 8,
            y: mouse.targetY + (Math.random() - 0.5) * 8,
            vx: Math.cos(angle) * driftSpeed - dx * 0.08,
            vy: Math.sin(angle) * driftSpeed - dy * 0.08,
            size: 2 + Math.random() * 3, // Richer 2px-5px glowing photon dots
            alpha: 0.95,
            color: colors[Math.floor(Math.random() * colors.length)],
            maxLife: 26 + Math.random() * 14,
            life: 0,
          });
        }
      }
    };

    const onMouseDown = () => {
      mouse.isClicked = true;
      const colors = getColors();
      // Vibrant radial cosmic burst on click
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.2;
        const burstSpeed = 2.5 + Math.random() * 4.5;
        particles.push({
          x: mouse.targetX,
          y: mouse.targetY,
          vx: Math.cos(angle) * burstSpeed,
          vy: Math.sin(angle) * burstSpeed,
          size: 2.5 + Math.random() * 2.5,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          maxLife: 28,
          life: 0,
        });
      }
    };

    const onMouseUp = () => {
      mouse.isClicked = false;
    };

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth cursor spring physics
      mouse.x += (mouse.targetX - mouse.x) * 0.65;
      mouse.y += (mouse.targetY - mouse.y) * 0.65;

      const springK = 0.25;
      halo.x += (mouse.targetX - halo.x) * springK;
      halo.y += (mouse.targetY - halo.y) * springK;

      const vx = mouse.targetX - halo.x;
      const vy = mouse.targetY - halo.y;
      const velocity = Math.hypot(vx, vy);
      halo.angle = Math.atan2(vy, vx);

      if (mouse.isClicked) {
        halo.targetRadius = 14;
      } else if (mouse.isHovering) {
        halo.targetRadius = 28;
      } else {
        halo.targetRadius = 18;
      }
      halo.radius += (halo.targetRadius - halo.radius) * 0.22;

      // Render floating photon particles with vibrant alpha fade
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.93;
        p.vy *= 0.93;
        p.alpha = Math.max(0, 1 - Math.pow(p.life / p.maxLife, 1.2));

        if (p.life >= p.maxLife || p.alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Render Quantum Halo Ring
      ctx.save();
      ctx.translate(halo.x, halo.y);
      ctx.rotate(halo.angle);

      const stretchX = 1 + Math.min(velocity / 40, 0.35);
      const stretchY = 1 - Math.min(velocity / 80, 0.15);
      ctx.scale(stretchX, stretchY);

      ctx.beginPath();
      ctx.arc(0, 0, halo.radius, 0, Math.PI * 2);
      
      if (mouse.isHovering) {
        ctx.strokeStyle = theme === 'dark' ? '#06b6d4' : '#2563eb';
        ctx.lineWidth = 2.2;
      } else {
        ctx.strokeStyle = theme === 'dark' ? 'rgba(147, 197, 253, 0.65)' : 'rgba(59, 130, 246, 0.65)';
        ctx.lineWidth = 1.6;
      }
      
      ctx.stroke();

      if (mouse.isHovering) {
        ctx.fillStyle = theme === 'dark' ? 'rgba(6, 182, 212, 0.14)' : 'rgba(37, 99, 235, 0.12)';
        ctx.fill();
      }
      ctx.restore();

      // Render Nucleus Dot
      ctx.save();
      ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#1e3a8a';
      ctx.beginPath();
      ctx.arc(mouse.targetX, mouse.targetY, mouse.isHovering ? 2.5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] select-none"
    />
  );
};

export default GhostCursor;
