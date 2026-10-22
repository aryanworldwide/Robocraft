import React, { useState } from 'react';
import { GraduationCap, Eye, EyeOff, Check } from 'lucide-react';
import RichText from '@/components/lesson/RichText';
import AnswerChecker from '@/components/exam/AnswerChecker';

function ExamQuestion({ q, n, marks, onMarked }) {
  const [show, setShow] = useState(false);
  const [got, setGot] = useState(null);
  const pick = (m) => { setGot(m); onMarked?.(m); };
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex gap-2 items-start">
        <span className="text-xs font-bold text-cyan-500 mt-0.5">Q{n}.</span>
        <p className="text-sm font-medium flex-1">{q.q}</p>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap">[{marks}]</span>
      </div>
      <AnswerChecker question={q.q} model={q.a} marks={marks} onMarks={pick} />
      <button onClick={() => setShow(!show)} className="mt-2 text-xs font-semibold text-cyan-500 flex items-center gap-1">
        {show ? <><EyeOff className="w-3.5 h-3.5" /> Hide model answer</> : <><Eye className="w-3.5 h-3.5" /> Show model answer</>}
      </button>
      {show && (
        <div className="mt-2 border-l-2 border-green-500 pl-3 animate-fade-in">
          <RichText text={q.a} className="text-[13px]" />
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-muted-foreground mr-1">Mark yourself:</span>
            {Array.from({ length: marks + 1 }, (_, m) => (
              <button key={m} onClick={() => pick(m)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${got === m ? 'bg-green-500 text-white' : 'glass hover:bg-green-500/10'}`}>{m}</button>
            ))}
            {got !== null && <span className="text-[10px] text-green-500 flex items-center gap-1 ml-1"><Check className="w-3 h-3" /> {got}/{marks}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/** Exam-style written questions (short + long) with model answers and self-marking. */
export default function ExamCorner({ exam, onPracticed }) {
  const [scores, setScores] = useState({});
  if (!exam || (!(exam.short || []).length && !(exam.long || []).length)) return null;
  const short = exam.short || [], long = exam.long || [];
  const total = short.length * 2 + long.length * 5;
  const earned = Object.values(scores).reduce((a, b) => a + b, 0);
  const mark = (key, m) => {
    const next = { ...scores, [key]: m };
    setScores(next);
    if (Object.keys(next).length === short.length + long.length) onPracticed?.();
  };
  return (
    <div className="glass-strong rounded-2xl p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/15">
          <GraduationCap className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Exam Corner</h3>
          <p className="text-[10px] text-muted-foreground">Board-style written questions with model answers</p>
        </div>
        {Object.keys(scores).length > 0 && <span className="text-xs font-bold text-green-500">{earned}/{total}</span>}
      </div>
      {short.length > 0 && <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-4 mb-2">Short answer · 2 marks each</p>}
      <div className="space-y-2">
        {short.map((q, i) => <ExamQuestion key={'s' + i} q={q} n={i + 1} marks={2} onMarked={m => mark('s' + i, m)} />)}
      </div>
      {long.length > 0 && <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-4 mb-2">Long answer · 5 marks each</p>}
      <div className="space-y-2">
        {long.map((q, i) => <ExamQuestion key={'l' + i} q={q} n={short.length + i + 1} marks={5} onMarked={m => mark('l' + i, m)} />)}
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">Tip: in the exam, write key words, a labelled diagram where it helps, and one real example.</p>
    </div>
  );
}
