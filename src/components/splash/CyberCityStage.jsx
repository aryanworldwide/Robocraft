import React, { useMemo } from 'react';

export default function CyberCityStage() {
  const buildings = useMemo(() =>
    Array.from({ length: 15 }).map((_, i) => ({
      left: (i / 15) * 100 + Math.random() * 5,
      width: 4 + Math.random() * 6,
      height: 15 + Math.random() * 35,
      delay: Math.random() * 2,
    })), []
  );

  const drones = useMemo(() =>
    Array.from({ length: 4 }).map((_, i) => ({
      top: 15 + i * 15,
      delay: i * 1.5,
      duration: 6 + Math.random() * 3,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid floor perspective */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,210,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(200px) rotateX(60deg)',
          transformOrigin: 'bottom',
          maskImage: 'linear-gradient(to top, black, transparent)',
        }}
      />

      {/* Buildings */}
      {buildings.map((b, i) => (
        <div
          key={i}
          className="absolute bottom-1/3"
          style={{
            left: `${b.left}%`,
            width: `${b.width}%`,
            height: `${b.height}%`,
            background: 'linear-gradient(to top, rgba(0,210,255,0.15), rgba(0,210,255,0.02))',
            borderTop: '1px solid rgba(0,210,255,0.3)',
            animation: `slideUp 1s ease-out ${b.delay}s both`,
          }}
        >
          {/* Windows */}
          <div className="absolute inset-1 grid grid-cols-2 gap-0.5">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="bg-cyan-400/20 rounded-sm" style={{ opacity: Math.random() > 0.4 ? 0.6 : 0.1 }} />
            ))}
          </div>
        </div>
      ))}

      {/* Flying drones */}
      {drones.map((d, i) => (
        <div
          key={i}
          className="absolute w-2 h-2"
          style={{
            top: `${d.top}%`,
            animation: `flyAcross ${d.duration}s linear ${d.delay}s infinite`,
          }}
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 8px #00D2FF' }} />
          <div className="absolute top-1/2 left-0 w-6 h-px bg-cyan-400/30" />
        </div>
      ))}

      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes flyAcross {
          0% { left: -5%; }
          100% { left: 105%; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
