import React from 'react';

const GearIcon = ({ className, size = 24 }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} width={size} height={size}>
    <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export default function HolographicProgress({ progress }) {
  const size = 160;
  const strokeWidth = 6;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer rotating dashed ring */}
      <svg className="absolute inset-0 animate-spin-slow" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius + 8} fill="none" stroke="rgba(0, 210, 255, 0.15)" strokeWidth="1" strokeDasharray="4 8" />
      </svg>

      {/* Counter-rotating inner ring */}
      <svg className="absolute inset-0 animate-spin-reverse" width={size} height={size} style={{ animationDuration: '10s' }}>
        <circle cx={size/2} cy={size/2} r={radius - 10} fill="none" stroke="rgba(0, 210, 255, 0.08)" strokeWidth="1" strokeDasharray="2 6" />
      </svg>

      {/* Progress arc */}
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(0, 210, 255, 0.1)" strokeWidth={strokeWidth} />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="url(#splashGradient)" strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.3s ease-out', filter: 'drop-shadow(0 0 8px rgba(0, 210, 255, 0.6))' }}
        />
        <defs>
          <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Rotating gears on sides */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 animate-spin-slow" style={{ animationDuration: '6s' }}>
        <GearIcon className="text-cyan-400/40" size={20} />
      </div>
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 animate-spin-reverse" style={{ animationDuration: '5s' }}>
        <GearIcon className="text-blue-400/40" size={16} />
      </div>

      {/* Center percentage */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="absolute w-16 h-16 rounded-full bg-cyan-500/10 blur-xl animate-energy-pulse" />
        <span className="relative text-3xl font-bold text-cyan-400 neon-text">
          {Math.round(progress)}<span className="text-lg">%</span>
        </span>
      </div>
    </div>
  );
}
