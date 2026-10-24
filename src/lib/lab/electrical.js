// A small electrical check over the circuit the student has built.
//
// It does not solve the circuit numerically. It walks the connections and
// answers the questions a beginner actually gets wrong: is there a resistor in
// series with that LED, does the part have a path back to ground, is a pin
// driving two things at once. Enough to stop the simulator from cheerfully
// blinking an LED that would burn out on a real board.

import { getDef, isBoard } from './labComponents';

// Parts that current passes straight through, pin to pin.
const PASS_THROUGH = {
  resistor: [['a', 'b']],
  // A breadboard's power rails run the length of the board; the lettered
  // holes are modelled as separate points, which is close enough here.
  breadboard: [['r1', 'r2'], ['r3', 'r4']],
};

function passThroughPartner(type, pinId) {
  for (const [x, y] of PASS_THROUGH[type] || []) {
    if (pinId === x) return y;
    if (pinId === y) return x;
  }
  return null;
}

const key = (compId, pinId) => `${compId}:${pinId}`;

/**
 * Walk outwards from one pin until a board pin is reached.
 * Returns every board pin found, and whether a resistor sat on the way.
 */
function trace(start, { components, wires }) {
  const typeOf = (id) => components.find(c => c.id === id)?.type;
  const found = [];
  const seen = new Set();
  const queue = [{ compId: start.compId, pinId: start.pinId, viaResistor: false }];

  while (queue.length) {
    const here = queue.shift();
    const k = key(here.compId, here.pinId) + (here.viaResistor ? '|r' : '');
    if (seen.has(k)) continue;
    seen.add(k);

    for (const w of wires) {
      let other = null;
      if (w.from.compId === here.compId && w.from.pinId === here.pinId) other = w.to;
      else if (w.to.compId === here.compId && w.to.pinId === here.pinId) other = w.from;
      if (!other) continue;

      const otherType = typeOf(other.compId);
      if (!otherType) continue;

      if (isBoard(otherType)) {
        const pin = getDef(otherType)?.pins.find(p => p.id === other.pinId);
        found.push({ compId: other.compId, pinId: other.pinId, pinType: pin?.type, viaResistor: here.viaResistor });
        continue;
      }
      // Step through a resistor (or a rail) and carry on looking.
      const partner = passThroughPartner(otherType, other.pinId);
      if (partner) {
        queue.push({ compId: other.compId, pinId: partner, viaResistor: here.viaResistor || otherType === 'resistor' });
      }
    }
  }
  return found;
}

/**
 * Faults worth stopping for, each with something a student can act on.
 * Returns [{ level: 'danger' | 'warn', title, message, compId }]
 */
export function checkCircuit(components, wires) {
  const faults = [];
  if (!components?.length || !wires?.length) return faults;

  for (const comp of components) {
    const type = comp.type;

    // ── LEDs: a bare LED across a 5V pin draws far more than its rated 20mA ──
    if (type === 'led') {
      const anode = trace({ compId: comp.id, pinId: 'anode' }, { components, wires });
      const cathode = trace({ compId: comp.id, pinId: 'cathode' }, { components, wires });

      const driven = anode.filter(p => p.pinType !== 'ground');
      const grounded = cathode.some(p => p.pinType === 'ground') || anode.some(p => p.pinType === 'ground');

      // A resistor limits the current wherever it sits in the loop — before
      // the LED or after it.
      const limited = driven.some(p => p.viaResistor) || cathode.some(p => p.viaResistor);
      if (driven.length && !limited) {
        faults.push({
          level: 'danger',
          compId: comp.id,
          title: 'LED without a resistor',
          message: 'This LED is wired straight to the board. An LED drops about 2V, so the pin would push roughly 60mA through it — three times what the LED and the pin are rated for, and on a real Arduino that burns out the LED and can damage the pin. Put a 220Ω resistor in series, between the pin and the LED.',
        });
      }
      if (driven.length && !grounded) {
        faults.push({
          level: 'warn',
          compId: comp.id,
          title: 'LED has no path to ground',
          message: 'Current needs a way back. Wire the LED\'s Cathode (−) to a GND pin, through the breadboard\'s − rail if you are using one.',
        });
      }
      // Anode on ground and cathode on a signal pin: the LED is reversed.
      if (anode.some(p => p.pinType === 'ground') && cathode.some(p => p.pinType && p.pinType !== 'ground')) {
        faults.push({
          level: 'warn',
          compId: comp.id,
          title: 'LED is back to front',
          message: 'The long leg, Anode (+), must face the board pin and the short leg, Cathode (−), must face GND. Swap the two wires.',
        });
      }
    }

    // ── Buzzers draw more than a pin can source ──
    if (type === 'buzzer') {
      const pos = trace({ compId: comp.id, pinId: 'pos' }, { components, wires });
      if (pos.some(p => p.pinType === 'power')) {
        faults.push({
          level: 'warn',
          compId: comp.id,
          title: 'Buzzer wired to 5V',
          message: 'Wired to 5V the buzzer sounds constantly and the code cannot switch it. Move it to a digital pin such as D8 so the sketch can turn it on and off.',
        });
      }
    }

    // ── A motor straight off a board pin ──
    if (type === 'dc_motor') {
      const t1 = trace({ compId: comp.id, pinId: 't1' }, { components, wires });
      const onBoard = t1.some(p => p.pinType === 'digital' || p.pinType === 'pwm' || p.pinType === 'power');
      const viaDriver = components.some(c => c.type === 'motor_driver') &&
        wires.some(w => [w.from, w.to].some(e => e.compId === comp.id) &&
                        [w.from, w.to].some(e => components.find(c => c.id === e.compId)?.type === 'motor_driver'));
      if (onBoard && !viaDriver) {
        faults.push({
          level: 'danger',
          compId: comp.id,
          title: 'Motor wired straight to the board',
          message: 'A DC motor pulls far more current than an Arduino pin can give, and the voltage spike when it stops can destroy the board. Drive it through the L298N motor driver, with the motor on OUT1/OUT2 and the driver on the Arduino pins.',
        });
      }
    }

    // ── Sensors and modules need both power and ground ──
    const def = getDef(type);
    if (def && !isBoard(type)) {
      const vcc = def.pins.find(p => p.type === 'power');
      const gnd = def.pins.find(p => p.type === 'ground');
      const touched = (pinId) => wires.some(w => [w.from, w.to].some(e => e.compId === comp.id && e.pinId === pinId));
      const anyWire = wires.some(w => [w.from, w.to].some(e => e.compId === comp.id));
      if (anyWire && vcc && gnd) {
        if (!touched(vcc.id)) faults.push({ level: 'warn', compId: comp.id, title: `${def.name} has no power`, message: `Wire ${def.name}'s ${vcc.label} to 5V (or 3.3V where the part needs it). Without power it reads nothing.` });
        if (!touched(gnd.id)) faults.push({ level: 'warn', compId: comp.id, title: `${def.name} has no ground`, message: `Wire ${def.name}'s ${gnd.label} to a GND pin. A sensor without a shared ground gives junk readings.` });
      }
    }
  }

  return faults;
}

/** The faults that should stop the simulation from running. */
export const blockingFaults = (faults) => faults.filter(f => f.level === 'danger');
