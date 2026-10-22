import React, { useRef, useState, useCallback, useEffect } from 'react';
import { LAB_COMPONENTS, getDef, pinLocalPos, pinWorldPos, isBoard } from '@/lib/lab/labComponents';

const PIN_COLORS = { power:'#EF4444', ground:'#1F2937', digital:'#3B82F6', analog:'#22C55E', pwm:'#F97316', data:'#A78BFA', plus:'#EF4444', minus:'#1F2937', signal:'#EAB308', terminal:'#94A3B8' };

export default function Canvas({
  components, wires, selectedId, pendingWire, simState, running, wireStatuses,
  onSelect, onMove, onMoveStart, onPinDown, onBackgroundDown, onDropComponent, bottomInset = 0,
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
  const insetRef = useRef(bottomInset);
  insetRef.current = bottomInset;
  const viewRef = useRef(view);
  viewRef.current = view;
  const dropRef = useRef(onDropComponent);
  dropRef.current = onDropComponent;

  // Parts added from the drawer land in the middle of what you are looking at.
  useEffect(() => {
    const add = (e) => {
      const type = e.detail?.type;
      const def = type && LAB_COMPONENTS[type];
      if (!def || !svgRef.current) return;
      const r = svgRef.current.getBoundingClientRect();
      const v = viewRef.current;
      const cx = (r.width / 2 - v.x) / v.scale;
      const cy = (r.height / 2 - v.y) / v.scale;
      const jitter = (compsRef.current?.length || 0) % 4;
      dropRef.current(type, cx - def.w / 2 + jitter * 18, cy - def.h / 2 + jitter * 14);
    };
    window.addEventListener('lab-add', add);
    return () => window.removeEventListener('lab-add', add);
  }, []);

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
      const vh = Math.max(120, rect.height - insetRef.current); // the part not hidden by the serial drawer
      const w = maxX - minX, h = maxY - minY;
      const s = Math.min(1.4, Math.max(0.3, Math.min((rect.width - 24) / w, (vh - 24) / h) * 0.9));
      setView({ scale: s, x: (rect.width - w * s) / 2 - minX * s, y: (vh - h * s) / 2 - minY * s });
    };
    window.addEventListener('lab-fit', fit);
    return () => window.removeEventListener('lab-fit', fit);
  }, []);

  const toWorld = useCallback((clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    return { x: (clientX - rect.left - view.x) / view.scale, y: (clientY - rect.top - view.y) / view.scale };
  }, [view]);

  const onWheel = (e) => {
    e.preventDefault();
    const rect = svgRef.current.getBoundingClientRect();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const ns = Math.min(3, Math.max(0.3, view.scale * factor));
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    // keep the point under the cursor fixed while zooming
    const wx = (sx - view.x) / view.scale, wy = (sy - view.y) / view.scale;
    setView({ scale: ns, x: sx - wx * ns, y: sy - wy * ns });
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
        wx: (p.mx - rect.left - view.x) / view.scale,
        wy: (p.my - rect.top - view.y) / view.scale,
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
      setView({ scale: ns, x: (p.mx - rect.left) - drag.current.wx * ns, y: (p.my - rect.top) - drag.current.wy * ns });
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

  // Real wiring colours: red for 5V, black for ground, and a colour per signal type.
  const wireColor = (w, idx) => {
    if (wireStatuses?.[idx] === 'incorrect') return '#EF4444';
    const typeOf = (end) => {
      const c = components.find(x => x.id === end.compId);
      const d = c && getDef(c.type);
      return d?.pins.find(p => p.id === end.pinId)?.type;
    };
    const t = [typeOf(w.from), typeOf(w.to)];
    if (t.includes('power') || t.includes('plus')) return '#EF4444';
    if (t.includes('ground') || t.includes('minus')) return '#334155';
    if (t.includes('analog')) return '#22C55E';
    if (t.includes('pwm')) return '#F97316';
    if (t.includes('data')) return '#A78BFA';
    if (t.includes('digital')) return '#2563EB';
    return '#0EA5E9';
  };
  const cable = (a, b) => {
    const dx = Math.max(24, Math.abs(b.x - a.x) * 0.45);
    const sag = Math.min(26, Math.abs(b.x - a.x) * 0.08 + 8);
    return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y + sag}, ${b.x - dx} ${b.y + sag}, ${b.x} ${b.y}`;
  };

  return (
    <div className="relative w-full h-full overflow-hidden lab-workplane">
      {/* zoom controls */}
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1">
        <button onClick={() => setView(v => ({ ...v, scale: Math.min(3, v.scale * 1.2) }))} className="w-9 h-8 rounded-lg bg-white/85 dark:bg-slate-800/80 text-slate-700 dark:text-cyan-300 text-sm font-bold shadow" aria-label="Zoom in">+</button>
        <button onClick={() => setView(v => ({ ...v, scale: Math.max(0.3, v.scale / 1.2) }))} className="w-9 h-8 rounded-lg bg-white/85 dark:bg-slate-800/80 text-slate-700 dark:text-cyan-300 text-sm font-bold shadow" aria-label="Zoom out">−</button>
        <button onClick={() => window.dispatchEvent(new CustomEvent('lab-fit'))} className="w-9 h-8 rounded-lg bg-white/85 dark:bg-slate-800/80 text-slate-700 dark:text-cyan-300 text-[9px] font-bold shadow" aria-label="Fit">FIT</button>
      </div>

      <svg ref={svgRef} className="w-full h-full touch-none"
        onWheel={onWheel}
        onPointerDown={onPointerDownBg}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}>
        <defs>
          <pattern id="labGridSmall" width={20 * view.scale} height={20 * view.scale} patternUnits="userSpaceOnUse" patternTransform={`translate(${view.x * 1},${view.y * 1})`}>
            <path d={`M ${20 * view.scale} 0 L 0 0 0 ${20 * view.scale}`} fill="none" className="lab-grid-line" strokeWidth="1" />
          </pattern>
          <pattern id="labGridBig" width={100 * view.scale} height={100 * view.scale} patternUnits="userSpaceOnUse" patternTransform={`translate(${view.x * 1},${view.y * 1})`}>
            <path d={`M ${100 * view.scale} 0 L 0 0 0 ${100 * view.scale}`} fill="none" className="lab-grid-line-strong" strokeWidth="1.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#labGridSmall)" />
        <rect width="100%" height="100%" fill="url(#labGridBig)" />
        <g transform={`translate(${view.x},${view.y}) scale(${view.scale})`}>
          {/* wires */}
          {wires.map((w, i) => {
            const fc = components.find(c => c.id === w.from.compId);
            const tc = components.find(c => c.id === w.to.compId);
            if (!fc || !tc) return null;
            const fd = getDef(fc.type), td = getDef(tc.type);
            const a = pinWorldPos(fc, fd, w.from.pinId), b = pinWorldPos(tc, td, w.to.pinId);
            if (!a || !b) return null;
            const col = wireColor(w, i);
            const d = cable(a, b);
            return (
              <g key={w.id || i}>
                <path d={d} stroke="rgba(15,23,42,0.18)" strokeWidth={6} strokeLinecap="round" fill="none" />
                <path d={d} stroke={col} strokeWidth={4} strokeLinecap="round" fill="none" />
                <path d={d} stroke="rgba(255,255,255,0.35)" strokeWidth={1} strokeLinecap="round" fill="none" />
                {running && <path d={d} stroke="#fff" strokeWidth={1.6} strokeDasharray="4 7" className="wire-current" fill="none" />}
              </g>
            );
          })}

          {/* rubber band */}
          {pendingWire && cursor && (() => {
            const comp = components.find(c => c.id === pendingWire.compId);
            const def = comp && getDef(comp.type);
            const a = comp && pinWorldPos(comp, def, pendingWire.pinId);
            if (!a) return null;
            return <path d={cable(a, cursor)} stroke="#0EA5E9" strokeWidth={2.5} strokeDasharray="6 5" fill="none" opacity={0.9} />;
          })()}

          {/* components */}
          {components.map(comp => (
            <ComponentNode key={comp.id} comp={comp} def={getDef(comp.type)} selected={selectedId === comp.id}
              wires={wires} simState={simState} running={running}
              onPointerDown={e => onPointerDownComp(e, comp)} onPinDown={(e, pid) => { e.stopPropagation(); onPinDown(comp.id, pid); }} />
          ))}
        </g>
      </svg>

      <div className="absolute left-2 bottom-2 text-[10px] bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg pointer-events-none shadow-sm">
        {typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches
          ? 'Tap a part to add · tap 2 pins to wire · pinch to zoom'
          : 'Drag parts in · click 2 pins to wire · scroll to zoom'}
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

function ComponentVisual({ comp, def, simState: globalSim, running }) {
  const simState = globalSim?.comp?.[comp.id] ? { ...globalSim, ...globalSim.comp[comp.id] } : globalSim;
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