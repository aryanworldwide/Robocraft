import React from 'react';

// Reusable deterministic progress ring for the engineering dashboard.
export default function MasteryRing({ value, size = 130, stroke = 11, label = 'Mastery', color = '#00D2FF', sublabel }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.max(0, Math.min(100, value)) / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,210,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s ease-out', filter: 'drop-shadow(0 0 6px rgba(0,210,255,0.25))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{value}%</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        {sublabel && <span className="text-[9px] text-muted-foreground/70 mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}
