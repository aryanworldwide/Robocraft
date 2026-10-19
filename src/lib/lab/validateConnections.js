// Local, deterministic pin-level validation for Build With Me — ZERO AI.
// Compares each placed wire against the experiment's exact required
// connections (bidirectional) and produces specific, beginner-friendly
// feedback for wrong pins.

import { getComponentById } from '@/lib/circuit/components';

function parse(key) { return key.split(':'); } // [instanceId, pinId]

function findComp(components, instanceId) {
  return components.find(c => c.instanceId === instanceId);
}

function compName(components, instanceId) {
  const c = findComp(components, instanceId);
  return c?.name || instanceId;
}

function pinLabel(components, instanceId, pinId) {
  const c = findComp(components, instanceId);
  const pin = c?.pins.find(p => p.id === pinId);
  return pin?.label || pinId;
}

function isMicrocontroller(components, instanceId) {
  const c = findComp(components, instanceId);
  if (!c) return false;
  return getComponentById(c.id)?.category === 'Microcontroller';
}

// Human-readable description of a pin key, e.g. "Arduino Uno (D13)".
function describe(components, key) {
  const [iid, pid] = parse(key);
  return `${compName(components, iid)} (${pinLabel(components, iid, pid)})`;
}

function isShortCircuit(components, wire) {
  const [ai, ap] = parse(wire.from);
  const [bi, bp] = parse(wire.to);
  const a = findComp(components, ai);
  const b = findComp(components, bi);
  const pa = a?.pins.find(p => p.id === ap);
  const pb = b?.pins.find(p => p.id === bp);
  if (!pa || !pb) return false;
  return (pa.type === 'power' && pb.type === 'ground') || (pa.type === 'ground' && pb.type === 'power');
}

// Validate a single wire against the required connections.
export function validateWire(wire, requiredConnections, components) {
  const match = requiredConnections.some(
    r => (r.from === wire.from && r.to === wire.to) || (r.from === wire.to && r.to === wire.from)
  );
  if (match) return { status: 'correct', message: '✓ Correct connection!' };

  if (isShortCircuit(components, wire)) {
    return { status: 'wrong', message: '⚠️ Short circuit! Never connect power (VCC) directly to ground (GND).' };
  }

  const usedPins = new Set();
  requiredConnections.forEach(r => { usedPins.add(r.from); usedPins.add(r.to); });

  const a = wire.from;
  const b = wire.to;
  const aUsed = usedPins.has(a);
  const bUsed = usedPins.has(b);

  const partnerOf = (key) => {
    const r = requiredConnections.find(rc => rc.from === key || rc.to === key);
    if (!r) return null;
    return r.from === key ? r.to : r.from;
  };

  if (aUsed && !bUsed) {
    const other = partnerOf(a);
    return {
      status: 'wrong',
      message: `❌ ${describe(components, b)} is not used here. Connect ${describe(components, a)} → ${describe(components, other)}.`,
    };
  }
  if (bUsed && !aUsed) {
    const other = partnerOf(b);
    const [oIid] = parse(other);
    if (isMicrocontroller(components, oIid)) {
      return {
        status: 'wrong',
        message: `❌ Wrong pin — ${describe(components, a)} is not the required pin. Try ${pinLabel(components, oIid, parse(other)[1])}.`,
      };
    }
    return {
      status: 'wrong',
      message: `❌ ${describe(components, a)} is not used here. ${describe(components, b)} must connect to ${describe(components, other)}.`,
    };
  }
  if (aUsed && bUsed) {
    const otherA = partnerOf(a);
    return {
      status: 'wrong',
      message: `❌ Wrong connection — ${describe(components, a)} should connect to ${describe(components, otherA)}, not to ${describe(components, b)}.`,
    };
  }
  return { status: 'wrong', message: '❌ These pins are not used in this experiment.' };
}

// Validate the whole circuit. Returns per-wire results + completion summary.
export function validateAll(wires, requiredConnections, components) {
  const results = wires.map(w => ({ ...w, ...validateWire(w, requiredConnections, components) }));

  const satisfied = new Set();
  requiredConnections.forEach((r, i) => {
    const has = wires.some(
      w => (w.from === r.from && w.to === r.to) || (w.from === r.to && w.to === r.from)
    );
    if (has) satisfied.add(i);
  });

  const correctCount = satisfied.size;
  const total = requiredConnections.length;
  const wrongCount = results.filter(r => r.status === 'wrong').length;

  return {
    results,
    correctCount,
    total,
    wrongCount,
    complete: correctCount === total && wrongCount === 0,
  };
}