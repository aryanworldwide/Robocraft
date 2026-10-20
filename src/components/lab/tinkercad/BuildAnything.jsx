import React, { useState } from 'react';
import { backend } from '@/api/client';
import { LAB_COMPONENTS, getDef } from '@/lib/lab/labComponents';
import { assignWiring } from '@/lib/lab/freeBuild';
import { X, Sparkles, Loader2, Check, ArrowRight, Wrench, Plus } from 'lucide-react';

const EXAMPLES = [
  'Build an automatic plant watering system',
  'Build an obstacle avoiding robot',
  'Build a smart dustbin',
  'Build a temperature monitoring system',
  'Build a servo-controlled door',
  'Build my own robot',
];

export default function BuildAnything({ boardType, onAddComponents, onUseGuide, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const catalog = Object.keys(LAB_COMPONENTS).map(k => `${k} (${getDef(k).name})`).join(', ');

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await backend.integrations.Core.InvokeLLM({
        user_input: prompt,
        prompt: `A school student wants to build: "${prompt}".
Available component types (use ONLY these ids): ${catalog}.
The board is: ${getDef(boardType)?.name || 'Arduino Uno'}.
Recommend 3-6 component ids from the list to build this (include the board if needed). Return JSON: goal (short string), components (array of type ids), plan (array of 5-7 short build steps).`,
        response_json_schema: { type: 'object', properties: {
          goal: { type: 'string' },
          components: { type: 'array', items: { type: 'string' } },
          plan: { type: 'array', items: { type: 'string' } },
        } },
      });
      const comps = (res.components || []).filter(t => LAB_COMPONENTS[t]);
      if (!comps.includes(boardType)) comps.unshift(boardType);
      const guide = assignWiring(comps, boardType);
      setResult({ goal: res.goal || prompt, components: comps, plan: res.plan || [], guide });
    } catch (e) {
      setError('Could not reach the assistant. Try "Start From Scratch" and add components manually.');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-lg glass-strong rounded-2xl p-5 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Build Anything</h2>
              <p className="text-[10px] text-muted-foreground">Describe what you want to build</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg glass text-muted-foreground hover:text-red-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!result && (
          <>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3}
              placeholder="e.g. Build an obstacle avoiding robot"
              className="w-full glass rounded-xl p-3 text-sm outline-none resize-none border border-border focus:border-cyan-500/40 transition-colors" />
            <div className="flex flex-wrap gap-1.5 my-3">
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => setPrompt(ex)}
                  className="text-[10px] glass px-2.5 py-1.5 rounded-full text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                  {ex}
                </button>
              ))}
            </div>
            <button onClick={generate} disabled={loading || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold disabled:opacity-40 transition-all">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Designing your build…</> : <><Wrench className="w-4 h-4" /> Design My Build</>}
            </button>
            {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
          </>
        )}

        {result && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass rounded-xl p-3 border-l-2 border-cyan-500">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">Your Project</p>
              <p className="text-sm font-medium">Goal: {result.goal}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Recommended Components</p>
              <div className="space-y-1.5">
                {result.components.map(t => {
                  const def = getDef(t);
                  if (!def) return null;
                  return (
                    <div key={t} className="flex items-center gap-2 glass rounded-lg px-3 py-2 text-xs">
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span>{def.emoji}</span>
                      <span className="font-medium">{def.name}</span>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => onAddComponents(result.components)}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:neon-glow transition-all">
                <Plus className="w-4 h-4" /> Add All Components
              </button>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Build Plan</p>
              <div className="space-y-1.5">
                {result.plan.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="w-5 h-5 rounded-lg bg-cyan-500/15 flex items-center justify-center text-[10px] font-bold text-cyan-400 flex-shrink-0">{i + 1}</span>
                    <span className="text-foreground/85">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Wiring Guide</p>
              <div className="glass rounded-xl p-3 space-y-1 max-h-40 overflow-y-auto">
                {result.guide.map((g, i) => (
                  <div key={i} className="text-[11px] text-foreground/85 flex items-center gap-1.5">
                    <span className="text-cyan-400 font-mono">{g.boardPin}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span>{getDef(g.compType)?.name} {g.compPin}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => onUseGuide(result.guide)}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl glass text-cyan-400 text-xs font-bold hover:bg-cyan-500/10 transition-colors">
                <Wrench className="w-4 h-4" /> Start Wiring
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}