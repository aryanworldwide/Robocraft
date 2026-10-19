// Local, deterministic circuit validation — ZERO AI / integration credits.
// Inspects wires between placed components and flags electrical problems a
// beginner is likely to make. Used by the free-build "Build With Me" workspace.

import { getComponentById } from '@/lib/circuit/components';

const MOTOR_IDS = new Set(['dc_motor', 'servo', 'stepper']);
const DRIVER_IDS = new Set(['motor_driver']);

function pinMeta(components, pinKey) {
  const [instanceId, pinId] = pinKey.split(':');
  const comp = components.find(c => c.instanceId === instanceId);
  if (!comp) return null;
  const pin = comp.pins.find(p => p.id === pinId);
  if (!pin) return null;
  return { comp, pin, def: getComponentById(comp.id) };
}

// Returns the controller instance (microcontroller) among the two endpoints, if any.
function controllerOf(a, b) {
  if (a.def?.category === 'Microcontroller') return a;
  if (b.def?.category === 'Microcontroller') return b;
  return null;
}

// Validate a single wire. Returns { status: 'ok'|'warn'|'error', message }
export function validateWire(components, wire) {
  const a = pinMeta(components, wire.from);
  const b = pinMeta(components, wire.to);
  if (!a || !b) return { status: 'error', message: 'Wire connects to a missing pin.' };

  const tA = a.pin.type, tB = b.pin.type;

  // Short circuit: power directly to ground
  if ((tA === 'power' && tB === 'ground') || (tA === 'ground' && tB === 'power')) {
    return {
      status: 'error',
      message: '⚠️ Short circuit! Power (VCC) and Ground (GND) must never connect directly — this can damage your components.',
    };
  }

  // Both power — usually a mistake
  if (tA === 'power' && tB === 'power') {
    return {
      status: 'warn',
      message: '⚠️ Both pins are power. Usually VCC should connect to a signal or input pin, not another VCC.',
    };
  }

  // Both ground — creates a loop (acceptable as common ground, but flag for beginners)
  if (tA === 'ground' && tB === 'ground') {
    return {
      status: 'ok',
      message: '✓ Common ground connection. Sharing GND between components is correct.',
    };
  }

  // Motor connected directly to a microcontroller GPIO (no driver)
  const ctrl = controllerOf(a, b);
  if (ctrl) {
    const other = a === ctrl ? b : a;
    if (MOTOR_IDS.has(other.comp.id)) {
      return {
        status: 'error',
        message: `⚠️ ${other.def.name} is connected directly to ${ctrl.def.name}. Motors need a motor driver (e.g. L298N) — an Arduino pin cannot supply enough current and may burn out.`,
      };
    }
  }

  // Signal/data/analog/pwm connections are good
  if (['signal', 'digital', 'pwm', 'analog'].includes(tA) || ['signal', 'digital', 'pwm', 'analog'].includes(tB)) {
    return { status: 'ok', message: '✓ Connection looks correct.' };
  }

  // Power to a non-ground pin (e.g. VCC → VCC of a sensor) is fine
  if (tA === 'power' || tB === 'power') {
    return { status: 'ok', message: '✓ Power connection.' };
  }

  return { status: 'ok', message: '✓ Connection added.' };
}

// Validate the whole circuit. Returns { wires: [...], summary }
// wires: each original wire annotated with validation status + message.
export function validateCircuit(components, wires) {
  const annotated = wires.map(w => ({ ...w, ...validateWire(components, w) }));
  const errors = annotated.filter(w => w.status === 'error');
  const warnings = annotated.filter(w => w.status === 'warn');

  // Per-component completeness checks: components with power+ground pins should have both wired.
  const componentIssues = [];
  components.forEach(comp => {
    const def = getComponentById(comp.id);
    if (!def) return;
    const hasPower = def.pins.some(p => p.type === 'power');
    const hasGround = def.pins.some(p => p.type === 'ground');
    if (!hasPower && !hasGround) return;
    const connectedPins = new Set();
    annotated.forEach(w => {
      [w.from, w.to].forEach(k => {
        const [iid, pid] = k.split(':');
        if (iid === comp.instanceId) connectedPins.add(pid);
      });
    });
    if (hasPower && def.pins.filter(p => p.type === 'power').every(p => !connectedPins.has(p.id))) {
      componentIssues.push(`${def.name} has no power (VCC) connection.`);
    }
    if (hasGround && def.pins.filter(p => p.type === 'ground').every(p => !connectedPins.has(p.id))) {
      componentIssues.push(`${def.name} has no ground (GND) connection.`);
    }
  });

  return {
    wires: annotated,
    errors,
    warnings,
    componentIssues,
    valid: errors.length === 0,
  };
}