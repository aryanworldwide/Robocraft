import React from 'react';
import { PIN_COLORS } from '@/lib/circuit/components';

// Render a single placed component with its pins.
function ComponentBox({ comp, selectedPin, onPinClick }) {
  const pinsBySide = (side) => comp.pins.filter(p => side === 'left' ? p.x <= 2 : p.x >= comp.width - 2);

  return (
    <g transform={`translate(${comp.x},${comp.y})`} style={{ cursor: 'default' }}>
      {/* glow shadow */}
      <rect x="3" y="4" width={comp.width} height={comp.height} rx="12" fill="#000" opacity="0.25" />
      {/* body */}
      <rect width={comp.width} height={comp.height} rx="12"
        fill={comp.color} fillOpacity="0.18" stroke={comp.color} strokeWidth="2" />
      {/* icon + name */}
      <text x={comp.width / 2} y="22" textAnchor="middle" fontSize="22">{comp.icon}</text>
      <text x={comp.width / 2} y={comp.height - 8} textAnchor="middle" fontSize="10"
        fontWeight="700" fill="#CBD5E1" fontFamily="'Inter',sans-serif">
        {comp.name.length > 18 ? comp.name.slice(0, 17) + '…' : comp.name}
      </text>

      {/* pins */}
      {comp.pins.map(p => {
        const key = `${comp.instanceId}:${p.id}`;
        const selected = selectedPin === key;
        const color = PIN_COLORS[p.type] || '#94A3B8';
        const isRight = p.x >= comp.width - 2;
        return (
          <g key={p.id} onClick={(e) => { e.stopPropagation(); onPinClick(comp.instanceId, p.id); }}
            style={{ cursor: 'pointer' }}>
            {/* hit area */}
            <circle cx={p.x} cy={p.y} r="11" fill="transparent" />
            {/* halo when selected */}
            {selected && <circle cx={p.x} cy={p.y} r="9" fill="none" stroke="#00D2FF" strokeWidth="2" opacity="0.8">
              <animate attributeName="r" values="7;10;7" dur="1s" repeatCount="indefinite" />
            </circle>}
            {/* pin pad */}
            <circle cx={p.x} cy={p.y} r="4.5" fill={color} stroke="#0F172A" strokeWidth="1.2"
              style={{ filter: selected ? 'drop-shadow(0 0 4px #00D2FF)' : 'none' }} />
            {/* label */}
            <text x={isRight ? p.x - 8 : p.x + 8} y={p.y + 3}
              textAnchor={isRight ? 'end' : 'start'} fontSize="8.5" fontWeight="600"
              fill="#E2E8F0" fontFamily="'Inter',sans-serif" style={{ pointerEvents: 'none' }}>
              {p.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function Workbench({ components, wires, selectedPin, selectedWire, onPinClick, onWireClick, onCanvasClick }) {
  const maxX = Math.max(...components.map(c => c.x + c.width), 400) + 40;
  const maxY = Math.max(...components.map(c => c.y + c.height), 300) + 40;

  const wireColor = (w) => w.status === 'correct' ? '#22C55E' : w.status === 'wrong' ? '#EF4444' : '#64748B';

  return (
    <div className="relative w-full h-full overflow-auto grid-pattern rounded-2xl"
      style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,210,255,0.06), transparent 60%)' }}>
      <svg width={maxX} height={maxY} style={{ display: 'block' }} onClick={onCanvasClick}>
        {/* wires (under components) */}
        {wires.map((w, i) => {
          const [fi, fp] = w.from.split(':');
          const [ti, tp] = w.to.split(':');
          const fc = components.find(c => c.instanceId === fi);
          const tc = components.find(c => c.instanceId === ti);
          if (!fc || !tc) return null;
          const fPin = fc.pins.find(p => p.id === fp);
          const tPin = tc.pins.find(p => p.id === tp);
          if (!fPin || !tPin) return null;
          const x1 = fc.x + fPin.x, y1 = fc.y + fPin.y;
          const x2 = tc.x + tPin.x, y2 = tc.y + tPin.y;
          const dx = (x2 - x1) / 2;
          const selected = selectedWire === i;
          return (
            <g key={i} onClick={(e) => { e.stopPropagation(); onWireClick(i); }} style={{ cursor: 'pointer' }}>
              {/* wide invisible hit area */}
              <path d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                fill="none" stroke="transparent" strokeWidth="14" />
              <path d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                fill="none" stroke={wireColor(w)} strokeWidth={selected ? 5 : 3.2}
                strokeLinecap="round"
                strokeOpacity={selected ? 1 : 0.9}
                strokeDasharray={w.status === 'wrong' ? '6 4' : 'none'}
                style={selected ? { filter: 'drop-shadow(0 0 5px #00D2FF)' } : undefined} />
              {/* end caps */}
              <circle cx={x1} cy={y1} r="3.2" fill={wireColor(w)} />
              <circle cx={x2} cy={y2} r="3.2" fill={wireColor(w)} />
            </g>
          );
        })}

        {/* components */}
        {components.map(comp => (
          <ComponentBox key={comp.instanceId} comp={comp}
            selectedPin={selectedPin} onPinClick={onPinClick} />
        ))}
      </svg>
    </div>
  );
}