import React, { useRef, useState, useCallback, useEffect } from 'react';
import { LAB_COMPONENTS, getDef, pinLocalPos, pinWorldPos} from '@/lib/lab/labComponents';
import PartArt from '@/components/lab/art/PartArt';

const PIN_COLORS = { power:'#EF4444', ground:'#1F2937', digital:'#3B82F6', analog:'#22C55E', pwm:'#F97316', data:'#A78BFA', plus:'#EF4444', minus:'#1F2937', signal:'#EAB308', terminal:'#94A3B8' };

export default function Canvas({
  components, wires, selectedId, pendingWire, simState, running, wireStatuses,
  onSelect, onMove, onMoveStart, onPinDown, onBackgroundDown, onDropComponent, bottomInset = 0,
}) {
  const svgRef = useRef(null);
  const [view, setView] = useState({ x: 40, y: 40, scale: 0.7 });
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
      const comps = compsRef.current || [];
      if (!comps.length) {
        const cx = (r.width / 2 - v.x) / v.scale, cy = (r.height / 2 - v.y) / v.scale;
        dropRef.current(type, cx - def.w / 2, cy - def.h / 2);
        return;
      }
      // put it in clear space to the right of what is already there (wrapping down)
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      comps.forEach(c => { const d = getDef(c.type); if (!d) return; minX = Math.min(minX, c.x); minY = Math.min(minY, c.y); maxX = Math.max(maxX, c.x + d.w); maxY = Math.max(maxY, c.y + d.h); });
      // A part's labels and name stick out well below and to the side of its
      // body, so the gap has to clear those, not just the rectangle.
      const labelRoom = (d) => {
        const longest = (side) => d.pins.filter(p => p.side === side).reduce((m, p) => Math.max(m, p.label.length), 0);
        return { below: longest('bottom') * 5.2 + 34, above: longest('top') * 5.2 + 14 };
      };
      const room = Math.max(...comps.map(c => getDef(c.type)).filter(Boolean).map(d => labelRoom(d).below), 0);
      const GAP = 40;
      if (maxX - minX + def.w + GAP < 900) dropRef.current(type, maxX + GAP, minY);
      else dropRef.current(type, minX, maxY + GAP + room + labelRoom(def).above);
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
        const below = d.pins.filter(p => p.side === 'bottom').reduce((m, p) => Math.max(m, p.label.length), 0) * 5.2 + 30;
        const above = d.pins.filter(p => p.side === 'top').reduce((m, p) => Math.max(m, p.label.length), 0) * 5.2 + 14;
        minY = Math.min(minY, c.y - above);
        maxX = Math.max(maxX, c.x + d.w); maxY = Math.max(maxY, c.y + d.h + below);
      });
      if (minX === Infinity) { setView({ x: 40, y: 40, scale: 0.7 }); return; }
      const rect = svgRef.current.getBoundingClientRect();
      const vh = Math.max(120, rect.height - insetRef.current); // the part not hidden by the serial drawer
      const PAD_L = 42, PAD_R = 56, PAD_Y = 20; // room for pin labels and the zoom buttons
      const vw = Math.max(120, rect.width - PAD_L - PAD_R);
      const w = maxX - minX, h = maxY - minY;
      const s = Math.min(1.4, Math.max(0.3, Math.min(vw / w, (vh - 2 * PAD_Y) / h) * 0.95));
      setView({ scale: s, x: PAD_L + (vw - w * s) / 2 - minX * s, y: (vh - h * s) / 2 - minY * s });
    };
    window.addEventListener('lab-fit', fit);
    // refit when the workspace itself changes size (drawer, rotation, keyboard)
    let last = 0, tid = null;
    const ro = new ResizeObserver(() => {
      const r = svgRef.current?.getBoundingClientRect();
      if (!r || !r.width) return;
      const size = r.width * r.height;
      if (last && Math.abs(size - last) / last < 0.12) { last = size; return; }
      last = size;
      clearTimeout(tid); tid = setTimeout(fit, 120);
    });
    if (svgRef.current) ro.observe(svgRef.current);
    return () => { window.removeEventListener('lab-fit', fit); ro.disconnect(); clearTimeout(tid); };
  }, []);

  const toWorld = useCallback((clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return { x: (clientX - rect.left - view.x) / view.scale, y: (clientY - rect.top - view.y) / view.scale };
  }, [view]);

  const onWheel = (e) => {
    e.preventDefault();
    if (!svgRef.current) return;
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
    if (!svgRef.current) return;
    // Some Android devices refuse the capture for a pointer that has already
    // gone; losing the capture is survivable, throwing here is not.
    try { svgRef.current.setPointerCapture(e.pointerId); } catch { /* keep going */ }
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
    if (!svgRef.current) return;
    try { svgRef.current.setPointerCapture(e.pointerId); } catch { /* keep going */ }
    drag.current = { mode: 'move', id: comp.id, sx: e.clientX, sy: e.clientY, ox: comp.x, oy: comp.y };
  };

  const onPointerMove = (e) => {
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pinch = drag.current?.mode === 'pinch' ? drag.current : null;
    if (pinch) {
      const p = pinchInfo();
      if (!p || !svgRef.current) return;
      const ns = Math.min(3, Math.max(0.3, pinch.startScale * (p.dist / pinch.startDist)));
      const rect = svgRef.current.getBoundingClientRect();
      setView({ scale: ns, x: (p.mx - rect.left) - pinch.wx * ns, y: (p.my - rect.top) - pinch.wy * ns });
      return;
    }
    // Read the drag once. React runs the updater below during the next render,
    // and on a touch screen pointerup often lands first and clears drag.current
    // — reading it inside the updater then threw and took the canvas down.
    const d = drag.current;
    if (!d) return;
    if (d.mode === 'pan') {
      setView(v => ({ ...v, x: d.vx + (e.clientX - d.sx), y: d.vy + (e.clientY - d.sy) }));
    } else {
      const dx = (e.clientX - d.sx) / view.scale;
      const dy = (e.clientY - d.sy) / view.scale;
      onMove(d.id, d.ox + dx, d.oy + dy);
    }
  };

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (drag.current?.mode === 'pinch' && pointers.current.size < 2) drag.current = null;
    else if (drag.current?.mode !== 'pinch') drag.current = null;
    try { svgRef.current?.releasePointerCapture(e.pointerId); } catch { /* already released */ }
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

          {/* The first pin of a new wire is marked where it is. Nothing trails
              the finger: a wire is two taps, not a drag. */}
          {pendingWire && (() => {
            const comp = components.find(c => c.id === pendingWire.compId);
            const def = comp && getDef(comp.type);
            const a = comp && pinWorldPos(comp, def, pendingWire.pinId);
            if (!a) return null;
            return (
              <g pointerEvents="none">
                <circle cx={a.x} cy={a.y} r={13} fill="#0EA5E9" opacity={0.18}>
                  <animate attributeName="r" values="11;16;11" dur="1.3s" repeatCount="indefinite" />
                </circle>
                <circle cx={a.x} cy={a.y} r={9} fill="none" stroke="#0EA5E9" strokeWidth={2.5} />
              </g>
            );
          })()}

          {/* components */}
          {components.map(comp => (
            <ComponentNode key={comp.id} comp={comp} def={getDef(comp.type)} selected={selectedId === comp.id}
              wires={wires} simState={simState} running={running}
              onPointerDown={e => onPointerDownComp(e, comp)} onPinDown={(e, pid) => { e.stopPropagation(); onPinDown(comp.id, pid); }} />
          ))}
        </g>
      </svg>

      <div className={`absolute left-2 bottom-2 text-[10px] px-2 py-1 rounded-lg pointer-events-none shadow-sm ${
        pendingWire ? 'bg-cyan-500 text-white font-semibold' : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300'}`}>
        {pendingWire
          ? 'Now tap the other pin · tap the same pin again to cancel'
          : (typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches
            ? 'Tap a part to add · tap one pin, then another, to wire'
            : 'Drag parts in · click one pin, then another, to wire')}
      </div>
    </div>
  );
}

function ComponentNode({ comp, def, selected, wires, simState, running, onPointerDown, onPinDown }) {
  if (!def) return null;
  // Half the distance between neighbouring pins, so every tap lands on the
  // pin nearest the finger and never on its neighbour.
  const counts = { left: 0, right: 0, top: 0, bottom: 0 };
  def.pins.forEach(p => { counts[p.side] = (counts[p.side] || 0) + 1; });
  const down = Math.max(counts.left, counts.right), across = Math.max(counts.top, counts.bottom);
  const pitch = Math.min(down > 1 ? def.h / (down + 1) : 99, across > 1 ? def.w / (across + 1) : 99);
  const hitRadius = Math.max(7, Math.min(15, pitch / 2));
  // Roughly how far the bottom labels reach once rotated upright.
  const longestBottom = def.pins.filter(p => p.side === 'bottom').reduce((m, p) => Math.max(m, p.label.length), 0);
  const bottomLabelRoom = longestBottom ? longestBottom * 5.2 + 12 : 0;
  const rot = comp.rot || 0;
  const partState = running ? { ...(simState || {}), ...((simState?.comp || {})[comp.id] || {}) } : undefined;
  const wiredPins = new Set();
  wires.forEach(w => {
    if (w.from.compId === comp.id) wiredPins.add(w.from.pinId);
    if (w.to.compId === comp.id) wiredPins.add(w.to.pinId);
  });
  return (
    <g transform={`translate(${comp.x},${comp.y}) rotate(${rot} ${def.w / 2} ${def.h / 2})`}
      onPointerDown={onPointerDown} style={{ cursor: 'grab' }}>
      {/* shadow + realistic artwork */}
      <rect x={4} y={6} width={def.w - 8} height={def.h - 6} rx={8} fill="rgba(15,23,42,0.18)" />
      <PartArt type={comp.type} def={def} state={partState} running={running} />
      {selected && <rect x={-4} y={-4} width={def.w + 8} height={def.h + 8} rx={10} fill="none" stroke="#0EA5E9" strokeWidth={2} strokeDasharray="6 4" />}

      {/* name tag */}
      <g transform={`rotate(${-rot} ${def.w / 2} ${def.h + 14})`}>
        {/* Clear of the bottom row's vertical labels, whose length depends on
            the longest one (GPIO12, Cathode (−)…). */}
        <text x={def.w / 2} y={def.h + 15 + bottomLabelRoom} textAnchor="middle" fontSize={11} fontWeight={700} className="part-label">{def.name}</text>
      </g>

      {/* pins */}
      {def.pins.map(pin => {
        const lp = pinLocalPos(def, pin.id);
        if (!lp) return null;
        const color = PIN_COLORS[pin.type] || '#94A3B8';
        const wired = wiredPins.has(pin.id);
        const vertical = pin.side === 'top' || pin.side === 'bottom';
        const labelDx = pin.side === 'left' ? -7 : pin.side === 'right' ? 7 : 0;
        const labelDy = pin.side === 'top' ? -13 : pin.side === 'bottom' ? 13 : 0;
        const anchor = pin.side === 'left' ? 'end'
          : pin.side === 'right' ? 'start'
          : pin.side === 'top' ? 'start'    // rotated -90°, this runs upwards
          : 'end';                          // and this runs downwards
        return (
          <g key={pin.id}>
            {/* An invisible, finger-sized target: a 5px dot is far too small to
                hit on a phone, and missing it panned the canvas instead. A
                board's pins sit close together, so theirs stays tighter to
                avoid stealing the neighbouring pin's taps. */}
            <circle cx={lp.x} cy={lp.y} r={hitRadius} fill="transparent" style={{ cursor: 'crosshair' }}
              onPointerDown={(e) => onPinDown(e, pin.id)} />
            <circle cx={lp.x} cy={lp.y} r={7} fill="#ffffff" opacity={0.85} pointerEvents="none" />
            <circle cx={lp.x} cy={lp.y} r={5} fill={color} stroke="#0f172a" strokeWidth={1} style={{ cursor: 'crosshair' }} onPointerDown={(e) => onPinDown(e, pin.id)} />
            {wired && <circle cx={lp.x} cy={lp.y} r={8.5} fill="none" stroke="#22C55E" strokeWidth={1.6} opacity={0.75} pointerEvents="none" />}
            {/* Pins along the top and bottom edges carry their labels
                vertically, the way a real board's silkscreen does — at this
                pitch "GPIO12" written across would run into its neighbour. */}
            {/* The label must never take a tap meant for its pin: on the top
                and bottom rows it sits directly over one. */}
            <text x={lp.x + labelDx} y={lp.y + labelDy + 3} fontSize={7.5} fontWeight={700} className="pin-label"
              pointerEvents="none" textAnchor={anchor}
              transform={`rotate(${-rot + (vertical ? -90 : 0)} ${lp.x + labelDx} ${lp.y + labelDy + 3})`}>{pin.label}</text>
          </g>
        );
      })}
    </g>
  );
}
