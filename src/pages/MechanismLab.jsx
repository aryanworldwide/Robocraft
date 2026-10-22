import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import BackButton from '@/components/BackButton';
import { fourBar, grashof, sliderCrank, sliderStroke, fk2R, ik2R, gearTrain, gruebler } from '@/lib/mechanisms';
import { Play, Pause, Cog, Check, Target, RefreshCw } from 'lucide-react';

const TABS = [
  ['fourbar', 'Four-bar'], ['slider', 'Slider-crank'], ['arm', '2R arm'], ['gears', 'Gears'], ['dof', 'DOF'],
];
const deg = (r) => (r * 180) / Math.PI;

function useAnim(playing, speed = 1) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!playing) return;
    let raf, last = performance.now();
    const f = (now) => { setT(x => x + ((now - last) / 1000) * speed); last = now; raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);
  return t;
}

function Slider({ label, value, min, max, step = 1, onChange, unit = 'mm' }) {
  return (
    <label className="block text-[11px]">
      <span className="flex justify-between text-muted-foreground"><span>{label}</span><b className="text-foreground tabular-nums">{value}{unit}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-cyan-500" />
    </label>
  );
}

function Stage({ box, children, onPointer }) {
  const ref = useRef(null);
  const [x0, y0, w, h] = box;
  const handle = (e) => {
    if (!onPointer || (e.type === 'pointermove' && e.buttons === 0)) return;
    const svg = ref.current; const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    onPointer(p.x, -p.y);
  };
  return (
    <svg ref={ref} viewBox={`${x0} ${-(y0 + h)} ${w} ${h}`} className="w-full rounded-2xl bg-slate-950 touch-none" style={{ aspectRatio: `${w} / ${h}` }}
      onPointerDown={handle} onPointerMove={handle}>
      <defs>
        <pattern id="mgrid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#1e293b" strokeWidth="0.6" /></pattern>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#64748b" strokeWidth="1.5" /></pattern>
      </defs>
      <rect x={x0} y={-(y0 + h)} width={w} height={h} fill="url(#mgrid)" />
      <g transform="scale(1,-1)">{children}</g>
    </svg>
  );
}
const Link = ({ p, q, color = '#38bdf8', w = 4 }) => <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={color} strokeWidth={w} strokeLinecap="round" />;
const Joint = ({ p, r = 3.2, fill = '#f8fafc' }) => <circle cx={p[0]} cy={p[1]} r={r} fill={fill} stroke="#0f172a" strokeWidth="1.2" />;
const Ground = ({ p }) => <g><path d={`M${p[0] - 8} ${p[1] - 9}h16l-8 9z`} fill="#475569" /><rect x={p[0] - 11} y={p[1] - 13} width="22" height="4" fill="url(#hatch)" /></g>;

function Challenge({ id, title, ok, detail, done, onDone }) {
  useEffect(() => { if (ok && !done) onDone(id); }, [ok]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={`rounded-xl border px-3 py-2 text-[11px] mt-3 ${ok || done ? 'border-green-500/40 bg-green-500/10' : 'border-amber-500/30 bg-amber-500/5'}`}>
      <p className="font-semibold flex items-center gap-1.5">{ok || done ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Target className="w-3.5 h-3.5 text-amber-400" />} Challenge: {title}</p>
      {detail && <p className="text-muted-foreground mt-0.5">{detail}</p>}
    </div>
  );
}

// ───────── Four-bar ─────────
function FourBarTab({ ch }) {
  const [L, setL] = useState({ a: 30, b: 90, c: 70, d: 80, pr: 0.5, po: 25 });
  const [play, setPlay] = useState(true);
  const t = useAnim(play, 1.4);
  const g = grashof(L);
  // sample a full turn to find the motion range and coupler curve
  const sample = useMemo(() => {
    const pts = [], outs = [], valid = [];
    for (let i = 0; i <= 360; i += 2) {
      const s = fourBar(L, (i * Math.PI) / 180);
      valid.push(!s.locked);
      if (!s.locked) { pts.push(s.P); outs.push(s.out); }
    }
    const swing = outs.length ? deg(Math.max(...outs) - Math.min(...outs)) : 0;
    return { pts, swing, full: valid.every(Boolean), valid };
  }, [L]);
  // crank angle: full rotation if possible, else rock between limits
  const theta = useMemo(() => {
    if (sample.full) return t % (Math.PI * 2);
    const ok = sample.valid.map((v, i) => (v ? i * 2 : null)).filter(v => v !== null);
    if (!ok.length) return 0;
    const lo = Math.min(...ok), hi = Math.max(...ok);
    const span = hi - lo, u = (t * 40) % (2 * span || 1);
    return ((lo + (u < span ? u : 2 * span - u)) * Math.PI) / 180;
  }, [t, sample]);
  const s = fourBar(L, theta);
  const mu = s.C ? deg(Math.acos(Math.max(-1, Math.min(1, (L.b ** 2 + L.c ** 2 - ((s.B[0] - L.d) ** 2 + s.B[1] ** 2)) / (2 * L.b * L.c))))) : null;
  const curve = sample.pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');
  return (
    <div>
      <Stage box={[-70, -110, 260, 220]}>
        <path d={curve} fill="none" stroke="#f472b6" strokeWidth="1.2" strokeDasharray="3 2" />
        <Ground p={s.A} /><Ground p={s.D} />
        <Link p={s.A} q={s.D} color="#475569" w={2} />
        <Link p={s.A} q={s.B} color="#facc15" />
        {s.C && <>
          <polygon points={`${s.B} ${s.C} ${s.P}`} fill="#38bdf833" stroke="#38bdf8" strokeWidth="2" />
          <Link p={s.D} q={s.C} color="#4ade80" />
          <Joint p={s.C} /><circle cx={s.P[0]} cy={s.P[1]} r="3.5" fill="#f472b6" />
        </>}
        <Joint p={s.A} /><Joint p={s.B} /><Joint p={s.D} />
      </Stage>
      <div className="flex items-center justify-between mt-2">
        <div className="text-[11px]">
          <p><b className="text-cyan-400">{g.type}</b></p>
          <p className="text-muted-foreground">S + L = {g.s + g.l} · P + Q = {g.pq} · rocker swing {sample.swing.toFixed(0)}°{mu !== null && ` · μ = ${mu.toFixed(0)}°`}</p>
        </div>
        <button onClick={() => setPlay(p => !p)} className="p-2 rounded-xl glass-strong">{play ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
      </div>
      <p className="text-[11px] text-muted-foreground mt-1">{g.note} μ is the transmission angle — keep it between 40° and 140° for smooth force transfer.</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
        <Slider label="Crank a (yellow)" value={L.a} min={10} max={120} onChange={v => setL({ ...L, a: v })} />
        <Slider label="Coupler b (blue)" value={L.b} min={10} max={150} onChange={v => setL({ ...L, b: v })} />
        <Slider label="Rocker c (green)" value={L.c} min={10} max={150} onChange={v => setL({ ...L, c: v })} />
        <Slider label="Ground d" value={L.d} min={10} max={150} onChange={v => setL({ ...L, d: v })} />
        <Slider label="Coupler point along b" value={L.pr} min={0} max={1.5} step={0.05} unit="" onChange={v => setL({ ...L, pr: v })} />
        <Slider label="Coupler point offset" value={L.po} min={-60} max={60} onChange={v => setL({ ...L, po: v })} />
      </div>
      <Challenge {...ch('fourbar_wiper')} title="Windscreen wiper" ok={g.type === 'Crank-rocker' && sample.swing >= 80}
        detail={`Make a crank-rocker whose rocker swings at least 80° (a motor turning the crank drives the wiper). Now: ${g.type}, ${sample.swing.toFixed(0)}°.`} />
    </div>
  );
}

// ───────── Slider-crank ─────────
function SliderTab({ ch }) {
  const [P, setP] = useState({ r: 30, l: 90, e: 0 });
  const [play, setPlay] = useState(true);
  const t = useAnim(play, 2);
  const s = sliderCrank(P, t % (Math.PI * 2));
  const stroke = sliderStroke(P);
  const valid = P.l > P.r + Math.abs(P.e);
  // quick-return ratio for an offset crank
  const qr = useMemo(() => {
    if (!valid) return null;
    const a1 = Math.asin(P.e / (P.l + P.r)), a2 = Math.asin(P.e / (P.l - P.r));
    const fwd = Math.PI + a1 - a2;
    return (fwd / (2 * Math.PI - fwd));
  }, [P, valid]);
  return (
    <div>
      <Stage box={[-60, -60, 240, 140]}>
        <rect x={P.l - P.r - 20} y={P.e - 12} width={2 * P.r + 60} height="24" fill="none" stroke="#475569" strokeDasharray="4 3" />
        <Ground p={[0, 0]} />
        {s.C && <>
          <rect x={s.C[0] - 14} y={s.C[1] - 9} width="28" height="18" rx="3" fill="#f97316" />
          <Link p={s.B} q={s.C} color="#38bdf8" />
        </>}
        <Link p={[0, 0]} q={s.B} color="#facc15" />
        <Joint p={[0, 0]} /><Joint p={s.B} />{s.C && <Joint p={s.C} />}
      </Stage>
      <div className="flex items-center justify-between mt-2">
        <p className="text-[11px]">{valid ? <>Stroke <b className="text-cyan-400">{stroke.toFixed(1)} mm</b>{P.e === 0 ? ' (= 2 × crank)' : ''} · time ratio {qr?.toFixed(2)}</> : <span className="text-red-400">Rod is too short — the linkage jams. Need l &gt; r + |e|.</span>}</p>
        <button onClick={() => setPlay(p => !p)} className="p-2 rounded-xl glass-strong">{play ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
      </div>
      <p className="text-[11px] text-muted-foreground mt-1">Used in engines, pumps and the Class 10 "linear actuator". An offset e makes the forward and return strokes take different times (quick return).</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
        <Slider label="Crank r" value={P.r} min={10} max={60} onChange={v => setP({ ...P, r: v })} />
        <Slider label="Rod l" value={P.l} min={20} max={160} onChange={v => setP({ ...P, l: v })} />
        <Slider label="Offset e" value={P.e} min={-40} max={40} onChange={v => setP({ ...P, e: v })} />
      </div>
      <Challenge {...ch('slider_stroke')} title="80 mm stroke pump" ok={valid && Math.abs(stroke - 80) <= 1 && P.e === 0}
        detail={`Set up an in-line (e = 0) slider-crank with an 80 mm stroke. Now: ${valid ? stroke.toFixed(1) : '—'} mm.`} />
    </div>
  );
}

// ───────── 2R arm ─────────
function ArmTab({ ch }) {
  const [L1, setL1] = useState(80), [L2, setL2] = useState(60);
  const [mode, setMode] = useState('ik');
  const [ang, setAng] = useState({ t1: 40, t2: 50 });
  const [tgt, setTgt] = useState([90, 60]);
  const [elbowUp, setElbowUp] = useState(true);
  const [goals, setGoals] = useState(() => newGoals());
  const [hit, setHit] = useState([]);
  function newGoals() { return Array.from({ length: 3 }, () => { const r = 40 + Math.random() * 90, a = Math.random() * Math.PI * 0.9 + 0.05; return [Math.round(r * Math.cos(a)), Math.round(r * Math.sin(a))]; }); }
  let t1, t2, reach = true;
  if (mode === 'ik') { const s = ik2R(L1, L2, tgt[0], tgt[1], elbowUp); if (s) ({ t1, t2 } = s); else { reach = false; const a = Math.atan2(tgt[1], tgt[0]); t1 = a; t2 = 0; } }
  else { t1 = (ang.t1 * Math.PI) / 180; t2 = (ang.t2 * Math.PI) / 180; }
  const { E, T } = fk2R(L1, L2, t1, t2);
  useEffect(() => {
    if (mode !== 'fk') return;
    goals.forEach((g, i) => { if (!hit.includes(i) && Math.hypot(T[0] - g[0], T[1] - g[1]) < 6) setHit(h => [...h, i]); });
  }, [T[0], T[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div>
      <div className="flex gap-1 mb-2 text-[11px]">
        <button onClick={() => setMode('ik')} className={`flex-1 py-1.5 rounded-lg ${mode === 'ik' ? 'bg-cyan-500 text-white' : 'glass'}`}>Inverse kinematics (drag target)</button>
        <button onClick={() => setMode('fk')} className={`flex-1 py-1.5 rounded-lg ${mode === 'fk' ? 'bg-cyan-500 text-white' : 'glass'}`}>Forward kinematics (set angles)</button>
      </div>
      <Stage box={[-150, -40, 300, 200]} onPointer={mode === 'ik' ? (x, y) => setTgt([Math.round(x), Math.round(y)]) : null}>
        <circle r={L1 + L2} fill="#0ea5e911" stroke="#0ea5e955" strokeDasharray="4 3" />
        <circle r={Math.abs(L1 - L2)} fill="#020617" stroke="#0ea5e955" strokeDasharray="4 3" />
        <line x1="-150" y1="0" x2="150" y2="0" stroke="#334155" />
        {mode === 'fk' && goals.map((g, i) => <circle key={i} cx={g[0]} cy={g[1]} r="6" fill={hit.includes(i) ? '#22c55e' : 'none'} stroke="#22c55e" strokeWidth="2" />)}
        {mode === 'ik' && <g><circle cx={tgt[0]} cy={tgt[1]} r="7" fill="none" stroke={reach ? '#f472b6' : '#ef4444'} strokeWidth="2" /><path d={`M${tgt[0] - 10} ${tgt[1]}h20M${tgt[0]} ${tgt[1] - 10}v20`} stroke={reach ? '#f472b6' : '#ef4444'} /></g>}
        <Ground p={[0, 0]} />
        <Link p={[0, 0]} q={E} color="#facc15" w={6} /><Link p={E} q={T} color="#38bdf8" w={5} />
        <Joint p={[0, 0]} r={4} /><Joint p={E} r={4} /><circle cx={T[0]} cy={T[1]} r="3.5" fill="#f472b6" />
      </Stage>
      <p className="text-[11px] mt-2 font-mono">θ1 = {deg(t1).toFixed(1)}° · θ2 = {deg(t2).toFixed(1)}° · tip ({T[0].toFixed(1)}, {T[1].toFixed(1)}) mm {!reach && <span className="text-red-400">— target out of reach</span>}</p>
      <p className="text-[11px] text-muted-foreground">Shaded ring = workspace: from |L1 − L2| = {Math.abs(L1 - L2)} mm to L1 + L2 = {L1 + L2} mm.</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
        <Slider label="Link 1" value={L1} min={20} max={110} onChange={setL1} />
        <Slider label="Link 2" value={L2} min={20} max={110} onChange={setL2} />
        {mode === 'fk' ? <>
          <Slider label="θ1 (shoulder)" value={ang.t1} min={-10} max={190} unit="°" onChange={v => setAng({ ...ang, t1: v })} />
          <Slider label="θ2 (elbow)" value={ang.t2} min={-170} max={170} unit="°" onChange={v => setAng({ ...ang, t2: v })} />
        </> : (
          <label className="flex items-center gap-2 text-[11px] col-span-2"><input type="checkbox" checked={elbowUp} onChange={e => setElbowUp(e.target.checked)} /> Elbow-up solution (untick for elbow-down)</label>
        )}
      </div>
      <Challenge {...ch('arm_targets')} title="Pick and place" ok={hit.length === 3}
        detail={mode === 'fk' ? `Using only the angle sliders (forward kinematics), touch all 3 green targets. ${hit.length}/3 done.` : 'Switch to Forward kinematics and touch all 3 green targets using θ1 and θ2.'} />
      {mode === 'fk' && <button onClick={() => { setGoals(newGoals()); setHit([]); }} className="mt-2 text-[11px] text-cyan-400 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> New targets</button>}
    </div>
  );
}

// ───────── Gears ─────────
const TEETH = [8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 60];
function GearShape({ cx, cy, teeth, angle, color }) {
  const m = 2, r = (m * teeth) / 2, ra = r + m, rf = r - 1.25 * m;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2, w = Math.PI / teeth;
    const pts = [[rf, a - w * 0.6], [ra, a - w * 0.3], [ra, a + w * 0.3], [rf, a + w * 0.6]];
    pts.forEach(([rr, aa], k) => { d += `${i === 0 && k === 0 ? 'M' : 'L'}${(cx + rr * Math.cos(aa + angle)).toFixed(2)} ${(cy + rr * Math.sin(aa + angle)).toFixed(2)}`; });
  }
  return <g><path d={d + 'Z'} fill={color} opacity="0.9" /><circle cx={cx} cy={cy} r={Math.max(2, rf * 0.25)} fill="#0f172a" /><line x1={cx} y1={cy} x2={cx + rf * 0.8 * Math.cos(angle)} y2={cy + rf * 0.8 * Math.sin(angle)} stroke="#0f172a" strokeWidth="1.5" /></g>;
}
function GearsTab({ ch }) {
  const [compound, setCompound] = useState(false);
  const [z, setZ] = useState({ a: 12, b: 36, c: 12, d: 24 });
  const [rpm, setRpm] = useState(200);
  const [play, setPlay] = useState(true);
  const t = useAnim(play, 0.5);
  const pairs = compound ? [[z.a, z.b], [z.c, z.d]] : [[z.a, z.b]];
  const { ratio, outputDirection } = gearTrain(pairs);
  const m = 2, rA = z.a, rB = z.b, rC = z.c, rD = z.d; // pitch radius = m·z/2 = z for m=2
  const wA = t * 2;
  const wB = -wA * z.a / z.b;
  const wD = compound ? -wB * z.c / z.d : 0;
  const xB = rA + rB;
  const xD = xB + rC + rD;
  const width = compound ? xD + rD + rA + 20 : xB + rB + rA + 20;
  return (
    <div>
      <Stage box={[-rA - 10, -Math.max(rB, rD, 30) - 10, width, 2 * Math.max(rB, rD, 30) + 20]}>
        <GearShape cx={0} cy={0} teeth={z.a} angle={wA} color="#facc15" />
        <GearShape cx={xB} cy={0} teeth={z.b} angle={wB + Math.PI / z.b} color="#38bdf8" />
        {compound && <>
          <GearShape cx={xB} cy={0} teeth={z.c} angle={wB} color="#a78bfa" />
          <GearShape cx={xD} cy={0} teeth={z.d} angle={wD + Math.PI / z.d} color="#4ade80" />
        </>}
      </Stage>
      <div className="flex items-center justify-between mt-2">
        <p className="text-[11px]">Gear ratio <b className="text-cyan-400">{ratio.toFixed(2)} : 1</b> · output {(rpm / ratio).toFixed(1)} rpm · torque × {ratio.toFixed(2)} · output turns {outputDirection > 0 ? 'same way' : 'opposite way'}</p>
        <button onClick={() => setPlay(p => !p)} className="p-2 rounded-xl glass-strong">{play ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
      </div>
      <p className="text-[11px] text-muted-foreground mt-1">Ratio = driven teeth ÷ driver teeth{compound ? ' for each pair, multiplied together' : ''}. Slower output = more torque (ignoring friction). Module m = {m} mm.</p>
      <label className="flex items-center gap-2 text-[11px] mt-2"><input type="checkbox" checked={compound} onChange={e => setCompound(e.target.checked)} /> Compound train (two gears on the middle shaft)</label>
      <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
        {(compound ? ['a', 'b', 'c', 'd'] : ['a', 'b']).map((k, i) => (
          <label key={k} className="flex items-center justify-between glass rounded-lg px-2 py-1">
            <span>{['Driver (motor)', compound ? 'Middle — big' : 'Driven (output)', 'Middle — small', 'Output'][i]}</span>
            <select value={z[k]} onChange={(e) => setZ({ ...z, [k]: Number(e.target.value) })} className="bg-transparent font-bold">{TEETH.map(n => <option key={n} value={n}>{n} T</option>)}</select>
          </label>
        ))}
        <Slider label="Motor speed" value={rpm} min={50} max={300} step={10} unit=" rpm" onChange={setRpm} />
      </div>
      <Challenge {...ch('gears_6')} title="Slow it down 6 times" ok={Math.abs(ratio - 6) < 1e-9 && outputDirection > 0}
        detail={`A 300 rpm motor must drive a 50 rpm wheel turning the same way as the motor. Hint: you need two meshing pairs. Now: ${ratio.toFixed(2)} : 1, ${outputDirection > 0 ? 'same' : 'opposite'} direction.`} />
    </div>
  );
}

// ───────── DOF ─────────
const DOF_Q = [
  { name: 'Four-bar linkage', n: 4, j1: 4, j2: 0 },
  { name: 'Slider-crank (3 revolute + 1 prismatic)', n: 4, j1: 4, j2: 0 },
  { name: '2-link robot arm (shoulder + elbow)', n: 3, j1: 2, j2: 0 },
  { name: 'Five-bar linkage', n: 5, j1: 5, j2: 0 },
  { name: 'Triangle of three links (a truss)', n: 3, j1: 3, j2: 0 },
  { name: 'Watt six-bar linkage', n: 6, j1: 7, j2: 0 },
  { name: 'Cam with flat follower (cam–follower contact is a higher pair)', n: 3, j1: 2, j2: 1 },
  { name: '3-link SCARA arm (3 revolute)', n: 4, j1: 3, j2: 0 },
];
function DofTab({ ch }) {
  const [n, setN] = useState(4), [j1, setJ1] = useState(4), [j2, setJ2] = useState(0);
  const [qi, setQi] = useState(0); const [pick, setPick] = useState(null); const [score, setScore] = useState(0);
  const M = gruebler(n, j1, j2);
  const q = DOF_Q[qi % DOF_Q.length], ans = gruebler(q.n, q.j1, q.j2);
  const opts = [...new Set([ans, ans + 1, ans - 1, ans + 2, 0, 1, 2])].slice(0, 4).sort((a, b) => a - b);
  return (
    <div>
      <div className="glass-strong rounded-2xl p-3">
        <p className="text-xs font-semibold mb-1">Grübler's equation (planar mechanisms)</p>
        <p className="font-mono text-sm text-cyan-400">M = 3(n − 1) − 2j₁ − j₂</p>
        <p className="text-[11px] text-muted-foreground mt-1">n = links including the fixed ground link · j₁ = lower pairs (pins, sliders) · j₂ = higher pairs (cam, gear contact).</p>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Slider label="n links" value={n} min={2} max={10} unit="" onChange={setN} />
          <Slider label="j₁" value={j1} min={1} max={14} unit="" onChange={setJ1} />
          <Slider label="j₂" value={j2} min={0} max={4} unit="" onChange={setJ2} />
        </div>
        <p className="text-sm mt-1">M = 3({n} − 1) − 2·{j1} − {j2} = <b className="text-cyan-400">{M}</b> → {M > 0 ? `mechanism with ${M} degree${M > 1 ? 's' : ''} of freedom (needs ${M} input${M > 1 ? 's' : ''})` : M === 0 ? 'structure — nothing can move' : 'pre-loaded / over-constrained structure'}</p>
      </div>
      <div className="glass-strong rounded-2xl p-3 mt-3">
        <p className="text-[11px] text-muted-foreground">Quick quiz · score {score}</p>
        <p className="text-sm font-semibold mt-0.5">{q.name}</p>
        <p className="text-[11px] text-muted-foreground">n = {q.n}, j₁ = {q.j1}, j₂ = {q.j2}. What is the DOF?</p>
        <div className="flex gap-2 mt-2">
          {opts.map(o => (
            <button key={o} disabled={pick !== null} onClick={() => { setPick(o); if (o === ans) setScore(s => s + 1); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold ${pick === null ? 'glass' : o === ans ? 'bg-green-500 text-white' : o === pick ? 'bg-red-500 text-white' : 'glass opacity-50'}`}>{o}</button>
          ))}
        </div>
        {pick !== null && <button onClick={() => { setQi(i => i + 1); setPick(null); }} className="mt-2 text-[11px] text-cyan-400">Next →</button>}
      </div>
      <Challenge {...ch('dof_quiz')} title="DOF expert" ok={score >= 5} detail={`Answer 5 DOF questions correctly. ${Math.min(score, 5)}/5.`} />
    </div>
  );
}

export default function MechanismLab() {
  const { selectedClass, getProgressForClass, updateProgress, addXP } = useApp();
  const [tab, setTab] = useState('fourbar');
  const done = getProgressForClass(selectedClass).mech || {};
  const finish = (id) => {
    const cur = getProgressForClass(selectedClass).mech || {};
    if (cur[id]) return;
    updateProgress(selectedClass, { mech: { ...cur, [id]: Date.now() } });
    addXP(selectedClass, 20);
  };
  const ch = (id) => ({ id, done: !!done[id], onDone: finish });
  const total = ['fourbar_wiper', 'slider_stroke', 'arm_targets', 'gears_6', 'dof_quiz'];
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-10">
      <div className="flex items-center gap-2 mb-1">
        <BackButton />
        <h1 className="text-lg font-bold flex items-center gap-2"><Cog className="w-5 h-5 text-cyan-500" /> Mechanism Lab</h1>
        <span className="ml-auto text-[11px] text-muted-foreground">{total.filter(k => done[k]).length}/{total.length} challenges</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Linkages, kinematics and gears — move the sliders and watch the mechanism respond.</p>
      <div className="flex gap-1 mb-3 overflow-x-auto no-scrollbar">
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${tab === id ? 'bg-cyan-500 text-white' : 'glass-strong'}`}>{label}</button>
        ))}
      </div>
      {tab === 'fourbar' && <FourBarTab ch={ch} />}
      {tab === 'slider' && <SliderTab ch={ch} />}
      {tab === 'arm' && <ArmTab ch={ch} />}
      {tab === 'gears' && <GearsTab ch={ch} />}
      {tab === 'dof' && <DofTab ch={ch} />}
    </div>
  );
}
