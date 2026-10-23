import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { makeProblem, checkAnswer } from '@/lib/problems';
import { Check, X, RefreshCw, ListChecks, ChevronRight } from 'lucide-react';

// Records attempts per topic so the app can show accuracy and proficiency ranks.
export function useProblemStats() {
  const { selectedClass, getProgressForClass, updateProgress, addXP } = useApp();
  const stats = getProgressForClass(selectedClass).problemStats || {};
  const record = (topicId, ok) => {
    const cur = getProgressForClass(selectedClass).problemStats || {};
    const s = cur[topicId] || { tries: 0, correct: 0 };
    updateProgress(selectedClass, { problemStats: { ...cur, [topicId]: { tries: s.tries + 1, correct: s.correct + (ok ? 1 : 0), last: Date.now() } } });
    if (ok) addXP(selectedClass, 5);
  };
  return { stats, record };
}

/** One numerical problem at a time from the given topics, with a worked solution. */
export default function ProblemSolver({ topicIds, compact = false, onAnswered }) {
  const { record } = useProblemStats();
  const nextTopic = () => topicIds[Math.floor(Math.random() * topicIds.length)];
  const [problem, setProblem] = useState(() => makeProblem(nextTopic()));
  const [given, setGiven] = useState('');
  const [result, setResult] = useState(null); // null | true | false
  const [showSteps, setShowSteps] = useState(false);
  const [session, setSession] = useState({ done: 0, right: 0 });

  useEffect(() => { next(); }, [topicIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  function next() {
    setProblem(makeProblem(nextTopic()));
    setGiven(''); setResult(null); setShowSteps(false);
  }

  function submit(value) {
    if (result !== null) return;
    const v = value ?? given;
    if (String(v).trim() === '') return;
    const ok = checkAnswer(problem, v);
    setGiven(String(v));
    const counted = ok && !showSteps; // looking at the solution first doesn't count as solved
    setResult(ok); setShowSteps(true);
    record(problem.topicId, counted);
    setSession(s => ({ done: s.done + 1, right: s.right + (counted ? 1 : 0) }));
    onAnswered?.(counted);
  }

  if (!problem) return null;
  const fmt = (a) => (typeof a === 'number' ? String(a) : a);

  return (
    <div className={`glass-strong rounded-2xl ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-center gap-2 mb-2">
        <ListChecks className="w-4 h-4 text-cyan-500" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-500">{problem.topicTitle}</span>
        {session.done > 0 && <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">{session.right}/{session.done} correct</span>}
      </div>
      <p className="text-sm leading-relaxed mb-3">{problem.q}</p>

      {problem.choices ? (
        <div className="grid grid-cols-2 gap-2">
          {problem.choices.map(c => {
            const picked = given === c, right = result !== null && c === problem.answer;
            return (
              <button key={c} disabled={result !== null} onClick={() => submit(c)}
                className={`py-2.5 rounded-xl text-sm font-semibold ${right ? 'bg-green-500/15 text-green-600 dark:text-green-400' : picked && result === false ? 'bg-red-500/15 text-red-500' : 'glass'}`}>{c}</button>
            );
          })}
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); submit(); }} className="flex gap-2">
          <input value={given} onChange={e => setGiven(e.target.value)} disabled={result !== null}
            inputMode={problem.text ? 'text' : 'decimal'} placeholder={problem.text ? 'Your answer' : 'Your answer (number)'}
            className="flex-1 min-w-0 rounded-xl bg-background/60 border border-border px-3 py-2.5 text-sm outline-none focus:border-cyan-500" />
          {problem.unit && <span className="self-center text-xs text-muted-foreground">{problem.unit}</span>}
          <button type="submit" disabled={result !== null || !String(given).trim()} className="px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold disabled:opacity-40">Check</button>
        </form>
      )}

      {result !== null && (
        <div className={`mt-3 rounded-xl p-3 text-sm ${result ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
          <p className={`font-bold flex items-center gap-1.5 ${result ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
            {result ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {result ? 'Correct' : `Not quite — answer: ${fmt(problem.answer)} ${problem.unit || ''}`}
          </p>
        </div>
      )}

      {result === null && (
        <button onClick={() => setShowSteps(!showSteps)} className="mt-3 text-xs text-muted-foreground underline">{showSteps ? 'Hide solution' : 'Show solution'}</button>
      )}
      {showSteps && (
        <ol className="mt-3 space-y-1.5 border-l-2 border-cyan-500/50 pl-3">
          {problem.steps.map((s, i) => <li key={i} className="text-[13px] text-foreground/85 leading-relaxed">{s}</li>)}
        </ol>
      )}

      <button aria-label="Refresh" onClick={next} className="mt-4 w-full py-2.5 rounded-xl glass text-cyan-500 text-sm font-bold flex items-center justify-center gap-1.5">
        {result === null ? <><RefreshCw className="w-4 h-4" /> Skip — new problem</> : <>Next problem <ChevronRight className="w-4 h-4" /></>}
      </button>
    </div>
  );
}
