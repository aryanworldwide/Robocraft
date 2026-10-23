import React from 'react';
import { RealisticComponent, REALISTIC_SIZES, REALISTIC_PINS } from './RealisticComponents';

// ── Wire colors aligned to the RoboCraft circuit legend ──────────────────────
const WIRE_COLORS = {
  red: '#DC2626', black: '#171717', blue: '#2563EB', green: '#16A34A',
  orange: '#EA580C', yellow: '#CA8A04', purple: '#A78BFA', cyan: '#0891B2',
};

const WIRE_LEGEND = [
  { color: WIRE_COLORS.red, label: '5V / Power' },
  { color: WIRE_COLORS.black, label: 'GND' },
  { color: WIRE_COLORS.blue, label: 'Digital' },
  { color: WIRE_COLORS.green, label: 'Analog' },
  { color: WIRE_COLORS.orange, label: 'PWM' },
  { color: WIRE_COLORS.yellow, label: 'Signal / Data' },
];

function resolveColor(conn) {
  if (conn.color && /^#/.test(conn.color)) return conn.color;
  if (conn.wireColor) {
    const k = String(conn.wireColor).toLowerCase();
    if (WIRE_COLORS[k]) return WIRE_COLORS[k];
  }
  return '#64748B';
}

// ── Name → component id matching (reused from prior renderer) ────────────────
function matchComponentId(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  const idMap = {
    arduino_uno: ['arduino uno', 'arduino', 'uno', 'arduino_uno'],
    arduino_nano: ['arduino nano', 'nano'],
    esp32: ['esp32', 'esp 32'],
    esp8266: ['esp8266', 'nodemcu', 'esp8266 (nodemcu)'],
    breadboard: ['breadboard'],
    led: ['led', 'led (light'],
    rgb_led: ['rgb led', 'rgb'],
    resistor: ['resistor'],
    push_button: ['push button', 'button'],
    buzzer: ['buzzer', 'piezo'],
    servo: ['servo', 'servo motor', 'sg90'],
    dc_motor: ['dc motor', 'motor', 'dc'],
    stepper: ['stepper'],
    ultrasonic: ['ultrasonic', 'hc-sr04', 'distance sensor'],
    ir_sensor: ['ir sensor', 'ir', 'infrared'],
    ldr: ['ldr', 'light dependent'],
    temp_sensor: ['temperature sensor', 'dht11', 'temp sensor', 'dht'],
    gas_sensor: ['gas sensor', 'mq-2', 'mq2'],
    lcd: ['lcd', '16x2'],
    oled: ['oled'],
    battery: ['battery', '9v battery'],
    power_supply: ['power supply'],
    motor_driver: ['motor driver', 'l298n', 'l298'],
    bluetooth: ['bluetooth', 'hc-05', 'hc05'],
    relay: ['relay'],
    joystick: ['joystick'],
    a4988: ['a4988', 'a4988 stepper', 'stepper driver'],
    mpu6050: ['mpu6050', 'mpu 6050', 'mpu-6050', 'imu', 'gy-521', 'gy521'],
    nema17: ['nema17', 'nema 17', 'nema-17', 'nema 17 stepper', 'stepper motor', 'stepper'],
  };
  for (const [id, aliases] of Object.entries(idMap)) {
    if (aliases.some(a => lower === a)) return id;
  }
  for (const [id, aliases] of Object.entries(idMap)) {
    if (aliases.some(a => lower.includes(a))) return id;
  }
  return null;
}

function matchPinId(componentId, pinLabel) {
  if (!componentId || !pinLabel) return null;
  const pins = REALISTIC_PINS[componentId];
  if (!pins) return null;
  const lower = String(pinLabel).toLowerCase().replace(/[()]/g, '').trim();
  const exact = pins.find(p => p.id.toLowerCase() === lower);
  if (exact) return exact.id;
  const labelMatch = pins.find(p => p.label.toLowerCase() === lower);
  if (labelMatch) return labelMatch.id;
  const partial = pins.find(p =>
    p.label.toLowerCase().includes(lower) || lower.includes(p.label.toLowerCase()) || p.id.toLowerCase().includes(lower));
  if (partial) return partial.id;
  if (lower.includes('vcc') || lower.includes('power') || lower.includes('5v') || lower.includes('vin') || lower.includes('12v')) {
    const p = pins.find(x => x.type === 'power');
    if (p) return p.id;
  }
  if (lower.includes('gnd') || lower.includes('ground') || lower.includes('cathode') || lower.includes('negative') || lower.includes('−') || lower.includes('-')) {
    const p = pins.find(x => x.type === 'ground');
    if (p) return p.id;
  }
  return null;
}

// ── Component categories for workbench placement ─────────────────────────────
const DISCRETE = new Set(['led', 'rgb_led', 'resistor', 'push_button', 'buzzer', 'ldr']);
const SENSOR = new Set(['ultrasonic', 'ir_sensor', 'temp_sensor', 'gas_sensor', 'joystick', 'mpu6050']);
const MOTOR = new Set(['dc_motor', 'servo', 'stepper', 'nema17']);
const POWER = new Set(['battery', 'power_supply']);
const DISPLAY = new Set(['lcd', 'oled']);
const COMMS = new Set(['bluetooth', 'relay']);
const DRIVER_IDS = new Set(['motor_driver', 'a4988']);

// ── Build component instances from pin connections ───────────────────────────
function buildInstances(pinConnections) {
  let controllerId = '';
  const byName = new Map();
  pinConnections.forEach(conn => {
    if (conn.controllerId && !controllerId) controllerId = conn.controllerId;
    if (!conn.componentId && conn.component) conn.componentId = matchComponentId(conn.component);
    if (!controllerId && conn.controllerPin) controllerId = 'arduino_uno';
    const cid = conn.componentId;
    if (cid === controllerId) return;
    const key = conn.component || cid;
    if (!key) return;
    if (!byName.has(key)) byName.set(key, { key, id: cid, name: conn.component || key, conns: [], generic: !cid });
    byName.get(key).conns.push(conn);
  });
  if (!controllerId) controllerId = 'arduino_uno';

  // A part we have no artwork for still gets drawn — as a labelled module with
  // exactly the pins the wiring asks for, so no connection is ever lost.
  const dyn = {};
  for (const inst of byName.values()) {
    if (!inst.generic) continue;
    const pins = [];
    inst.conns.forEach(c => {
      const id = String(c.componentPin || 'PIN').toUpperCase();
      if (!pins.some(p => p.id === id)) pins.push({ id, label: id, type: 'signal', x: 0, y: 0 });
    });
    const h = Math.max(86, 34 + pins.length * 24);
    pins.forEach((p, i) => { p.y = 34 + i * 24; });
    dyn[inst.key] = { pins, size: { w: 150, h } };
    inst.id = `generic:${inst.key}`;
  }
  return { controllerId, instances: Array.from(byName.values()), dyn };
}

// ── Absolute pin position + exit side ────────────────────────────────────────
function sizeOf(compId, dyn, key) {
  if (compId && compId.startsWith('generic:')) return dyn[key]?.size || { w: 150, h: 90 };
  return REALISTIC_SIZES[compId];
}
function pinsOf(compId, dyn, key) {
  if (compId && compId.startsWith('generic:')) return dyn[key]?.pins || [];
  return REALISTIC_PINS[compId];
}

function pinAbs(pos, compId, pinId, dyn, key) {
  if (!pos || !compId) return null;
  const pins = pinsOf(compId, dyn, key);
  if (!pins) return null;
  const pin = pins.find(p => p.id === pinId);
  if (!pin) return null;
  const size = sizeOf(compId, dyn, key) || { w: pos.w, h: pos.h };
  const x = pos.x + pin.x;
  const y = pos.y + pin.y;
  let side = 'left';
  if (pin.x <= 2) side = 'left';
  else if (pin.x >= size.w - 2) side = 'right';
  else if (pin.y <= 2) side = 'top';
  else if (pin.y >= size.h - 2) side = 'bottom';
  return { x, y, side };
}

// ── Orthogonal jumper-wire path (rounded right-angle) ────────────────────────
function wirePath(s, t) {
  const exit = 26;
  const es = s.side === 'left' ? { x: s.x - exit, y: s.y }
    : s.side === 'right' ? { x: s.x + exit, y: s.y }
      : s.side === 'top' ? { x: s.x, y: s.y - exit }
        : { x: s.x, y: s.y + exit };
  const et = t.side === 'left' ? { x: t.x - exit, y: t.y }
    : t.side === 'right' ? { x: t.x + exit, y: t.y }
      : t.side === 'top' ? { x: t.x, y: t.y - exit }
        : { x: t.x, y: t.y + exit };

  const horizS = s.side === 'left' || s.side === 'right';
  const horizT = t.side === 'left' || t.side === 'right';
  if (horizS && horizT) {
    const midX = (es.x + et.x) / 2;
    return `M ${s.x} ${s.y} L ${es.x} ${es.y} L ${midX} ${es.y} L ${midX} ${et.y} L ${et.x} ${et.y} L ${t.x} ${t.y}`;
  }
  if (!horizS && !horizT) {
    const midY = (es.y + et.y) / 2;
    return `M ${s.x} ${s.y} L ${es.x} ${es.y} L ${es.x} ${midY} L ${et.x} ${midY} L ${et.x} ${et.y} L ${t.x} ${t.y}`;
  }
  // mixed
  return `M ${s.x} ${s.y} L ${es.x} ${es.y} L ${et.x} ${es.y} L ${et.x} ${et.y} L ${t.x} ${t.y}`;
}

/** A part with no artwork: a labelled module carrying exactly its wired pins. */
function GenericModule({ name, x, y, size, pins, onComponentClick }) {
  return (
    <g transform={`translate(${x},${y})`} onClick={() => onComponentClick?.(name)} style={{ cursor: onComponentClick ? 'pointer' : 'default' }}>
      <rect width={size.w} height={size.h} rx="8" fill="#1F2937" stroke="#0F172A" strokeWidth="2" />
      <rect x="6" y="6" width={size.w - 12} height="18" rx="4" fill="#374151" />
      <text x={size.w / 2} y="19" textAnchor="middle" fontSize="10" fontWeight="800" fill="#E5E7EB" fontFamily="'Inter',sans-serif">
        {String(name || 'MODULE').toUpperCase().slice(0, 18)}
      </text>
      {pins.map(p => (
        <g key={p.id}>
          <rect x={p.x - 5} y={p.y - 5} width="10" height="10" rx="1.5" fill="#111827" stroke="#555" strokeWidth="0.5" />
          <circle cx={p.x} cy={p.y} r="1.6" fill="#FFD700" />
          <text x={p.x + 10} y={p.y + 3} fontSize="8.5" fontWeight="700" fill="#D1D5DB" fontFamily="'Inter',sans-serif">{p.label}</text>
        </g>
      ))}
    </g>
  );
}

/** A small coloured label at a wire end, naming the pin it connects to. */
function PinTag({ p, text, color, dim, nudge = 0 }) {
  if (!p || !text) return null;
  const short = String(text).replace(/\s*\(.*\)$/, '').slice(0, 12);
  const w = Math.max(22, short.length * 7.2 + 10);
  const off = 15;
  const x = p.side === 'left' ? p.x - off - w : p.side === 'right' ? p.x + off : p.x - w / 2;
  const y = (p.side === 'top' ? p.y - off - 16 : p.side === 'bottom' ? p.y + off : p.y - 8) + nudge;
  return (
    <g opacity={dim ? 0.25 : 1} style={{ pointerEvents: 'none' }}>
      <rect x={x} y={y} width={w} height={16} rx={4} fill="#fff" stroke={color} strokeWidth="1.4" />
      <text x={x + w / 2} y={y + 11.5} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={color} fontFamily="'Inter',sans-serif">{short}</text>
    </g>
  );
}

// ── A large realistic breadboard as the workbench stage ──────────────────────
function WorkbenchBreadboard({ x, y, w, h }) {
  const holes = Math.floor((w - 60) / 13);
  const cols = [];
  for (let i = 0; i < holes; i++) cols.push(40 + i * 13);
  return (
    <g transform={`translate(${x},${y})`}>
      {/* shadow */}
      <rect x="6" y="10" width={w} height={h} rx="10" fill="#000" opacity="0.08" />
      {/* body */}
      <rect width={w} height={h} rx="10" fill="#F3EAD6" stroke="#D9C9A3" strokeWidth="2" />
      <rect x="3" y="3" width={w - 6} height={h - 6} rx="8" fill="none" stroke="#E8Dcba" strokeWidth="1" />
      {/* power rails */}
      <rect x="20" y="14" width={w - 40} height="18" rx="3" fill="#E0533D" opacity="0.85" />
      <rect x="20" y={h - 32} width={w - 40} height="18" rx="3" fill="#3B6FB0" opacity="0.85" />
      <text x="30" y="27" fontSize="11" fontWeight="800" fill="#fff" fontFamily="monospace">+</text>
      <text x="30" y={h - 19} fontSize="11" fontWeight="800" fill="#fff" fontFamily="monospace">−</text>
      <text x={w - 30} y="27" fontSize="11" fontWeight="800" fill="#fff" fontFamily="monospace" textAnchor="end">+</text>
      <text x={w - 30} y={h - 19} fontSize="11" fontWeight="800" fill="#fff" fontFamily="monospace" textAnchor="end">−</text>
      {/* rail holes */}
      {cols.map((cx, i) => (
        <g key={`r${i}`}>
          <circle cx={cx} cy="23" r="2.4" fill="#9B7B4A" />
          <circle cx={cx} cy={h - 23} r="2.4" fill="#9B7B4A" />
        </g>
      ))}
      {/* center groove */}
      <rect x="20" y={h / 2 - 6} width={w - 40} height="12" rx="3" fill="#E3D2AE" />
      {/* main terminal strips */}
      {cols.map((cx, i) => (
        <g key={`m${i}`}>
          {Array.from({ length: 5 }).map((_, j) => (
            <circle key={j} cx={cx} cy={48 + j * 12} r="2.4" fill="#9B7B4A" />
          ))}
          {Array.from({ length: 5 }).map((_, j) => (
            <circle key={j} cx={cx} cy={h / 2 + 14 + j * 12} r="2.4" fill="#9B7B4A" />
          ))}
        </g>
      ))}
      {/* column numbers */}
      {cols.filter((_, i) => i % 5 === 0).map((cx, i) => (
        <text key={i} x={cx} y={h / 2 - 10} textAnchor="middle" fontSize="7" fill="#B59B6A" fontFamily="monospace">{i * 5 + 1}</text>
      ))}
    </g>
  );
}

// ── Soft drop shadow filter id ───────────────────────────────────────────────
const SHADOW_FILTER = 'rcCompShadow';

// ── Main component ───────────────────────────────────────────────────────────
export default function CircuitDiagram({ pinConnections, projectName, header, onComponentClick, highlightWire }) {
  if (!pinConnections || pinConnections.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
        Pin connection data not available for this project.<br />
        Please refer to the source code and build steps for wiring details.
      </div>
    );
  }

  const { controllerId, instances, dyn } = buildInstances(pinConnections);
  const cSize = REALISTIC_SIZES[controllerId] || { w: 180, h: 260 };

  // ── Layout coordinates ──
  const CANVAS_W = 1180;
  const PAD = 40;
  const TITLE_H = 92;

  const ctrlX = (CANVAS_W - cSize.w) / 2;
  const ctrlY = TITLE_H + 24;

  const discreteCount = instances.filter(i => DISCRETE.has(i.id)).length;
  const showBreadboard = discreteCount > 0;
  const BB_W = 880, BB_H = showBreadboard ? 250 : 0;
  const bbX = (CANVAS_W - BB_W) / 2;
  const bbY = ctrlY + cSize.h + (showBreadboard ? 120 : 0);

  const positions = {};
  positions[controllerId] = { x: ctrlX, y: ctrlY, w: cSize.w, h: cSize.h };

  // Discrete components on the breadboard
  const discrete = instances.filter(i => DISCRETE.has(i.id));
  discrete.forEach((inst, i) => {
    const sz = sizeOf(inst.id, dyn, inst.key);
    const n = discrete.length;
    const span = BB_W - 160;
    const slot = n === 1 ? span / 2 : span / n;
    const x = bbX + 80 + slot * i + (slot - sz.w) / 2;
    const y = bbY + 56;
    positions[inst.key] = { x, y, w: sz.w, h: sz.h };
  });

  // Modules row (sensors, driver, displays, comms)
  const mods = instances.filter(i =>
    SENSOR.has(i.id) || i.id === 'motor_driver' || DISPLAY.has(i.id) || COMMS.has(i.id));
  const modY = bbY + BB_H + (showBreadboard ? 96 : 110);
  let modMaxH = 0;
  const modSpan = CANVAS_W - 2 * PAD;
  const modSlot = mods.length ? modSpan / mods.length : modSpan;
  mods.forEach((inst, i) => {
    const sz = sizeOf(inst.id, dyn, inst.key);
    modMaxH = Math.max(modMaxH, sz.h);
    const x = PAD + modSlot * i + (modSlot - sz.w) / 2;
    const y = modY;
    positions[inst.key] = { x, y, w: sz.w, h: sz.h };
  });

  // Actuators + power row
  const actuators = instances.filter(i => MOTOR.has(i.id) || POWER.has(i.id));
  const actY = modY + modMaxH + 86;
  let actMaxH = 0;
  const actSpan = CANVAS_W - 2 * PAD;
  const actSlot = actuators.length ? actSpan / actuators.length : actSpan;
  actuators.forEach((inst, i) => {
    const sz = sizeOf(inst.id, dyn, inst.key);
    actMaxH = Math.max(actMaxH, sz.h);
    const x = PAD + actSlot * i + (actSlot - sz.w) / 2;
    const y = actY;
    positions[inst.key] = { x, y, w: sz.w, h: sz.h };
  });

  // Any leftover (unknown) components → place in modules row end
  const placed = new Set([controllerId, ...discrete.map(i => i.key), ...mods.map(i => i.key), ...actuators.map(i => i.key)]);
  const leftover = instances.filter(i => !placed.has(i.key));
  leftover.forEach((inst, i) => {
    const sz = sizeOf(inst.id, dyn, inst.key) || { w: 150, h: 130 };
    const x = PAD + i * (sz.w + 30);
    const y = actY + actMaxH + 70;
    positions[inst.key] = { x, y, w: sz.w, h: sz.h };
    actMaxH = Math.max(actMaxH, sz.h + 60);
  });

  // ── Build wires ──
  const wires = [];
  pinConnections.forEach((conn, idx) => {
    const instKey = conn.component || conn.componentId || matchComponentId(conn.component);
    const inst = instances.find(i => i.key === instKey);
    const compId = inst?.id || conn.componentId || matchComponentId(conn.component);
    if (!compId) return;
    const pos = positions[instKey] || positions[compId];
    if (!pos) return;

    const ctrlPinId = conn.controllerPinId || matchPinId(controllerId, conn.controllerPin);
    const compPinId = inst?.generic
      ? String(conn.componentPin || 'PIN').toUpperCase()
      : (conn.componentPinId || matchPinId(compId, conn.componentPin));
    const s = pinAbs(positions[controllerId], controllerId, ctrlPinId, dyn, controllerId);
    const t = pinAbs(pos, compId, compPinId, dyn, instKey);
    if (!s || !t) return;

    wires.push({
      key: `c${idx}`,
      d: wirePath(s, t),
      color: resolveColor(conn),
      s, t,
      sTag: String(conn.controllerPin || '').toUpperCase(),
      tTag: String(conn.componentPin || '').toUpperCase(),
      label: `${conn.controllerPin} → ${conn.componentPin}`,
      dimmed: highlightWire != null && highlightWire !== idx,
      highlighted: highlightWire === idx,
      idx,
    });
  });

  // ── Auto inter-component wires (motor driver ↔ motors ↔ battery) ──
  const driverInst = instances.find(i => i.id === 'motor_driver');
  const motorInsts = instances.filter(i => MOTOR.has(i.id));
  const batteryInst = instances.find(i => POWER.has(i.id));

  if (driverInst && motorInsts.length > 0) {
    const outs = ['OUT1', 'OUT2', 'OUT3', 'OUT4'];
    const motorPinPairs = { dc_motor: ['P', 'N'], servo: ['VCC', 'GND'], stepper: ['A1', 'A2'] };
    motorInsts.forEach((m, mi) => {
      const pair = motorPinPairs[m.id] || ['P', 'N'];
      const oIdx = mi * 2;
      const driverPos = positions[driverInst.key];
      const mPos = positions[m.key];
      pair.forEach((mp, j) => {
        const outId = outs[oIdx + j];
        if (!outId) return;
        const s = pinAbs(driverPos, 'motor_driver', outId, dyn, driverInst.key);
        const t = pinAbs(mPos, m.id, mp, dyn, m.key);
        if (!s || !t) return;
        wires.push({
          key: `auto_d${mi}${j}`,
          d: wirePath(s, t),
          color: j === 0 ? WIRE_COLORS.red : WIRE_COLORS.black,
          s, t, sTag: outId, tTag: mp, label: `${outId} → ${mp}`, dimmed: false, highlighted: false, idx: -1,
        });
      });
    });
  }
  if (batteryInst && driverInst) {
    const bPos = positions[batteryInst.key];
    const dPos = positions[driverInst.key];
    const pairs = [
      { b: 'P', d: '12V', c: WIRE_COLORS.red },
      { b: 'N', d: 'GND', c: WIRE_COLORS.black },
    ];
    pairs.forEach((p, j) => {
      const s = pinAbs(bPos, batteryInst.id, p.b, dyn, batteryInst.key);
      const t = pinAbs(dPos, 'motor_driver', p.d, dyn, driverInst.key);
      if (!s || !t) return;
      wires.push({ key: `auto_b${j}`, d: wirePath(s, t), color: p.c, s, t, sTag: p.b === 'P' ? '+' : '−', tTag: p.d, label: `Battery → ${p.d}`, dimmed: false, highlighted: false, idx: -1 });
    });
  }
  if (batteryInst && !driverInst && motorInsts.length > 0) {
    // Battery direct to motor (simple projects)
    const bPos = positions[batteryInst.key];
    motorInsts.forEach((m, mi) => {
      const s = pinAbs(bPos, batteryInst.id, 'P', dyn, batteryInst.key);
      const t = pinAbs(positions[m.key], m.id, 'P', dyn, m.key);
      if (!s || !t) return;
      wires.push({ key: `auto_bm${mi}`, d: wirePath(s, t), color: WIRE_COLORS.red, s, t, label: 'Battery → Motor', dimmed: false, highlighted: false, idx: -1 });
    });
  }

  // ── Canvas height ──
  const allBottoms = Object.values(positions).map(p => p.y + p.h);
  const contentBottom = Math.max(...allBottoms, showBreadboard ? bbY + BB_H : 0);
  const CANVAS_H = contentBottom + 60 + 36; // + legend

  // ── Header ──
  const diffColors = { Beginner: '#16A34A', Intermediate: '#EA580C', Advanced: '#DC2626' };
  const hInfo = header || {};
  const diffColor = diffColors[hInfo.difficulty] || '#0EA5E9';
  const subtitle = hInfo.subtitle || instances.map(i => i.name).slice(0, 5).join(' + ');

  return (
    <svg width="100%" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      style={{ maxWidth: `${CANVAS_W}px`, margin: '0 auto', display: 'block', background: '#FAFBFC' }}>
      <defs>
        <filter id={SHADOW_FILTER} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.18" />
        </filter>
        <linearGradient id="rcBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDFEFE" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>
      </defs>

      {/* workbench background */}
      <rect x="0" y="0" width={CANVAS_W} height={CANVAS_H} fill="url(#rcBg)" />

      {/* ── Header ── */}
      <g>
        <text x={CANVAS_W / 2} y="34" textAnchor="middle" fontSize="26" fontWeight="800"
          fill="#0F172A" fontFamily="'Inter',sans-serif" letterSpacing="-0.5">
          {(hInfo.name || projectName || 'ROBOTICS PROJECT').toUpperCase()}
        </text>
        <text x={CANVAS_W / 2} y="58" textAnchor="middle" fontSize="13" fontWeight="600"
          fill="#475569" fontFamily="'Inter',sans-serif">
          {subtitle}
        </text>
        {/* badges */}
        <g transform={`translate(${CANVAS_W / 2 - 230}, 68)`}>
          {[
            { label: hInfo.difficulty || '', color: diffColor, show: !!hInfo.difficulty },
            { label: `⏱ ${hInfo.time || ''}`, color: '#475569', show: !!hInfo.time },
            { label: `₹ ${hInfo.cost || ''}`.replace('₹ ₹', '₹'), color: '#475569', show: !!hInfo.cost },
          ].filter(b => b.show).map((b, i) => (
            <g key={i} transform={`translate(${i * 160}, 0)`}>
              <rect width="150" height="22" rx="11" fill="#fff" stroke={b.color} strokeWidth="1.5" />
              <text x="75" y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill={b.color} fontFamily="'Inter',sans-serif">
                {b.label}
              </text>
            </g>
          ))}
        </g>
      </g>

      {/* ── Breadboard stage (only when parts sit on it) ── */}
      {showBreadboard && <WorkbenchBreadboard x={bbX} y={bbY} w={BB_W} h={BB_H} />}

      {/* ── Wires (under components' pin caps, over breadboard) ── */}
      <g>
        {wires.map(w => (
          <g key={w.key}>
            {/* soft shadow */}
            <path d={w.d} fill="none" stroke="#000" strokeWidth={w.highlighted ? 6 : 4}
              strokeOpacity="0.08" strokeLinecap="round" strokeLinejoin="round" transform="translate(1.5,2)" />
            <path d={w.d} fill="none" stroke={w.color}
              strokeWidth={w.highlighted ? 5 : 3.4}
              strokeOpacity={w.dimmed ? 0.22 : 1}
              strokeLinecap="round" strokeLinejoin="round"
              style={w.highlighted ? { filter: 'drop-shadow(0 0 5px #0EA5E9)' } : undefined}
            />
          </g>
        ))}
      </g>

      {/* ── Pin tags: which pin each wire lands on ── */}
      <g>
        {(() => {
          const seen = new Map();
          const slot = (pt) => {
            const k = `${Math.round(pt.x)},${Math.round(pt.y)}`;
            const n = seen.get(k) || 0;
            seen.set(k, n + 1);
            return n * 17;
          };
          return wires.flatMap(w => [
            w.sTag ? <PinTag key={`${w.key}s`} p={w.s} text={w.sTag} color={w.color} dim={w.dimmed} nudge={slot(w.s)} /> : null,
            w.tTag ? <PinTag key={`${w.key}t`} p={w.t} text={w.tTag} color={w.color} dim={w.dimmed} nudge={slot(w.t)} /> : null,
          ]);
        })()}
      </g>

      {/* ── Components ── */}
      <g filter={`url(#${SHADOW_FILTER})`}>
        {/* Controller */}
        <RealisticComponent componentId={controllerId} x={ctrlX} y={ctrlY}
          onComponentClick={onComponentClick} />
        {/* Discrete on breadboard */}
        {discrete.map(inst => (
          <RealisticComponent key={inst.key} componentId={inst.id}
            x={positions[inst.key].x} y={positions[inst.key].y} onComponentClick={onComponentClick} />
        ))}
        {/* Modules, actuators and anything we have no artwork for */}
        {[...mods, ...actuators, ...leftover].map(inst => (
          inst.generic
            ? <GenericModule key={inst.key} name={inst.name} x={positions[inst.key].x} y={positions[inst.key].y}
                size={dyn[inst.key].size} pins={dyn[inst.key].pins} onComponentClick={onComponentClick} />
            : <RealisticComponent key={inst.key} componentId={inst.id}
                x={positions[inst.key].x} y={positions[inst.key].y} onComponentClick={onComponentClick} />
        ))}
      </g>

      {/* ── Pin caps (gold jumper tips) drawn on top ── */}
      <g>
        {wires.map(w => (
          <g key={`cap-${w.key}`}>
            <rect x={w.s.x - 3.5} y={w.s.y - 3.5} width="7" height="7" rx="1.5"
              fill="#EAB308" stroke="#854D0E" strokeWidth="0.6" />
            <rect x={w.t.x - 3.5} y={w.t.y - 3.5} width="7" height="7" rx="1.5"
              fill="#EAB308" stroke="#854D0E" strokeWidth="0.6" />
          </g>
        ))}
      </g>

      {/* ── Component labels ── */}
      <g fontFamily="'Inter',sans-serif">
        <text x={ctrlX + cSize.w / 2} y={ctrlY + cSize.h + 20} textAnchor="middle"
          fontSize="12" fontWeight="700" fill="#0F172A">{COMPONENT_LABELS[controllerId] || 'Controller'}</text>
        {[...discrete, ...mods, ...actuators, ...leftover].map(inst => {
          const p = positions[inst.key];
          if (!p) return null;
          return (
            <text key={inst.key} x={p.x + p.w / 2} y={p.y + p.h + 18} textAnchor="middle"
              fontSize="11" fontWeight="700" fill="#0F172A">{inst.name}</text>
          );
        })}
      </g>

      {/* ── Legend ── */}
      <g transform={`translate(${PAD}, ${CANVAS_H - 26})`}>
        <rect x="-10" y="-18" width={CANVAS_W - 2 * PAD + 20} height="34" rx="8" fill="#fff" stroke="#E2E8F0" strokeWidth="1" />
        {WIRE_LEGEND.map((item, i) => (
          <g key={i} transform={`translate(${i * 165}, 0)`}>
            <rect x="0" y="-4" width="20" height="6" rx="3" fill={item.color} />
            <text x="26" y="2" fontSize="11" fontWeight="600" fill="#334155" fontFamily="'Inter',sans-serif">{item.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

const COMPONENT_LABELS = {
  arduino_uno: 'Arduino Uno',
  arduino_nano: 'Arduino Nano',
  esp32: 'ESP32',
  esp8266: 'ESP8266',
};