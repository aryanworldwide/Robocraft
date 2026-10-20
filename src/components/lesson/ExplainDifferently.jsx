import React, { useState } from 'react';
import { aiEnabled } from '@/lib/features';
import { Wand2, Lightbulb, HelpCircle, Swords, Loader2, Bot } from 'lucide-react';
import { backend } from '@/api/client';

// AI-powered "explain differently" tools — only invoked on explicit click.
function ExplainDifferentlyInner({ lesson }) {
  const [active, setActive] = useState(null); // 'simpler' | 'example' | 'why' | 'challenge'
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const tools = [
    { id: 'simpler', label: 'Explain Simpler', icon: Lightbulb, prompt: `Explain the robotics concept "${lesson.title}" in very simple terms a 12-year-old could understand. Keep it under 80 words, friendly, no jargon. Topic context: ${lesson.summary || ''}` },
    { id: 'example', label: 'Give an Example', icon: Wand2, prompt: `Give one concrete, vivid real-world robotics example that illustrates "${lesson.title}". 2-3 sentences. Context: ${lesson.summary || ''}` },
    { id: 'why', label: 'Ask Why', icon: HelpCircle, prompt: `For the robotics concept "${lesson.title}", answer "Why does this matter?" in 2-3 sentences, connecting it to real robot behaviour. Context: ${lesson.summary || ''}` },
    { id: 'challenge', label: 'Challenge Me', icon: Swords, prompt: `Ask one short reasoning/diagnostic question about "${lesson.title}" that tests deep understanding (not recall). Just the question, no answer. Context: ${lesson.summary || ''}` },
  ];

  const run = async (tool) => {
    if (active === tool.id && result) { setActive(null); return; }
    if (active === tool.id) { setActive(null); return; }
    setActive(tool.id);
    if (result && loading) return;
    setLoading(true); setResult('');
    try {
      const res = await backend.integrations.Core.InvokeLLM({
        prompt: tool.prompt,
        response_json_schema: { type: 'object', properties: { text: { type: 'string' } } },
      });
      setResult(res.text || 'No response. Try again.');
    } catch {
      setResult('Could not reach AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-strong rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center"><Bot className="w-5 h-5 text-violet-400" /></div>
        <div>
          <h3 className="text-sm font-bold text-violet-400">Explain Differently</h3>
          <p className="text-[10px] text-muted-foreground">AI tools — tap to use</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tools.map(t => {
          const Icon = t.icon;
          const on = active === t.id;
          return (
            <button key={t.id} onClick={() => run(t)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${on ? 'bg-violet-500/20 text-violet-300 neon-glow' : 'glass text-foreground/80 hover:bg-violet-500/10'}`}>
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>
      {active && (
        <div className="mt-3 glass rounded-xl p-3 animate-fade-in">
          {loading ? (
            <div className="flex items-center gap-2 py-3"><Loader2 className="w-4 h-4 text-violet-400 animate-spin" /><span className="text-xs text-muted-foreground">Thinking…</span></div>
          ) : (
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{result}</p>
          )}
        </div>
      )}
    </div>
  );
}


export default function ExplainDifferently(props) {
  if (!aiEnabled) return null; // AI not configured for this build
  return <ExplainDifferentlyInner {...props} />;
}
