import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Layers, Check } from 'lucide-react';

export default function FlashCards({ cards, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(new Set());
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    if (reviewed.size === cards.length && onComplete) {
      onComplete();
    }
  }, [reviewed.size]);

  const handleStart = (clientX) => {
    setDragStart(clientX);
    setDragOffset(0);
  };

  const handleMove = (clientX) => {
    if (dragStart !== null) {
      setDragOffset(clientX - dragStart);
    }
  };

  const handleEnd = () => {
    if (Math.abs(dragOffset) > 80) {
      if (dragOffset > 0 && currentIdx > 0) {
        setCurrentIdx(currentIdx - 1);
      } else if (dragOffset < 0 && currentIdx < cards.length - 1) {
        setCurrentIdx(currentIdx + 1);
      }
    }
    setDragStart(null);
    setDragOffset(0);
  };

  const next = () => {
    if (currentIdx < cards.length - 1) {
      setFlipped(false);
      setTimeout(() => setCurrentIdx(currentIdx + 1), 150);
    }
  };

  const prev = () => {
    if (currentIdx > 0) {
      setFlipped(false);
      setTimeout(() => setCurrentIdx(currentIdx - 1), 150);
    }
  };

  const flip = () => {
    if (!flipped) {
      const newReviewed = new Set(reviewed);
      newReviewed.add(currentIdx);
      setReviewed(newReviewed);
    }
    setFlipped(!flipped);
  };

  if (!cards || cards.length === 0) return null;
  const card = cards[currentIdx];

  const rotateStyle = {
    transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
    transition: dragStart === null ? 'transform 0.3s ease' : 'none',
  };

  return (
    <div className="space-y-4">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {cards.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIdx ? 'w-6 bg-cyan-400' : reviewed.has(i) ? 'w-1.5 bg-green-400' : 'w-1.5 bg-slate-600'
            }`}
          />
        ))}
      </div>

      {/* Card counter */}
      <div className="text-center text-xs text-muted-foreground">
        {currentIdx + 1} / {cards.length}
      </div>

      {/* Flash card */}
      <div className="flex items-center justify-center gap-2">
        <button aria-label="Back"
          onClick={prev}
          disabled={currentIdx === 0}
          className="p-2 rounded-xl glass disabled:opacity-30 hover:bg-cyan-500/10 transition-colors tap-target"
        >
          <ChevronLeft className="w-5 h-5 text-cyan-400" />
        </button>

        <div
          ref={cardRef}
          className="flex-1 max-w-sm"
          style={{ perspective: '1000px', ...rotateStyle }}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={dragStart !== null ? (e) => handleMove(e.clientX) : undefined}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
        >
          <div
            onClick={flip}
            className="relative w-full cursor-pointer"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s ease',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: '280px',
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 glass-strong rounded-3xl p-6 flex flex-col items-center justify-center text-center neon-border"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-[10px] text-cyan-400 font-medium uppercase tracking-wider mb-3">Concept</span>
              <h3 className="text-xl font-bold mb-2">{card.front}</h3>
              {card.hint && <p className="text-xs text-muted-foreground mt-2">Tap to reveal</p>}
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 glass-strong rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-cyan-500/30"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              {card.category && (
                <span className="text-[10px] text-purple-400 font-medium uppercase tracking-wider mb-3">{card.category}</span>
              )}
              <p className="text-sm text-foreground/90 leading-relaxed">{card.back}</p>
              {card.formula && (
                <div className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <code className="text-sm text-cyan-400 font-mono">{card.formula}</code>
                </div>
              )}
              {reviewed.has(currentIdx) && (
                <div className="absolute top-3 right-3">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        <button aria-label="Next"
          onClick={next}
          disabled={currentIdx === cards.length - 1}
          className="p-2 rounded-xl glass disabled:opacity-30 hover:bg-cyan-500/10 transition-colors tap-target"
        >
          <ChevronRight className="w-5 h-5 text-cyan-400" />
        </button>
      </div>

      {/* Flip button */}
      <div className="flex justify-center">
        <button
          onClick={flip}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-cyan-400 text-sm font-medium hover:bg-cyan-500/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Flip Card
        </button>
      </div>
    </div>
  );
}