import React from 'react';
import { getDef } from '@/lib/lab/labComponents';

/**
 * Realistic (Fritzing-style) artwork for every lab component.
 * Everything is drawn in the component's own 0,0 → w,h space so the same art is
 * used by the 2-D canvas, the palette thumbnails and the wiring diagrams.
 * `state` carries live simulation values: { ledOn, brightness, servoAngle, motorAngle, distance, irDetected, buzzerOn, pressed }
 */

// ── shared bits ───────────────────────────────────────────────────────────
const Header = ({ x, y, w, h = 9, n, vertical = false, gold = false }) => {
  const holes = [];
  for (let i = 0; i < n; i++) {
    const cx = vertical ? x + w / 2 : x + (w / n) * (i + 0.5);
    const cy = vertical ? y + (h / n) * (i + 0.5) : y + h / 2;
    holes.push(<rect key={i} x={cx - 2.1} y={cy - 2.1} width={4.2} height={4.2} rx={0.6} fill={gold ? '#d4a017' : '#111827'} />);
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={1.5} fill="#1a1a1a" stroke="#000" strokeWidth={0.4} />
      {holes}
    </g>
  );
};
const Screw = ({ cx, cy, r = 3.4 }) => (
  <g><circle cx={cx} cy={cy} r={r} fill="#cbd5e1" stroke="#64748b" strokeWidth={0.6} />
    <path d={`M${cx - r * 0.6} ${cy} h${r * 1.2}`} stroke="#475569" strokeWidth={0.9} /></g>
);
const Chip = ({ x, y, w, h, label }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={1.5} fill="#15181d" />
    <circle cx={x + 4} cy={y + 4} r={1.4} fill="#30363d" />
    {label && <text x={x + w / 2} y={y + h / 2 + 2.5} textAnchor="middle" fontSize={Math.min(7, h * 0.45)} fill="#9aa4b2" fontFamily="monospace">{label}</text>}
  </g>
);
const Silk = (p) => <text {...p} fill={p.fill || '#eaf6f7'} fontFamily="system-ui, sans-serif" fontWeight={700} />;

// ── boards ────────────────────────────────────────────────────────────────
function ArduinoUno({ w, h }) {
  return (
    <g>
      <rect x={2} y={2} width={w - 4} height={h - 4} rx={9} fill="#00878f" stroke="#026b71" strokeWidth={1.5} />
      <rect x={6} y={6} width={w - 12} height={h - 12} rx={6} fill="none" stroke="#17a2ab" strokeWidth={0.8} />
      {/* USB-B */}
      <rect x={-2} y={18} width={34} height={30} rx={2} fill="#c9ced6" stroke="#8b94a1" />
      <rect x={2} y={23} width={26} height={20} rx={1.5} fill="#e7ebf0" />
      {/* barrel jack */}
      <rect x={-1} y={h - 54} width={30} height={26} rx={4} fill="#111418" />
      <circle cx={6} cy={h - 41} r={5} fill="#2a2f36" />
      {/* headers */}
      <Header x={38} y={3.5} w={w * 0.44} h={9} n={10} />
      <Header x={38 + w * 0.46} y={3.5} w={w * 0.3} h={9} n={8} />
      <Header x={40} y={h - 12.5} w={w * 0.34} h={9} n={8} />
      <Header x={44 + w * 0.36} y={h - 12.5} w={w * 0.3} h={9} n={6} />
      {/* ATmega + crystal + regulator */}
      <Chip x={w * 0.42} y={h * 0.42} w={w * 0.3} h={h * 0.2} label="ATMEGA328P" />
      <rect x={w * 0.3} y={h * 0.52} width={14} height={9} rx={4} fill="#a3adb9" />
      <rect x={w * 0.2} y={h * 0.62} width={20} height={12} rx={2} fill="#111418" />
      {/* reset button + LEDs */}
      <rect x={36} y={h * 0.2} width={12} height={12} rx={2} fill="#1f2937" />
      <circle cx={42} cy={h * 0.2 + 6} r={3.4} fill="#cfd6df" />
      <rect x={w * 0.5} y={h * 0.26} width={6} height={3.2} rx={1} fill="#22c55e" />
      <rect x={w * 0.56} y={h * 0.26} width={6} height={3.2} rx={1} fill="#f59e0b" />
      <Silk x={w * 0.52} y={h * 0.78} fontSize={11}>ARDUINO</Silk>
      <Silk x={w * 0.52} y={h * 0.78 + 11} fontSize={8} fill="#bfe9ec">UNO R3</Silk>
      <circle cx={14} cy={h - 12} r={3.4} fill="#0b6066" stroke="#d7eef0" strokeWidth={1.4} />
      <circle cx={w - 12} cy={12} r={3.4} fill="#0b6066" stroke="#d7eef0" strokeWidth={1.4} />
    </g>
  );
}

function ArduinoNano({ w, h }) {
  return (
    <g>
      <rect x={3} y={3} width={w - 6} height={h - 6} rx={5} fill="#1d4ed8" stroke="#1e3a8a" strokeWidth={1.2} />
      <Header x={8} y={3} w={w - 16} h={8} n={15} gold />
      <Header x={8} y={h - 11} w={w - 16} h={8} n={15} gold />
      <rect x={w - 30} y={h * 0.3} width={26} height={h * 0.4} rx={2} fill="#c9ced6" />
      <Chip x={w * 0.3} y={h * 0.36} w={w * 0.34} h={h * 0.3} label="ATmega" />
      <Silk x={10} y={h * 0.62} fontSize={7}>NANO</Silk>
    </g>
  );
}

function Esp32({ w, h }) {
  return (
    <g>
      <rect x={3} y={3} width={w - 6} height={h - 6} rx={5} fill="#15181d" stroke="#000" strokeWidth={1.2} />
      <Header x={6} y={3} w={w - 12} h={8} n={19} gold />
      <Header x={6} y={h - 11} w={w - 12} h={8} n={19} gold />
      {/* shielded module + PCB antenna */}
      <rect x={w * 0.24} y={h * 0.26} width={w * 0.4} height={h * 0.46} rx={2} fill="#9aa4b2" stroke="#6b7280" />
      <text x={w * 0.44} y={h * 0.54} textAnchor="middle" fontSize={7} fill="#2a2f36" fontFamily="monospace">ESP-WROOM-32</text>
      <path d={`M${w * 0.68} ${h * 0.3} h${w * 0.1} v4 h-${w * 0.07} v4 h${w * 0.07} v4 h-${w * 0.1}`} stroke="#d4a017" strokeWidth={2.4} fill="none" />
      <rect x={w * 0.06} y={h * 0.38} width={18} height={14} rx={2} fill="#c9ced6" />
      <rect x={w * 0.2} y={h * 0.74} width={10} height={10} rx={1.5} fill="#2a2f36" />
      <rect x={w * 0.62} y={h * 0.74} width={10} height={10} rx={1.5} fill="#2a2f36" />
      <Silk x={w * 0.3} y={h * 0.9} fontSize={6} fill="#9aa4b2">ESP32 DEVKIT</Silk>
    </g>
  );
}

function Breadboard({ w, h }) {
  const cols = 22, rows = 5;
  const holes = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      holes.push(<rect key={`a${c}${r}`} x={14 + c * ((w - 28) / cols)} y={h * 0.26 + r * 6} width={3} height={3} rx={0.5} fill="#9aa4b2" />);
      holes.push(<rect key={`b${c}${r}`} x={14 + c * ((w - 28) / cols)} y={h * 0.62 + r * 6} width={3} height={3} rx={0.5} fill="#9aa4b2" />);
    }
  }
  return (
    <g>
      <rect x={2} y={2} width={w - 4} height={h - 4} rx={4} fill="#f3f4f6" stroke="#cbd5e1" strokeWidth={1.4} />
      <line x1={8} y1={10} x2={w - 8} y2={10} stroke="#ef4444" strokeWidth={1.2} />
      <line x1={8} y1={16} x2={w - 8} y2={16} stroke="#2563eb" strokeWidth={1.2} />
      <line x1={8} y1={h - 16} x2={w - 8} y2={h - 16} stroke="#ef4444" strokeWidth={1.2} />
      <line x1={8} y1={h - 10} x2={w - 8} y2={h - 10} stroke="#2563eb" strokeWidth={1.2} />
      <rect x={10} y={h * 0.49} width={w - 20} height={5} rx={1} fill="#e5e7eb" stroke="#cbd5e1" strokeWidth={0.5} />
      {holes}
    </g>
  );
}

// ── outputs ───────────────────────────────────────────────────────────────
function Led({ w, h, state }) {
  const on = state?.ledOn;
  const b = state?.brightness ?? 1;
  const cx = w / 2, cy = h / 2 - 2;
  return (
    <g>
      {on && <circle cx={cx} cy={cy} r={22 * (0.6 + 0.4 * b)} fill="#fde047" opacity={0.35 * b} />}
      <path d={`M${cx - 10} ${cy + 10} v-10 a10 10 0 0 1 20 0 v10 z`} fill={on ? '#fde047' : '#ef4444'} stroke={on ? '#facc15' : '#b91c1c'} strokeWidth={1.2} />
      <ellipse cx={cx} cy={cy + 10} rx={10} ry={2.6} fill={on ? '#fcd34d' : '#dc2626'} />
      <rect x={cx - 12} y={cy + 9} width={24} height={3} rx={1} fill={on ? '#facc15' : '#dc2626'} />
      <path d={`M${cx - 4} ${cy + 12} v${h / 2 - cy - 8}`} stroke="#9aa4b2" strokeWidth={2} />
      <path d={`M${cx + 4} ${cy + 12} v${h / 2 - cy - 2}`} stroke="#9aa4b2" strokeWidth={2} />
      <path d={`M${cx - 3} ${cy - 2} l6 4 l-6 4`} fill="none" stroke={on ? '#92400e' : '#7f1d1d'} strokeWidth={1} opacity={0.7} />
    </g>
  );
}

function Resistor({ w, h }) {
  const cy = h / 2;
  return (
    <g>
      <line x1={2} y1={cy} x2={w - 2} y2={cy} stroke="#b9c0ca" strokeWidth={3} />
      <rect x={w * 0.24} y={cy - 11} width={w * 0.52} height={22} rx={10} fill="#d8b98c" stroke="#a9835a" strokeWidth={1} />
      {[0.32, 0.42, 0.52, 0.68].map((p, i) => (
        <rect key={i} x={w * p} y={cy - 11} width={5} height={22} fill={['#dc2626', '#dc2626', '#a16207', '#d4af37'][i]} />
      ))}
      <text x={w / 2} y={cy + 20} textAnchor="middle" fontSize={8} fill="#64748b">220Ω</text>
    </g>
  );
}

function PushButton({ w, h, state }) {
  const p = state?.pressed;
  return (
    <g>
      <rect x={w * 0.18} y={h * 0.18} width={w * 0.64} height={h * 0.64} rx={3} fill="#1f2937" stroke="#0b0f14" />
      <circle cx={w / 2} cy={h / 2} r={w * 0.2} fill={p ? '#9aa4b2' : '#e5e7eb'} stroke="#64748b" />
      {[[0.18, 0.26], [0.18, 0.74], [0.82, 0.26], [0.82, 0.74]].map(([x, y], i) => (
        <rect key={i} x={w * x - 5} y={h * y - 2} width={10} height={4} rx={1} fill="#b9c0ca" />
      ))}
    </g>
  );
}

function Buzzer({ w, h, state }) {
  const on = state?.buzzerOn;
  return (
    <g>
      <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) * 0.34} fill="#15181d" stroke="#000" />
      <circle cx={w / 2} cy={h / 2} r={3} fill="#2a2f36" />
      <text x={w / 2} y={h / 2 + 14} textAnchor="middle" fontSize={7} fill="#64748b">BUZZER</text>
      {on && [10, 16, 22].map((r, i) => (
        <path key={i} d={`M${w / 2 + r} ${h / 2 - r * 0.7} a${r} ${r} 0 0 1 0 ${r * 1.4}`} fill="none" stroke="#f97316" strokeWidth={1.6} opacity={0.9 - i * 0.2} />
      ))}
    </g>
  );
}

function Servo({ w, h, state }) {
  const a = (state?.servoAngle ?? 90) - 90;
  return (
    <g>
      <rect x={w * 0.2} y={h * 0.22} width={w * 0.5} height={h * 0.56} rx={3} fill="#2563eb" stroke="#1e3a8a" />
      <rect x={w * 0.2} y={h * 0.14} width={w * 0.5} height={h * 0.1} rx={2} fill="#1d4ed8" />
      <rect x={w * 0.1} y={h * 0.3} width={w * 0.1} height={h * 0.1} rx={2} fill="#1d4ed8" />
      <rect x={w * 0.7} y={h * 0.3} width={w * 0.1} height={h * 0.1} rx={2} fill="#1d4ed8" />
      <circle cx={w * 0.36} cy={h * 0.4} r={w * 0.1} fill="#e2e8f0" stroke="#94a3b8" />
      <g transform={`rotate(${a} ${w * 0.36} ${h * 0.4})`}>
        <rect x={w * 0.33} y={h * 0.04} width={w * 0.06} height={h * 0.38} rx={3} fill="#f8fafc" stroke="#cbd5e1" />
        <circle cx={w * 0.36} cy={h * 0.09} r={2.2} fill="#cbd5e1" />
      </g>
      {/* 3-wire cable */}
      {['#f97316', '#ef4444', '#78350f'].map((c, i) => (
        <path key={c} d={`M${w * 0.2} ${h * (0.42 + i * 0.09)} h-${w * 0.14}`} stroke={c} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      ))}
      <text x={w * 0.45} y={h * 0.74} textAnchor="middle" fontSize={7} fill="#dbeafe">SG90</text>
    </g>
  );
}

function DcMotor({ w, h, state }) {
  const rot = state?.motorAngle ?? 0;
  return (
    <g>
      <rect x={w * 0.3} y={h * 0.18} width={w * 0.46} height={h * 0.64} rx={6} fill="#facc15" stroke="#ca8a04" />
      <rect x={w * 0.12} y={h * 0.3} width={w * 0.2} height={h * 0.4} rx={4} fill="#cbd5e1" stroke="#94a3b8" />
      <circle cx={w * 0.22} cy={h * 0.5} r={h * 0.1} fill="#e2e8f0" />
      <g transform={`rotate(${rot} ${w * 0.22} ${h * 0.5})`}>
        <rect x={w * 0.2} y={h * 0.38} width={w * 0.04} height={h * 0.24} rx={1} fill="#94a3b8" />
      </g>
      <rect x={w * 0.76} y={h * 0.36} width={w * 0.12} height={h * 0.12} rx={2} fill="#ef4444" />
      <rect x={w * 0.76} y={h * 0.52} width={w * 0.12} height={h * 0.12} rx={2} fill="#1f2937" />
      <text x={w * 0.53} y={h * 0.56} textAnchor="middle" fontSize={7} fill="#78350f">TT MOTOR</text>
    </g>
  );
}

// ── sensors ───────────────────────────────────────────────────────────────
function IrSensor({ w, h, state }) {
  const det = state?.irDetected;
  return (
    <g>
      <rect x={4} y={h * 0.16} width={w - 8} height={h * 0.68} rx={3} fill="#1d4ed8" stroke="#1e3a8a" />
      <circle cx={w * 0.3} cy={h / 2} r={7} fill="#0b1220" stroke="#334155" />
      <circle cx={w * 0.52} cy={h / 2} r={7} fill={det ? '#bae6fd' : '#e2e8f0'} stroke="#94a3b8" />
      {det && <path d={`M${w * 0.62} ${h / 2} h18`} stroke="#22c55e" strokeWidth={2} strokeDasharray="3 3" />}
      <rect x={w * 0.68} y={h * 0.3} width={12} height={12} rx={2} fill="#1e40af" stroke="#1e3a8a" />
      <circle cx={w * 0.68 + 6} cy={h * 0.3 + 6} r={3} fill="#60a5fa" />
      <circle cx={w * 0.3} cy={h * 0.78} r={2.6} fill={det ? '#22c55e' : '#14532d'} />
      <Header x={w * 0.62} y={h * 0.62} w={22} h={8} n={3} gold />
      <text x={w * 0.42} y={h * 0.26} textAnchor="middle" fontSize={6.5} fill="#dbeafe">IR MODULE</text>
    </g>
  );
}

function Ultrasonic({ w, h, state }) {
  const d = state?.distance;
  return (
    <g>
      <rect x={3} y={h * 0.14} width={w - 6} height={h * 0.66} rx={3} fill="#1d4ed8" stroke="#1e3a8a" />
      {[0.26, 0.74].map((p, i) => (
        <g key={i}>
          <circle cx={w * p} cy={h * 0.46} r={Math.min(w, h) * 0.18} fill="#9aa4b2" stroke="#6b7280" strokeWidth={1.4} />
          <circle cx={w * p} cy={h * 0.46} r={Math.min(w, h) * 0.13} fill="#4b5563" />
          <text x={w * p} y={h * 0.49} textAnchor="middle" fontSize={5} fill="#e5e7eb">{i ? 'R' : 'T'}</text>
        </g>
      ))}
      <rect x={w * 0.44} y={h * 0.34} width={w * 0.12} height={h * 0.2} rx={1.5} fill="#cbd5e1" stroke="#94a3b8" />
      <Header x={w * 0.3} y={h * 0.72} w={w * 0.4} h={8} n={4} gold />
      <text x={w / 2} y={h * 0.22} textAnchor="middle" fontSize={6.5} fill="#dbeafe">HC-SR04</text>
      {d !== undefined && <text x={w / 2} y={h * 0.98} textAnchor="middle" fontSize={9} fontWeight={700} fill="#0ea5e9">{Math.round(d)} cm</text>}
    </g>
  );
}

function Ldr({ w, h }) {
  const cx = w / 2, cy = h / 2;
  return (
    <g>
      <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.3} fill="#f8fafc" stroke="#94a3b8" strokeWidth={1.4} />
      <path d={`M${cx - 10} ${cy - 6} q5 4 10 0 q5 -4 10 0 M${cx - 10} ${cy + 2} q5 4 10 0 q5 -4 10 0`} stroke="#b45309" strokeWidth={2} fill="none" />
      <path d={`M${cx - 6} ${cy + 10} v${h / 2 - cy - 2}`} stroke="#9aa4b2" strokeWidth={2} />
      <path d={`M${cx + 6} ${cy + 10} v${h / 2 - cy - 2}`} stroke="#9aa4b2" strokeWidth={2} />
      <text x={cx} y={h - 2} textAnchor="middle" fontSize={7} fill="#64748b">LDR</text>
    </g>
  );
}

function Potentiometer({ w, h, state }) {
  const a = ((state?.knob ?? 50) / 100) * 270 - 135;
  return (
    <g>
      <rect x={w * 0.16} y={h * 0.3} width={w * 0.68} height={h * 0.5} rx={3} fill="#1e40af" stroke="#1e3a8a" />
      <circle cx={w / 2} cy={h * 0.4} r={Math.min(w, h) * 0.22} fill="#60a5fa" stroke="#1e3a8a" />
      <g transform={`rotate(${a} ${w / 2} ${h * 0.4})`}>
        <rect x={w / 2 - 1.6} y={h * 0.4 - Math.min(w, h) * 0.2} width={3.2} height={Math.min(w, h) * 0.2} rx={1.5} fill="#0b1220" />
      </g>
      <Header x={w * 0.3} y={h * 0.74} w={w * 0.4} h={8} n={3} gold />
      <text x={w / 2} y={h * 0.26} textAnchor="middle" fontSize={6.5} fill="#1e3a8a">10kΩ POT</text>
    </g>
  );
}

function Display({ w, h, running, oled }) {
  return (
    <g>
      <rect x={3} y={3} width={w - 6} height={h - 6} rx={3} fill={oled ? '#111418' : '#1e3a8a'} stroke="#0b1220" />
      <rect x={10} y={12} width={w - 20} height={h - 30} rx={2} fill={oled ? '#05070a' : '#1d9c3a'} />
      <text x={w / 2} y={h / 2 + 2} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={oled ? '#e2e8f0' : '#eafff0'}>
        {running ? 'RoboCraft' : (oled ? '0.96" OLED' : 'LCD 16x2')}
      </text>
      <Header x={w * 0.3} y={h - 12} w={w * 0.4} h={8} n={4} gold />
    </g>
  );
}

function MotorDriver({ w, h }) {
  return (
    <g>
      <rect x={3} y={3} width={w - 6} height={h - 6} rx={4} fill="#1e40af" stroke="#172554" />
      {/* heatsink */}
      <rect x={w * 0.3} y={h * 0.12} width={w * 0.4} height={h * 0.34} rx={2} fill="#0b0f14" />
      {[0, 1, 2, 3, 4].map(i => <rect key={i} x={w * 0.31 + i * (w * 0.076)} y={h * 0.13} width={w * 0.035} height={h * 0.32} fill="#2a2f36" />)}
      {/* screw terminals */}
      <rect x={6} y={h * 0.56} width={w * 0.34} height={h * 0.3} rx={2} fill="#16a34a" stroke="#14532d" />
      <Screw cx={6 + w * 0.09} cy={h * 0.71} /><Screw cx={6 + w * 0.25} cy={h * 0.71} />
      <rect x={w - 6 - w * 0.34} y={h * 0.56} width={w * 0.34} height={h * 0.3} rx={2} fill="#16a34a" stroke="#14532d" />
      <Screw cx={w - 6 - w * 0.25} cy={h * 0.71} /><Screw cx={w - 6 - w * 0.09} cy={h * 0.71} />
      <Header x={w * 0.42} y={h * 0.62} w={w * 0.18} h={8} n={4} gold />
      <Chip x={w * 0.12} y={h * 0.18} w={w * 0.14} h={h * 0.2} />
      <text x={w / 2} y={h * 0.54} textAnchor="middle" fontSize={7.5} fontWeight={700} fill="#dbeafe">L298N</text>
    </g>
  );
}

function Imu({ w, h }) {
  return (
    <g>
      <rect x={4} y={h * 0.2} width={w - 8} height={h * 0.6} rx={3} fill="#7c3aed" stroke="#4c1d95" />
      <Chip x={w * 0.38} y={h * 0.38} w={w * 0.26} h={h * 0.26} />
      <Header x={w * 0.2} y={h * 0.64} w={w * 0.6} h={8} n={8} gold />
      <text x={w / 2} y={h * 0.34} textAnchor="middle" fontSize={6.5} fill="#ede9fe">GY-521 MPU6050</text>
    </g>
  );
}

function Battery9V({ w, h }) {
  return (
    <g>
      <rect x={w * 0.14} y={h * 0.16} width={w * 0.72} height={h * 0.74} rx={5} fill="#111418" stroke="#000" />
      <rect x={w * 0.14} y={h * 0.4} width={w * 0.72} height={h * 0.22} fill="#f59e0b" />
      <circle cx={w * 0.36} cy={h * 0.14} r={5} fill="#cbd5e1" stroke="#64748b" />
      <rect x={w * 0.56} y={h * 0.08} width={10} height={11} rx={2} fill="#cbd5e1" stroke="#64748b" />
      <text x={w / 2} y={h * 0.56} textAnchor="middle" fontSize={10} fontWeight={700} fill="#111418">9V</text>
      <text x={w / 2} y={h * 0.82} textAnchor="middle" fontSize={6} fill="#e5e7eb">BATTERY</text>
    </g>
  );
}

function PowerSupply({ w, h }) {
  return (
    <g>
      <rect x={w * 0.1} y={h * 0.18} width={w * 0.8} height={h * 0.64} rx={6} fill="#1f2937" stroke="#0b0f14" />
      <rect x={w * 0.18} y={h * 0.3} width={w * 0.4} height={h * 0.26} rx={2} fill="#374151" />
      <text x={w * 0.38} y={h * 0.48} textAnchor="middle" fontSize={7} fill="#e5e7eb">5V 2A</text>
      <path d={`M${w * 0.9} ${h * 0.4} h${w * 0.1}`} stroke="#ef4444" strokeWidth={3} />
      <path d={`M${w * 0.9} ${h * 0.6} h${w * 0.1}`} stroke="#111418" strokeWidth={3} />
    </g>
  );
}

const ART = {
  arduino_uno: ArduinoUno, arduino_nano: ArduinoNano, esp32: Esp32, breadboard: Breadboard,
  led: Led, resistor: Resistor, push_button: PushButton, buzzer: Buzzer, servo: Servo, dc_motor: DcMotor,
  ir_sensor: IrSensor, ultrasonic: Ultrasonic, ldr: Ldr, potentiometer: Potentiometer,
  lcd: (p) => <Display {...p} />, oled: (p) => <Display {...p} oled />,
  motor_driver: MotorDriver, mpu6050: Imu, battery: Battery9V, power_supply: PowerSupply,
};

/** Draws one component's artwork at its own size. */
export default function PartArt({ type, def, state, running }) {
  const d = def || getDef(type);
  if (!d) return null;
  const Art = ART[type];
  if (!Art) {
    return (
      <g>
        <rect x={3} y={3} width={d.w - 6} height={d.h - 6} rx={5} fill="#1f2937" stroke="#334155" />
        <text x={d.w / 2} y={d.h / 2} textAnchor="middle" fontSize={22}>{d.emoji}</text>
      </g>
    );
  }
  return <Art w={d.w} h={d.h} state={state} running={running} />;
}

/** Small thumbnail of the same artwork, for palettes and lists. */
export function PartThumb({ type, size = 34, className = '' }) {
  const d = getDef(type);
  if (!d) return null;
  return (
    <svg viewBox={`0 0 ${d.w} ${d.h}`} width={size} height={(size * d.h) / d.w} className={className} aria-hidden>
      <PartArt type={type} def={d} />
    </svg>
  );
}
