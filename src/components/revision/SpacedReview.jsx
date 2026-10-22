import React, { useMemo, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { getLesson } from '@/lib/curriculum';
import { dueCards, reviewCard, boxStats, BOX_DAYS } from '@/lib/srs';
import { CheckCircle2, XCircle, Layers, ChevronRight } from 'lucide-react';

export function useDueCount() {
  const { selectedClass, getProgressForClass } = useApp();
  const p = getProgressForClass(selectedClass);
  return useMemo(() => dueCards(selectedClass, p).cards.length, [selectedClass, p.srs, p.completedLessons]); // eslint-disable-line react-hooks/exhaustive-deps
}

export default function SpacedReview({ onExit }) {
  const { selectedClass, getProgressForClass, updateProgress, addXP } = useApp();
  const [queue] = useState(() => dueCards(selectedClass, getProgressForClass(selectedClass)).cards);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState({ right: 0, done: 0 });
  const card = queue[i];

  const answer = (k) => {
    if (pick !== null) return;
    setPick(k);
    const ok = k === card.q.answer;
    const p = getProgressForClass(selectedClass);
    updateProgress(selectedClass, { srs: reviewCard(p.srs || {}, card.id, ok) });
    if (ok) addXP(selectedClass, 2);
    setScore(s => ({ right: s.right + (ok ? 1 : 0), done: s.done + 1 }));
  };
  const next = () => { setPick(null); setI(x => x + 1); };

  if (!queue.length) return (
    <div className="glass-strong rounded-2xl p-6 text-center">
      <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-2" />
      <p className="text-sm font-bold">Nothing due today</p>
      <p className="text-xs text-muted-foreground mt-1">Complete more chapters to add cards, or come back tomorrow.</p>
      <button onClick={onExit} className="mt-4 px-4 py-2 rounded-xl glass text-xs">Back</button>
    </div>
  );
  if (!card) {
    const boxes = boxStats(getProgressForClass(selectedClass));
    return (
      <div className="glass-strong rounded-2xl p-5 text-center">
        <Layers className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
        <p className="text-lg font-bold">{score.right}/{score.done} correct</p>
        <p className="text-xs text-muted-foreground mt-1">Wrong answers come back tomorrow; right ones come back later and later.</p>
        <div className="flex items-end justify-center gap-1.5 h-20 mt-4">
          {boxes.slice(1).map((n, b) => (
            <div key={b} className="flex flex-col items-center gap-1">
              <div className="w-8 rounded-t bg-gradient-to-t from-cyan-600 to-cyan-400" style={{ height: `${Math.min(60, 4 + n * 2)}px` }} />
              <span className="text-[9px] text-muted-foreground">{BOX_DAYS[b + 1]}d</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">Cards per review gap</p>
        <button onClick={onExit} className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold">Done</button>
      </div>
    );
  }
  const lesson = getLesson(selectedClass, card.lessonId);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Spaced review · {lesson?.title}</span><span>{i + 1}/{queue.length}</span>
      </div>
      <div className="h-1.5 glass rounded-full overflow-hidden"><div className="h-full bg-cyan-500 transition-all" style={{ width: `${(i / queue.length) * 100}%` }} /></div>
      <div className="glass-strong rounded-2xl p-4">
        <p className="text-sm font-medium mb-3">{card.q.q}</p>
        <div className="grid gap-2">
          {card.q.options.map((o, k) => {
            const state = pick === null ? '' : k === card.q.answer ? 'bg-green-500/20 border-green-500/50' : k === pick ? 'bg-red-500/20 border-red-500/50' : 'opacity-60';
            return (
              <button key={k} onClick={() => answer(k)} className={`text-left text-sm px-3 py-2.5 rounded-xl glass border border-transparent ${state}`}>
                <span className="font-bold mr-2">{String.fromCharCode(65 + k)}.</span>{o}
              </button>
            );
          })}
        </div>
        {pick !== null && (
          <div className="mt-3 text-xs flex items-start gap-2">
            {pick === card.q.answer ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
            <span className="text-muted-foreground">{card.q.explanation || (pick === card.q.answer ? 'Correct.' : 'This card will come back tomorrow.')}</span>
          </div>
        )}
      </div>
      {pick !== null && <button onClick={next} className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-1">Next <ChevronRight className="w-4 h-4" /></button>}
    </div>
  );
}
