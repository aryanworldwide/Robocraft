import React, { useState } from 'react';
import { Sparkles, X, Loader2, Cpu, Cable, Code2, Info } from 'lucide-react';
import { buildRobot, ROBOT_KINDS } from '@/lib/design/robots';

const EXAMPLES = [
  'Build a robotic arm',
  'Make a robot that detects and avoids obstacles',
  'Build a robotic hand that moves its fingers',
  'Create a line-following robot',
  'Build a maze-solving robot',
  'A robotic arm that picks up and moves objects',
];

/**
 * Describe a robot, get one built in the workspace.
 * The geometry is generated from primitives here in the app — there is no
 * picture of a robot and no canned model file, so every part can be selected,
 * resized, measured and exported like anything else the student draws.
 */
export default function BuildAnything3D({ onBuild, onClose, initial = null }) {
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(initial);
  const [tab, setTab] = useState('parts');

  const generate = (text) => {
    const idea = (text ?? prompt).trim();
    if (!idea || busy) return;
    setBusy(true);
    // A beat so the spinner is visible; the build itself is instant.
    setTimeout(() => {
      try {
        setResult(buildRobot(idea));
        setTab('parts');
      } finally {
        setBusy(false);
      }
    }, 260);
  };

  const place = () => {
    if (!result) return;
    onBuild(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full sm:max-w-lg max-h-[88vh] glass-strong rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm">Build anything</h2>
            <p className="text-[11px] text-muted-foreground">Describe a robot and it is built here in 3D</p>
          </div>
          <button aria-label="Close" onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 tap-target"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!result && (
            <>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={3}
                placeholder="A robotic arm that picks things up…"
                className="w-full glass rounded-xl p-3 text-sm outline-none border border-border focus:border-cyan-500/50 resize-none"
              />
              <div className="flex flex-wrap gap-1.5 mt-3">
                {EXAMPLES.map(e => (
                  <button key={e} onClick={() => { setPrompt(e); generate(e); }}
                    className="text-[10px] px-2.5 py-1.5 rounded-lg glass text-cyan-500 hover:bg-cyan-500/10">
                    {e}
                  </button>
                ))}
              </div>
              <button onClick={() => generate()} disabled={!prompt.trim() || busy}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2">
                {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Building…</> : <>Build it</>}
              </button>
              <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                These are built from real shapes at real sizes in millimetres, so you can take the model apart,
                change it and print it. What it can build: {ROBOT_KINDS.map(k => k.title).join(', ')}.
              </p>
            </>
          )}

          {result && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold">{result.title}</span>
                <span className="text-[10px] text-muted-foreground">· {result.parts.length} parts · {result.joints.length} joints</span>
                <button onClick={() => setResult(null)} className="ml-auto text-[10px] text-cyan-500">Start again</button>
              </div>

              <div className="flex gap-1 mb-3">
                {[['parts', 'Parts', Cpu], ['wiring', 'Wiring', Cable], ['code', 'Code', Code2], ['notes', 'Notes', Info]].map(([id, label, Icon]) => (
                  <button key={id} onClick={() => setTab(id)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 ${tab === id ? 'bg-cyan-500/15 text-cyan-500' : 'glass text-muted-foreground'}`}>
                    <Icon className="w-3 h-3" /> {label}
                  </button>
                ))}
              </div>

              {tab === 'parts' && (
                <div className="space-y-1.5">
                  {result.bom.map(([name, qty, why]) => (
                    <div key={name} className="glass rounded-xl p-2.5">
                      <p className="text-[11px] font-bold">{qty} × {name}</p>
                      <p className="text-[10px] text-muted-foreground leading-snug">{why}</p>
                    </div>
                  ))}
                  <p className="text-[10px] font-bold text-cyan-500 mt-3">Moving joints</p>
                  {result.joints.map(j => (
                    <div key={j.name} className="glass rounded-xl p-2.5">
                      <p className="text-[11px] font-bold">{j.name} <span className="font-normal text-muted-foreground">· {j.range}</span></p>
                      <p className="text-[10px] text-muted-foreground">{j.driver}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'wiring' && (
                <div className="space-y-1">
                  {result.wiring.map(([from, to]) => (
                    <div key={from} className="flex items-start gap-2 glass rounded-lg p-2">
                      <span className="text-[11px] font-medium flex-1">{from}</span>
                      <span className="text-[11px] font-mono text-cyan-500 text-right flex-1">{to}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'code' && (
                <pre className="text-[10px] leading-snug whitespace-pre-wrap break-words glass rounded-xl p-3 max-h-72 overflow-auto">{result.code}</pre>
              )}

              {tab === 'notes' && (
                <ul className="space-y-2">
                  {result.notes.map((n, i) => (
                    <li key={i} className="text-[11px] text-muted-foreground leading-relaxed glass rounded-xl p-2.5">{n}</li>
                  ))}
                  <li className="text-[11px] text-amber-600 dark:text-amber-400 leading-relaxed glass rounded-xl p-2.5">
                    The model is built and can be inspected and edited. The joints do not move on their own yet —
                    wire the circuit in the Circuit Lab to run the code.
                  </li>
                </ul>
              )}

              <button onClick={place}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm">
                {initial && initial === result ? 'Build another one' : 'Place in the workspace'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
