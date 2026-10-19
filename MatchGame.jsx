import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check, X, Zap, RotateCcw, Link2 } from 'lucide-react';

export default function MatchGame({ pairs, onComplete, xpReward = 30 }) {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [matches, setMatches] = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [wrongFlash, setWrongFlash] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const containerRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});
  const [positions, setPositions] = useState({});

  useEffect(() => {
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    setLeftItems(shuffled.map((p, i) => ({ id: i, text: p.left })));
    setRightItems([...shuffled].sort(() => Math.random() - 0.5).map((p, i) => ({ id: i, text: p.right })));
    setMatches({});
    setSelectedLeft(null);
    setCompleted(false);
  }, [pairs]);

  useEffect(() => {
    const updatePositions = () => {
      const cRect = containerRef.current?.getBoundingClientRect();
      if (!cRect) return;
      const pos = {};
      leftItems.forEach(item => {
        const el = leftRefs.current[item.id];
        if (el) {
          const r = el.getBoundingClientRect();
          pos[`l_${item.id}`] = { x: r.right - cRect.left, y: r.top + r.height / 2 - cRect.top };
        }
      });
      rightItems.forEach(item => {
        const el = rightRefs.current[item.id];
        if (el) {
          const r = el.getBoundingClientRect();
          pos[`r_${item.id}`] = { x: r.left - cRect.left, y: r.top + r.height / 2 - cRect.top };
        }
      });
      setPositions(pos);
    };
    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [leftItems, rightItems]);

  const handleLeftClick = (id) => {
    if (matches[id] !== undefined || completed) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (rightId) => {
    if (selectedLeft === null || completed) return;
    const leftItem = leftItems.find(l => l.id === selectedLeft);
    const rightItem = rightItems.find(r => r.id === rightId);
    if (!leftItem || !rightItem) return;
    const correctPair = pairs.find(p => p.left === leftItem.text);
    if (correctPair && correctPair.right === rightItem.text) {
      const newMatches = { ...matches, [selectedLeft]: rightId };
      setMatches(newMatches);
      setSelectedLeft(null);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 600);
      if (Object.keys(newMatches).length === pairs.length) {
        setCompleted(true);
        if (onComplete) setTimeout(() => onComplete(), 400);
      }
    } else {
      setWrongFlash({ left: selectedLeft, right: rightId });
      setTimeout(() => setWrongFlash(null), 600);
      setSelectedLeft(null);
    }
  };

  const reset = useCallback(() => {
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    setLeftItems(shuffled.map((p, i) => ({ id: i, text: p.left })));
    setRightItems([...shuffled].sort(() => Math.random() - 0.5).map((p, i) => ({ id: i, text: p.right })));
    setMatches({});
    setSelectedLeft(null);
    setCompleted(false);
    setWrongFlash(null);
  }, [pairs]);

  if (completed) {
    return (
      <div className="glass-strong rounded-2xl p-6 text-center animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
          <Zap className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-lg font-bold mb-1">All Matched! 🎉</h3>
        <p className="text-sm text-cyan-400 mb-3">+{xpReward} XP earned</p>
        <button onClick={reset} className="text-xs text-muted-foreground hover:text-cyan-400 flex items-center gap-1 mx-auto">
          <RotateCcw className="w-3 h-3" /> Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
        <Link2 className="w-3.5 h-3.5" />
        {selectedLeft ? 'Now tap the matching item on the right →' : 'Tap a term on the left, then tap its match'}
      </div>

      {showFeedback && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="glass-strong rounded-2xl px-6 py-3 animate-scale-in flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-sm font-bold text-green-400">Correct!</span>
          </div>
        </div>
      )}

      <div ref={containerRef} className="relative">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {Object.entries(matches).map(([leftId, rightId]) => {
            const lp = positions[`l_${leftId}`];
            const rp = positions[`r_${rightId}`];
            if (!lp || !rp) return null;
            const midX = (lp.x + rp.x) / 2;
            return (
              <path
                key={leftId}
                d={`M ${lp.x} ${lp.y} Q ${midX} ${lp.y} ${rp.x} ${rp.y}`}
                stroke="#22D3EE"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                className="animate-fade-in"
                style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.5))' }}
              />
            );
          })}
          {selectedLeft !== null && positions[`l_${selectedLeft}`] && (
            <circle
              cx={positions[`l_${selectedLeft}`].x}
              cy={positions[`l_${selectedLeft}`].y}
              r="5"
              fill="#22D3EE"
              className="animate-pulse"
            />
          )}
        </svg>

        <div className="grid grid-cols-2 gap-3 relative" style={{ zIndex: 2 }}>
          <div className="space-y-2">
            {leftItems.map(item => {
              const isMatched = matches[item.id] !== undefined;
              const isSelected = selectedLeft === item.id;
              const isWrong = wrongFlash?.left === item.id;
              return (
                <button
                  key={item.id}
                  ref={el => { leftRefs.current[item.id] = el; }}
                  onClick={() => handleLeftClick(item.id)}
                  disabled={isMatched}
                  className={`w-full text-left p-3 rounded-xl text-sm transition-all border select-none ${
                    isMatched
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : isWrong
                      ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                      : isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-400 neon-glow scale-105'
                      : 'glass border-transparent text-foreground hover:bg-cyan-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="pr-1">{item.text}</span>
                    <div className="flex items-center gap-1">
                      {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                      {isMatched && <Check className="w-4 h-4 flex-shrink-0" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            {rightItems.map(item => {
              const isMatched = Object.values(matches).includes(item.id);
              const isWrong = wrongFlash?.right === item.id;
              return (
                <button
                  key={item.id}
                  ref={el => { rightRefs.current[item.id] = el; }}
                  onClick={() => handleRightClick(item.id)}
                  disabled={isMatched}
                  className={`w-full text-left p-3 rounded-xl text-sm transition-all border select-none ${
                    isMatched
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : isWrong
                      ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                      : selectedLeft !== null
                      ? 'glass border-cyan-500/20 text-foreground hover:bg-cyan-500/10 cursor-pointer'
                      : 'glass border-transparent text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="pr-1">{item.text}</span>
                    {isMatched && <Check className="w-4 h-4 flex-shrink-0" />}
                    {isWrong && <X className="w-4 h-4 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        {Object.keys(matches).length} / {pairs.length} matched
      </div>
    </div>
  );
}