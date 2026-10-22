// Planar mechanism maths for the Mechanism Lab (pure functions, unit-tested with bun).

/** Grübler / Kutzbach mobility for planar mechanisms: M = 3(n − 1) − 2·j1 − j2 */
export const gruebler = (n, j1, j2 = 0) => 3 * (n - 1) - 2 * j1 - j2;

function circleIntersect(x0, y0, r0, x1, y1, r1, upper = true) {
  const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy);
  if (d > r0 + r1 + 1e-9 || d < Math.abs(r0 - r1) - 1e-9 || d === 0) return null;
  const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r0 * r0 - a * a));
  const xm = x0 + (a * dx) / d, ym = y0 + (a * dy) / d;
  const s = upper ? 1 : -1;
  return [xm - (s * h * dy) / d, ym + (s * h * dx) / d];
}

/**
 * Four-bar: ground d (A at origin, D at (d,0)), crank a, coupler b, rocker c.
 * Coupler point P is at fraction `pr` along BC and offset `po` perpendicular (in units of length).
 */
export function fourBar({ a, b, c, d, pr = 0.5, po = 0 }, theta, upper = true) {
  const A = [0, 0], D = [d, 0];
  const B = [a * Math.cos(theta), a * Math.sin(theta)];
  const C = circleIntersect(B[0], B[1], b, D[0], D[1], c, upper);
  if (!C) return { A, B, D, C: null, P: null, locked: true };
  const ux = (C[0] - B[0]) / b, uy = (C[1] - B[1]) / b;
  const P = [B[0] + ux * b * pr - uy * po, B[1] + uy * b * pr + ux * po];
  const out = Math.atan2(C[1] - D[1], C[0] - D[0]);
  return { A, B, C, D, P, out, locked: false };
}

export function grashof({ a, b, c, d }) {
  const L = [a, b, c, d];
  const s = Math.min(...L), l = Math.max(...L);
  const pq = L.reduce((x, y) => x + y, 0) - s - l;
  const sum = s + l;
  if (Math.abs(sum - pq) < 1e-6) return { grashof: true, type: 'Change-point', note: 'S + L = P + Q: the linkage can flip between branches (change point).', s, l, pq };
  if (sum > pq) return { grashof: false, type: 'Triple-rocker (non-Grashof)', note: 'S + L > P + Q: no link can rotate fully — every link only rocks.', s, l, pq };
  let type;
  if (d === s) type = 'Double-crank (drag link)';
  else if (a === s || c === s) type = 'Crank-rocker';
  else type = 'Double-rocker (Grashof)';
  const note = type === 'Crank-rocker' ? 'The shortest link is next to the ground, so it rotates fully while the opposite link rocks.'
    : type.startsWith('Double-crank') ? 'The shortest link is the ground, so both side links rotate fully.'
    : 'The shortest link is the coupler, so it can rotate fully but both side links only rock.';
  return { grashof: true, type, note, s, l, pq };
}

/** Slider-crank: crank r, connecting rod l, offset e. Returns joint positions and slider x. */
export function sliderCrank({ r, l, e = 0 }, theta) {
  const B = [r * Math.cos(theta), r * Math.sin(theta)];
  const dy = e - B[1];
  if (Math.abs(dy) > l) return { B, C: null, x: null, locked: true };
  const x = B[0] + Math.sqrt(l * l - dy * dy);
  return { O: [0, 0], B, C: [x, e], x, locked: false };
}
export const sliderStroke = ({ r, l, e = 0 }) => {
  const xmax = Math.sqrt((l + r) ** 2 - e * e), xmin = Math.sqrt((l - r) ** 2 - e * e);
  return xmax - xmin; // = 2r when e = 0
};

/** 2-link planar arm. */
export function fk2R(L1, L2, t1, t2) {
  const E = [L1 * Math.cos(t1), L1 * Math.sin(t1)];
  return { E, T: [E[0] + L2 * Math.cos(t1 + t2), E[1] + L2 * Math.sin(t1 + t2)] };
}
export function ik2R(L1, L2, x, y, elbowUp = true) {
  const D = (x * x + y * y - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  if (D < -1 - 1e-9 || D > 1 + 1e-9) return null;
  const t2 = (elbowUp ? -1 : 1) * Math.acos(Math.max(-1, Math.min(1, D)));
  const t1 = Math.atan2(y, x) - Math.atan2(L2 * Math.sin(t2), L1 + L2 * Math.cos(t2));
  return { t1, t2 };
}

/** Simple / compound gear train. teeth: [[driver, driven], ...] meshing pairs on successive shafts. */
export function gearTrain(pairs) {
  let ratio = 1; let dir = 1;
  for (const [a, b] of pairs) { ratio *= b / a; dir *= -1; }
  return { ratio, outputDirection: dir }; // ratio = input turns per output turn
}
