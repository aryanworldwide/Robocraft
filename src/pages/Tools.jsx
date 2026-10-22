import React, { useMemo, useState } from 'react';
import BackButton from '@/components/BackButton';
import { Calculator, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

const r = (x, d = 3) => (Number.isFinite(x) ? Math.round(x * 10 ** d) / 10 ** d : '—');
const rad = (d) => (d * Math.PI) / 180;
const degOf = (x) => (x * 180) / Math.PI;
const E12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
function nextE12(v) {
  if (!(v > 0)) return null;
  const dec = 10 ** Math.floor(Math.log10(v));
  const m = v / dec;
  const s = E12.find(x => x >= m - 1e-9);
  return s ? s * dec : 10 * dec;
}

function Num({ label, value, set, unit, step = 'any', min }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="flex-1 text-foreground/80">{label}</span>
      <input type="number" inputMode="decimal" step={step} min={min} value={value} onChange={e => set(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-24 rounded-lg bg-background/60 border border-border px-2 py-1.5 text-right tabular-nums outline-none focus:border-cyan-500" />
      <span className="w-12 text-xs text-muted-foreground">{unit}</span>
    </label>
  );
}
function Slider({ label, value, set, min, max, step = 1, unit }) {
  return (
    <label className="block text-sm">
      <div className="flex justify-between"><span className="text-foreground/80">{label}</span><span className="tabular-nums font-semibold">{value}{unit}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} className="w-full accent-cyan-500" />
    </label>
  );
}
function Out({ label, value, unit, strong }) {
  return (
    <div className="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`tabular-nums ${strong ? 'font-bold text-cyan-500' : 'font-semibold'}`}>{value} {unit}</span>
    </div>
  );
}
function Tool({ title, desc, children, open, onToggle }) {
  return (
    <div className="glass-strong rounded-2xl">
      <button onClick={onToggle} className="w-full flex items-center gap-2 p-4 text-left">
        <div className="flex-1"><p className="text-sm font-bold">{title}</p><p className="text-[11px] text-muted-foreground">{desc}</p></div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-2.5">{children}</div>}
    </div>
  );
}

function GearTool() {
  const [t1, setT1] = useState(12), [t2, setT2] = useState(36), [n, setN] = useState(1200), [tq, setTq] = useState(0.2), [eff, setEff] = useState(90);
  const k = t2 / t1;
  return (<>
    <Num label="Driver teeth" value={t1} set={setT1} /><Num label="Driven teeth" value={t2} set={setT2} />
    <Num label="Input speed" value={n} set={setN} unit="rpm" /><Num label="Input torque" value={tq} set={setTq} unit="N·m" /><Num label="Efficiency" value={eff} set={setEff} unit="%" />
    <Out label="Gear ratio" value={`${r(k, 3)} : 1`} strong /><Out label="Output speed" value={r(n / k, 2)} unit="rpm" />
    <Out label="Output torque" value={r(tq * k * eff / 100, 3)} unit="N·m" /><Out label="Direction" value="reversed (external gears)" />
  </>);
}

function TorqueTool() {
  const [m, setM] = useState(1.5), [d, setD] = useState(0.4), [lm, setLm] = useState(0.5), [sf, setSf] = useState(1.5);
  const g = 9.8, t = m * g * d + lm * g * d / 2;
  return (<>
    <Num label="Load mass" value={m} set={setM} unit="kg" /><Num label="Arm length" value={d} set={setD} unit="m" />
    <Num label="Arm (link) mass" value={lm} set={setLm} unit="kg" /><Num label="Safety factor" value={sf} set={setSf} unit="×" />
    <Out label="Holding torque" value={r(t, 3)} unit="N·m" /><Out label="Choose motor ≥" value={r(t * sf, 3)} unit="N·m" strong />
    <Out label="In kg·cm (servo specs)" value={r(t * sf / g * 100, 1)} unit="kg·cm" />
  </>);
}

function ArmTool() {
  const [L1, setL1] = useState(10), [L2, setL2] = useState(7), [a1, setA1] = useState(40), [a2, setA2] = useState(50);
  const [tx, setTx] = useState(12), [ty, setTy] = useState(6);
  const x1 = L1 * Math.cos(rad(a1)), y1 = L1 * Math.sin(rad(a1));
  const x = x1 + L2 * Math.cos(rad(a1 + a2)), y = y1 + L2 * Math.sin(rad(a1 + a2));
  // inverse kinematics for the target
  const c2 = (tx * tx + ty * ty - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  const ik = Math.abs(c2) <= 1 ? [1, -1].map(sgn => {
    const t2 = sgn * Math.acos(c2);
    const t1 = Math.atan2(ty, tx) - Math.atan2(L2 * Math.sin(t2), L1 + L2 * Math.cos(t2));
    return [degOf(t1), degOf(t2)];
  }) : null;
  const S = 110 / (L1 + L2), ox = 120, oy = 125;
  const P = (px, py) => [ox + px * S, oy - py * S];
  const [bx, by] = P(0, 0), [ex, ey] = P(x1, y1), [fx, fy] = P(x, y), [gx, gy] = P(tx, ty);
  return (<>
    <svg viewBox="0 0 240 140" width="100%" className="rounded-xl bg-background/60 border border-border" style={{ maxHeight: 260 }}>
      <circle cx={ox} cy={oy} r={(L1 + L2) * S} fill="#06b6d4" fillOpacity="0.07" stroke="#06b6d4" strokeDasharray="3 3" />
      <line x1="0" y1={oy} x2="240" y2={oy} stroke="currentColor" opacity="0.2" />
      <line x1={bx} y1={by} x2={ex} y2={ey} stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" />
      <line x1={ex} y1={ey} x2={fx} y2={fy} stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
      <circle cx={bx} cy={by} r="4" fill="hsl(var(--background))" stroke="currentColor" /><circle cx={ex} cy={ey} r="3.5" fill="hsl(var(--background))" stroke="currentColor" />
      <circle cx={fx} cy={fy} r="4" fill="#f97316" />
      <path d={`M${gx - 4} ${gy} h8 M${gx} ${gy - 4} v8`} stroke="#22c55e" strokeWidth="2" />
    </svg>
    <Slider label="Link 1 length (L₁)" value={L1} set={setL1} min={1} max={20} /><Slider label="Link 2 length (L₂)" value={L2} set={setL2} min={1} max={20} />
    <Slider label="θ₁" value={a1} set={setA1} min={-180} max={180} unit="°" /><Slider label="θ₂" value={a2} set={setA2} min={-180} max={180} unit="°" />
    <Out label="Forward kinematics (x, y)" value={`(${r(x, 2)}, ${r(y, 2)})`} strong /><Out label="Reach (max)" value={r(L1 + L2, 2)} />
    <p className="text-xs font-bold pt-2">Inverse kinematics — target <span className="text-green-500">+</span></p>
    <Num label="Target x" value={tx} set={setTx} /><Num label="Target y" value={ty} set={setTy} />
    {ik ? (<>
      <Out label="Elbow-down θ₁, θ₂" value={`${r(ik[0][0], 1)}°, ${r(ik[0][1], 1)}°`} />
      <Out label="Elbow-up θ₁, θ₂" value={`${r(ik[1][0], 1)}°, ${r(ik[1][1], 1)}°`} />
      <button onClick={() => { setA1(Math.round(ik[0][0])); setA2(Math.round(ik[0][1])); }} className="text-xs text-cyan-500 font-semibold">Move arm to target</button>
    </>) : <p className="text-xs text-red-500">Target is out of reach (outside the workspace).</p>}
  </>);
}

function GrublerTool() {
  const [spatial, setSpatial] = useState(false), [n, setN] = useState(4), [j1, setJ1] = useState(4), [j2, setJ2] = useState(0), [j3, setJ3] = useState(0);
  const dof = spatial ? 6 * (n - 1) - 5 * j1 - 4 * j2 - 3 * j3 : 3 * (n - 1) - 2 * j1 - j2;
  return (<>
    <div className="flex gap-2">{['Planar', 'Spatial'].map((l, i) => <button key={l} onClick={() => setSpatial(!!i)} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${spatial === !!i ? 'bg-cyan-500 text-white' : 'glass'}`}>{l}</button>)}</div>
    <Num label="Links n (incl. ground)" value={n} set={setN} step={1} />
    <Num label={spatial ? '1-DOF joints (R, P)' : 'Lower pairs j₁ (R, P)'} value={j1} set={setJ1} step={1} />
    <Num label={spatial ? '2-DOF joints (U, C)' : 'Higher pairs j₂'} value={j2} set={setJ2} step={1} />
    {spatial && <Num label="3-DOF joints (S)" value={j3} set={setJ3} step={1} />}
    <Out label="Formula" value={spatial ? '6(n−1) − Σ(6−fᵢ)' : '3(n−1) − 2j₁ − j₂'} />
    <Out label="Degrees of freedom" value={dof} strong />
    <p className="text-xs text-muted-foreground">{dof <= 0 ? 'A structure (cannot move) unless special geometry makes it over-constrained.' : dof === 1 ? 'A constrained mechanism — one motor drives it.' : `Needs ${dof} independent inputs.`}</p>
  </>);
}

function BatteryTool() {
  const [cells, setCells] = useState(3), [cv, setCv] = useState(3.7), [cap, setCap] = useState(2200), [c, setC] = useState(25), [I, setI] = useState(1.5), [use, setUse] = useState(80);
  const V = cells * cv, h = cap / 1000 * use / 100 / I;
  return (<>
    <Num label="Cells in series (S)" value={cells} set={setCells} step={1} /><Num label="Cell voltage" value={cv} set={setCv} unit="V" />
    <Num label="Capacity" value={cap} set={setCap} unit="mAh" /><Num label="C-rating" value={c} set={setC} unit="C" />
    <Num label="Average current" value={I} set={setI} unit="A" /><Num label="Usable capacity" value={use} set={setUse} unit="%" />
    <Out label="Pack voltage" value={r(V, 2)} unit="V" /><Out label="Energy" value={r(V * cap / 1000, 2)} unit="Wh" />
    <Out label="Max continuous current" value={r(cap / 1000 * c, 2)} unit="A" /><Out label="Run time" value={`${r(h * 60, 0)} min`} strong />
  </>);
}

function BudgetTool() {
  const [rows, setRows] = useState([['Controller', 5, 0.05], ['Motors', 6, 1.0], ['Servo', 5, 0.5], ['Sensors', 5, 0.1]]);
  const [margin, setMargin] = useState(25), [vb, setVb] = useState(7.4), [cap, setCap] = useState(2200);
  const P = rows.reduce((s, [, v, i]) => s + (Number(v) || 0) * (Number(i) || 0), 0), Pm = P * (1 + margin / 100), I = Pm / vb;
  const upd = (k, j, val) => setRows(rows.map((row, i) => (i === k ? row.map((c, x) => (x === j ? val : c)) : row)));
  return (<>
    {rows.map(([n, v, i], k) => (
      <div key={k} className="flex gap-1.5 items-center">
        <input value={n} onChange={e => upd(k, 0, e.target.value)} className="flex-1 min-w-0 rounded-lg bg-background/60 border border-border px-2 py-1.5 text-sm" />
        <input type="number" value={v} onChange={e => upd(k, 1, e.target.value)} className="w-14 rounded-lg bg-background/60 border border-border px-1.5 py-1.5 text-sm text-right" /><span className="text-[10px]">V</span>
        <input type="number" value={i} onChange={e => upd(k, 2, e.target.value)} className="w-14 rounded-lg bg-background/60 border border-border px-1.5 py-1.5 text-sm text-right" /><span className="text-[10px]">A</span>
        <button onClick={() => setRows(rows.filter((_, x) => x !== k))} aria-label="Remove"><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
      </div>
    ))}
    <button onClick={() => setRows([...rows, ['New part', 5, 0.1]])} className="text-xs text-cyan-500 font-semibold flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add part</button>
    <Num label="Safety margin" value={margin} set={setMargin} unit="%" /><Num label="Battery voltage" value={vb} set={setVb} unit="V" /><Num label="Battery capacity" value={cap} set={setCap} unit="mAh" />
    <Out label="Total power" value={r(P, 2)} unit="W" /><Out label="With margin" value={r(Pm, 2)} unit="W" />
    <Out label="Battery current" value={r(I, 2)} unit="A" strong /><Out label="Estimated run time (80% usable)" value={r(cap / 1000 * 0.8 / I * 60, 0)} unit="min" />
  </>);
}

function OhmTool() {
  const [vs, setVs] = useState(5), [vf, setVf] = useState(2), [ma, setMa] = useState(15);
  const R = (vs - vf) / (ma / 1000), std = nextE12(R), P = (vs - vf) * ma / 1000;
  return (<>
    <Num label="Supply voltage" value={vs} set={setVs} unit="V" /><Num label="LED forward voltage" value={vf} set={setVf} unit="V" /><Num label="LED current" value={ma} set={setMa} unit="mA" />
    <Out label="Exact resistor" value={r(R, 1)} unit="Ω" /><Out label="Use standard (E12) value" value={std ? r(std, 1) : '—'} unit="Ω" strong />
    <Out label="Power in resistor" value={r(P * 1000, 1)} unit="mW" /><Out label="Resistor rating" value={P < 0.125 ? '1/8 W is fine' : P < 0.25 ? '1/4 W' : '≥ 1/2 W'} />
  </>);
}

function SensorTool() {
  const [us, setUs] = useState(1160), [cm, setCm] = useState(20), [bits, setBits] = useState(10), [vref, setVref] = useState(5), [raw, setRaw] = useState(512);
  const max = 2 ** bits - 1;
  return (<>
    <p className="text-xs font-bold">Ultrasonic (HC-SR04)</p>
    <Num label="Echo time" value={us} set={setUs} unit="µs" /><Out label="Distance" value={r(us * 0.0343 / 2, 2)} unit="cm" strong />
    <Num label="Distance" value={cm} set={setCm} unit="cm" /><Out label="Echo time" value={r(2 * cm / 0.0343, 0)} unit="µs" />
    <p className="text-xs font-bold pt-2">ADC reading → voltage</p>
    <Num label="ADC bits" value={bits} set={setBits} step={1} /><Num label="Reference" value={vref} set={setVref} unit="V" /><Num label="Raw reading" value={raw} set={setRaw} step={1} />
    <Out label="Voltage" value={r(raw * vref / max, 4)} unit="V" strong /><Out label="Resolution" value={r(vref / max * 1000, 3)} unit="mV/step" />
    <Out label="LM35 temperature" value={r(raw * vref / max * 100, 1)} unit="°C" />
  </>);
}

function WheelTool() {
  const [d, setD] = useState(65), [rpm, setRpm] = useState(150), [cpr, setCpr] = useState(20), [ticks, setTicks] = useState(100), [track, setTrack] = useState(15);
  const circ = Math.PI * d / 10;
  return (<>
    <Num label="Wheel diameter" value={d} set={setD} unit="mm" /><Num label="Wheel speed" value={rpm} set={setRpm} unit="rpm" />
    <Out label="Circumference" value={r(circ, 2)} unit="cm" /><Out label="Robot speed" value={r(circ * rpm / 60, 2)} unit="cm/s" strong />
    <Num label="Encoder counts/rev" value={cpr} set={setCpr} step={1} /><Num label="Counts recorded" value={ticks} set={setTicks} step={1} />
    <Out label="Distance travelled" value={r(ticks / cpr * circ, 2)} unit="cm" /><Out label="Distance per count" value={r(circ / cpr, 3)} unit="cm" />
    <Num label="Track width (wheel to wheel)" value={track} set={setTrack} unit="cm" />
    <Out label="Wheel travel for a 90° spin turn" value={r(Math.PI * track / 4, 2)} unit="cm each" />
  </>);
}

function CoordTool() {
  const [x, setX] = useState(3), [y, setY] = useState(4), [z, setZ] = useState(2), [rr, setRr] = useState(5), [t, setT] = useState(30);
  return (<>
    <p className="text-xs font-bold">Cartesian → polar / cylindrical / spherical</p>
    <Num label="x" value={x} set={setX} /><Num label="y" value={y} set={setY} /><Num label="z" value={z} set={setZ} />
    <Out label="Polar (r, θ)" value={`(${r(Math.hypot(x, y), 3)}, ${r(degOf(Math.atan2(y, x)), 2)}°)`} strong />
    <Out label="Cylindrical (r, θ, z)" value={`(${r(Math.hypot(x, y), 3)}, ${r(degOf(Math.atan2(y, x)), 2)}°, ${z})`} />
    <Out label="Spherical (ρ, θ, φ)" value={`(${r(Math.hypot(x, y, z), 3)}, ${r(degOf(Math.atan2(y, x)), 2)}°, ${r(degOf(Math.acos(z / (Math.hypot(x, y, z) || 1))), 2)}°)`} />
    <p className="text-xs font-bold pt-2">Polar → Cartesian</p>
    <Num label="r" value={rr} set={setRr} /><Num label="θ" value={t} set={setT} unit="°" />
    <Out label="(x, y)" value={`(${r(rr * Math.cos(rad(t)), 3)}, ${r(rr * Math.sin(rad(t)), 3)})`} strong />
  </>);
}

function BaseTool() {
  const [txt, setTxt] = useState('202'), [base, setBase] = useState(10);
  const v = parseInt(String(txt).trim(), base);
  const ok = Number.isFinite(v) && String(txt).trim() !== '';
  return (<>
    <div className="flex gap-2">
      <input value={txt} onChange={e => setTxt(e.target.value)} className="flex-1 rounded-lg bg-background/60 border border-border px-2 py-1.5 text-sm font-mono" />
      <select value={base} onChange={e => setBase(Number(e.target.value))} className="rounded-lg bg-background/60 border border-border px-2 text-sm">
        {[[2, 'Binary'], [8, 'Octal'], [10, 'Decimal'], [16, 'Hex']].map(([b, n]) => <option key={b} value={b}>{n}</option>)}
      </select>
    </div>
    {ok ? (<>
      <Out label="Decimal" value={v.toString(10)} strong /><Out label="Binary" value={v.toString(2)} />
      <Out label="Octal" value={v.toString(8)} /><Out label="Hexadecimal" value={v.toString(16).toUpperCase()} />
    </>) : <p className="text-xs text-red-500">Not a valid number in that base.</p>}
  </>);
}

function PidTool() {
  const [kp, setKp] = useState(2), [ki, setKi] = useState(0.5), [kd, setKd] = useState(0.2), [mass, setMass] = useState(1);
  const pts = useMemo(() => {
    // Motor-like plant: m·v' = u − b·v, position x' = v; target position 1.
    const dt = 0.01, b = 1; let x = 0, v = 0, I = 0, prevE = 1; const out = [];
    for (let i = 0; i <= 800; i++) {
      const e = 1 - x; I += e * dt; const D = (e - prevE) / dt; prevE = e;
      const u = Math.max(-20, Math.min(20, kp * e + ki * I + kd * D));
      v += ((u - b * v) / mass) * dt; x += v * dt;
      if (i % 8 === 0) out.push([i * dt, x]);
    }
    return out;
  }, [kp, ki, kd, mass]);
  const W = 260, H = 120, ymax = Math.max(1.6, ...pts.map(p => p[1])), ymin = Math.min(0, ...pts.map(p => p[1]));
  const X = t => 20 + (t / 8) * (W - 30), Y = v => 10 + (1 - (v - ymin) / (ymax - ymin)) * (H - 25);
  const peak = Math.max(...pts.map(p => p[1])), overshoot = Math.max(0, (peak - 1) * 100);
  const settle = (() => { for (let i = pts.length - 1; i >= 0; i--) if (Math.abs(pts[i][1] - 1) > 0.02) return pts[Math.min(i + 1, pts.length - 1)][0]; return 0; })();
  return (<>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="rounded-xl bg-background/60 border border-border" style={{ maxHeight: 240 }}>
      <line x1="20" y1={Y(1)} x2={W - 10} y2={Y(1)} stroke="#22c55e" strokeDasharray="4 3" />
      <line x1="20" y1={Y(0)} x2={W - 10} y2={Y(0)} stroke="currentColor" opacity="0.25" />
      <polyline fill="none" stroke="#06b6d4" strokeWidth="2" points={pts.map(([t, v]) => `${X(t)},${Y(v)}`).join(' ')} />
      <text x="22" y={Y(1) - 4} fontSize="8" fill="#22c55e">target</text><text x={W - 30} y={H - 4} fontSize="8" fill="currentColor" opacity="0.6">8 s</text>
    </svg>
    <Slider label="Kp (proportional)" value={kp} set={setKp} min={0} max={20} step={0.1} />
    <Slider label="Ki (integral)" value={ki} set={setKi} min={0} max={10} step={0.1} />
    <Slider label="Kd (derivative)" value={kd} set={setKd} min={0} max={5} step={0.05} />
    <Slider label="Load inertia" value={mass} set={setMass} min={0.2} max={5} step={0.1} />
    <Out label="Overshoot" value={r(overshoot, 1)} unit="%" strong /><Out label="Settling time (±2%)" value={settle >= 7.9 ? 'not settled' : `${r(settle, 2)} s`} />
    <Out label="Final position" value={r(pts[pts.length - 1][1], 3)} />
    <p className="text-xs text-muted-foreground">Try: raise Kp until it oscillates, then add Kd to damp it. Set Ki to 0 and add a heavy load to see steady-state error.</p>
  </>);
}

const TOOLS = [
  ['gear', 'Gear train', 'Ratio, output speed and torque', GearTool],
  ['torque', 'Joint torque & motor sizing', 'Torque to hold a load on an arm', TorqueTool],
  ['arm', '2R arm kinematics', 'Forward and inverse kinematics with a live drawing', ArmTool],
  ['pid', 'PID tuning simulator', 'See overshoot and settling as you change gains', PidTool],
  ['grubler', 'Grübler DOF calculator', 'Planar and spatial mechanisms', GrublerTool],
  ['budget', 'Power budget', 'Total current and run time for your robot', BudgetTool],
  ['battery', 'Battery pack', 'Voltage, energy, max current, run time', BatteryTool],
  ['ohm', 'LED resistor & Ohm\'s law', 'Resistor value, standard size and power', OhmTool],
  ['sensor', 'Sensor maths', 'Ultrasonic distance and ADC conversion', SensorTool],
  ['wheel', 'Wheels & encoders', 'Speed, distance, odometry and turns', WheelTool],
  ['coord', 'Coordinate converter', 'Cartesian, polar, cylindrical, spherical', CoordTool],
  ['base', 'Number base converter', 'Binary, octal, decimal, hex', BaseTool],
];

export default function Tools() {
  const [open, setOpen] = useState('arm');
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-8">
      <div className="flex items-center gap-2 mb-1">
        <BackButton />
        <h1 className="text-lg font-bold flex items-center gap-2"><Calculator className="w-5 h-5 text-cyan-500" /> Engineering Tools</h1>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Calculators engineers actually use — for homework checks, projects and practicals. Work offline.</p>
      <div className="space-y-3">
        {TOOLS.map(([id, title, desc, C]) => (
          <Tool key={id} title={title} desc={desc} open={open === id} onToggle={() => setOpen(open === id ? null : id)}><C /></Tool>
        ))}
      </div>
    </div>
  );
}
