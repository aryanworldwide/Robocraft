import React from 'react';
import { ChevronLeft, ChevronRight, Layers, RotateCcw } from 'lucide-react';

export default function FlashCardView({ card, isFlipped, onFlip, onPrev, onNext, canPrev, canNext, totalCards, currentIdx }) {
  if (!card) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <button onClick={onPrev} disabled={!canPrev} className="p-2 rounded-xl glass disabled:opacity-30 hover:bg-cyan-500/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-cyan-400" />
        </button>
        <div className="flex-1 max-w-sm" style={{ perspective: '1000px' }}>
          <div
            onClick={onFlip}
            className="relative w-full cursor-pointer"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s ease',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: '260px',
            }}
          >
            <div
              className="absolute inset-0 glass-strong rounded-3xl p-6 flex flex-col items-center justify-center text-center neon-border"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-[10px] text-cyan-400 font-medium uppercase tracking-wider mb-3">{card.category || 'Concept'}</span>
              <h3 className="text-xl font-bold mb-2">{card.front}</h3>
              <p className="text-xs text-muted-foreground mt-2">Tap to reveal</p>
            </div>
            <div
              className="absolute inset-0 glass-strong rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-cyan-500/30"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <p className="text-sm text-foreground/90 leading-relaxed">{card.back}</p>
              {card.formula && (
                <div className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <code className="text-sm text-cyan-400 font-mono">{card.formula}</code>
                </div>
              )}
            </div>
          </div>
        </div>
        <button onClick={onNext} disabled={!canNext} className="p-2 rounded-xl glass disabled:opacity-30 hover:bg-cyan-500/10 transition-colors">
          <ChevronRight className="w-5 h-5 text-cyan-400" />
        </button>
      </div>
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: totalCards }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentIdx ? 'w-6 bg-cyan-400' : i < currentIdx ? 'w-1.5 bg-green-400' : 'w-1.5 bg-slate-600'}`} />
        ))}
      </div>
      <div className="flex justify-center">
        <button onClick={onFlip} className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-cyan-400 text-sm font-medium hover:bg-cyan-500/10 transition-colors">
          <RotateCcw className="w-4 h-4" /> Flip Card
        </button>
      </div>
    </div>
  );
}
