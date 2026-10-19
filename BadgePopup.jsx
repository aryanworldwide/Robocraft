import React, { useState } from 'react';
import { Sparkles, X, Award } from 'lucide-react';

export default function BadgePopup({ badges, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!badges || badges.length === 0) return null;
  const badge = badges[currentIdx];
  const isLast = currentIdx === badges.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={isLast ? onClose : undefined}>
      <div
        className="glass-strong rounded-3xl p-8 max-w-sm w-full mx-4 text-center animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-cyan-500/10">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-glow"
             style={{ background: `${badge.color}20`, boxShadow: `0 0 30px ${badge.color}40` }}>
          <Award className="w-10 h-10" style={{ color: badge.color }} />
        </div>

        <div className="flex items-center justify-center gap-1 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Achievement Unlocked!</span>
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>

        <h2 className="text-xl font-bold mb-1" style={{ color: badge.color }}>{badge.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{badge.description}</p>

        <div className="px-4 py-2 rounded-xl bg-cyan-500/10 mb-4">
          <span className="text-sm font-bold text-cyan-400">+100 XP</span>
        </div>

        {!isLast ? (
          <button
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:neon-glow transition-all"
          >
            Next Badge →
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:neon-glow transition-all"
          >
            Awesome! 🎉
          </button>
        )}
      </div>
    </div>
  );
}
