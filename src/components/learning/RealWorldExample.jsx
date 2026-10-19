import React from 'react';
import { Globe } from 'lucide-react';
import { getRealWorldExamples } from '@/lib/curriculum/realWorldData';

export default function RealWorldExample({ lesson }) {
  const examples = getRealWorldExamples(lesson);

  return (
    <div className="glass-strong rounded-3xl p-6" style={{ border: '1px solid rgba(74,222,128,0.2)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
          <Globe className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <span className="text-[10px] text-green-400 font-medium uppercase tracking-wider">Where is this used in real life?</span>
          <p className="text-[9px] text-muted-foreground">Never ask "why am I learning this?" again</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {examples.map((ex, i) => (
          <div key={i} className="flex items-center gap-3 glass rounded-xl p-3 hover:scale-[1.02] transition-transform cursor-default">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-xl flex-shrink-0">
              {ex.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-green-400">{ex.context}</p>
              <p className="text-[11px] text-foreground/80 leading-snug">{ex.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
