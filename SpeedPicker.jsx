import React from 'react';
import { Check, Gauge } from 'lucide-react';

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export default function SpeedPicker({ open, currentRate, onSelect, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />
      <div
        className="relative glass-strong rounded-t-3xl p-5 w-full max-w-md animate-slide-up"
        onClick={e => e.stopPropagation()}
        style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
      >
        <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm">Playback Speed</h3>
        </div>
        <div className="space-y-2">
          {SPEEDS.map(speed => (
            <button
              key={speed}
              onClick={() => onSelect(speed)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                currentRate === speed
                  ? 'bg-cyan-500/15 border border-cyan-500/50 text-cyan-400'
                  : 'glass hover:bg-cyan-500/10'
              }`}
            >
              <span className="text-sm font-medium">{speed}x</span>
              {currentRate === speed && <Check className="w-4 h-4 text-cyan-400" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
