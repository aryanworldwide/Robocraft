globalThis.document = { createElement: () => ({ getContext: () => null, width: 0, height: 0 }) };
let fail = 0;
const ok = (c, m) => { if (!c) { fail++; console.log('FAIL', m); } };

// 1. arena tasks still pass with their sample solutions
{
  const { ArenaBoard } = await import('@/lib/arena/world');
  const { TASKS } = await import('@/lib/arena/tasks');
  const { runSketch } = await import('@/lib/arduino/runtime');
  for (const task of TASKS.filter(t => t.id !== 'free')) {
    const b = new ArenaBoard(task.map()); const st = task.init?.(b) || {};
    let res = null;
    const h = runSketch(task.solution, b, { speed: 16, maxMs: 150000, onTime: () => {
      const r = task.evaluate(b, st); if (r.state !== 'running' && !res) { res = r; h.stop(); } } });
    await h.done;
    ok(res?.state === 'pass', `arena ${task.id}: ${res?.state} ${res?.msg}`);
    console.log('arena', task.id.padEnd(9), res?.state, '-', res?.msg);
  }
}
// 2. every lab project validates, generates code and runs
{
  const { LAB_EXPERIMENTS, generateCode } = await import('@/lib/lab/labExperiments');
  const { validateCircuit, resolvePins } = await import('@/lib/lab/validateLab');
  const { resolveFreePins } = await import('@/lib/lab/freeBuild');
  const { CircuitBoard } = await import('@/lib/lab/circuitBoard');
  const { runSketch } = await import('@/lib/arduino/runtime');
  let n = 0;
  for (const ex of LAB_EXPERIMENTS) {
    const placed = ex.components.map(t => ({ id: t, type: t, x: 0, y: 0, rot: 0 }));
    const used = {};
    const wires = ex.required.map((r, i) => {
      const end = e => { let p = e.pin; if (p === '*') { const c = used[e.comp] || 0; p = c === 0 ? 'a' : 'b'; used[e.comp] = c + 1; } return { compId: e.comp, pinId: p }; };
      return { id: 'w' + i, from: end(r.from), to: end(r.to) };
    });
    const v = validateCircuit(ex, placed, wires);
    ok(v.valid, `lab ${ex.id} wiring invalid`);
    const code = generateCode(ex, resolvePins(ex, placed, wires));
    ok(code && !/No template/.test(code), `lab ${ex.id} no code`);
    const b = new CircuitBoard(placed, resolveFreePins(placed, wires), () => ({ buttonPressed: true, objectCm: 8, knob: 20 }));
    let err = null;
    const h = runSketch(code, b, { speed: 1e6, maxMs: 3000, onError: e => (err = e.message) });
    await h.done;
    ok(!err, `lab ${ex.id} runtime: ${err}`);
    n++;
  }
  console.log('lab projects checked:', n);
}
// 3. 3D parts build, export to STL, and decals never enter the solid
{
  const { PARTS, buildPart, PROJECTS } = await import('@/lib/design/parts');
  const { objectSoup, toSTL, ungroup } = await import('@/lib/design/shapes');
  for (const p of PARTS) {
    const g = buildPart(p);
    const soup = objectSoup(g);
    ok(soup.length > 0 && soup.length % 9 === 0, `part ${p.id} bad geometry`);
    ok(toSTL(soup).byteLength > 84, `part ${p.id} stl`);
    const kids = g.type === 'group' ? ungroup(g) : [];
    ok(kids.every(k => !k.decal || k.size[2] < 0.1), `part ${p.id} decal thickness`);
  }
  console.log('3D parts checked:', PARTS.length, '· design projects:', PROJECTS.length);
}
console.log(fail ? `\n${fail} CHECK(S) FAILED` : '\nall checks passed');
