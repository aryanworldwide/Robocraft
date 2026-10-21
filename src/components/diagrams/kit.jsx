import React from 'react';

// Small drawing kit shared by every textbook diagram.
// Colours are mid-tone so they read on both the light and dark theme;
// text and outlines use currentColor (the theme's foreground colour).
export const K = {
  cyan: '#06b6d4', purple: '#a855f7', green: '#22c55e', amber: '#f59e0b',
  pink: '#ec4899', red: '#ef4444', blue: '#3b82f6', orange: '#f97316', grey: '#94a3b8',
};

export function Svg({ w = 340, h = 200, label, children }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img" aria-label={label}
      className="text-foreground select-none" style={{ maxHeight: 420, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {children}
    </svg>
  );
}

export function T({ x, y, children, s = 10, a = 'middle', b = false, c = 'currentColor', o = 1, i = false }) {
  const parts = React.Children.toArray(children);
  if (parts.some(p => typeof p !== 'string' && typeof p !== 'number')) {
    return (
      <text x={x} y={y} fontSize={s} textAnchor={a} fontWeight={b ? 700 : 400} fill={c} opacity={o} dominantBaseline="middle" style={{ whiteSpace: 'pre' }}>{children}</text>
    );
  }
  const str = parts.join('');
  const lines = str.split('\n');
  return (
    <text x={x} y={y} fontSize={s} textAnchor={a} fontWeight={b ? 700 : 400} fill={c} opacity={o}
      fontStyle={i ? 'italic' : 'normal'} dominantBaseline="middle" style={{ whiteSpace: 'pre' }}>
      {lines.map((ln, k) => <tspan key={k} x={x} dy={k === 0 ? -(lines.length - 1) * s * 0.6 : s * 1.2}>{ln}</tspan>)}
    </text>
  );
}

export function Box({ x, y, w, h, label, sub, c = K.cyan, r = 8, s = 10, dash }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill="hsl(var(--background))" />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={c} fillOpacity={0.14} stroke={c} strokeWidth={1.5} strokeDasharray={dash} />
      {label && <T x={x + w / 2} y={y + h / 2 - (sub ? 6 : 0)} s={s} b>{label}</T>}
      {sub && <T x={x + w / 2} y={y + h / 2 + 8} s={s - 2} o={0.75}>{sub}</T>}
    </g>
  );
}

export function Arrow({ x1, y1, x2, y2, c = 'currentColor', w = 1.5, head = 7, dash, both = false, label, lx, ly, ls = 9 }) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const tip = (x, y, a) => {
    const p1 = [x - head * Math.cos(a - 0.4), y - head * Math.sin(a - 0.4)];
    const p2 = [x - head * Math.cos(a + 0.4), y - head * Math.sin(a + 0.4)];
    return `${x},${y} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`;
  };
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeDasharray={dash} opacity={0.85} />
      <polygon points={tip(x2, y2, ang)} fill={c} opacity={0.85} />
      {both && <polygon points={tip(x1, y1, ang + Math.PI)} fill={c} opacity={0.85} />}
      {label && <T x={lx ?? (x1 + x2) / 2} y={ly ?? (y1 + y2) / 2 - 7} s={ls} o={0.85}>{label}</T>}
    </g>
  );
}

export function Line({ x1, y1, x2, y2, c = 'currentColor', w = 1.5, dash, o = 0.85 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeDasharray={dash} opacity={o} strokeLinecap="round" />;
}

export function Circle({ x, y, r, c = K.cyan, fo = 0.14, label, s = 10, w = 1.5, dash }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={c} fillOpacity={fo} stroke={c} strokeWidth={w} strokeDasharray={dash} />
      {label && <T x={x} y={y} s={s} b>{label}</T>}
    </g>
  );
}

// Curved arrow around a centre (for rotation)
export function ArcArrow({ x, y, r, from = -40, to = 220, c = 'currentColor', w = 1.5 }) {
  const rad = d => (d * Math.PI) / 180;
  const sx = x + r * Math.cos(rad(from)), sy = y + r * Math.sin(rad(from));
  const ex = x + r * Math.cos(rad(to)), ey = y + r * Math.sin(rad(to));
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 1 : 0;
  const tang = rad(to) + (sweep ? Math.PI / 2 : -Math.PI / 2);
  const h = 6;
  const p1 = [ex - h * Math.cos(tang - 0.45), ey - h * Math.sin(tang - 0.45)];
  const p2 = [ex - h * Math.cos(tang + 0.45), ey - h * Math.sin(tang + 0.45)];
  return (
    <g opacity={0.85}>
      <path d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} ${sweep} ${ex} ${ey}`} fill="none" stroke={c} strokeWidth={w} />
      <polygon points={`${ex},${ey} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} fill={c} />
    </g>
  );
}

export function Pivot({ x, y, c = 'currentColor' }) {
  return <circle cx={x} cy={y} r={4} fill="hsl(var(--background))" stroke={c} strokeWidth={1.8} />;
}

export function Ground({ x, y, w = 40 }) {
  return (
    <g opacity={0.8}>
      <Line x1={x - w / 2} y1={y} x2={x + w / 2} y2={y} />
      {Array.from({ length: Math.floor(w / 8) }).map((_, i) => (
        <Line key={i} x1={x - w / 2 + i * 8 + 4} y1={y} x2={x - w / 2 + i * 8} y2={y + 6} w={1} />
      ))}
    </g>
  );
}

// Cog wheel drawn from tooth count
export function Gear({ x, y, r, teeth = 12, c = K.cyan, rot = 0 }) {
  const pts = [];
  const n = teeth * 4;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rot;
    const rr = i % 4 < 2 ? r + 5 : r - 1;
    pts.push(`${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`);
  }
  return (
    <g>
      <polygon points={pts.join(' ')} fill={c} fillOpacity={0.18} stroke={c} strokeWidth={1.3} />
      <circle cx={x} cy={y} r={r * 0.25} fill="none" stroke={c} strokeWidth={1.3} />
    </g>
  );
}
