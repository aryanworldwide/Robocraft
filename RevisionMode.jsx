import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { getAllLessons, getLesson, getQuizForLesson } from '@/lib/curriculum';
import { weakAreas, getMode } from '@/lib/adaptive';
import { getConceptIntro, getTakeaway, getThinkingQuestion } from '@/lib/lesson/parseTheory';
import { exportFullRevisionPdf } from '@/lib/revision/exportRevisionPdf';
import { Clock, Target, CheckCircle2, XCircle, ArrowRight, RotateCcw, Download, Brain, AlertTriangle, Trophy, ChevronRight } from 'lucide-react';
import BackButton from '@/components/BackButton';

const DURATIONS = [
  { id: 15, label: '15 min', count: 6, icon: Clock, desc: 'Quick weak-area sweep' },
  { id: 30, label: '30 min', count: 12, icon: Clock, desc: 'Solid revision session' },
  { id: 60, label: '60 min', count: 20, icon: Clock, desc: 'Deep exam prep' },
  { id: 0, label: 'Full Revision', count: 999, icon: Target, desc: 'Every topic' },
];

function pickQuestion(classId, lesson) {
  const quiz = getQuizForLesson(classId, lesson.id) || [];
  const mcq = quiz.find(q => q.type === 'mcq');
  if (mcq) return { ...mcq, type: 'mcq' };
  const tf = quiz.find(q => q.type === 'tf');
  if (tf) return { ...tf, type: 'mcq', options: ['True', 'False'], answer: tf.answer ? 0 : 1, explanation: tf.explanation };
  const fill = quiz.find(q => q.type === 'fill');
  if (fill) return { q: fill.q, type: 'open', answer: fill.answer, explanation: fill.explanation };
  // fallback: derive from key concept
  const kc = (lesson.keyConcepts || [])[0];
  return { q: `Explain in one line: ${kc || lesson.title}`, type: 'open', answer: lesson.summary || '', explanation: getTakeaway(lesson) };
}

export default function RevisionMode() {
  const navigate = useNavigate();
  const { selectedClass, getProgressForClass } = useApp();
  const progress = getProgressForClass(selectedClass);
  const engineering = getMode(selectedClass) === 'engineering';

  const [phase, setPhase] = useState('select'); // select | review | question | result | complete
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [openAnswer, setOpenAnswer] = useState('');
  const [stats, setStats] = useState({ reviewed: 0, answered: 0, correct: 0, improved: [], needsReview: [] });
  const [weakLessonIds, setWeakLessonIds] = useState([]);

  const buildQueue = (count) => {
    const weak = weakAreas(selectedClass, progress, 10);
    const weakIds = [...new Set(weak.map(w => w.lessonId))];
    setWeakLessonIds(weakIds);
    const all = getAllLessons(selectedClass);
    const weakLessons = weakIds.map(id => getLesson(selectedClass, id)).filter(Boolean);
    const rest = all.filter(l => !weakIds.includes(l.id));
    const ordered = [...weakLessons, ...rest].slice(0, count);
    return ordered.map(l => ({ lesson: l, question: pickQuestion(selectedClass, l), isWeak: weakIds.includes(l.id) }));
  };

  const start = (count) => {
    setQueue(buildQueue(count));
    setIdx(0); setPhase('review'); setPicked(null); setOpenAnswer('');
    setStats({ reviewed: 0, answered: 0, correct: 0, improved: [], needsReview: [] });
  };

  const current = queue[idx];

  const submitAnswer = () => {
    const q = current.question;
    let isCorrect = false;
    if (q.type === 'mcq') isCorrect = picked === q.answer;
    else isCorrect = openAnswer.trim().toLowerCase().includes(String(q.answer).toLowerCase().slice(0, 4)) && openAnswer.trim().length > 2;

    const newStats = { ...stats, answered: stats.answered + 1, correct: stats.correct + (isCorrect ? 1 : 0) };
    if (current.isWeak) {
      if (isCorrect) {
        if (!newStats.improved.includes(current.lesson.title)) newStats.improved.push(current.lesson.title);
        newStats.needsReview = newStats.needsReview.filter(t => t !== current.lesson.title);
      } else {
        if (!newStats.needsReview.includes(current.lesson.title)) newStats.needsReview.push(current.lesson.title);
      }
    } else if (!isCorrect) {
      if (!newStats.needsReview.includes(current.lesson.title)) newStats.needsReview.push(current.lesson.title);
    }
    setStats(newStats);
    setPhase('result');
  };

  const next = () => {
    if (idx + 1 >= queue.length) {
      setStats(s => ({ ...s, reviewed: queue.length }));
      setPhase('complete');
      return;
    }
    setIdx(idx + 1); setPhase('review'); setPicked(null); setOpenAnswer('');
  };

  const subjectColor = { Robotics: '#00D2FF', 'Mechanical Systems': '#F97316', Computing: '#F59E0B', Microcontrollers: '#22D3EE', 'Electrical & Control Systems': '#EAB308', Applications: '#EC4899', 'Python Programming': '#4ADE80', 'Artificial Intelligence': '#A78BFA', 'Computing Fundamentals': '#F59E0B' };
  const color = current ? (subjectColor[current.lesson.subject] || '#00D2FF') : '#00D2FF';

  // ── Selection screen ──
  if (phase === 'select') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="mb-4 flex items-center gap-2 animate-slide-up"><BackButton /><h1 className="text-lg font-bold">Revision Mode</h1></div>
        <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up" style={{ animationDelay: '0.03s' }}>
          <div className="flex items-center gap-2 mb-2"><Brain className="w-5 h-5 text-cyan-400" /><h2 className="text-sm font-bold">Smart, prioritized revision</h2></div>
          <p className="text-xs text-muted-foreground leading-relaxed">We prioritize your weak areas first. Flow: review a concept → answer a question → check your understanding → move on. You'll get a full report at the end.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {DURATIONS.map((d, i) => {
            const Icon = d.icon;
            return (
              <button key={d.id} onClick={() => start(d.count)}
                className="glass-strong rounded-2xl p-4 text-left hover:neon-glow transition-all animate-slide-up" style={{ animationDelay: `${0.05 + i * 0.03}s` }}>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-3"><Icon className="w-5 h-5 text-cyan-400" /></div>
                <h3 className="text-sm font-bold mb-1">{d.label}</h3>
                <p className="text-[10px] text-muted-foreground">{d.desc}</p>
              </button>
            );
          })}
        </div>
        <button onClick={() => exportFullRevisionPdf(selectedClass)} className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl glass text-green-400 text-sm font-bold hover:bg-green-500/10 transition-colors animate-slide-up" style={{ animationDelay: '0.18s' }}>
          <Download className="w-4 h-4" /> Or download the full revision PDF
        </button>
      </div>
    );
  }

  // ── Complete screen ──
  if (phase === 'complete') {
    const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="text-center mb-6 animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
            <Trophy className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-xl font-bold gradient-text">Revision Complete</h1>
        </div>
        <div className="glass-strong rounded-2xl p-5 mb-4 animate-slide-up">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-2xl font-bold text-cyan-400">{stats.reviewed}</p><p className="text-[10px] text-muted-foreground">Concepts reviewed</p></div>
            <div><p className="text-2xl font-bold text-purple-400">{stats.answered}</p><p className="text-[10px] text-muted-foreground">Questions answered</p></div>
            <div><p className="text-2xl font-bold text-green-400">{accuracy}%</p><p className="text-[10px] text-muted-foreground">Accuracy</p></div>
          </div>
        </div>
        {stats.improved.length > 0 && (
          <div className="glass-strong rounded-2xl p-4 mb-3 animate-slide-up border-l-2 border-green-500">
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Improved Areas</h3>
            {stats.improved.map(t => <p key={t} className="text-sm text-foreground/90 flex gap-2"><span className="text-green-400">+</span> {t}</p>)}
          </div>
        )}
        {stats.needsReview.length > 0 && (
          <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up border-l-2 border-yellow-500">
            <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Needs More Review</h3>
            {stats.needsReview.map(t => <p key={t} className="text-sm text-foreground/90 flex gap-2"><span className="text-yellow-400">•</span> {t}</p>)}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setPhase('select')} className="flex items-center justify-center gap-2 py-3 rounded-2xl glass text-cyan-400 text-sm font-bold hover:bg-cyan-500/10">
            <RotateCcw className="w-4 h-4" /> Revision Again
          </button>
          <button onClick={() => navigate('/learn')} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:neon-glow">
            Back to Learn <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Active flow ──
  const progressPct = Math.round(((idx) / queue.length) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="mb-3 flex items-center justify-between animate-slide-up">
        <BackButton onClick={() => setPhase('select')} />
        <span className="text-[10px] text-muted-foreground">{idx + 1} / {queue.length}</span>
      </div>
      {/* progress bar */}
      <div className="h-1.5 glass rounded-full overflow-hidden mb-4">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500" style={{ width: `${progressPct}%` }} />
      </div>

      {/* REVIEW CONCEPT */}
      {phase === 'review' && current && (
        <div className="space-y-3 animate-fade-in">
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}><Brain className="w-4 h-4" style={{ color }} /></div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color }}>{engineering ? 'Review Concept' : 'Read & Review'}</h3>
              {current.isWeak && <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 font-bold">WEAK AREA</span>}
            </div>
            <h2 className="text-base font-bold mb-2">{current.lesson.title}</h2>
            <p className="text-sm text-foreground/90 leading-relaxed">{getConceptIntro(current.lesson)}</p>
            <div className="glass rounded-lg p-3 mt-3">
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Key takeaway</p>
              <p className="text-xs text-foreground/85 leading-relaxed">{getTakeaway(current.lesson)}</p>
            </div>
          </div>
          <button onClick={() => setPhase('question')} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:neon-glow">
            I've reviewed it — show the question <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* QUESTION */}
      {phase === 'question' && current && (
        <div className="space-y-3 animate-fade-in">
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center"><Target className="w-4 h-4 text-purple-400" /></div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Check Understanding</h3>
            </div>
            <p className="text-sm font-medium mb-4">{current.question.q}</p>
            {current.question.type === 'mcq' ? (
              <div className="grid gap-2">
                {current.question.options.map((opt, oi) => (
                  <button key={oi} onClick={() => setPicked(oi)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-left transition-all ${picked === oi ? 'bg-cyan-500/20 text-cyan-300 neon-glow' : 'glass hover:bg-cyan-500/10'}`}>
                    <span className="w-5 h-5 rounded-full border border-cyan-500/40 flex items-center justify-center text-[10px] font-bold">{String.fromCharCode(65 + oi)}</span>
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <textarea value={openAnswer} onChange={e => setOpenAnswer(e.target.value)} placeholder="Type your answer..." rows={3}
                  className="w-full glass rounded-xl p-3 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/50 mb-2" />
                <p className="text-[10px] text-muted-foreground">Self-assessed — be honest, then check.</p>
              </>
            )}
          </div>
          <button onClick={submitAnswer} disabled={current.question.type === 'mcq' ? picked === null : !openAnswer.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-bold disabled:opacity-40 hover:neon-glow">
            Submit Answer <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* RESULT */}
      {phase === 'result' && current && (
        <div className="space-y-3 animate-fade-in">
          <div className="glass-strong rounded-2xl p-5">
            {(() => {
              const q = current.question;
              const isCorrect = q.type === 'mcq' ? picked === q.answer : openAnswer.trim().toLowerCase().includes(String(q.answer).toLowerCase().slice(0, 4)) && openAnswer.trim().length > 2;
              return (
                <>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isCorrect ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                    {isCorrect ? <CheckCircle2 className="w-7 h-7 text-green-400" /> : <XCircle className="w-7 h-7 text-red-400" />}
                  </div>
                  <h3 className={`text-sm font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{isCorrect ? 'Correct' : 'Not quite'}</h3>
                  {q.type === 'mcq' ? (
                    <p className="text-xs text-muted-foreground mb-2">Correct answer: <strong className="text-foreground">{String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}</strong></p>
                  ) : (
                    <p className="text-xs text-muted-foreground mb-2">Key answer: <strong className="text-foreground">{q.answer}</strong></p>
                  )}
                  <div className="glass rounded-lg p-3 mt-2">
                    <p className="text-xs text-foreground/85 leading-relaxed">{q.explanation}</p>
                  </div>
                </>
              );
            })()}
          </div>
          <button onClick={next} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:neon-glow">
            {idx + 1 >= queue.length ? 'See results' : 'Next concept'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}