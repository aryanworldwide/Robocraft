import React, { useMemo } from 'react';

export default function SplashBackground() {
  const particles = useMemo(() =>
    Array.from({ length: 18 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 3,
    })), []
  );

  return (
    <div className="absolute inset-0 animated-bg overflow-hidden">
      {/* Hexagon grid */}
      <div className="absolute inset-0 hex-grid opacity-50" />

      {/* Circuit pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cyan-400/40"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            boxShadow: '0 0 8px rgba(0, 210, 255, 0.6)',
          }}
        />
      ))}

      {/* AI scan line */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-0 right-0 h-32 scan-line"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(0, 210, 255, 0.06), transparent)' }}
        />
      </div>
    </div>
  );
}
