import React, { useState } from 'react';
import { aiEnabled } from '@/lib/features';
import { Sparkles, X, Loader2, Send } from 'lucide-react';
import { backend } from '@/api/client';

const SUGGESTIONS = [
  'What should I connect next?',
  'Check my wiring',
  'Help me write the code',
  "Why isn't my robot working?",
];

function HelpMeBuildInner({ components, wires, code, status }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async (q) => {
    if (!q.trim()) return;
    setLoading(true); setReply(''); setOpen(true);
    const ctx = `Components on workspace: ${components.map(c => c.type).join(', ') || 'none'}.\nNumber of wires: ${wires.length}.\nCircuit status: ${status}.\nCurrent generated code:\n${(code || '').slice(0, 500)}`;
    try {
      const res = await backend.integrations.Core.InvokeLLM({
        user_input: q,
        prompt: `You are a friendly robotics build mentor for a school student. Keep answers short and practical (2-4 sentences), simple English.\n\nBuild context:\n${ctx}\n\nStudent question: ${q}`,
      });
      setReply(typeof res === 'string' ? res : (res.text || res.explanation || JSON.stringify(res)));
    } catch {
      setReply('Could not reach the AI mentor right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(o => !o)} title="Help Me Build"
        className="fixed right-4 z-40 bottom-24 md:bottom-6 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg hover:neon-glow transition-all">
        <Sparkles className="w-5 h-5" />
      </button>
      {open && (
        <div className="fixed right-4 z-40 bottom-40 md:bottom-24 w-72 max-w-[calc(100vw-2rem)] glass-strong rounded-2xl p-3 animate-scale-in border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Help Me Build</span>
            <button onClick={() => setOpen(false)} className="p-1 rounded text-muted-foreground hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => ask(s)} className="text-[10px] glass px-2 py-1 rounded-full text-cyan-400 hover:bg-cyan-500/10 transition-colors">{s}</button>
            ))}
          </div>
          <div className="flex gap-1.5 mb-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { ask(input); setInput(''); } }}
              placeholder="Ask anything…"
              className="flex-1 glass rounded-lg px-2 py-1.5 text-[11px] outline-none border border-border focus:border-cyan-500/40" />
            <button onClick={() => { ask(input); setInput(''); }} className="px-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"><Send className="w-3.5 h-3.5" /></button>
          </div>
          <div className="max-h-40 overflow-y-auto text-[11px] text-foreground/90 leading-relaxed whitespace-pre-line">
            {loading ? <div className="flex items-center gap-1.5 text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking…</div> : reply}
          </div>
        </div>
      )}
    </>
  );
}


export default function HelpMeBuild(props) {
  if (!aiEnabled) return null; // AI not configured for this build
  return <HelpMeBuildInner {...props} />;
}
