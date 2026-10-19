import React, { useState, useEffect } from 'react';

const LABELS = [
  { x: 20, y: 25, text: 'ESP32', color: '#00D2FF' },
  { x: 75, y: 18, text: 'Sensor', color: '#A78BFA' },
  { x: 10, y: 55, text: 'Motor', color: '#4ADE80' },
  { x: 80, y: 50, text: 'Servo', color: '#F59E0B' },
  { x: 25, y: 78, text: 'Arduino', color: '#22D3EE' },
  { x: 70, y: 75, text: 'Battery', color: '#F97316' },
];

export default function RobotBlueprintStage({ onDone }) {
  const [buildProgress, setBuildProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [illuminated, setIlluminated] = useState(false);

  useEffect(() => {
    const t1 = setInterval(() => setBuildProgress(p => {
      if (p >= 100) { clearInterval(t1); return 100; }
      return p + 4;
    }), 30);
    const t2 = setTimeout(() => setScanning(true), 3200);
    const t3 = setTimeout(() => { setIlluminated(true); setScanning(false); }, 4600);
    const t4 = setTimeout(onDone, 5400);
    return () => { clearInterval(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 hex-grid opacity-15" />

      <div className="relative w-full max-w-sm aspect-square px-6">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Blueprint robot outline */}
          <g
            stroke="rgba(0,210,255,0.4)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000 - (buildProgress / 100) * 1000,
              transition: 'stroke-dashoffset 0.05s linear',
              filter: illuminated ? 'drop-shadow(0 0 6px rgba(0,210,255,0.8))' : 'none',
              opacity: illuminated ? 1 : 0.5,
            }}
          >
            {/* Head */}
            <rect x="115" y="40" width="70" height="55" rx="10" />
            <circle cx="132" cy="62" r="5" />
            <circle cx="168" cy="62" r="5" />
            <line x1="150" y1="75" x2="150" y2="88" />
            <line x1="140" y1="88" x2="160" y2="88" />
            {/* Antenna */}
            <line x1="150" y1="40" x2="150" y2="25" />
            <circle cx="150" cy="22" r="4" />
            {/* Body */}
            <rect x="100" y="100" width="100" height="90" rx="12" />
            <circle cx="150" cy="130" r="12" />
            <rect x="120" y="150" width="60" height="6" rx="3" />
            <rect x="120" y="164" width="60" height="6" rx="3" />
            <rect x="120" y="178" width="40" height="6" rx="3" />
            {/* Arms */}
            <rect x="75" y="105" width="20" height="55" rx="8" />
            <rect x="205" y="105" width="20" height="55" rx="8" />
            <circle cx="85" cy="168" r="6" />
            <circle cx="215" cy="168" r="6" />
            {/* Legs */}
            <rect x="110" y="195" width="30" height="65" rx="8" />
            <rect x="160" y="195" width="30" height="65" rx="8" />
            <rect x="105" y="258" width="40" height="10" rx="5" />
            <rect x="155" y="258" width="40" height="10" rx="5" />
          </g>

          {/* Scan beam */}
          {scanning && (
            <rect
              x="0" y="0" width="300" height="6"
              fill="url(#scanGradient)"
              style={{ animation: 'scanBeam 1.4s ease-in-out', transformOrigin: 'center' }}
            />
          )}

          {/* Illumination glow */}
          {illuminated && (
            <rect x="100" y="40" width="100" height="228" rx="12" fill="rgba(0,210,255,0.05)" />
          )}

          <defs>
            <linearGradient id="scanGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgba(0,210,255,0.8)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>

        {/* Labels */}
        {illuminated && LABELS.map((label, i) => (
          <div
            key={label.text}
            className="absolute animate-fade-in"
            style={{
              left: `${label.x}%`,
              top: `${label.y}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: label.color, boxShadow: `0 0 6px ${label.color}` }} />
              <span className="text-[10px] font-mono font-medium" style={{ color: label.color, textShadow: `0 0 4px ${label.color}` }}>
                {label.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="absolute bottom-16 text-xs font-mono text-cyan-400/60 tracking-widest">
        {buildProgress < 100 ? 'BUILDING BLUEPRINT...' : scanning ? 'SCANNING...' : 'SYSTEM VERIFIED'}
      </p>

      <style>{`
        @keyframes scanBeam {
          0% { transform: translateY(0); }
          100% { transform: translateY(294px); }
        }
      `}</style>
    </div>
  );
}