// Validation: compares student wires against an experiment's required connections.
import { getDef, isBoard, pinLocalPos } from './labComponents';

// Does a required pin spec match an actual (componentType, pinId)?
function pinMatches(spec, actualType, actualPinId) {
  if (spec.comp !== actualType) return false;
  if (spec.pin === '*') return true; // any pin (symmetric resistor terminal)
  const def = getDef(actualType);
  if (!def) return false;
  const actual = def.pins.find(p => p.id === actualPinId);
  if (!actual) return false;
  if (spec.pin === actualPinId) return true;
  // Electrical-type shortcuts: 'GND' matches any ground pin, '5V' any power pin.
  if (spec.pin === 'GND' && actual.type === 'ground') return true;
  if (spec.pin === '5V' && actual.type === 'power') return true;
  return false;
}

// Does a student wire satisfy a required connection (either direction)?
function wireMatchesReq(wire, req, types) {
  const fa = types[wire.from.compId], ta = types[wire.to.compId];
  if (!fa || !ta) return false;
  const a = { comp: fa, pin: wire.from.pinId };
  const b = { comp: ta, pin: wire.to.pinId };
  return (pinMatches(req.from, a.comp, a.pin) && pinMatches(req.to, b.comp, b.pin)) ||
         (pinMatches(req.from, b.comp, b.pin) && pinMatches(req.to, a.comp, a.pin));
}

// BFS from a component pin through pass-through components (resistor) to a board pin.
export function traceToBoard(wires, types, startCompId, startPinId) {
  const visited = new Set();
  let frontier = [{ compId: startCompId, pinId: startPinId }];
  while (frontier.length) {
    const next = [];
    for (const f of frontier) {
      for (const w of wires) {
        let other = null;
        if (w.from.compId === f.compId && w.from.pinId === f.pinId) other = w.to;
        else if (w.to.compId === f.compId && w.to.pinId === f.pinId) other = w.from;
        if (!other) continue;
        const ot = types[other.compId];
        if (!ot) continue;
        if (isBoard(ot)) return other.pinId;
        const key = other.compId + ':' + other.pinId;
        if (visited.has(key)) continue;
        visited.add(key);
        if (ot === 'resistor') {
          const exit = other.pinId === 'a' ? 'b' : 'a';
          next.push({ compId: other.compId, pinId: exit });
        }
        // breadboard/other non-board, non-passthrough = dead end here
      }
    }
    frontier = next;
  }
  return null;
}

// Resolve code pins from the student's actual wiring.
export function resolvePins(experiment, components, wires) {
  const types = {};
  components.forEach(c => { types[c.id] = c.type; });
  const byType = {};
  components.forEach(c => { byType[c.type] = c; });
  const pins = {};
  for (const key of Object.keys(experiment.codePins || {})) {
    const cp = experiment.codePins[key];
    const comp = byType[cp.trace];
    if (!comp) { pins[key] = null; continue; }
    pins[key] = traceToBoard(wires, types, comp.id, cp.pin);
  }
  return pins;
}

// Full validation result.
// Returns: { valid, satisfied:[reqIdx], wireResults:[{wireIdx, status, reqIdx, reason}],
//            missing:[reqIdx], componentIssues:[] }
export function validateCircuit(experiment, components, wires) {
  const types = {};
  components.forEach(c => { types[c.id] = c.type; });
  const presentTypes = new Set(components.map(c => c.type));

  const componentIssues = [];
  for (const t of experiment.components) {
    if (!presentTypes.has(t)) componentIssues.push(`Missing: ${getDef(t)?.name || t}`);
  }
  // discourage extras
  // (extras are allowed but not flagged to keep UX simple)

  const satisfied = new Array(experiment.required.length).fill(false);
  const usedWire = new Set();
  const wireResults = wires.map((w, i) => {
    for (let r = 0; r < experiment.required.length; r++) {
      if (satisfied[r]) continue;
      if (wireMatchesReq(w, experiment.required[r], types)) {
        satisfied[r] = true;
        usedWire.add(i);
        return { wireIdx: i, status: 'correct', reqIdx: r, reason: 'Correct connection' };
      }
    }
    return { wireIdx: i, status: 'incorrect', reqIdx: -1, reason: explainWrong(w, experiment, types) };
  });

  const missing = [];
  experiment.required.forEach((r, i) => { if (!satisfied[i]) missing.push(i); });

  const valid = componentIssues.length === 0 && missing.length === 0 && wireResults.every(w => w.status === 'correct');
  return { valid, satisfied, wireResults, missing, componentIssues };
}

function explainWrong(wire, experiment, types) {
  const fa = types[wire.from.compId], ta = types[wire.to.compId];
  const aPin = getDef(fa)?.pins.find(p => p.id === wire.from.pinId);
  const bPin = getDef(ta)?.pins.find(p => p.id === wire.to.pinId);
  const aLabel = aPin ? aPin.label : wire.from.pinId;
  const bLabel = bPin ? bPin.label : wire.to.pinId;
  const aName = getDef(fa)?.name || fa;
  const bName = getDef(ta)?.name || ta;
  // power/ground misuse
  if (aPin?.type === 'power' && bPin?.type === 'ground') return `Short circuit: ${aName} ${aLabel} to ${bName} ${bLabel}. Never connect power to ground.`;
  if (aPin?.type === 'ground' && bPin?.type === 'power') return `Short circuit: ${aName} ${aLabel} to ${bName} ${bLabel}. Never connect ground to power.`;
  // both board pins
  if (isBoard(fa) && isBoard(ta)) return `Connecting two board pins (${aLabel} ↔ ${bLabel}) is not part of this circuit.`;
  // generic
  return `${aName} ${aLabel} → ${bName} ${bLabel} is not a required connection. Check the wiring guide.`;
}

export function countRequired(experiment) { return experiment.required.length; }