import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Lightbulb, ListChecks, Sparkles, XCircle, ArrowRight } from 'lucide-react';

// Solves a single challenge at a given difficulty level, then reveals
// approach / what-you-missed / engineering insight (deterministic).
export default function EngineeringChallenge({ challenge, level, onSolved }) {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('answer'); // answer | review

  const lvl = Math.min(4, Math.max(1, level));
  const stage = challenge.levels[lvl - 1];

  const missedCovered = (item) => {
    const a = (answer || '').toLowerCase();
    return item.keywords.some(k => a.includes(k.toLowerCase()));
  };
  const missedItems = (challenge.missed || []).filter(m => !missedCovered(m));
  const coveredItems = (challenge.missed || []).filter(missedCovered);

  const submit = () => {
    setPhase('review');
    onSolved?.(challenge.id);
  };

  const correct = stage.type === 'mcq' ? selected === stage.answer : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      <button onClick={() => navigate('/challenges')} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> All Challenges
      </button>

      {/* Scenario */}
      <div className="glass-strong rounded-2xl p-4 animate-slide-up">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] glass px-2 py-0.5 rounded-full text-purple-400 font-medium">{challenge.area}</span>
          <span className="text-[10px] glass px-2 py-0.5 rounded-full text-cyan-400 font-medium">Level {lvl}</span>
        </div>
        <h1 className="text-lg font-bold mb-1">{challenge.title}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">{challenge.scenario}</p>
      </div>

      {/* Question */}
      <div className="glass-strong rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '0.03s' }}>
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">Problem</h3>
        <p className="text-sm text-foreground/90 mb-3">{stage.question}</p>

        {phase === 'answer' && stage.type === 'mcq' && (
          <div className="space-y-2">
            {stage.options.map((opt, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${selected === i ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300' : 'glass border border-transparent text-foreground/85 hover:bg-cyan-500/5'}`}>
                <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            ))}
            <button onClick={submit} disabled={selected === null}
              className="w-full mt-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold disabled:opacity-40">
              Submit Answer
            </button>
          </div>
        )}

        {phase === 'answer' && stage.type === 'reason' && (
          <div className="space-y-2">
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={5}
              placeholder="Reason through the problem. Describe what you would check, measure, and change…"
              className="w-full glass rounded-xl p-3 text-sm text-foreground/90 placeholder:text-muted-foreground/60 outline-none border border-cyan-500/10 focus:border-cyan-400/40 resize-none" />
            <button onClick={submit} disabled={answer.trim().length < 10}
              className="w-full px-3 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold disabled:opacity-40">
              Submit Reasoning
            </button>
            <p className="text-[10px] text-muted-foreground text-center">Write at least one sentence. There is no single correct answer.</p>
          </div>
        )}

        {phase === 'review' && (
          <div className="space-y-3">
            {correct !== null && (
              <div className={`glass rounded-xl p-3 flex items-center gap-2 ${correct ? 'text-green-400' : 'text-red-400'}`}>
                {correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span className="text-xs font-bold">{correct ? 'Correct.' : 'Not quite — study the insight below.'}</span>
              </div>
            )}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Your Approach</h4>
              <p className="text-xs text-foreground/85 glass rounded-lg p-3 whitespace-pre-line">
                {correct !== null ? `Selected: ${String.fromCharCode(65 + selected)} — ${stage.options[selected]}` : (answer.trim() || 'No reasoning provided.')}
              </p>
            </div>
            {coveredItems.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-green-400 mb-1.5 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> What You Considered</h4>
                <ul className="space-y-1">
                  {coveredItems.map((m, i) => <li key={i} className="text-xs text-foreground/85 glass rounded-lg p-2 flex gap-2"><span className="text-green-400">✓</span>{m.point}</li>)}
                </ul>
              </div>
            )}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-red-400 mb-1.5 flex items-center gap-1"><XCircle className="w-3 h-3" /> What You Missed</h4>
              {missedItems.length ? (
                <ul className="space-y-1">
                  {missedItems.map((m, i) => <li key={i} className="text-xs text-foreground/85 glass rounded-lg p-2 flex gap-2"><span className="text-red-400">✗</span>{m.point}</li>)}
                </ul>
              ) : <p className="text-xs text-green-400 glass rounded-lg p-2">Strong reasoning — you covered the key points.</p>}
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-purple-400 mb-1.5 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Engineering Insight</h4>
              <p className="text-xs text-foreground/90 glass rounded-lg p-3 leading-relaxed border-l-2 border-purple-400/40">{challenge.insight}</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1"><ListChecks className="w-3 h-3" /> Model Approach</h4>
              <ul className="space-y-1">
                {challenge.approach.map((a, i) => <li key={i} className="text-xs text-foreground/85 glass rounded-lg p-2 flex gap-2"><span className="text-cyan-400 font-bold">{i + 1}.</span>{a}</li>)}
              </ul>
            </div>
            <button onClick={() => navigate('/challenges')} className="w-full px-3 py-2.5 rounded-lg glass text-cyan-400 text-xs font-bold flex items-center justify-center gap-1.5">
              Back to Challenges <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}