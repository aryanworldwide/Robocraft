import React, { useState} from 'react';
import { PIN_COLORS } from '@/lib/circuit/components';

function getPinPos(components, pinKey) {
  const [instanceId, pinId] = pinKey.split(':');
  const comp = components.find(c => c.instanceId === instanceId);
  if (!comp) return null;
  const pin = comp.pins.find(p => p.id === pinId);
  if (!pin) return null;
  return { x: comp.x + pin.x, y: comp.y + pin.y };
}

const STATUS_COLORS = {
  ok: '#4ADE80',
  warn: '#F59E0B',
  error: '#EF4444',
};

export default function CircuitCanvas({ components, wires, selectedPin, selectedWire, zoom, pan, onPanChange, onZoomChange, onComponentMove, onPinClick, onWireClick, onComponentSelect, selectedComponent }) {
  const [dragging, setDragging] = useState(null);

  const handlePointerDown = (e) => {
    if (e.target.closest('.placed-component') || e.target.closest('.pin-button') || e.target.closest('.wire-path')) return;
    setDragging({ type: 'pan', startX: e.clientX - pan.x, startY: e.clientY - pan.y });
  };

  const handleComponentDown = (e, comp) => {
    e.stopPropagation();
    onComponentSelect?.(comp.instanceId);
    setDragging({ type: 'comp', id: comp.instanceId, startX: e.clientX, startY: e.clientY, ox: comp.x, oy: comp.y });
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    if (dragging.type === 'pan') {
      onPanChange({ x: e.clientX - dragging.startX, y: e.clientY - dragging.startY });
    } else {
      const dx = (e.clientX - dragging.startX) / zoom;
      const dy = (e.clientY - dragging.startY) / zoom;
      onComponentMove(dragging.id, dragging.ox + dx, dragging.oy + dy);
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-[#0a0e1a]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
      onWheel={(e) => { e.preventDefault(); onZoomChange(Math.max(0.3, Math.min(3, zoom * (e.deltaY > 0 ? 0.9 : 1.1)))); }}
      style={{ touchAction: 'none' }}
    >
      <div className="absolute" style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
        <div className="absolute grid-pattern" style={{ width: '6000px', height: '6000px', left: '-3000px', top: '-3000px' }} />

        <svg className="absolute pointer-events-none" style={{ overflow: 'visible', width: 1, height: 1 }}>
          {wires.map((wire, i) => {
            const from = getPinPos(components, wire.from);
            const to = getPinPos(components, wire.to);
            if (!from || !to) return null;
            const midX = (from.x + to.x) / 2;
            const path = `M ${from.x} ${from.y} C ${midX} ${from.y} ${midX} ${to.y} ${to.x} ${to.y}`;
            const status = wire.status || (wire.correct ? 'ok' : 'error');
            const color = STATUS_COLORS[status] || '#4ADE80';
            const isSel = selectedWire === i;
            return (
              <g key={i}>
                {/* invisible thick hit area for easy tapping */}
                <path className="wire-path" d={path} fill="none" stroke="transparent" strokeWidth={14}
                  style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                  onPointerDown={(e) => { e.stopPropagation(); onWireClick?.(i); }} />
                <path d={path} fill="none" stroke={color} strokeWidth={isSel ? 5 : 3} strokeLinecap="round"
                  className={status === 'ok' ? 'wire-current' : ''}
                  style={{ filter: `drop-shadow(0 0 ${isSel ? 6 : 4}px ${color}${isSel ? 'CC' : '80'})` }} />
                {status === 'ok' && <circle cx={midX} cy={(from.y + to.y) / 2} r={3} fill={color} className="animate-pulse" />}
              </g>
            );
          })}
          {selectedPin && (() => {
            const pos = getPinPos(components, selectedPin);
            if (!pos) return null;
            return <circle cx={pos.x} cy={pos.y} r={10} fill="none" stroke="#00D2FF" strokeWidth={2.5} className="animate-pulse" />;
          })()}
        </svg>

        {components.map(comp => {
          const isSelComp = selectedComponent === comp.instanceId;
          return (
            <div key={comp.instanceId} className="placed-component absolute glass-strong rounded-xl select-none"
              style={{ left: comp.x, top: comp.y, width: comp.width, zIndex: 10, border: `1px solid ${isSelComp ? comp.color : comp.color + '50'}`, boxShadow: isSelComp ? `0 0 0 2px ${comp.color}` : 'none', cursor: 'move' }}
              onPointerDown={(e) => handleComponentDown(e, comp)}>
              <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-white/5">
                <span className="text-base">{comp.icon}</span>
                <span className="text-[10px] font-bold" style={{ color: comp.color }}>{comp.name}</span>
              </div>
              {comp.pins.map(pin => {
                const pinKey = `${comp.instanceId}:${pin.id}`;
                const isSel = selectedPin === pinKey;
                const conn = wires.find(w => (w.from === pinKey || w.to === pinKey));
                const color = PIN_COLORS[pin.type] || '#00D2FF';
                const isRight = pin.x > comp.width / 2;
                return (
                  <button key={pin.id} className="pin-button absolute group" style={{ left: pin.x, top: pin.y, transform: 'translate(-50%,-50%)' }}
                    onPointerDown={(e) => { e.stopPropagation(); onPinClick(comp.instanceId, pin.id); }}>
                    <div className="w-3.5 h-3.5 rounded-full border-2 transition-transform"
                      style={{ background: isSel ? color : conn ? color : 'transparent', borderColor: color, boxShadow: isSel ? `0 0 10px ${color}` : 'none', transform: isSel ? 'scale(1.6)' : '' }} />
                    <span className="absolute text-[8px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ [isRight ? 'right' : 'left']: '14px', top: '50%', transform: 'translateY(-50%)', color }}>
                      {pin.label}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}

        {components.length === 0 && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-sm text-muted-foreground">Add components from the palette below</p>
          </div>
        )}
      </div>
    </div>
  );
}