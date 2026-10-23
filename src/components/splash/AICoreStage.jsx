import React, { useState, useEffect } from 'react';

export default function AICoreStage({ onDone }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExpanded(true), 100);
    const t2 = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 bg-black on-dark flex items-center justify-center z-50">
      {/* Energy waves */}
      {expanded && [0, 1, 2].map(i => (
        <div
          key={i}
          className="absolute rounded-full border border-cyan-400/30"
          style={{
            width: 200, height: 200,
            animation: `energyPulse 2s ease-out ${i * 0.6}s infinite`,
          }}
        />
      ))}

      {/* AI Core */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: expanded ? 120 : 0,
          height: expanded ? 120 : 0,
          transition: 'width 1s ease-out, height 1s ease-out',
        }}
      >
        {/* Rotating neon rings */}
        <svg className="absolute inset-0 animate-spin-slow" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,210,255,0.2)" strokeWidth="1" strokeDasharray="6 4" />
        </svg>
        <svg className="absolute inset-0 animate-spin-reverse" viewBox="0 0 120 120" style={{ animationDuration: '6s' }}>
          <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(0,210,255,0.15)" strokeWidth="1" strokeDasharray="3 5" />
        </svg>

        {/* Core glow */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-2xl animate-energy-pulse" />
        <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-md animate-energy-pulse" />
        <div className="absolute w-8 h-8 rounded-full bg-white/80" style={{ boxShadow: '0 0 30px rgba(0,210,255,0.9)' }} />
      </div>

      {/* Terminal text */}
      {expanded && (
        <div className="absolute bottom-1/3 text-center">
          <p className="text-xs font-mono text-cyan-400 tracking-widest" style={{ textShadow: '0 0 10px rgba(0,210,255,0.6)' }}>
            INITIALIZING AI CORE<span className="animate-pulse">...</span>
          </p>
        </div>
      )}

      <style>{`
        @keyframes energyPulse {
          0% { transform: scale(0.3); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
