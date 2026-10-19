import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

// ── LED Blink ──────────────────────────────────────────────────────────────
function LedSim({ sim, running }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!running) return;
    let t;
    const tick = () => {
      setOn(v => {
        t = setTimeout(tick, !v ? sim.onMs : sim.offMs);
        return !v;
      });
    };
    t = setTimeout(tick, sim.onMs);
    return () => clearTimeout(t);
  }, [running, sim.onMs, sim.offMs]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6">
      <div className="relative">
        <div className="w-32 h-32 rounded-full transition-all duration-150 flex items-center justify-center text-5xl"
          style={{
            background: on ? 'radial-gradient(circle, #FBBF24, #F59E0B)' : '#1E293B',
            boxShadow: on ? '0 0 50px 12px rgba(251,191,36,0.7), inset 0 0 30px rgba(255,255,255,0.4)' : 'inset 0 0 20px rgba(0,0,0,0.5)',
            border: '3px solid #0F172A',
          }}>
          💡
        </div>
        {/* LED legs */}
        <div className="flex justify-center gap-8 -mt-1">
          <div className="w-1 h-8 bg-slate-500 rounded" />
          <div className="w-1 h-8 bg-slate-500 rounded" />
        </div>
      </div>
      <div className={`text-sm font-bold ${on ? 'text-amber-400 neon-text' : 'text-slate-500'}`}>
        LED {on ? 'ON' : 'OFF'} · digitalWrite(13, {on ? 'HIGH' : 'LOW'})
      </div>
    </div>
  );
}

// ── Push Button ──────────────────────────────────────────────────────────────
function ButtonSim({ running }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-6">
      <button
        onPointerDown={() => running && setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        disabled={!running}
        className="w-28 h-28 rounded-full text-5xl select-none transition-all duration-100 active:scale-95 disabled:opacity-50"
        style={{
          background: pressed ? 'radial-gradient(circle, #A78BFA, #7C3AED)' : '#1E293B',
          boxShadow: pressed ? '0 0 40px 8px rgba(167,139,250,0.7), inset 0 0 20px rgba(255,255,255,0.3)' : 'inset 0 0 20px rgba(0,0,0,0.5)',
          border: '3px solid #0F172A',
        }}>
        🔘
      </button>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-150 ${pressed ? 'neon-text' : ''}`}
        style={{
          background: pressed ? 'radial-gradient(circle, #FBBF24, #F59E0B)' : '#1E293B',
          boxShadow: pressed ? '0 0 40px 10px rgba(251,191,36,0.7)' : 'inset 0 0 16px rgba(0,0,0,0.5)',
          border: '2px solid #0F172A',
        }}>
        💡
      </div>
      <div className="text-xs font-bold text-slate-400">
        {pressed ? 'Pressed → LED ON' : 'Released → LED OFF'}
      </div>
    </div>
  );
}

// ── Servo Sweep ──────────────────────────────────────────────────────────────
function ServoSim({ sim, running }) {
  const [angle, setAngle] = useState(0);
  const dir = useRef(1);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setAngle(a => {
        let n = a + dir.current * 3;
        if (n >= sim.max) { n = sim.max; dir.current = -1; }
        if (n <= sim.min) { n = sim.min; dir.current = 1; }
        return n;
      });
    }, sim.stepMs);
    return () => clearInterval(t);
  }, [running, sim.stepMs, sim.min, sim.max]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6">
      <div className="relative w-40 h-40">
        <circle cx="80" cy="80" r="62" fill="#1E293B" stroke="#334155" strokeWidth="3" />
        {/* degree marks */}
        {[0, 45, 90, 135, 180].map(d => {
          const rad = (d - 90) * Math.PI / 180;
          return <text key={d} x={80 + Math.cos(rad) * 52} y={80 + Math.sin(rad) * 52 + 3}
            textAnchor="middle" fontSize="9" fill="#64748B" fontFamily="monospace">{d}°</text>;
        })}
        {/* arm */}
        <g transform={`rotate(${angle - 90} 80 80)`} style={{ transition: 'transform 30ms linear' }}>
          <rect x="78" y="20" width="4" height="62" rx="2" fill="#22D3EE" />
          <circle cx="80" cy="20" r="7" fill="#22D3EE" style={{ filter: 'drop-shadow(0 0 6px #22D3EE)' }} />
        </g>
        <circle cx="80" cy="80" r="8" fill="#0F172A" stroke="#475569" strokeWidth="2" />
      </div>
      <div className="text-sm font-bold text-cyan-400">Angle: {angle}° · myServo.write({angle})</div>
    </div>
  );
}

// ── IR Sensor ────────────────────────────────────────────────────────────────
function IrSim({ running }) {
  const [proximity, setProximity] = useState(100); // 0 = near, 100 = far
  const detected = proximity < 40;
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6">
      <div className="flex items-end gap-6">
        {/* IR sensor */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-16 rounded-xl flex items-center justify-center text-3xl relative"
            style={{ background: '#1E293B', border: '2px solid #F472B6' }}>
            👁️
            {/* detection beam */}
            {running && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-150"
                style={{
                  width: detected ? '20px' : '70px',
                  background: detected ? 'linear-gradient(90deg, #EF4444, transparent)' : 'linear-gradient(90deg, #22D3EE, transparent)',
                  opacity: 0.7,
                }} />
            )}
          </div>
          <span className="text-[10px] text-slate-400">IR Sensor</span>
        </div>
        {/* movable object */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all duration-150"
            style={{
              background: '#334155',
              transform: `translateX(${(100 - proximity) * -0.6}px)`,
              opacity: running ? 1 : 0.5,
            }}>
            📦
          </div>
          <span className="text-[10px] text-slate-400">Object</span>
        </div>
      </div>
      {/* LED output */}
      <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-150"
        style={{
          background: detected ? 'radial-gradient(circle, #FBBF24, #F59E0B)' : '#1E293B',
          boxShadow: detected ? '0 0 30px 8px rgba(251,191,36,0.7)' : 'inset 0 0 12px rgba(0,0,0,0.5)',
          border: '2px solid #0F172A',
        }}>
        💡
      </div>
      {running ? (
        <input type="range" min="0" max="100" value={proximity}
          onChange={e => setProximity(Number(e.target.value))}
          className="w-56 accent-pink-400" />
      ) : null}
      <div className="text-xs font-bold" style={{ color: detected ? '#FBBF24' : '#64748B' }}>
        {detected ? 'Object detected → LED ON' : 'No object → LED OFF'}
      </div>
    </div>
  );
}

// ── Ultrasonic ────────────────────────────────────────────────────────────────
function UltrasonicSim({ running }) {
  const [distance, setDistance] = useState(50);
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6">
      <div className="flex items-center gap-4">
        {/* sensor */}
        <div className="w-24 h-20 rounded-xl flex flex-col items-center justify-center gap-1"
          style={{ background: '#1E293B', border: '2px solid #A78BFA' }}>
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-600" />
            <div className="w-5 h-5 rounded-full bg-slate-600" />
          </div>
          <span className="text-[9px] text-slate-400">HC-SR04</span>
        </div>
        {/* object at distance */}
        <div className="relative h-20 flex items-center" style={{ width: '240px' }}>
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-cyan-500/30" />
          <div className="absolute h-12 w-10 rounded-lg flex items-center justify-center text-xl transition-all duration-150"
            style={{
              left: `${Math.min(95, (distance / 200) * 100)}%`,
              background: '#334155',
            }}>
            🧱
          </div>
        </div>
      </div>
      {running ? (
        <input type="range" min="2" max="200" value={distance}
          onChange={e => setDistance(Number(e.target.value))}
          className="w-64 accent-violet-400" />
      ) : null}
      <div className="glass-strong rounded-xl px-5 py-3 text-center">
        <div className="text-2xl font-bold text-cyan-400 font-mono">{distance.toFixed(1)} cm</div>
        <div className="text-[10px] text-slate-400">Serial: Distance: {distance.toFixed(1)} cm</div>
      </div>
    </div>
  );
}

// ── Line Follower ────────────────────────────────────────────────────────────
function LineFollowerSim({ running }) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    const t = setInterval(() => {
      const t2 = (Date.now() - start) / 600;
      setOffset(38 * Math.sin(t2));
    }, 40);
    return () => clearInterval(t);
  }, [running]);

  const leftOn = Math.abs(offset - 12) < 20;
  const rightOn = Math.abs(offset + 12) < 20;
  const both = leftOn && rightOn;
  const action = both ? 'Forward' : leftOn ? 'Turn Left' : rightOn ? 'Turn Right' : 'Stop';
  const actionColor = both ? '#22C55E' : leftOn || rightOn ? '#F59E0B' : '#EF4444';

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6">
      {/* track */}
      <div className="relative w-72 h-24 rounded-xl overflow-hidden" style={{ background: '#E2E8F0' }}>
        {/* black line */}
        <div className="absolute top-0 bottom-0 w-6 bg-slate-900 transition-all duration-100"
          style={{ left: `${50 + offset * 0.7}%`, transform: 'translateX(-50%)' }} />
        {/* robot */}
        <div className="absolute top-1/2 -translate-y-1/2 text-3xl transition-all duration-100"
          style={{ left: '50%', transform: `translate(-50%,-50%) rotate(${both ? 0 : leftOn ? -15 : rightOn ? 15 : 0}deg)` }}>
          🤖
        </div>
      </div>
      {/* sensors */}
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full transition-all"
            style={{ background: leftOn ? '#F472B6' : '#1E293B', boxShadow: leftOn ? '0 0 14px #F472B6' : 'none' }} />
          <span className="text-[9px] text-slate-400">Left · {leftOn ? 'LINE' : '—'}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full transition-all"
            style={{ background: rightOn ? '#F472B6' : '#1E293B', boxShadow: rightOn ? '0 0 14px #F472B6' : 'none' }} />
          <span className="text-[9px] text-slate-400">Right · {rightOn ? 'LINE' : '—'}</span>
        </div>
      </div>
      <div className="glass-strong rounded-xl px-5 py-2.5">
        <span className="text-sm font-bold" style={{ color: actionColor }}>Action: {action}</span>
      </div>
    </div>
  );
}

// ── Obstacle Avoider ──────────────────────────────────────────────────────────
function ObstacleAvoiderSim({ sim, running }) {
  const [distance, setDistance] = useState(60);
  const reverse = distance < sim.threshold;
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6">
      <div className="flex items-center gap-6">
        {/* robot */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-4xl transition-transform duration-200"
            style={{ transform: `scaleX(${reverse ? -1 : 1})` }}>🚗</div>
          {/* spinning wheel indicator */}
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent"
            style={{ animation: running ? 'spin-slow 0.8s linear infinite' : 'none' }} />
        </div>
        {/* obstacle */}
        <div className="relative w-40 h-16 flex items-center">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-cyan-500/20" />
          <div className="absolute h-14 w-8 rounded flex items-center justify-center text-lg transition-all duration-150"
            style={{ left: `${Math.min(92, (distance / 200) * 100)}%`, background: '#475569' }}>🧱</div>
        </div>
      </div>
      {running ? (
        <input type="range" min="2" max="200" value={distance}
          onChange={e => setDistance(Number(e.target.value))}
          className="w-64 accent-cyan-400" />
      ) : null}
      <div className="glass-strong rounded-xl px-5 py-2.5 flex items-center gap-3">
        <span className="text-lg font-bold text-cyan-400 font-mono">{distance.toFixed(1)} cm</span>
        <span className="text-sm font-bold" style={{ color: reverse ? '#EF4444' : '#22C55E' }}>
          → {reverse ? 'REVERSE' : 'FORWARD'}
        </span>
      </div>
      <div className="text-[10px] text-slate-400">
        {reverse ? `Obstacle < ${sim.threshold}cm — backing up` : 'Path clear — driving forward'}
      </div>
    </div>
  );
}

const SIMS = {
  led: LedSim, button: ButtonSim, servo: ServoSim, ir: IrSim,
  ultrasonic: UltrasonicSim, line_follower: LineFollowerSim, obstacle_avoider: ObstacleAvoiderSim,
};

export default function Simulator({ sim }) {
  const [running, setRunning] = useState(false);
  const [key, setKey] = useState(0);
  const Sim = SIMS[sim.type] || LedSim;

  const reset = () => { setRunning(false); setKey(k => k + 1); };

  return (
    <div className="glass-strong rounded-2xl p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: running ? '#22C55E' : '#64748B', boxShadow: running ? '0 0 8px #22C55E' : 'none' }} />
          Simulation · {running ? 'RUNNING' : 'PAUSED'}
        </h3>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setRunning(r => !r)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${running ? 'glass text-yellow-400' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:neon-glow'}`}>
            {running ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Run</>}
          </button>
          <button onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-slate-300 text-xs font-bold hover:bg-white/10">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-[280px] flex items-center justify-center rounded-xl"
        style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(0,210,255,0.08)' }}>
        <Sim key={key} sim={sim} running={running} />
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-2">
        {running ? 'Interact with the controls above to see inputs change the output.' : 'Press Run to start the live simulation.'}
      </p>
    </div>
  );
}