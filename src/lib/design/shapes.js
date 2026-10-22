// Primitive solids as triangle soups (no three.js needed, so they can be tested).
// Model space: millimetres, Y is up. Every primitive spans x,z ∈ [-0.5, 0.5] and
// y ∈ [0, 1] so an object's size simply scales it and position.y is its elevation.
import { combine } from './csg';

function quad(out, a, b, c, d) { out.push(...a, ...b, ...c, ...a, ...c, ...d); }

function box() {
  const o = [];
  const p = (x, y, z) => [x - 0.5, y, z - 0.5];
  // counter-clockwise when viewed from outside
  quad(o, p(0, 0, 1), p(1, 0, 1), p(1, 1, 1), p(0, 1, 1)); // +z
  quad(o, p(1, 0, 0), p(0, 0, 0), p(0, 1, 0), p(1, 1, 0)); // -z
  quad(o, p(1, 0, 1), p(1, 0, 0), p(1, 1, 0), p(1, 1, 1)); // +x
  quad(o, p(0, 0, 0), p(0, 0, 1), p(0, 1, 1), p(0, 1, 0)); // -x
  quad(o, p(0, 1, 1), p(1, 1, 1), p(1, 1, 0), p(0, 1, 0)); // +y
  quad(o, p(0, 0, 0), p(1, 0, 0), p(1, 0, 1), p(0, 0, 1)); // -y
  return o;
}

// Frustum / cylinder / cone: rTop & rBottom as fractions of 0.5.
function frustum(rb, rt, n) {
  const o = [];
  const ring = (r, y) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return [Math.cos(a) * r * 0.5, y, -Math.sin(a) * r * 0.5]; });
  const B = ring(rb, 0), T = ring(rt, 1);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    if (rt > 0 && rb > 0) quad(o, B[i], B[j], T[j], T[i]);
    else if (rt === 0) o.push(...B[i], ...B[j], 0, 1, 0);
    else o.push(...B[i], ...B[j], ...T[j], ...B[i], ...T[j], ...T[i]);
    if (rb > 0) o.push(0, 0, 0, ...B[j], ...B[i]);
    if (rt > 0) o.push(0, 1, 0, ...T[i], ...T[j]);
  }
  return o;
}

function sphere(lat = 12, lon = 24, half = false) {
  const o = [];
  const pt = (i, j) => {
    const th = (half ? 0.5 + 0.5 * (i / lat) : i / lat) * Math.PI; // 0 = top
    const ph = (j / lon) * Math.PI * 2;
    const r = Math.sin(th) * 0.5;
    const y = half ? Math.cos(th) * 1 : 0.5 + Math.cos(th) * 0.5;
    return [Math.cos(ph) * r, half ? 1 - y - 0 : y, -Math.sin(ph) * r];
  };
  if (!half) {
    for (let i = 0; i < lat; i++) for (let j = 0; j < lon; j++) {
      const a = pt(i, j), b = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1);
      if (i === 0) o.push(...a, ...b, ...c);
      else if (i === lat - 1) o.push(...a, ...b, ...d);
      else quad(o, a, b, c, d);
    }
    return o;
  }
  // hemisphere (dome): flat base at y=0, top at y=1
  const P = (i, j) => { const th = (i / lat) * Math.PI / 2; const ph = (j / lon) * Math.PI * 2; const r = Math.sin(th) * 0.5; return [Math.cos(ph) * r, Math.cos(th), -Math.sin(ph) * r]; };
  for (let i = 0; i < lat; i++) for (let j = 0; j < lon; j++) {
    const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1);
    if (i === 0) o.push(...a, ...b, ...c); else quad(o, a, b, c, d);
  }
  for (let j = 0; j < lon; j++) { const a = P(lat, j), b = P(lat, j + 1); o.push(0, 0, 0, ...b, ...a); }
  return o;
}

function wedge() { // ramp: full height at -x, zero at +x
  const o = [];
  const p = (x, y, z) => [x - 0.5, y, z - 0.5];
  o.push(...p(0, 0, 1), ...p(1, 0, 1), ...p(0, 1, 1)); // +z side
  o.push(...p(1, 0, 0), ...p(0, 0, 0), ...p(0, 1, 0)); // -z side
  quad(o, p(0, 0, 0), p(0, 0, 1), p(0, 1, 1), p(0, 1, 0)); // back (-x)
  quad(o, p(0, 1, 1), p(1, 0, 1), p(1, 0, 0), p(0, 1, 0)); // slope
  quad(o, p(0, 0, 0), p(1, 0, 0), p(1, 0, 1), p(0, 0, 1)); // bottom
  return o;
}

function pyramid() {
  const o = [];
  const c = [0, 1, 0];
  const b = [[-0.5, 0, 0.5], [0.5, 0, 0.5], [0.5, 0, -0.5], [-0.5, 0, -0.5]];
  for (let i = 0; i < 4; i++) o.push(...b[i], ...b[(i + 1) % 4], ...c);
  quad(o, b[0], b[3], b[2], b[1]);
  return o;
}

function tube(inner = 0.6, n = 32) { // hollow cylinder; inner = inner/outer diameter ratio
  const o = [];
  const ring = (r, y) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return [Math.cos(a) * r * 0.5, y, -Math.sin(a) * r * 0.5]; });
  const OB = ring(1, 0), OT = ring(1, 1), IB = ring(inner, 0), IT = ring(inner, 1);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    quad(o, OB[i], OB[j], OT[j], OT[i]);          // outer wall
    quad(o, IB[j], IB[i], IT[i], IT[j]);          // inner wall (faces inward)
    quad(o, OT[i], OT[j], IT[j], IT[i]);          // top ring
    quad(o, OB[j], OB[i], IB[i], IB[j]);          // bottom ring
  }
  return o;
}

function torus(n = 32, m = 12, tubeR = 0.25) { // ring lying flat; height = tube diameter
  const o = [];
  const R = 0.5 - tubeR;
  const P = (i, j) => { const u = (i / n) * Math.PI * 2, v = (j / m) * Math.PI * 2; const r = R + tubeR * Math.cos(v); return [Math.cos(u) * r, 0.5 + Math.sin(v) * 0.5, -Math.sin(u) * r]; };
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) quad(o, P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1));
  return o;
}

function hexPrism() { return frustum(1, 1, 6); }

const CACHE = {};
export const SHAPES = {
  box: { name: 'Box', size: [20, 20, 20], make: box },
  cylinder: { name: 'Cylinder', size: [20, 20, 20], make: () => frustum(1, 1, 40), round: true },
  sphere: { name: 'Sphere', size: [20, 20, 20], make: () => sphere(), round: true },
  cone: { name: 'Cone', size: [20, 20, 20], make: () => frustum(1, 0, 40), round: true },
  dome: { name: 'Half sphere', size: [20, 20, 10], make: () => sphere(8, 24, true), round: true },
  wedge: { name: 'Wedge', size: [20, 20, 20], make: wedge },
  pyramid: { name: 'Pyramid', size: [20, 20, 20], make: pyramid },
  tube: { name: 'Tube', size: [20, 20, 20], make: () => tube(0.6), round: true },
  torus: { name: 'Torus', size: [20, 20, 5], make: () => torus(), round: true },
  hex: { name: 'Hex prism', size: [20, 20, 10], make: hexPrism, round: true },
};
export function unitShape(type) {
  if (!CACHE[type]) CACHE[type] = new Float32Array(SHAPES[type].make());
  return CACHE[type];
}

// ── transforms ──
const rad = (d) => (d * Math.PI) / 180;
/**
 * obj: { type, size:[w,d,h] (x, z, y), pos:[x,y,z], rot:[rx,ry,rz] degrees, mirror:[sx,sy,sz]? }
 * Returns world-space triangle soup.
 */
export function objectSoup(obj) {
  const base = obj.type === 'group' ? groupSoup(obj) : unitShape(obj.type);
  const [w, d, h] = obj.size;
  const [rx, ry, rz] = (obj.rot || [0, 0, 0]).map(rad);
  const m = obj.mirror || [1, 1, 1];
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
  const out = new Float32Array(base.length);
  // groups are stored normalised like primitives (x,z centred, y from 0..1)
  for (let i = 0; i < base.length; i += 3) {
    let x = base[i] * w * m[0], y = (base[i + 1] - 0.5) * h * m[1], z = base[i + 2] * d * m[2];
    // rotate about the object's centre: X, then Z, then Y
    let t = y * cx - z * sx; z = y * sx + z * cx; y = t;
    t = x * cz - y * sz; y = x * sz + y * cz; x = t;
    t = x * cy + z * sy; z = -x * sy + z * cy; x = t;
    out[i] = x + obj.pos[0]; out[i + 1] = y + h / 2 + obj.pos[1]; out[i + 2] = z + obj.pos[2];
  }
  if (m[0] * m[1] * m[2] < 0) flipWinding(out);
  return out;
}
function flipWinding(p) {
  for (let i = 0; i + 8 < p.length; i += 9) for (let k = 0; k < 3; k++) { const t = p[i + 3 + k]; p[i + 3 + k] = p[i + 6 + k]; p[i + 6 + k] = t; }
}

/** A group's own normalised geometry, computed from its children (cached on the object). */
const GROUP_CACHE = new WeakMap(); // children array → normalised soup
export function groupSoup(g) {
  const hit = GROUP_CACHE.get(g.children);
  if (hit && hit.frame === g.frame) return hit.soup;
  const solids = [], holes = [];
  for (const c of g.children) (c.hole ? holes : solids).push(objectSoup(c));
  const world = combine(solids, holes);
  // normalise into the unit box using the group's stored frame
  const { origin, extent } = g.frame; // world bounds at grouping time
  const n = new Float32Array(world.length);
  for (let i = 0; i < world.length; i += 3) {
    n[i] = (world[i] - origin[0]) / extent[0];
    n[i + 1] = (world[i + 1] - origin[1]) / extent[1];
    n[i + 2] = (world[i + 2] - origin[2]) / extent[2];
  }
  GROUP_CACHE.set(g.children, { frame: g.frame, soup: n });
  return n;
}

export function soupBounds(pos) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3) for (let k = 0; k < 3; k++) { const v = pos[i + k]; if (v < min[k]) min[k] = v; if (v > max[k]) max[k] = v; }
  return { min, max };
}

let nid = 1;
export const newObjId = () => `o${Date.now().toString(36)}${(nid++).toString(36)}`;

/** Build a group object from children (world placement preserved). */
export function makeGroup(children, extra = {}) {
  const all = children.filter(c => !c.hole).map(objectSoup);
  const pts = all.length ? all : children.map(objectSoup);
  const b = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
  for (const p of pts) { const bb = soupBounds(p); for (let k = 0; k < 3; k++) { b.min[k] = Math.min(b.min[k], bb.min[k]); b.max[k] = Math.max(b.max[k], bb.max[k]); } }
  const ext = b.max.map((v, k) => Math.max(0.01, v - b.min[k]));
  const centre = [(b.min[0] + b.max[0]) / 2, b.min[1], (b.min[2] + b.max[2]) / 2];
  return {
    id: newObjId(), type: 'group', hole: false, color: children.find(c => !c.hole)?.color || '#ef4444',
    children: children.map(c => ({ ...c })),
    frame: { origin: centre, extent: ext },
    size: [ext[0], ext[2], ext[1]], pos: centre, rot: [0, 0, 0],
    ...extra,
  };
}

/** Turn a group back into its children, applying the group's current transform. */
export function ungroup(g) {
  // If the group was only moved (no rotation/scale/mirror), offset children; otherwise bake into a mesh-less approximation.
  const [w, d, h] = g.size, ext = g.frame.extent;
  const s = [w / ext[0], h / ext[1], d / ext[2]];
  const ry = (g.rot || [0, 0, 0])[1];
  return g.children.map(c => {
    // child position relative to frame origin, scaled
    let rx = (c.pos[0] - g.frame.origin[0]) * s[0], ry0 = (c.pos[1] - g.frame.origin[1]) * s[1], rz = (c.pos[2] - g.frame.origin[2]) * s[2];
    const a = rad(ry), ca = Math.cos(a), sa = Math.sin(a);
    const x = rx * ca + rz * sa, z = -rx * sa + rz * ca;
    return {
      ...c, id: newObjId(),
      pos: [g.pos[0] + x, g.pos[1] + ry0, g.pos[2] + z],
      size: [c.size[0] * s[0], c.size[1] * s[2], c.size[2] * s[1]],
      rot: [c.rot?.[0] || 0, (c.rot?.[1] || 0) + ry, c.rot?.[2] || 0],
    };
  });
}

/** Binary STL (Z-up, mm) from a triangle soup in model space (Y-up). */
export function toSTL(pos, name = 'robocraft') {
  const tris = pos.length / 9;
  const buf = new ArrayBuffer(84 + tris * 50);
  const dv = new DataView(buf);
  const header = `RoboCraft 3D Studio — ${name}`.slice(0, 79);
  for (let i = 0; i < header.length; i++) dv.setUint8(i, header.charCodeAt(i) & 0x7f);
  dv.setUint32(80, tris, true);
  let o = 84;
  const conv = (i) => [pos[i], -pos[i + 2], pos[i + 1]]; // Y-up → Z-up (keeps handedness)
  for (let t = 0; t < tris; t++) {
    const a = conv(t * 9), b = conv(t * 9 + 3), c = conv(t * 9 + 6);
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const l = Math.hypot(...n) || 1;
    for (const x of [n[0] / l, n[1] / l, n[2] / l, ...a, ...b, ...c]) { dv.setFloat32(o, x, true); o += 4; }
    dv.setUint16(o, 0, true); o += 2;
  }
  return buf;
}
