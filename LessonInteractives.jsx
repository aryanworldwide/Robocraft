import React, { useState, useMemo } from 'react';
import { Binary, Gauge, Radar, GitBranch, Zap, RotateCw, Target } from 'lucide-react';

// ── Boolean Logic Lab ──────────────────────────────────────────
function BooleanLogicLab() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const ops = [
    { name: 'A AND B', fn: (x, y) => x && y },
    { name: 'A OR B', fn: (x, y) => x || y },
    { name: 'NOT A', fn: (x) => Number(!x) },
    { name: 'A XOR B', fn: (x, y) => Number(x !== y) },
  ];
  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-4">
        {[['A', a, setA], ['B', b, setB]].map(([label, val, set]) => (
          <button key={label} onClick={() => set(val ? 0 : 1)}
            className={`w-20 h-20 rounded-2xl text-3xl font-bold font-mono transition-all ${val ? 'bg-cyan-500 text-slate-900 neon-glow' : 'glass text-muted-foreground'}`}>
            {val}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground text-center mb-3">Tap a value to toggle 0 / 1</p>
      <div className="grid grid-cols-2 gap-2">
        {ops.map(op => {
          const out = op.name.includes('NOT A') ? op.fn(a) : op.fn(a, b);
          return (
            <div key={op.name} className="glass rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs font-mono text-foreground/80">{op.name}</span>
              <span className={`text-xl font-bold font-mono ${out ? 'text-green-400' : 'text-muted-foreground/50'}`}>{out}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Motor Lab ──────────────────────────────────────────────────
function MotorLab() {
  const [pwm, setPwm] = useState(60);
  const [dir, setDir] = useState(1);
  const rpm = Math.round((pwm / 255) * 200);
  const torque = (pwm / 255 * 0.5).toFixed(2);
  return (
    <div>
      <div className="flex items-center justify-center my-5">
        <div className="relative w-28 h-28">
          <div className="absolute inset-0 rounded-full glass-strong border-2 border-cyan-500/30" />
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${dir ? rpm * 1.2 : -rpm * 1.2}deg)`, transition: 'transform 0.4s' }}>
            <div className="w-1 h-24 bg-gradient-to-b from-cyan-400 to-transparent rounded-full origin-center" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-cyan-500/30 border border-cyan-400" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="text-muted-foreground">PWM Speed</span>
        <span className="font-mono text-cyan-400">{pwm} / 255</span>
      </div>
      <input type="range" min={0} max={255} value={pwm} onChange={e => setPwm(+e.target.value)} className="w-full accent-cyan-400 mb-4" />
      <div className="grid grid-cols-2 gap-2">
        <div className="glass rounded-xl p-2.5">
          <p className="text-[10px] text-muted-foreground">Direction</p>
          <button onClick={() => setDir(dir ? 0 : 1)} className="flex items-center gap-1.5 text-sm font-bold text-cyan-400 mt-0.5">
            <RotateCw className={`w-4 h-4 ${dir ? '' : 'scale-x-[-1]'}`} /> {dir ? 'CW' : 'CCW'}
          </button>
        </div>
        <div className="glass rounded-xl p-2.5">
          <p className="text-[10px] text-muted-foreground">Speed / Torque</p>
          <p className="text-sm font-mono mt-0.5"><span className="text-cyan-400">{rpm}</span> rpm · <span className="text-green-400">{torque}</span> Nm</p>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3 text-center">Higher PWM → more speed but less available torque. Trade-off shown by the torque-speed relationship.</p>
    </div>
  );
}

// ── Sensor Lab ─────────────────────────────────────────────────
function SensorLab() {
  const [distance, setDistance] = useState(30);
  const noise = useMemo(() => (Math.random() - 0.5) * 2, [distance]);
  const raw = Math.round(distance + noise);
  const adc = Math.min(1023, Math.round((raw / 100) * 1023));
  const calibrated = (raw * 0.9 + 1.2).toFixed(1);
  return (
    <div>
      <div className="flex items-end justify-center gap-1 h-28 mb-4">
        {Array.from({ length: 11 }).map((_, i) => {
          const d = i * 10;
          const active = d <= distance;
          return <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-3 rounded-t transition-all" style={{ height: `${active ? 70 : 6}px`, background: active ? 'linear-gradient(to top,#00d2ff,#0ea5e9)' : 'rgba(255,255,255,0.06)' }} />
            <span className="text-[7px] text-muted-foreground">{d}</span>
          </div>;
        })
        }
      </div>
      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="text-muted-foreground">Real Distance (cm)</span>
        <span className="font-mono text-cyan-400">{distance} cm</span>
      </div>
      <input type="range" min={5} max={100} value={distance} onChange={e => setDistance(+e.target.value)} className="w-full accent-cyan-400 mb-4" />
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="glass rounded-xl p-2"><p className="text-[9px] text-muted-foreground">Raw Reading</p><p className="text-sm font-mono text-yellow-400">{raw} cm</p></div>
        <div className="glass rounded-xl p-2"><p className="text-[9px] text-muted-foreground">ADC Value</p><p className="text-sm font-mono text-purple-400">{adc}</p></div>
        <div className="glass rounded-xl p-2"><p className="text-[9px] text-muted-foreground">Calibrated</p><p className="text-sm font-mono text-green-400">{calibrated}</p></div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3 text-center">Notice the raw reading jitters from noise — calibration + averaging clean it up before the controller uses it.</p>
    </div>
  );
}

// ── Control Loop Lab ──────────────────────────────────────────
function ControlLoopLab() {
  const [target, setTarget] = useState(50);
  const [kp, setKp] = useState(3);
  const [running, setRunning] = useState(false);
  const [pos, setPos] = useState(0);
  const [hist, setHist] = useState([0]);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setPos(prev => {
        const err = target - prev;
        return Math.max(0, Math.min(100, prev + err * kp * 0.08));
      });
    }, 120);
    return () => clearInterval(id);
  }, [running, target, kp]);

  React.useEffect(() => {
    if (!running) return;
    setHist(h => [...h.slice(-24), pos]);
  }, [pos, running]);

  const reset = () => { setRunning(false); setPos(0); setHist([0]); };

  return (
    <div>
      <div className="relative h-28 mb-4 flex items-end gap-0.5 px-1 glass rounded-xl p-2">
        {hist.map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-cyan-400/60 transition-all" style={{ height: `${h}%` }} />
        ))}
        <div className="absolute left-1 right-1 border-t border-dashed border-green-400/70" style={{ bottom: `calc(${target}% * 0.78 + 8px)` }}>
          <span className="absolute right-0 -top-4 text-[9px] text-green-400 font-mono">target {target}</span>
        </div>
        <div className="absolute bottom-1 left-2 text-[9px] text-muted-foreground font-mono">pos {Math.round(pos)}</div>
      </div>
      <div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Target</span><span className="font-mono text-green-400">{target}</span></div>
      <input type="range" min={0} max={100} value={target} onChange={e => { setTarget(+e.target.value); }} className="w-full accent-green-400 mb-2" />
      <div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Kp (gain)</span><span className="font-mono text-cyan-400">{kp.toFixed(1)}</span></div>
      <input type="range" min={0.5} max={12} step={0.5} value={kp} onChange={e => setKp(+e.target.value)} className="w-full accent-cyan-400 mb-4" />
      <div className="flex gap-2">
        <button onClick={() => setRunning(r => !r)} className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold">{running ? 'Pause' : 'Run Loop'}</button>
        <button onClick={reset} className="px-4 py-2 rounded-xl glass text-cyan-400 text-xs font-bold">Reset</button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3 text-center">Higher Kp reaches target faster but can overshoot. This is the P term of a PID controller.</p>
    </div>
  );
}

const WIDGETS = [
  { match: ['boolean', 'logic', 'gate'], Comp: BooleanLogicLab, title: 'Boolean Logic Lab', icon: Binary, desc: 'Toggle inputs A and B to see logic outputs update live.' },
  { match: ['motor', 'pwm', 'servo', 'stepper', 'bldc', 'gear', 'actuator'], Comp: MotorLab, title: 'Motor Behaviour', icon: Gauge, desc: 'Change PWM and direction to observe speed-torque behaviour.' },
  { match: ['sensor', 'ultrasonic', 'ir ', 'adc', 'analog', 'distance'], Comp: SensorLab, title: 'Sensor Simulation', icon: Radar, desc: 'Change a physical input and see raw vs calibrated readings.' },
  { match: ['control', 'pid', 'closed-loop', 'feedback', 'loop'], Comp: ControlLoopLab, title: 'Control Loop', icon: GitBranch, desc: 'Set a target and gain, then run the feedback loop.' },
];

export default function LessonInteractives({ lesson }) {
  // Match ONLY against the lesson's title and key concepts — not the full
  // theory text, which mentions many loosely related words and caused
  // unrelated simulators (e.g. a motor lab on an intro lesson) to appear.
  const blob = `${lesson.title} ${(lesson.keyConcepts || []).join(' ')}`.toLowerCase();
  const widget = WIDGETS.find(w => w.match.some(k => blob.includes(k)));
  if (!widget) return null;
  const { Comp, title, icon: Icon, desc } = widget;
  return (
    <div className="glass-strong rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center"><Icon className="w-5 h-5 text-purple-400" /></div>
        <div>
          <h3 className="text-sm font-bold text-purple-400">Visualize It</h3>
          <p className="text-[10px] text-muted-foreground">{title}</p>
        </div>
      </div>
      <p className="text-xs text-foreground/70 mb-4 mt-2">{desc}</p>
      <Comp />
    </div>
  );
}