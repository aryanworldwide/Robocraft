import React from 'react';
import { LAB_COMPONENTS, getDef } from '@/lib/lab/labComponents';
import { Trash2, RotateCw, Info, CheckCircle2, XCircle, AlertTriangle, Lightbulb, Wrench } from 'lucide-react';

export default function PropertiesPanel({ selected, components, wires, experiment, validation, freeCheck, wiringGuide, helpStep, onRotate, onDelete }) {
  const comp = selected ? components.find(c => c.id === selected) : null;
  const def = comp ? getDef(comp.type) : null;

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Inspector</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Experiment objective (template mode) */}
        {experiment && (
          <div className="glass rounded-xl p-3 border-l-2 border-cyan-500">
            <div className="flex items-center gap-1.5 mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-bold text-cyan-400">Objective</span>
            </div>
            <p className="text-[11px] text-foreground/90 leading-snug">{experiment.objective}</p>
          </div>
        )}

        {/* Template validation */}
        {experiment && validation && (
          <div className="glass rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold">Circuit Check</span>
              {validation.valid
                ? <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Complete</span>
                : <span className="text-[10px] text-yellow-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Incomplete</span>}
            </div>
            {validation.componentIssues.map((m, i) => (
              <div key={i} className="text-[10px] text-red-400 flex items-start gap-1.5 mb-1"><XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {m}</div>
            ))}
            {validation.missing.map((rIdx, i) => {
              const req = experiment.required[rIdx];
              const fa = getDef(req.from.comp), fb = getDef(req.to.comp);
              return (
                <div key={i} className="text-[10px] text-yellow-400 flex items-start gap-1.5 mb-1">
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Missing: {fa?.name} {req.from.pin === '*' ? 'terminal' : req.from.pin} → {fb?.name} {req.to.pin === '*' ? 'terminal' : req.to.pin}
                </div>
              );
            })}
            {validation.wireResults.filter(w => w.status === 'incorrect').map(w => (
              <div key={w.wireIdx} className="text-[10px] text-red-400 flex items-start gap-1.5 mb-1"><XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {w.reason}</div>
            ))}
            {validation.valid && <div className="text-[10px] text-green-400 mt-1">All connections correct. Ready to program!</div>}
          </div>
        )}

        {/* Free-build check */}
        {!experiment && freeCheck && (
          <div className="glass rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold">Circuit Check</span>
              {freeCheck.status === 'valid'
                ? <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Valid</span>
                : freeCheck.status === 'error'
                ? <span className="text-[10px] text-red-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Error</span>
                : <span className="text-[10px] text-yellow-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Incomplete</span>}
            </div>
            {freeCheck.issues.map((iss, i) => (
              <div key={i} className={`text-[10px] flex items-start gap-1.5 mb-1 ${iss.type === 'error' ? 'text-red-400' : iss.type === 'warn' ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                {iss.type === 'error' ? <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /> : <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                {iss.msg}
              </div>
            ))}
            {freeCheck.status === 'valid' && <div className="text-[10px] text-green-400 mt-1">Circuit looks good. Run the simulation!</div>}
          </div>
        )}

        {/* Wiring guide / Help Me Build It (free build) */}
        {!experiment && wiringGuide && (
          <div className="glass rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-bold text-cyan-400">Help Me Build It</span>
            </div>
            {helpStep ? (
              <div className="text-[11px] text-foreground/90">
                <p className="mb-1.5">Next connection:</p>
                <div className="glass rounded-lg p-2 font-mono text-[10px]">
                  <span className="text-cyan-400">{getDef(helpStep.compType)?.name}</span> {helpStep.compPin} → <span className="text-cyan-400">{helpStep.boardPin}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">Click the two pins to connect them.</p>
              </div>
            ) : (
              <p className="text-[10px] text-green-400">All guide connections done! Check the circuit, then run.</p>
            )}
          </div>
        )}

        {/* Selected component */}
        {!comp && (
          <div className="text-[11px] text-muted-foreground text-center py-4 flex flex-col items-center gap-1">
            <Info className="w-5 h-5 opacity-50" />
            {components.length === 0 ? 'Add a component, then click it to inspect its pins.' : 'Click a component to inspect its pins and properties.'}
          </div>
        )}
        {comp && def && (
          <>
            <div className="glass-strong rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{def.emoji}</span>
                <div>
                  <div className="text-xs font-bold">{def.name}</div>
                  <div className="text-[10px] text-muted-foreground">{def.pins.length} pins · {def.category}</div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={onRotate} className="flex-1 flex items-center justify-center gap-1 text-[10px] glass rounded-lg py-1.5 text-cyan-400 hover:bg-cyan-500/10">
                  <RotateCw className="w-3 h-3" /> Rotate
                </button>
                <button onClick={onDelete} className="flex-1 flex items-center justify-center gap-1 text-[10px] glass rounded-lg py-1.5 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Pins</div>
              <div className="space-y-1">
                {def.pins.map(p => {
                  const used = wires.some(w => (w.from.compId === comp.id && w.from.pinId === p.id) || (w.to.compId === comp.id && w.to.pinId === p.id));
                  return (
                    <div key={p.id} className="flex items-center justify-between text-[10px]">
                      <span className="font-medium">{p.label}</span>
                      <span className={`px-1.5 py-0.5 rounded ${used ? 'bg-green-500/15 text-green-400' : 'bg-muted text-muted-foreground'}`}>{p.type}{used ? ' · wired' : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}