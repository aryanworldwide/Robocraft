// Constructive Solid Geometry on triangle soups using BSP trees
// (after Evan Wallace's csg.js, MIT). Works on plain arrays so it can be
// unit-tested without three.js. Positions in, positions out.
//
//   const out = csgUnion(a, b)   // a, b: Float32Array/Array of xyz triples (triangles)

const EPS = 1e-5;
const COPLANAR = 0, FRONT = 1, BACK = 2, SPANNING = 3;

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

class Plane {
  constructor(n, w) { this.n = n; this.w = w; }
  static from(a, b, c) {
    const n = cross(sub(b, a), sub(c, a));
    const len = Math.hypot(n[0], n[1], n[2]);
    if (len < 1e-12) return null;
    const u = [n[0] / len, n[1] / len, n[2] / len];
    return new Plane(u, dot(u, a));
  }
  clone() { return new Plane(this.n.slice(), this.w); }
  flip() { this.n = [-this.n[0], -this.n[1], -this.n[2]]; this.w = -this.w; }
  // Split polygon into the four buckets.
  split(poly, cf, cb, front, back) {
    let type = 0; const types = [];
    for (const v of poly.v) {
      const t = dot(this.n, v) - this.w;
      const ty = t < -EPS ? BACK : t > EPS ? FRONT : COPLANAR;
      type |= ty; types.push(ty);
    }
    switch (type) {
      case COPLANAR: (dot(this.n, poly.plane.n) > 0 ? cf : cb).push(poly); break;
      case FRONT: front.push(poly); break;
      case BACK: back.push(poly); break;
      default: {
        const f = [], b = [];
        const n = poly.v.length;
        for (let i = 0; i < n; i++) {
          const j = (i + 1) % n, ti = types[i], tj = types[j], vi = poly.v[i], vj = poly.v[j];
          if (ti !== BACK) f.push(vi);
          if (ti !== FRONT) b.push(ti !== BACK ? vi.slice() : vi);
          if ((ti | tj) === SPANNING) {
            const t = (this.w - dot(this.n, vi)) / dot(this.n, sub(vj, vi));
            const v = lerp(vi, vj, t);
            f.push(v); b.push(v.slice());
          }
        }
        if (f.length >= 3) front.push(new Polygon(f, poly.plane));
        if (b.length >= 3) back.push(new Polygon(b, poly.plane));
      }
    }
  }
}

class Polygon {
  constructor(v, plane) { this.v = v; this.plane = plane || Plane.from(v[0], v[1], v[2]); }
  clone() { return new Polygon(this.v.map(p => p.slice()), this.plane.clone()); }
  flip() { this.v.reverse(); this.plane.flip(); }
}

class Node {
  constructor(polys) { this.plane = null; this.front = null; this.back = null; this.polys = []; if (polys) this.build(polys); }
  clone() {
    const n = new Node();
    n.plane = this.plane && this.plane.clone();
    n.front = this.front && this.front.clone();
    n.back = this.back && this.back.clone();
    n.polys = this.polys.map(p => p.clone());
    return n;
  }
  invert() {
    for (const p of this.polys) p.flip();
    this.plane && this.plane.flip();
    this.front && this.front.invert();
    this.back && this.back.invert();
    [this.front, this.back] = [this.back, this.front];
  }
  clipPolygons(polys) {
    if (!this.plane) return polys.slice();
    let f = [], b = [];
    for (const p of polys) this.plane.split(p, f, b, f, b);
    if (this.front) f = this.front.clipPolygons(f);
    b = this.back ? this.back.clipPolygons(b) : [];
    return f.concat(b);
  }
  clipTo(bsp) {
    this.polys = bsp.clipPolygons(this.polys);
    this.front && this.front.clipTo(bsp);
    this.back && this.back.clipTo(bsp);
  }
  allPolygons() {
    let out = this.polys.slice();
    if (this.front) out = out.concat(this.front.allPolygons());
    if (this.back) out = out.concat(this.back.allPolygons());
    return out;
  }
  // Iterative build to avoid deep recursion on large meshes.
  build(polys) {
    const stack = [[this, polys]];
    while (stack.length) {
      const [node, list] = stack.pop();
      if (!list.length) continue;
      if (!node.plane) node.plane = list[0].plane.clone();
      const f = [], b = [];
      for (const p of list) node.plane.split(p, node.polys, node.polys, f, b);
      if (f.length) { node.front = node.front || new Node(); stack.push([node.front, f]); }
      if (b.length) { node.back = node.back || new Node(); stack.push([node.back, b]); }
    }
  }
}

function toPolys(pos) {
  const out = [];
  for (let i = 0; i + 8 < pos.length; i += 9) {
    const a = [pos[i], pos[i + 1], pos[i + 2]], b = [pos[i + 3], pos[i + 4], pos[i + 5]], c = [pos[i + 6], pos[i + 7], pos[i + 8]];
    const pl = Plane.from(a, b, c);
    if (pl) out.push(new Polygon([a, b, c], pl));
  }
  return out;
}
function fromPolys(polys) {
  const out = [];
  for (const p of polys) {
    for (let i = 1; i + 1 < p.v.length; i++) {
      out.push(...p.v[0], ...p.v[i], ...p.v[i + 1]);
    }
  }
  return new Float32Array(out);
}

export function csgUnion(a, b) {
  const A = new Node(toPolys(a)), B = new Node(toPolys(b));
  A.clipTo(B); B.clipTo(A); B.invert(); B.clipTo(A); B.invert();
  A.build(B.allPolygons());
  return fromPolys(A.allPolygons());
}
export function csgSubtract(a, b) {
  const A = new Node(toPolys(a)), B = new Node(toPolys(b));
  A.invert(); A.clipTo(B); B.clipTo(A); B.invert(); B.clipTo(A); B.invert();
  A.build(B.allPolygons()); A.invert();
  return fromPolys(A.allPolygons());
}
export function csgIntersect(a, b) {
  const A = new Node(toPolys(a)), B = new Node(toPolys(b));
  A.invert(); B.clipTo(A); B.invert(); A.clipTo(B); B.clipTo(A);
  A.build(B.allPolygons()); A.invert();
  return fromPolys(A.allPolygons());
}

// Axis-aligned bounds of a triangle soup.
export function bounds(pos) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3) for (let k = 0; k < 3; k++) { const v = pos[i + k]; if (v < min[k]) min[k] = v; if (v > max[k]) max[k] = v; }
  return { min, max };
}
const overlaps = (a, b) => a.min.every((v, k) => v <= b.max[k] + EPS && a.max[k] >= b.min[k] - EPS);

/**
 * Tinkercad-style group: union of all solids, then every hole subtracted.
 * Skips work for parts whose bounds don't touch (much faster, avoids BSP noise).
 */
export function combine(solids, holes = []) {
  let parts = solids.filter(p => p.length);
  if (!parts.length) return new Float32Array(0);
  // union: merge overlapping parts, simply concatenate separate ones
  let acc = parts[0];
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    acc = overlaps(bounds(acc), bounds(p)) ? csgUnion(acc, p) : concat(acc, p);
  }
  for (const h of holes) {
    if (!h.length) continue;
    if (!overlaps(bounds(acc), bounds(h))) continue;
    acc = csgSubtract(acc, h);
  }
  return acc;
}
function concat(a, b) { const o = new Float32Array(a.length + b.length); o.set(a); o.set(b, a.length); return o; }

/** Signed volume of a closed triangle soup (mm³ if input is mm). */
export function volume(pos) {
  let v = 0;
  for (let i = 0; i + 8 < pos.length; i += 9) {
    const a = [pos[i], pos[i + 1], pos[i + 2]], b = [pos[i + 3], pos[i + 4], pos[i + 5]], c = [pos[i + 6], pos[i + 7], pos[i + 8]];
    v += dot(a, cross(b, c)) / 6;
  }
  return v;
}
