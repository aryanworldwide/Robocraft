// Ready-made robot parts (real-world sizes in mm) and guided design projects.
import { makeGroup, ungroup, objectSoup, soupBounds } from './shapes';

const P = (type, size, pos, extra = {}) => ({ type, size, pos, rot: [0, 0, 0], hole: false, ...extra });
const H = (type, size, pos, extra = {}) => P(type, size, pos, { hole: true, ...extra });

export const PARTS = [
  {
    id: 'uno', name: 'Arduino Uno', note: '68.6 × 53.4 mm, M3 holes', color: '#0f766e',
    build: () => {
      const holes = [[14, 2.5], [15.3, 50.7], [66.1, 7.6], [66.1, 35.5]].map(([x, z]) => H('cylinder', [3.2, 3.2, 6], [x - 34.3, -2, z - 26.7]));
      return [
        P('box', [68.6, 53.4, 1.6], [0, 0, 0], { color: '#0f766e' }),
        P('box', [16, 12, 11], [-34.3 + 6, 1.6, 26.7 - 38], { color: '#9ca3af' }),
        P('box', [14, 9, 11], [-34.3 + 5, 1.6, 26.7 - 7.6], { color: '#111827' }),
        P('box', [38, 10, 2.5], [8, 1.6, -12], { color: '#1f2937' }),
        ...holes,
      ];
    },
  },
  {
    id: 'hcsr04', name: 'Ultrasonic HC-SR04', note: '45 × 20 mm, Ø16 eyes 26 mm apart', color: '#1d4ed8',
    build: () => [
      P('box', [45, 1.6, 20], [0, 0, 0], { color: '#1d4ed8' }),
      P('cylinder', [16, 16, 12], [-13, 4, 6.8], { color: '#d1d5db', rot: [90, 0, 0] }),
      P('cylinder', [16, 16, 12], [13, 4, 6.8], { color: '#d1d5db', rot: [90, 0, 0] }),
    ],
  },
  {
    id: 'sg90', name: 'Micro servo SG90', note: '22.5 × 12.2 mm body', color: '#2563eb',
    build: () => [
      P('box', [22.5, 12.2, 22.7], [0, 0, 0], { color: '#2563eb' }),
      P('box', [32.5, 12.2, 2.5], [0, 15.9, 0], { color: '#2563eb' }),
      P('cylinder', [11.8, 11.8, 4], [-5.4, 22.7, 0], { color: '#2563eb' }),
      P('cylinder', [4.8, 4.8, 3.5], [-5.4, 26.7, 0], { color: '#f8fafc' }),
      H('cylinder', [2, 2, 6], [-13.8, 14, 0]), H('cylinder', [2, 2, 6], [13.8, 14, 0]),
    ],
  },
  {
    id: 'tt', name: 'TT gear motor', note: '64 × 22.5 × 18.8 mm', color: '#facc15',
    build: () => [
      P('box', [64, 22.5, 18.8], [0, 0, 0], { color: '#facc15' }),
      P('cylinder', [5.4, 5.4, 37], [-20, 3, 0], { color: '#f8fafc', rot: [90, 0, 0] }),
      H('cylinder', [3, 3, 30], [10, 3, 0], { rot: [90, 0, 0] }), H('cylinder', [3, 3, 30], [27, 3, 0], { rot: [90, 0, 0] }),
    ],
  },
  {
    id: 'wheel', name: 'Wheel 65 mm', note: 'fits TT motor shaft', color: '#111827',
    build: () => [
      P('cylinder', [65, 65, 26], [0, -26 / 2 + 32.5, 0], { color: '#111827', rot: [90, 0, 0] }),
      P('cylinder', [45, 45, 27], [0, -27 / 2 + 32.5, 0], { color: '#facc15', rot: [90, 0, 0] }),
      H('box', [3.7, 5.4, 40], [0, 32.5 - 20, 0], { rot: [90, 0, 0] }),
    ],
  },
  {
    id: 'battery', name: '9 V battery', note: '48.5 × 26.5 × 17.5 mm', color: '#334155',
    build: () => [
      P('box', [26.5, 17.5, 48.5], [0, 0, 0], { color: '#334155' }),
      P('cylinder', [8, 8, 4], [-6, 48.5, 0], { color: '#cbd5e1' }),
      P('hex', [8.5, 8.5, 4], [6, 48.5, 0], { color: '#cbd5e1' }),
    ],
  },
  {
    id: 'caster', name: 'Ball caster', note: 'Ø15 mm ball', color: '#94a3b8',
    build: () => [
      P('dome', [24, 24, 10], [0, 7, 0], { color: '#64748b', mirror: [1, -1, 1] }),
      P('sphere', [15, 15, 15], [0, 0, 0], { color: '#e2e8f0' }),
      P('box', [36, 14, 2], [0, 17, 0], { color: '#64748b' }),
    ],
  },
  { id: 'm3', name: 'M3 screw hole', note: 'Ø3.2 × 20 mm hole', color: '#6b7280', single: () => H('cylinder', [3.2, 3.2, 20], [0, -5, 0]) },
  { id: 'nut', name: 'M3 nut trap', note: 'hexagon 6.4 mm, 2.5 mm deep', color: '#6b7280', single: () => H('hex', [6.4, 6.4, 2.5], [0, 0, 0]) },
];

export function buildPart(part) {
  if (part.single) return { ...part.single(), name: part.name };
  return makeGroup(part.build(), { name: part.name, color: part.color });
}

// ── flatten a design into world-space primitives (for checks) ──
export function flatten(objs) {
  const out = [];
  const walk = (o, holeParent) => {
    if (o.type === 'group') ungroup(o).forEach(c => walk(c, holeParent || o.hole));
    else out.push({ ...o, hole: o.hole || holeParent });
  };
  objs.forEach(o => walk(o, false));
  return out;
}

export function designBounds(objs) {
  const solids = objs.filter(o => !o.hole);
  if (!solids.length) return null;
  const b = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
  for (const o of solids) { const bb = soupBounds(objectSoup(o)); for (let k = 0; k < 3; k++) { b.min[k] = Math.min(b.min[k], bb.min[k]); b.max[k] = Math.max(b.max[k], bb.max[k]); } }
  return { ...b, size: b.max.map((v, k) => v - b.min[k]) }; // size: [x, y(height), z]
}

const near = (a, b, tol) => Math.abs(a - b) <= tol;
// holes that were grouped (actually cut) and are round
function roundHoles(objs) {
  return flatten(objs.filter(o => o.type === 'group')).filter(o => o.hole && (o.type === 'cylinder' || o.type === 'hex') && near(o.size[0], o.size[1], 0.3));
}

export const PROJECTS = [
  {
    id: 'chassis', title: 'Robot chassis plate', level: 'Class 9–10',
    brief: 'Design the base plate for a 2-wheel robot that carries an Arduino Uno, two TT motors and a 9 V battery.',
    steps: [
      'Add a Box and make it 160 mm wide (X), 110 mm deep and 4 mm tall.',
      'Add Cylinder holes of Ø3.2 mm (M3 screws) where the motors will be bolted — at least 4.',
      'Add a hole Ø12 mm or bigger in the middle to pass wires through.',
      'Select the plate and all holes, then tap Group — the holes cut through.',
      'Drop the Arduino Uno part on top to check it fits. Export STL for 3-D printing.',
    ],
    checks: (objs) => {
      const b = designBounds(objs.filter(o => !o.name || !/Arduino|motor|battery|Wheel/i.test(o.name)));
      const holes = roundHoles(objs);
      return [
        { label: 'Plate at least 150 × 100 mm', ok: !!b && b.size[0] >= 150 && b.size[2] >= 100 },
        { label: 'Plate 3–6 mm thick', ok: !!b && b.size[1] >= 3 && b.size[1] <= 6 },
        { label: '4 or more M3 holes (Ø3–3.5) cut', ok: holes.filter(h => h.size[0] >= 3 && h.size[0] <= 3.5).length >= 4 },
        { label: 'Wire hole Ø12 mm or larger cut', ok: holes.some(h => h.size[0] >= 12) },
      ];
    },
  },
  {
    id: 'sonar', title: 'Ultrasonic sensor holder', level: 'Class 9–10',
    brief: 'A front plate that holds the HC-SR04. Its two "eyes" are Ø16 mm and their centres are 26 mm apart.',
    steps: [
      'Add a Box 50 × 3 × 25 mm (stand it upright: width 50, depth 3, height 25).',
      'Add two Cylinder holes Ø16 mm, rotate them 90° about X so they go through the plate.',
      'Place them 26 mm apart (x = −13 and x = +13) at the same height.',
      'Group the plate with both holes. Add a base Box underneath so it can be screwed to the chassis.',
    ],
    checks: (objs) => {
      const holes = roundHoles(objs).filter(h => near(h.size[0], 16, 1));
      let gap = 0;
      if (holes.length >= 2) gap = Math.hypot(holes[0].pos[0] - holes[1].pos[0], holes[0].pos[2] - holes[1].pos[2]);
      return [
        { label: 'Two Ø16 mm holes cut', ok: holes.length >= 2 },
        { label: 'Hole centres 26 mm apart (±1)', ok: holes.length >= 2 && near(gap, 26, 1) },
        { label: 'Holes at the same height', ok: holes.length >= 2 && near(holes[0].pos[1], holes[1].pos[1], 0.6) },
      ];
    },
  },
  {
    id: 'wheel', title: 'Custom wheel', level: 'Class 9',
    brief: 'Design a 3-D printable wheel for a TT motor. TT shafts are 5.4 mm with two flats (3.7 mm).',
    steps: [
      'Add a Cylinder 64 × 64 mm, 8 mm tall — this is the wheel.',
      'Add a Tube or Torus around it for a tyre (optional).',
      'Add a Box hole 3.7 × 5.4 mm (or a Cylinder hole Ø5.5) in the centre for the shaft.',
      'Add 4–6 Cylinder holes around the wheel to save plastic (spokes look).',
      'Group everything. Export STL.',
    ],
    checks: (objs) => {
      const b = designBounds(objs);
      const holes = flatten(objs.filter(o => o.type === 'group')).filter(o => o.hole);
      const centre = b ? [(b.min[0] + b.max[0]) / 2, (b.min[2] + b.max[2]) / 2] : [0, 0];
      const shaft = holes.some(h => Math.hypot(h.pos[0] - centre[0], h.pos[2] - centre[1]) < 2 && Math.min(h.size[0], h.size[1]) <= 6);
      return [
        { label: 'Diameter 60–70 mm', ok: !!b && b.size[0] >= 60 && b.size[0] <= 70 && near(b.size[0], b.size[2], 2) },
        { label: 'Width 6–30 mm', ok: !!b && b.size[1] >= 6 && b.size[1] <= 30 },
        { label: 'Shaft hole in the centre', ok: shaft },
        { label: '4 or more lightening holes', ok: holes.length >= 5 },
      ];
    },
  },
  {
    id: 'servoarm', title: 'Servo arm (gripper link)', level: 'Class 10–11',
    brief: 'A 70 mm link for a robotic arm: a round end that fits the servo horn and a row of holes for adjusting the length.',
    steps: [
      'Add a Box 70 × 10 × 4 mm.',
      'Add a Cylinder Ø12 × 4 mm at one end so the end is rounded.',
      'Add at least 4 Cylinder holes Ø2 mm along the arm, 8 mm apart.',
      'Group everything and export STL.',
    ],
    checks: (objs) => {
      const b = designBounds(objs);
      const holes = roundHoles(objs).filter(h => h.size[0] <= 3.5);
      return [
        { label: 'Length 65–80 mm', ok: !!b && Math.max(b.size[0], b.size[2]) >= 65 && Math.max(b.size[0], b.size[2]) <= 80 },
        { label: 'Thickness 3–6 mm', ok: !!b && b.size[1] >= 3 && b.size[1] <= 6 },
        { label: '4 or more small holes cut', ok: holes.length >= 4 },
      ];
    },
  },
  {
    id: 'stand', title: 'Phone stand', level: 'Class 9',
    brief: 'A stand that holds a phone at an angle — great first print.',
    steps: [
      'Add a Wedge 80 × 70 mm, 70 mm tall.',
      'Add a Box hole across it to make a slot 12 mm wide for the phone.',
      'Add a Box hole at the bottom for the charging cable.',
      'Group and export.',
    ],
    checks: (objs) => {
      const b = designBounds(objs);
      const holes = flatten(objs.filter(o => o.type === 'group')).filter(o => o.hole);
      return [
        { label: 'At least 60 mm tall', ok: !!b && b.size[1] >= 60 },
        { label: 'Base at least 60 × 60 mm', ok: !!b && b.size[0] >= 60 && b.size[2] >= 60 },
        { label: 'A slot cut (hole in a group)', ok: holes.length >= 1 },
      ];
    },
  },
];
