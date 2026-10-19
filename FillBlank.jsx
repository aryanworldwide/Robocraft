import React, { useState } from 'react';
import { Check, X, Zap, RotateCcw } from 'lucide-react';

export default function FillBlank({ questions, onComplete, xpReward = 30 }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [allDone, setAllDone] = useState(false);

  const question = questions[currentIdx];

  const submit = () => {
    const correct = answer.toLowerCase().trim() === question.answer.toLowerCase();
    setIsCorrect(correct);
    setSubmitted(true);
    if (correct) setCorrectCount(correctCount + 1);
  };

  const next = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setAnswer('');
      setSubmitted(false);
      setIsCorrect(false);
    } else {
      setAllDone(true);
      if (onComplete) onComplete();
    }
  };

  const reset = () => {
    setCurrentIdx(0);
    setAnswer('');
    setSubmitted(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setAllDone(false);
  };

  if (allDone) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="glass-strong rounded-2xl p-6 text-center animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-cyan-500/15 flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
          <Zap className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="text-lg font-bold mb-1">Challenge Complete!</h3>
        <p className="text-sm text-muted-foreground mb-2">{correctCount} / {questions.length} correct</p>
        <p className="text-sm text-cyan-400 mb-3">+{xpReward} XP earned</p>
        <button onClick={reset} className="text-xs text-muted-foreground hover:text-cyan-400 flex items-center gap-1 mx-auto">
          <RotateCcw className="w-3 h-3" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Quick Challenge</span>
        <span>{currentIdx + 1} / {questions.length}</span>
      </div>
      <div className="h-1.5 glass rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="glass-strong rounded-2xl p-4">
        <p className="text-sm font-medium leading-relaxed">{question.prompt}</p>
        {question.hint && (
          <p className="text-xs text-muted-foreground mt-2">💡 Hint: {question.hint}</p>
        )}
      </div>

      {/* Input */}
      <input
        type="text"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !submitted && answer && submit()}
        disabled={submitted}
        placeholder="Type your answer..."
        className={`w-full glass-strong rounded-xl p-4 text-sm focus:outline-none transition-all border ${
          submitted
            ? isCorrect
              ? 'border-green-500/50 text-green-400'
              : 'border-red-500/50 text-red-400'
            : 'border-transparent focus:border-cyan-500/50'
        }`}
      />

      {/* Feedback */}
      {submitted && (
        <div className={`glass-strong rounded-xl p-4 animate-fade-in ${isCorrect ? 'border border-green-500/30' : 'border border-red-500/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            {isCorrect ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
            <span className={`text-sm font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Correct!' : 'Not quite!'}
            </span>
          </div>
          {!isCorrect && (
            <p className="text-xs text-green-400 mt-1">Correct answer: <span className="font-bold">{question.answer}</span></p>
          )}
          {question.explanation && (
            <p className="text-xs text-muted-foreground mt-1">{question.explanation}</p>
          )}
        </div>
      )}

      {/* Action */}
      {!submitted ? (
        <button
          onClick={submit}
          disabled={!answer.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm disabled:opacity-40 hover:neon-glow transition-all"
        >
          Submit
        </button>
      ) : (
        <button
          onClick={next}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:neon-glow transition-all"
        >
          {currentIdx < questions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  );
}