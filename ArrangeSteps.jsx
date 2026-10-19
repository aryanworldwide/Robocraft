import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Check, Zap, RotateCcw } from 'lucide-react';

export default function ArrangeSteps({ steps, onComplete, xpReward = 30 }) {
  const [items, setItems] = useState(() => [...steps].map((s, i) => ({ ...s, currentIdx: i })));
  const [submitted, setSubmitted] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const moveUp = (index) => {
    if (index === 0 || submitted) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);
  };

  const moveDown = (index) => {
    if (index === items.length - 1 || submitted) return;
    const newItems = [...items];
    [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    setItems(newItems);
  };

  const submit = () => {
    const correct = items.every((item, idx) => item.correctOrder === idx);
    setAllCorrect(correct);
    setSubmitted(true);
    if (correct && onComplete) onComplete();
  };

  const reset = () => {
    setItems([...steps].sort(() => Math.random() - 0.5));
    setSubmitted(false);
    setAllCorrect(false);
  };

  return (
    <div className="space-y-3">
      <div className="text-center text-xs text-muted-foreground">
        Arrange the steps in the correct order using the arrows
      </div>

      <div className="space-y-2">
        {items.map((item, index) => {
          const isCorrect = submitted && item.correctOrder === index;
          const isWrong = submitted && item.correctOrder !== index;
          return (
            <div
              key={item.id || index}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                isCorrect
                  ? 'bg-green-500/10 border-green-500/30'
                  : isWrong
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'glass border-transparent'
              }`}
            >
              <span className="w-6 h-6 rounded-lg bg-cyan-500/15 flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-sm flex-1">{item.text}</span>
              {isCorrect && <Check className="w-4 h-4 text-green-400 flex-shrink-0" />}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0 || submitted}
                  className="p-0.5 rounded hover:bg-cyan-500/10 disabled:opacity-20 transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === items.length - 1 || submitted}
                  className="p-0.5 rounded hover:bg-cyan-500/10 disabled:opacity-20 transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {submitted && (
        <div className={`glass-strong rounded-xl p-4 text-center animate-fade-in ${allCorrect ? 'border border-green-500/30' : 'border border-red-500/30'}`}>
          {allCorrect ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="font-bold text-green-400">Perfect Order!</span>
              </div>
              <p className="text-xs text-cyan-400">+{xpReward} XP earned</p>
            </>
          ) : (
            <div>
              <p className="text-sm text-red-400 font-medium mb-1">Some steps are out of order</p>
              <p className="text-xs text-muted-foreground">The correct positions are highlighted in green/red. Try again!</p>
            </div>
            )}
          {allCorrect && (
            <button onClick={reset} className="mt-2 text-xs text-muted-foreground hover:text-cyan-400 flex items-center gap-1 mx-auto">
              <RotateCcw className="w-3 h-3" /> Shuffle & Try Again
            </button>
          )}
          {!allCorrect && (
            <button onClick={reset} className="mt-2 text-xs text-cyan-400 hover:underline flex items-center gap-1 mx-auto">
              <RotateCcw className="w-3 h-3" /> Try Again
            </button>
          )}
        </div>
      )}

      {!submitted && (
        <button
          onClick={submit}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:neon-glow transition-all"
        >
          Check Order
        </button>
      )}
    </div>
  );
}