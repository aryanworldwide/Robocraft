import React, { useRef, useState, useCallback, useEffect } from 'react';
import { LAB_COMPONENTS, getDef, pinLocalPos, pinWorldPos, isBoard } from '@/lib/lab/labComponents';

const PIN_COLORS = { power:'#EF4444', ground:'#1F2937', digital:'#3B82F6', analog:'#22C55E', pwm:'#F97316', data:'#A78BFA', plus:'#EF4444', minus:'#1F2937', signal:'#EAB308', terminal:'#94A3B8' };

export default function Canvas({
  components, wires, selectedId, pendingWire, simState, running, wireStatuses,
  onSelect, onMove, onMoveStart, onPinDown, onBackgroundDown, onDropComponent,
}) {
  const svgRef = useRef(null);
  const [view, setView] = useState({ x: 40, y: 40, scale: 0.7 });
  const [cursor, setCursor] = useState(null);
  const drag = useRef(null);
  const pointers = useRef(new Map());

  const pinchInfo = () => {
    const pts = [...pointers.current.values()];
    if (pts.length < 2) return null;
    return {
      dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
      mx: (pts[0].x + pts[1].x) / 2,
      my: (pts[0].y + pts[1].y) / 2,
    };
  };

  const compsRef = useRef(components);
  compsRef.current = components;

  useEffect(() => {
    const fit = () => {
      const comps = compsRef.current || [];
      if (!comps.length || !svgRef.current) { setView({ x: 40, y: 40, scale: 0.7 }); return; }
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      comps.forEach(c => {
        const d = getDef(c.type); if (!d) return;
        minX = Math.min(minX, c.x); minY = Math.min(minY, c.y);
        maxX = Math.max(maxX, c.x + d.w); maxY = Math.max(maxY, c.y + d.h);
      });
      if (minX === Infinity) { setView({ x: 40, y: 40, scale: 0.7 }); return; }
      const rect = svgRef.current.getBoundingClientRect();
      const w = maxX - minX, h = maxY - minY;
      const s = Math.min(1.2, Math.max(0.3, Math.min(rect.width / w, rect.height / h) * 0.85));
      setView({ scale: s, x: (rect.width - w * s) / 2 - minX * s, y: (rect.height - h * s) / 2 - minY * s });
    };
    window.addEventListener('lab-fit', fit);
    return () => window.removeEventListener('lab-fit', fit);
  }, []);

  const toWorld = useCallback((clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    return { x: view.x + (clientX - rect.left) / view.scale, y: view.y + (clientY - rect.top) / view.scale };
  }, [view]);

  const onWheel = (e) => {
    e.preventDefault();
    const rect = svgRef.current.getBoundingClientRect();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const ns = Math.min(3, Math.max(0.3, view.scale * factor));
    const wx = view.x + (e.clientX - rect.left) / view.scale;
    const wy = view.y + (e.clientY - rect.top) / view.scale;
    setView({ scale: ns, x: wx - (e.clientX - rect.left) / ns, y: wy - (e.clientY - rect.top) / ns });
  };

  const onPointerDownBg = (e) => {
    onBackgroundDown();
    svgRef.current.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    drag.current = { mode: 'pan', sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y };
    // Second finger lands → switch to pinch-zoom, anchored at the midpoint
    const p = pinchInfo();
    if (p) {
      const rect = svgRef.current.getBoundingClientRect();
      drag.current = {
        mode: 'pinch', startDist: p.dist, startScale: view.scale,
        wx: view.x + (p.mx - rect.left) / view.scale,
        wy: view.y + (p.my - rect.top) / view.scale,
      };
    }
  };

  const onPointerDownComp = (e, comp) => {
    e.stopPropagation();
    onSelect(comp.id);
    onMoveStart?.();
    svgRef.current.setPointerCapture(e.pointerId);
    drag.current = { mode: 'move', id: comp.id, sx: e.clientX, sy: e.clientY, ox: comp.x, oy: comp.y };
  };

  const onPointerMove = (e) => {
    if (pendingWire) setCursor(toWorld(e.clientX, e.clientY));
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (drag.current?.mode === 'pinch') {
      const p = pinchInfo();
      if (!p) return;
      const ns = Math.min(3, Math.max(0.3, drag.current.startScale * (p.dist / drag.current.startDist)));
      const rect = svgRef.current.getBoundingClientRect();
      setView({ scale: ns, x: drag.current.wx - (p.mx - rect.left) / ns, y: drag.current.wy - (p.my - rect.top) / ns });
      return;
    }
    if (!drag.current) return;
    if (drag.current.mode === 'pan') {
      setView(v => ({ ...v, x: drag.current.vx + (e.clientX - drag.current.sx), y: drag.current.vy + (e.clientY - drag.current.sy) }));
    } else {
      const dx = (e.clientX - drag.current.sx) / view.scale;
      const dy = (e.clientY - drag.current.sy) / view.scale;
      onMove(drag.current.id, drag.current.ox + dx, drag.current.oy + dy);
    }
  };

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (drag.current?.mode === 'pinch' && pointers.current.size < 2) drag.current = null;
    else if (drag.current?.mode !== 'pinch') drag.current = null;
    try { svgRef.current.releasePointerCapture(e.pointerId); } catch {}
  };

  const onDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('lab/type');
    if (!type || !LAB_COMPONENTS[type]) return;
    const def = LAB_COMPONENTS[type];
    const w = toWorld(e.clientX, e.clientY);
    onDropComponent(type, w.x - def.w / 2, w.y - def.h / 2);
  };

  const wireColor = (idx) => {
    const s = wireStatuses?.[idx];
    if (s === 'correct') return '#22C55E';
    if (s === 'incorrect') return '#EF4444';
    return '#06B6D4';
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0f1c] grid-pattern">
      {/* zoom controls */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1">
        <button onClick={() => setView(v => ({ ...v, scale: Math.min(3, v.scale * 1.2) }))} className="w-7 h-7 rounded-lg glass text-cyan-400 text-sm font-bold">+</button>
        <button onClick={() => setView(v => ({ ...v, scale: Math.max(0.3, v.scale / 1.2) }))} className="w-7 h-7 rounded-lg glass text-cyan-400 text-sm font-bold">−</button>
        <button onClick={() => setView({ x: 40, y: 40, scale: 0.7 })} className="w-7 h-7 rounded-lg glass text-cyan-400 text-[10px]">⌂</button>
      </div>

      <svg ref={svgRef} className="w-full h-full touch-none"
        onWheel={onWheel}
        onPointerDown={onPointerDownBg}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}>
        <g transform={`translate(${view.x},${view.y}) scale(${view.scale})`}>
          {/* wires */}
          {wires.map((w, i) => {
            const fc = components.find(c => c.id === w.from.compId);
            const tc = components.find(c => c.id === w.to.compId);
            if (!fc || !tc) return null;
            const fd = getDef(fc.type), td = getDef(tc.type);
            const a = pinWorldPos(fc, fd, w.from.pinId), b = pinWorldPos(tc, td, w.to.pinId);
            if (!a || !b) return null;
            const col = wireColor(i);
            return (
              <g key={w.id || i}>
                <path d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke={col} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.95} />
                {running && <path d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke="#fff" strokeWidth={1.5} strokeDasharray="4 6" className="wire-current" fill="none" />}
              </g>
            );
          })}

          {/* rubber band */}
          {pendingWire && cursor && (() => {
            const comp = components.find(c => c.id === pendingWire.compId);
            const def = comp && getDef(comp.type);
            const a = comp && pinWorldPos(comp, def, pendingWire.pinId);
            if (!a) return null;
            return <path d={`M ${a.x} ${a.y} L ${cursor.x} ${cursor.y}`} stroke="#06B6D4" strokeWidth={2} strokeDasharray="5 4" fill="none" opacity={0.8} />;
          })()}

          {/* components */}
          {components.map(comp => (
            <ComponentNode key={comp.id} comp={comp} def={getDef(comp.type)} selected={selectedId === comp.id}
              wires={wires} simState={simState} running={running}
              onPointerDown={e => onPointerDownComp(e, comp)} onPinDown={(e, pid) => { e.stopPropagation(); onPinDown(comp.id, pid); }} />
          ))}
        </g>
      </svg>

      <div className="absolute left-3 bottom-3 text-[10px] text-muted-foreground/70 glass px-2 py-1 rounded-lg pointer-events-none">
        {typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches
          ? 'Tap 2 pins to wire · Drag a part to move it · Pinch or +/− to zoom'
          : 'Drag from left · Click 2 pins to wire · Drag to move · Scroll to zoom'}
      </div>
    </div>
  );
}

function ComponentNode({ comp, def, selected, wires, simState, running, onPointerDown, onPinDown }) {
  if (!def) return null;
  const rot = comp.rot || 0;
  const wiredPins = new Set();
  wires.forEach(w => {
    if (w.from.compId === comp.id) wiredPins.add(w.from.pinId);
    if (w.to.compId === comp.id) wiredPins.add(w.to.pinId);
  });
  return (
    <g transform={`translate(${comp.x},${comp.y}) rotate(${rot} ${def.w / 2} ${def.h / 2})`}
      onPointerDown={onPointerDown} style={{ cursor: 'grab' }}>
      {/* body */}
      <rect width={def.w} height={def.h} rx={10} fill="rgba(15,23,42,0.85)" stroke={selected ? '#06B6D4' : 'rgba(6,182,212,0.25)'} strokeWidth={selected ? 2.5 : 1.2} />
      {selected && <rect x={-3} y={-3} width={def.w + 6} height={def.h + 6} rx={13} fill="none" stroke="#06B6D4" strokeWidth={1} opacity={0.4} />}

      {/* inner visual */}
      <ComponentVisual comp={comp} def={def} simState={simState} running={running} />

      {/* name tag */}
      <text x={def.w / 2} y={def.h / 2 + (def.h > 90 ? 38 : 26)} textAnchor="middle" fontSize={11} fontWeight={700} fill="#e2e8f0">{def.name}</text>

      {/* pins */}
      {def.pins.map(pin => {
        const lp = pinLocalPos(def, pin.id);
        if (!lp) return null;
        const color = PIN_COLORS[pin.type] || '#94A3B8';
        const wired = wiredPins.has(pin.id);
        const labelDx = pin.side === 'left' ? -7 : pin.side === 'right' ? 7 : 0;
        const labelDy = pin.side === 'top' ? -7 : pin.side === 'bottom' ? 7 : 0;
        const anchor = pin.side === 'left' ? 'end' : pin.side === 'right' ? 'start' : 'middle';
        return (
          <g key={pin.id}>
            <circle cx={lp.x} cy={lp.y} r={6} fill={color} stroke="#0a0f1c" strokeWidth={1.5} style={{ cursor: 'crosshair' }} onPointerDown={(e) => onPinDown(e, pin.id)} />
            {wired && <circle cx={lp.x} cy={lp.y} r={9} fill="none" stroke="#22C55E" strokeWidth={1.5} opacity={0.6} />}
            <text x={lp.x + labelDx} y={lp.y + labelDy + 3} fontSize={7.5} fontWeight={600} fill="#94a3b8" textAnchor={anchor} transform={`rotate(${-rot} ${lp.x + labelDx} ${lp.y + labelDy + 3})`}>{pin.label}</text>
          </g>
        );
      })}
    </g>
  );
}

function ComponentVisual({ comp, def, simState, running }) {
  const cx = def.w / 2, cy = def.h / 2;
  switch (comp.type) {
    case 'led': {
      const on = running && simState?.ledOn;
      return <g><circle cx={cx} cy={cy - 6} r={14} fill={on ? '#FBBF24' : '#1e293b'} stroke={on ? '#FDE68A' : '#334155'} strokeWidth={2} style={on ? { filter: 'drop-shadow(0 0 8px #FBBF24)' } : undefined} /></g>;
    }
    case 'buzzer': {
      const on = running && simState?.buzzerOn;
      return <g><circle cx={cx} cy={cy} r={10} fill="#1e293b" stroke="#475569" strokeWidth={2} />{on && <g stroke="#FB923C" strokeWidth={1.5} fill="none"><path d={`M ${cx + 10} ${cy} q 6 -6 0 -12`} /><path d={`M ${cx + 14} ${cy} q 8 -8 0 -16`} /></g>}</g>;
    }
    case 'servo': {
      const ang = (running ? (simState?.servoAngle ?? 90) : 90) - 90;
      return <g><rect x={cx - 14} y={cy - 14} width={28} height={28} rx={4} fill="#1e293b" stroke="#475569" /><line x1={cx} y1={cy} x2={cx} y2={cy - 22} stroke="#60A5FA" strokeWidth={3} strokeLinecap="round" transform={`rotate(${ang} ${cx} ${cy})`} /><circle cx={cx} cy={cy} r={3} fill="#60A5FA" /></g>;
    }
    case 'dc_motor': {
      const rot = running ? (simState?.motorAngle ?? 0) : 0;
      return <g transform={`rotate(${rot} ${cx} ${cy})`}><circle cx={cx} cy={cy} r={16} fill="#1e293b" stroke="#475569" strokeWidth={2} />{[0, 60, 120].map(a => <line key={a} x1={cx} y1={cy} x2={cx + 15 * Math.cos(a * Math.PI / 180)} y2={cy + 15 * Math.sin(a * Math.PI / 180)} stroke="#34D399" strokeWidth={2.5} />)}</g>;
    }
    case 'ir_sensor': {
      const det = running && simState?.irDetected;
      return <g><circle cx={cx} cy={cy} r={7} fill={det ? '#22C55E' : '#334155'} stroke="#475569" />{det && <path d={`M ${cx + 8} ${cy} h 30`} stroke="#22C55E" strokeWidth={1.5} strokeDasharray="3 3" opacity={0.7} />}</g>;
    }
    case 'ultrasonic': {
      const d = running ? Math.round(simState?.distance ?? 0) : '--';
      return <g><circle cx={cx - 12} cy={cy} r={6} fill="#0ea5e9" /><circle cx={cx + 12} cy={cy} r={6} fill="#0ea5e9" />{running && <text x={cx} y={cy + 28} textAnchor="middle" fontSize={10} fontWeight={700} fill="#7dd3fc">{d} cm</text>}</g>;
    }
    case 'lcd': case 'oled':
      return <g><rect x={8} y={10} width={def.w - 16} height={def.h - 30} rx={3} fill="#0b1f2a" stroke="#334155" /><text x={16} y={28} fontSize={9} fill="#7dd3fc" fontFamily="monospace">{running ? 'RoboCraft' : '----------'}</text></g>;
    case 'push_button':
      return <g><circle cx={cx} cy={cy} r={16} fill="#1e293b" stroke="#FBBF24" strokeWidth={2} /></g>;
    case 'battery':
      return <g><rect x={8} y={10} width={def.w - 16} height={def.h - 20} rx={4} fill="#1e293b" stroke="#475569" /><text x={cx} y={cy} textAnchor="middle" fontSize={12} fill="#F87171">9V</text></g>;
    default:
      return <g><text x={cx} y={cy - 6} textAnchor="middle" fontSize={26}>{def.emoji}</text></g>;
  }
}