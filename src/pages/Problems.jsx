import React, { useMemo, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { topicsForClass } from '@/lib/problems';
import { rankFor } from '@/lib/uiMode';
import ProblemSolver, { useProblemStats } from '@/components/problems/ProblemSolver';
import BackButton from '@/components/BackButton';
import { Sigma, Shuffle, ChevronRight } from 'lucide-react';

export default function Problems() {
  const { selectedClass } = useApp();
  const { stats } = useProblemStats();
  const topics = useMemo(() => topicsForClass(selectedClass), [selectedClass]);
  const [active, setActive] = useState(null); // null | 'mixed' | topicId
  const areas = [...new Set(topics.map(t => t.area))];

  const acc = (id) => {
    const s = stats[id];
    return s && s.tries ? Math.round((s.correct / s.tries) * 100) : 0;
  };
  const totalTries = topics.reduce((n, t) => n + (stats[t.id]?.tries || 0), 0);
  const totalRight = topics.reduce((n, t) => n + (stats[t.id]?.correct || 0), 0);

  if (active) {
    const ids = active === 'mixed' ? topics.map(t => t.id) : [active];
    const t = topics.find(x => x.id === active);
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-8">
        <button onClick={() => setActive(null)} className="text-xs text-cyan-500 mb-3">← All topics</button>
        <h1 className="text-lg font-bold mb-3">{active === 'mixed' ? 'Mixed practice' : t?.title}</h1>
        <ProblemSolver topicIds={ids} />
        <p className="text-[11px] text-muted-foreground mt-3 text-center">New numbers every time. Answers within 2% are accepted. Opening the solution before answering won't count towards your accuracy.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-8">
      <div className="flex items-center gap-2 mb-1">
        <BackButton />
        <h1 className="text-lg font-bold flex items-center gap-2"><Sigma className="w-5 h-5 text-cyan-500" /> Numerical Practice</h1>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Board-style numericals with step-by-step solutions. {totalTries > 0 && <span>Overall: <b>{totalRight}/{totalTries}</b> correct.</span>}</p>

      <button onClick={() => setActive('mixed')} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2 mb-5">
        <Shuffle className="w-4 h-4" /> Mixed practice ({topics.length} topics)
      </button>

      {areas.map(area => (
        <div key={area} className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{area}</h2>
          <div className="space-y-2">
            {topics.filter(t => t.area === area).map(t => {
              const a = acc(t.id), rank = rankFor(stats[t.id]?.tries >= 3 ? a : 0), tries = stats[t.id]?.tries || 0;
              return (
                <button key={t.id} onClick={() => setActive(t.id)} className="w-full glass-strong rounded-xl p-3 flex items-center gap-3 text-left">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{t.title}</p>
                    <p className="text-[11px] text-muted-foreground">{tries ? `${stats[t.id].correct}/${tries} correct · ${a}%` : 'Not attempted'}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: rank.color, background: `${rank.color}20` }}>{tries >= 3 ? rank.name : tries ? 'Keep going' : 'New'}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
