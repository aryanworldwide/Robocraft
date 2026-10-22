import { LAB_EXPERIMENTS, generateCode } from '@/lib/lab/labExperiments';
import { validateCircuit, resolvePins } from '@/lib/lab/validateLab';
import { CircuitBoard } from '@/lib/lab/circuitBoard';
import { runSketch } from '@/lib/arduino/runtime';
import { getDef } from '@/lib/lab/labComponents';

let id=1; const nid=()=>'c'+(id++);
for (const ex of LAB_EXPERIMENTS) {
  // place every required component (same as chooseExperiment) and pre-wire it
  const placed = ex.components.map((t,i)=>({id:t,type:t,x:100+i*200,y:100,rot:0}));
  const starUsed={};
  const wires = ex.required.map(r=>{
    const end=(e)=>{ let pinId=e.pin; if(pinId==='*'){const c=starUsed[e.comp]||0;pinId=c===0?'a':'b';starUsed[e.comp]=c+1;} return {compId:e.comp,pinId}; };
    return {id:nid(), from:end(r.from), to:end(r.to)};
  });
  const v = validateCircuit(ex, placed, wires);
  const pins = resolvePins(ex, placed, wires);
  const code = generateCode(ex, pins);
  const pinMap = {};
  for (const c of placed) { if (getDef(c.type)) { const map={}; for (const pdef of getDef(c.type).pins) { } } }
  // build CircuitBoard using resolveFreePins-like map
  const { resolveFreePins } = await import('@/lib/lab/freeBuild');
  const fp = resolveFreePins(placed, wires);
  const inputs={buttonPressed:true,objectCm:8,knob:20};
  const b = new CircuitBoard(placed, fp, ()=>inputs);
  const lines=[]; b.onSerial=l=>lines.push(l);
  let err=null;
  const h = runSketch(code, b, {speed:1e6, maxMs:4000, onError:e=>err=e.message});
  await h.done;
  const snap=b.snapshot();
  console.log(`${ex.id.padEnd(16)} valid=${v.valid} pins=${JSON.stringify(pins)} err=${err||'-'} serial="${(lines[0]||'').slice(0,40)}" comp=${JSON.stringify(snap.comp)}`);
}
