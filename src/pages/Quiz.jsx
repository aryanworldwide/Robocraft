import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { getQuizForLesson, shuffle } from '@/lib/curriculum';
import { XP_REWARDS } from '@/lib/gamification';
import { ArrowLeft, Check, X, Trophy, RotateCcw, ChevronRight, Target, Coins, Zap } from 'lucide-react';
import Confetti from '@/components/learning/Confetti';
import { isPro } from '@/lib/uiMode';

// Typo-tolerant fill-in-the-blank matching: exact after normalization, or a
// Levenshtein distance within a small length-based tolerance.
const normalize = (s) => (s || '').toString().toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m || !n) return Math.max(m, n);
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}
function fillMatches(given, expected) {
  const g = normalize(given), e = normalize(expected);
  if (!g) return false;
  if (g === e) return true;
  const tol = e.length <= 5 ? 1 : e.length <= 10 ? 2 : 3;
  return levenshtein(g, e) <= tol;
}

const correctTextFor = (q) =>
  q.type === 'fill' ? q.answer : (q.options ? q.options[q.answer] : '—');

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedClass, recordQuizScore } = useApp();
  const allQuestions = useMemo(() => getQuizForLesson(selectedClass, id), [selectedClass, id]);

  // Generate a randomized quiz once per mount
  const initialQuestions = useMemo(() => {
    if (!allQuestions || allQuestions.length === 0) return [];
    const selected = shuffle(allQuestions).slice(0, Math.min(10, allQuestions.length));
    return selected.map(q => {
      if (q.type === 'tf' && !Array.isArray(q.options)) {
        const isTrue = q.answer === true || q.answer === 'true' || q.answer === 0;
        return { ...q, options: ['True', 'False'], answer: isTrue ? 0 : 1 };
      }
      if (q.type === 'mcq') {
        const indexed = q.options.map((opt, i) => ({ opt, isCorrect: i === q.answer }));
        const shuffled = shuffle(indexed);
        return { ...q, options: shuffled.map(s => s.opt), answer: shuffled.findIndex(s => s.isCorrect) };
      }
      return q;
    });
  }, [allQuestions]);

  const [quizQuestions, setQuizQuestions] = useState(initialQuestions);
  const [practiceMode, setPracticeMode] = useState(false); // retry-wrong runs don't re-record XP
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!allQuestions || allQuestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">No quiz available for this lesson yet.</p>
        <button onClick={() => navigate('/learn')} className="text-cyan-400 mt-2">Back to Learn</button>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentIdx];
  const isLastQuestion = currentIdx === quizQuestions.length - 1;

  const isAnswered = () => currentQuestion.type === 'fill'
    ? selectedAnswer !== null && selectedAnswer !== ''
    : selectedAnswer !== null;

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelectedAnswer(idx);
  };

  const handleSubmit = () => {
    if (!isAnswered()) return;
    const correct = currentQuestion.type === 'fill'
      ? fillMatches(selectedAnswer, currentQuestion.answer)
      : selectedAnswer === currentQuestion.answer;
    setShowResult(true);
    setAnswers([...answers, { questionIdx: currentIdx, selected: selectedAnswer, correct }]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const score = answers.filter(a => a.correct).length;
      if (!practiceMode) recordQuizScore(selectedClass, id, score, quizQuestions.length);
      setShowSummary(true);
      if (score / quizQuestions.length >= 0.6 && !isPro(selectedClass)) setShowConfetti(true);
    } else {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetRun = (questions) => {
    setQuizQuestions(questions);
    setCurrentIdx(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowSummary(false);
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setPracticeMode(false);
    resetRun(initialQuestions);
  };

  const handleRetryWrong = () => {
    const wrong = answers.filter(a => !a.correct).map(a => initialQuestions[a.questionIdx] || quizQuestions[a.questionIdx]);
    if (!wrong.length) return;
    setPracticeMode(true);
    resetRun(shuffle(wrong));
  };

  const wrongCount = answers.filter(a => !a.correct).length;

  // Summary screen
  if (showSummary) {
    const score = answers.filter(a => a.correct).length;
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const xpEarned = practiceMode ? 0
      : score * XP_REWARDS.QUIZ_QUESTION + (percentage === 100 ? XP_REWARDS.QUIZ_PERFECT : 0);
    const coinsEarned = practiceMode ? 0 : score * 2;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div className="glass-strong rounded-3xl p-8 text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <Trophy className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-2">{practiceMode ? 'Practice Complete!' : 'Quiz Complete!'}</h2>
          <p className="text-sm text-muted-foreground mb-6">You scored {score} out of {quizQuestions.length}</p>

          {/* Score circle */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg width="128" height="128" className="-rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(0,210,255,0.1)" strokeWidth="10" />
              <circle
                cx="64" cy="64" r="56" fill="none"
                stroke="url(#quizGradient)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 56}
                strokeDashoffset={2 * Math.PI * 56 - (percentage / 100) * 2 * Math.PI * 56}
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
              <defs>
                <linearGradient id="quizGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D2FF" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-cyan-400">{percentage}%</span>
              <span className="text-[10px] text-muted-foreground">Score</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Correct</p>
              <p className="text-lg font-bold text-green-400">{score}</p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Wrong</p>
              <p className="text-lg font-bold text-red-400">{quizQuestions.length - score}</p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Accuracy</p>
              <p className="text-lg font-bold text-cyan-400">{percentage}%</p>
            </div>
          </div>

          {/* XP / coins earned */}
          {!practiceMode && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="glass px-3 py-1.5 rounded-full text-xs font-bold text-cyan-400 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> +{xpEarned} XP</span>
              <span className="glass px-3 py-1.5 rounded-full text-xs font-bold text-yellow-400 flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> +{coinsEarned} coins</span>
            </div>
          )}

          {/* Review answers */}
          <div className="text-left space-y-2 mb-6 max-h-72 overflow-y-auto">
            {answers.map((a, i) => {
              const q = quizQuestions[a.questionIdx];
              if (!q) return null;
              return (
                <div key={i} className="glass rounded-xl p-3.5 text-sm">
                  <div className="flex items-start gap-2.5">
                    {a.correct
                      ? <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      : <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium mb-1.5">{q.q}</p>
                      {!a.correct && (
                        <>
                          <p className="text-[11px] text-red-400/90">
                            Your answer: <span className="font-medium">{q.type === 'fill' ? a.selected : q.options?.[a.selected] ?? '—'}</span>
                          </p>
                          <p className="text-[11px] text-green-400/90">
                            Correct: <span className="font-medium">{correctTextFor(q)}</span>
                          </p>
                        </>
                      )}
                      {q.explanation && (
                        <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">{q.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            {wrongCount > 0 && (
              <button onClick={handleRetryWrong} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:neon-glow transition-all flex items-center justify-center gap-2">
                <Target className="w-4 h-4" /> Retry {wrongCount} Wrong {wrongCount === 1 ? 'Answer' : 'Answers'}
              </button>
            )}
            <div className="flex gap-3">
              <button onClick={handleRestart} className="flex-1 py-3 rounded-xl glass text-cyan-400 font-medium hover:bg-cyan-500/15 transition-colors flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> Full Retry
              </button>
              <button onClick={() => navigate('/learn')} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:neon-glow transition-all">
                Back to Learn
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz question screen
  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-slide-up">
        <button onClick={() => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate(`/lesson/${id}`))} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>
        <span className="text-xs glass px-3 py-1 rounded-full text-cyan-400 font-medium">
          {currentIdx + 1} / {quizQuestions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 glass rounded-full overflow-hidden mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentIdx + (showResult ? 1 : 0)) / quizQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="glass-strong rounded-2xl p-5 mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium glass text-cyan-400">
            {currentQuestion.type === 'mcq' ? 'Multiple Choice' : currentQuestion.type === 'tf' ? 'True / False' : 'Fill in the Blank'}
          </span>
        </div>
        <h2 className="text-base font-semibold leading-relaxed">{currentQuestion.q}</h2>
      </div>

      {/* Answers */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        {currentQuestion.type === 'fill' ? (
          <input
            type="text"
            value={selectedAnswer || ''}
            onChange={e => setSelectedAnswer(e.target.value)}
            disabled={showResult}
            placeholder="Type your answer..."
            className={`w-full glass-strong rounded-xl p-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all ${
              showResult
                ? (fillMatches(selectedAnswer, currentQuestion.answer) ? 'border-green-500/50' : 'border-red-500/50')
                : ''
            }`}
          />
        ) : (
          currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentQuestion.answer;
            let style = 'glass hover:bg-cyan-500/10 text-foreground';

            if (showResult) {
              if (isCorrect) style = 'bg-green-500/15 border-green-500/50 text-green-400';
              else if (isSelected) style = 'bg-red-500/15 border-red-500/50 text-red-400';
              else style = 'glass text-muted-foreground';
            } else if (isSelected) {
              style = 'bg-cyan-500/15 border-cyan-500/50 text-cyan-400';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${style}`}
              >
                <span className="text-sm">{opt}</span>
                {showResult && isCorrect && <Check className="w-4 h-4 text-green-400" />}
                {showResult && isSelected && !isCorrect && <X className="w-4 h-4 text-red-400" />}
              </button>
            );
          })
        )}
      </div>

      {/* Per-question feedback */}
      {showResult && (
        <div className={`glass-strong rounded-xl p-4 mt-4 animate-fade-in border-l-2 ${answers[answers.length - 1]?.correct ? 'border-green-500' : 'border-red-500'}`}>
          <p className="text-sm font-bold mb-1 flex items-center gap-1.5">
            {answers[answers.length - 1]?.correct
              ? <><Check className="w-4 h-4 text-green-400" /> Correct!</>
              : <><X className="w-4 h-4 text-red-400" /> Not quite — the answer is <span className="text-green-400">{correctTextFor(currentQuestion)}</span></>}
          </p>
          {currentQuestion.explanation && (
            <p className="text-xs text-foreground/80 leading-relaxed mt-1">
              {currentQuestion.explanation}
            </p>
          )}
        </div>
      )}

      {/* Action button */}
      <div className="mt-6">
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!isAnswered()}
            className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:neon-glow transition-all"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:neon-glow transition-all flex items-center justify-center gap-2"
          >
            {isLastQuestion ? 'See Results' : 'Next Question'} <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}