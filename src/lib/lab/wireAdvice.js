// What to say when a student wires two pins together.
//
// Wiring is tap-a-pin, tap-another-pin. The moment the second pin is tapped we
// either make the wire or say, in one plain sentence, what is wrong with it and
// what to do instead. A red wire a student cannot interpret is not feedback.

import { getDef, isBoard } from './labComponents';

const pinOf = (type, pinId) => getDef(type)?.pins.find(p => p.id === pinId);
const pinLabel = (type, pinId) => pinOf(type, pinId)?.label || pinId;
const nameOf = (type) => getDef(type)?.name || type;

// A required connection names a component type and a pin, where '*' is either
// terminal of a symmetric part such as a resistor.
const specMatches = (spec, type, pinId) => spec.comp === type && (spec.pin === '*' || spec.pin === pinId);

// "the LED's Cathode (−)" / "either end of the Resistor 220Ω"
function describe(spec) {
  if (spec.pin === '*') return `either end of the ${nameOf(spec.comp)}`;
  return `the ${nameOf(spec.comp)}'s ${pinLabel(spec.comp, spec.pin)}`;
}

/** Where this pin is supposed to go in the experiment being followed. */
export function expectedFor(experiment, type, pinId) {
  if (!experiment?.required) return [];
  const out = [];
  for (const r of experiment.required) {
    if (specMatches(r.from, type, pinId)) out.push(r.to);
    else if (specMatches(r.to, type, pinId)) out.push(r.from);
  }
  return out;
}

/**
 * Decide whether a wire should be made.
 * Returns { ok } when it should, or { ok: false, message, block } when not.
 * `block` means the wire is refused; otherwise it is made and the message is
 * a warning the student can act on or ignore.
 */
export function checkWire({ from, to, components, wires, experiment }) {
  const typeOf = (id) => components.find(c => c.id === id)?.type;
  const ft = typeOf(from.compId), tt = typeOf(to.compId);
  if (!ft || !tt) return { ok: true };

  const fPin = pinOf(ft, from.pinId), tPin = pinOf(tt, to.pinId);
  const fLabel = pinLabel(ft, from.pinId), tLabel = pinLabel(tt, to.pinId);

  // Both ends on the same part
  if (from.compId === to.compId) {
    return { ok: false, block: true,
      message: `Both ends are on the same ${nameOf(ft)}. A wire has to run from one part to another.` };
  }

  // Already wired, either way round
  const already = wires.some(w =>
    (w.from.compId === from.compId && w.from.pinId === from.pinId && w.to.compId === to.compId && w.to.pinId === to.pinId) ||
    (w.to.compId === from.compId && w.to.pinId === from.pinId && w.from.compId === to.compId && w.from.pinId === to.pinId));
  if (already) {
    return { ok: false, block: true, message: `${fLabel} and ${tLabel} are already joined.` };
  }

  // A direct path from power to ground is a short circuit — the one mistake
  // that destroys real hardware, so it is refused outright.
  const isPower = (p) => p?.type === 'power';
  const isGround = (p) => p?.type === 'ground';
  if ((isPower(fPin) && isGround(tPin)) || (isGround(fPin) && isPower(tPin))) {
    return { ok: false, block: true,
      message: `Short circuit: ${fLabel} straight to ${tLabel}. Power must go through a part before it reaches ground.` };
  }

  // Two pins on the Arduino itself
  if (isBoard(ft) && isBoard(tt)) {
    return { ok: false, block: true,
      message: `${fLabel} and ${tLabel} are both on the ${nameOf(ft)}. Wire a board pin to a part instead.` };
  }

  // LED the wrong way round: the long leg takes current in, the short leg
  // sends it to ground.
  const ledBackwards =
    (ft === 'led' && from.pinId === 'anode' && isGround(tPin)) ||
    (tt === 'led' && to.pinId === 'anode' && isGround(fPin)) ||
    (ft === 'led' && from.pinId === 'cathode' && isPower(tPin)) ||
    (tt === 'led' && to.pinId === 'cathode' && isPower(fPin));
  if (ledBackwards) {
    return { ok: false, block: true,
      message: `The LED is the wrong way round. Anode (+) is the long leg and faces the Arduino pin or 5V; Cathode (−) is the short leg and goes to GND.` };
  }

  // Following a guided experiment: say which connection this pin belongs to.
  if (experiment?.required) {
    const wanted = expectedFor(experiment, ft, from.pinId);
    const matches = wanted.some(spec => specMatches(spec, tt, to.pinId));
    if (!matches) {
      // A symmetric part has two valid destinations; naming both saves a
      // second wrong guess.
      const options = wanted.slice(0, 2).map(describe).join(', or ');
      const hint = wanted.length
        ? `${fLabel} of the ${nameOf(ft)} connects to ${options}.`
        : `${fLabel} is not used in this circuit — check the wiring guide.`;
      return { ok: false, block: true, message: `That is not a connection in this circuit. ${hint}` };
    }
  }

  // A signal pin already driving something else: allowed, but worth saying.
  if (isBoard(ft) || isBoard(tt)) {
    const boardSide = isBoard(ft) ? from : to;
    const boardPin = isBoard(ft) ? fLabel : tLabel;
    const type = isBoard(ft) ? fPin?.type : tPin?.type;
    const shared = type !== 'power' && type !== 'ground' &&
      wires.some(w => (w.from.compId === boardSide.compId && w.from.pinId === boardSide.pinId) ||
                      (w.to.compId === boardSide.compId && w.to.pinId === boardSide.pinId));
    if (shared) {
      return { ok: true, message: `${boardPin} is now driving two parts. One signal pin usually drives one part.` };
    }
  }

  return { ok: true };
}
