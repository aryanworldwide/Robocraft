import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { challengeLevel, recordChallengeSolved } from '@/lib/adaptive';
import { ENGINEERING_CHALLENGES, getChallenge } from '@/lib/curriculum/engineeringChallenges';
import EngineeringChallenge from '@/components/adaptive/EngineeringChallenge';
import { CheckCircle2, ChevronRight, Wrench } from 'lucide-react';

export default function EngineeringChallenges() {
  const { selectedClass, getProgressForClass, updateProgress } = useApp();
  const progress = getProgressForClass(selectedClass);
  const level = challengeLevel(selectedClass, progress);
  const solved = new Set(progress.engineering?.solved || []);
  const [activeId, setActiveId] = useState(null);

  const active = activeId ? getChallenge(activeId) : null;

  const handleSolved = (challengeId) => {
    recordChallengeSolved(selectedClass, getProgressForClass(selectedClass), updateProgress, challengeId);
  };

  if (active) {
    return <EngineeringChallenge challenge={active} level={level} onSolved={handleSolved} />;
  }

  // group by area
  const areas = [...new Set(ENGINEERING_CHALLENGES.map(c => c.area))];

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      <div className="animate-slide-up">
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold tracking-tight">ENGINEERING CHALLENGES</h1>
        </div>
        <p className="text-[11px] text-muted-foreground">Reasoning problems • Current difficulty: Level {level}</p>
      </div>

      {areas.map(area => (
        <div key={area} className="animate-slide-up">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2 px-1">{area}</h2>
          <div className="space-y-2">
            {ENGINEERING_CHALLENGES.filter(c => c.area === area).map(c => {
              const isSolved = solved.has(c.id);
              return (
                <button key={c.id} onClick={() => setActiveId(c.id)}
                  className="w-full text-left glass-strong rounded-2xl p-4 hover:neon-glow transition-all flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isSolved ? 'bg-green-500/15' : 'bg-cyan-500/15'}`}>
                    {isSolved ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Wrench className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold">{c.title}</p>
                      {isSolved && <span className="text-[9px] text-green-400 font-medium">SOLVED</span>}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.scenario}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
