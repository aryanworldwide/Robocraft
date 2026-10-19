import React from 'react';
import { Zap } from 'lucide-react';

export default function LevelUpPopup({ level, onClose }) {
  if (!level) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="glass-strong rounded-3xl p-8 max-w-sm w-full mx-4 text-center animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-glow"
             style={{ background: `${level.color}20`, boxShadow: `0 0 40px ${level.color}40` }}>
          <span className="text-3xl font-bold" style={{ color: level.color }}>{level.level}</span>
        </div>

        <div className="flex items-center justify-center gap-1 mb-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Level Up!</span>
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>

        <h2 className="text-2xl font-bold mb-1" style={{ color: level.color }}>{level.title}</h2>
        <p className="text-sm text-muted-foreground mb-4">You've reached Level {level.level}!</p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:neon-glow transition-all"
        >
          Continue Learning 🚀
        </button>
      </div>
    </div>
  );
}
