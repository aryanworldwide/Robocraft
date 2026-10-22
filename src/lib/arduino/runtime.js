// Runs a transpiled Arduino sketch against simulated hardware, in virtual time.
// The hardware object decides what pins do (LEDs, motors, sensors, servos…).
import { transpile, SketchError } from './transpile';

export const PINS = { A0: 14, A1: 15, A2: 16, A3: 17, A4: 18, A5: 19 };

export class StopSketch extends Error {}

/**
 * Base simulated board. Subclasses (arenas, circuits) override the hooks:
 *   onPinChange(pin, value, kind) · readDigital(pin) · readAnalog(pin)
 *   echoMicros(echoPin) · step(ms)
 */
export class SimBoard {
  constructor() {
    this.mode = {}; this.out = {}; this.pwm = {}; this.servo = {}; this.tones = {};
    this.serialLines = []; this.onSerial = null; this.lastTrigger = {}; this.t = 0;
  }
  pinMode(pin, m) { this.mode[pin] = m; }
  digitalWrite(pin, v) {
    const val = v ? 1 : 0;
    const prev = this.out[pin];
    this.out[pin] = val; this.pwm[pin] = val ? 255 : 0;
    if (prev === 1 && val === 0) this.lastTrigger[pin] = this.t; // falling edge (ultrasonic trigger)
    this.onPinChange?.(pin, val, 'digital');
  }
  analogWrite(pin, v) {
    const val = Math.max(0, Math.min(255, Math.round(v)));
    this.pwm[pin] = val; this.out[pin] = val > 0 ? 1 : 0;
    this.onPinChange?.(pin, val, 'pwm');
  }
  digitalRead(pin) {
    const v = this.readDigital?.(pin);
    if (v !== undefined && v !== null) return v ? 1 : 0;
    if (this.mode[pin] === 2) return 1; // INPUT_PULLUP idle
    return this.out[pin] || 0;
  }
  analogRead(pin) {
    const p = pin < 14 ? pin + 14 : pin;
    const v = this.readAnalog?.(p);
    return Math.max(0, Math.min(1023, Math.round(v ?? 0)));
  }
  pulseIn(pin) { return Math.round(this.echoMicros?.(pin) ?? 0); }
  servoWrite(pin, angle) { this.servo[pin] = Math.max(0, Math.min(180, angle)); this.onPinChange?.(pin, this.servo[pin], 'servo'); }
  tone(pin, f) { this.tones[pin] = f; this.onPinChange?.(pin, f, 'tone'); }
  noTone(pin) { this.tones[pin] = 0; this.onPinChange?.(pin, 0, 'tone'); }
  serial(text) { this.serialLines.push(text); if (this.serialLines.length > 400) this.serialLines.shift(); this.onSerial?.(text); }
  /** pwm 0–255 on a pin (digital HIGH = 255). */
  level(pin) { return this.pwm[pin] ?? (this.out[pin] ? 255 : 0); }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Start a sketch. Returns { stop(), done } where done resolves when it stops.
 * opts: { speed (1 = real time), onError(err), onTime(ms), maxMs }
 */
export function runSketch(code, board, opts = {}) {
  let stopped = false;
  let speed = opts.speed ?? 1;
  let sinceYield = 0, ticks = 0;
  const clock = { t: 0 };

  const advance = async (ms) => {
    if (stopped) throw new StopSketch();
    let left = ms;
    while (left > 0) {
      const dt = Math.min(5, left);
      board.t = clock.t;
      board.step?.(dt, clock.t);
      clock.t += dt; left -= dt;
      sinceYield += dt;
      if (sinceYield >= 20) {
        opts.onTime?.(clock.t);
        await sleep(Math.max(0, sinceYield / speed));
        sinceYield = 0;
        if (stopped) throw new StopSketch();
      }
      if (opts.maxMs && clock.t >= opts.maxMs) { stopped = true; throw new StopSketch(); }
    }
  };

  class Servo {
    constructor() { this.pin = null; this.angle = 90; }
    attach(pin) { this.pin = pin; board.servoWrite(pin, this.angle); return 1; }
    detach() { this.pin = null; }
    write(a) { this.angle = a; if (this.pin !== null) board.servoWrite(this.pin, a); }
    writeMicroseconds(us) { this.write((us - 1000) / 1000 * 180); }
    read() { return Math.round(this.angle); }
    attached() { return this.pin !== null; }
  }

  const fmt = (v, opt) => {
    if (typeof v === 'boolean') return v ? '1' : '0';
    if (Array.isArray(v) && v.isText) { const z = v.indexOf(0); return String.fromCharCode(...(z >= 0 ? v.slice(0, z) : v)); }
    if (typeof v === 'number') {
      if (opt === 2 || opt === 8 || opt === 16) { if (Number.isInteger(v)) return v.toString(opt).toUpperCase(); }
      if (opt === 10) return String(Math.trunc(v));
      if (!Number.isInteger(v)) return v.toFixed(typeof opt === 'number' ? opt : 2);
      return String(v);
    }
    return String(v ?? '');
  };
  let lineBuf = '';
  const Serial = {
    begin() {}, end() {},
    print(v, opt) { lineBuf += fmt(v, opt); },
    println(v = '', opt) { board.serial(lineBuf + fmt(v, opt)); lineBuf = ''; },
    write(v) { lineBuf += typeof v === 'number' ? String.fromCharCode(v) : String(v); },
    available() { return 0; }, read() { return -1; }, parseInt() { return 0; }, parseFloat() { return 0; }, flush() {},
  };

  const api = {
    HIGH: 1, LOW: 0, INPUT: 0, OUTPUT: 1, INPUT_PULLUP: 2, LED_BUILTIN: 13, true: true, false: false,
    A0: 14, A1: 15, A2: 16, A3: 17, A4: 18, A5: 19, DEC: 10, HEX: 16, BIN: 2, OCT: 8, NULL: 0,
    PI: Math.PI, HALF_PI: Math.PI / 2, TWO_PI: Math.PI * 2, DEG_TO_RAD: Math.PI / 180, RAD_TO_DEG: 180 / Math.PI,
    CHANGE: 1, RISING: 3, FALLING: 2,
    Serial, Servo,
    pinMode: (p, m) => board.pinMode(p, m),
    digitalWrite: (p, v) => board.digitalWrite(p, v),
    digitalRead: (p) => board.digitalRead(p),
    analogWrite: (p, v) => board.analogWrite(p, v),
    analogRead: (p) => board.analogRead(p),
    tone: (p, f) => board.tone(p, f), noTone: (p) => board.noTone(p),
    delay: (ms) => advance(Math.max(0, Number(ms) || 0)),
    delayMicroseconds: (us) => advance(Math.max(0, Number(us) || 0) / 1000),
    millis: () => Math.floor(clock.t), micros: () => Math.floor(clock.t * 1000),
    pulseIn: async (pin, level, timeout = 1000000) => {
      const us = board.pulseIn(pin, level);
      const cap = Math.min(us || 0, timeout);
      await advance((cap || timeout / 50) / 1000);
      return us > timeout ? 0 : cap;
    },
    map: (x, a, b, c, d) => Math.trunc(((x - a) * (d - c)) / (b - a) + c),
    constrain: (x, a, b) => Math.min(Math.max(x, a), b),
    abs: Math.abs, min: Math.min, max: Math.max, sqrt: Math.sqrt, pow: Math.pow, sq: (x) => x * x,
    sin: Math.sin, cos: Math.cos, tan: Math.tan, atan: Math.atan, atan2: Math.atan2, asin: Math.asin, acos: Math.acos,
    exp: Math.exp, log: Math.log, log10: Math.log10, floor: Math.floor, ceil: Math.ceil, round: Math.round, fabs: Math.abs, isnan: Number.isNaN,
    random: (a, b) => (b === undefined ? Math.floor(Math.random() * a) : Math.floor(a + Math.random() * (b - a))),
    randomSeed: () => {},
    bitRead: (x, n) => (x >> n) & 1, bitSet: (x, n) => x | (1 << n), bitClear: (x, n) => x & ~(1 << n),
    bitWrite: (x, n, b) => (b ? x | (1 << n) : x & ~(1 << n)), lowByte: (x) => x & 0xff, highByte: (x) => (x >> 8) & 0xff,
    attachInterrupt: () => {}, digitalPinToInterrupt: (p) => p, interrupts: () => {}, noInterrupts: () => {},
    __i: (x) => (typeof x === 'number' ? Math.trunc(x) : typeof x === 'boolean' ? (x ? 1 : 0) : x),
    __arr: (n) => new Array(Math.max(0, n | 0)).fill(0),
    __chars: (str) => { const a = [...str].map(c => c.charCodeAt(0)); a.push(0); a.isText = true; return a; },
    __sizeof: (x) => (Array.isArray(x) ? x.length : typeof x === 'string' ? x.length + 1 : 1),
    __tick: async () => { ticks++; if (ticks % 50 === 0) await advance(0.05); else if (stopped) throw new StopSketch(); },
  };

  let js;
  try { js = transpile(code); }
  catch (e) {
    const err = e instanceof SketchError ? e : new SketchError(e.message);
    opts.onError?.(err);
    return { stop() {}, done: Promise.resolve({ error: err }), js: null };
  }

  const done = (async () => {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    let fns;
    try {
      const keys = Object.keys(api).filter(k => k !== 'true' && k !== 'false');
      const f = new AsyncFunction(...keys, `${js}\nreturn { setup, loop };`);
      fns = await f(...keys.map(k => api[k]));
    } catch (e) {
      const hint = e instanceof SyntaxError ? semicolonHint(code) : null;
      const err = new SketchError(hint ? hint.msg : friendly(e), hint?.line);
      opts.onError?.(err); return { error: err };
    }
    try {
      await fns.setup();
      while (!stopped) { await fns.loop(); await advance(0.5); }
    } catch (e) {
      if (e instanceof StopSketch) return { stopped: true, t: clock.t };
      const err = new SketchError(friendly(e));
      opts.onError?.(err); return { error: err };
    }
    return { stopped: true, t: clock.t };
  })();

  return {
    js,
    done,
    stop() { stopped = true; },
    setSpeed(s) { speed = s; },
    get time() { return clock.t; },
  };
}

// Very common beginner error: a statement without ";" at the end of the line.
export function semicolonHint(code) {
  const lines = code.split('\n');
  const next = (i) => { for (let k = i + 1; k < lines.length; k++) { const s = lines[k].replace(/\/\/.*$/, '').trim(); if (s) return s; } return ''; };
  let inComment = false;
  for (let i = 0; i < lines.length; i++) {
    let s = lines[i].replace(/\/\/.*$/, '').trim();
    if (inComment) { if (s.includes('*/')) inComment = false; continue; }
    if (s.startsWith('/*')) { if (!s.includes('*/')) inComment = true; continue; }
    if (!s || s.startsWith('#')) continue;
    if (/[;{},:(]$/.test(s) || /^(if|else|for|while|do|switch|case|default)\b/.test(s)) continue;
    if (/^[\w\s*&]+\([^;]*\)$/.test(s) && next(i).startsWith('{')) continue; // function header
    if (/^(\}|\))/.test(s)) continue;
    const n = next(i);
    if (/^[)\]+\-*\/%&|^?:.<>=,]/.test(n) || /^(&&|\|\|)/.test(n)) continue; // expression continues
    return { line: i + 1, msg: `Line ${i + 1} looks like it is missing a ";" at the end: ${s}` };
  }
  return null;
}

function friendly(e) {
  const m = String(e?.message || e);
  const nd = m.match(/^(\w+) is not defined/);
  if (nd) return `"${nd[1]}" is not defined — check the spelling, or this function/library isn't supported in the simulator.`;
  if (/is not a function/.test(m)) return `${m} — this function isn't available in the simulator.`;
  if (/Unexpected token|Unexpected identifier|missing/.test(m)) return `There's a syntax error in your code (${m}). Check brackets, semicolons and spelling.`;
  if (/Maximum call stack/.test(m)) return 'A function keeps calling itself forever (infinite recursion).';
  return m;
}
