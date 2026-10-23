import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw, X, Volume2, Globe } from 'lucide-react';

// Generic, project-free voice build assistant. Generates simple spoken guidance
// from the current canvas state (board + components + wires). ZERO AI — fully local.
export default function VoiceBuildAssistant({ components, wires, board, lang, onLangChange, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const utterRef = useRef(null);

  const boardName = board?.name || 'your board';

  // Build a friendly, ordered build script from the live canvas.
  const steps = React.useMemo(() => {
    const s = [];
    s.push(`Let's build a circuit. First, place ${boardName} on the workspace. It is the brain of your circuit.`);
    const added = components.filter(c => c.id !== board?.id);
    added.forEach((c, i) => {
      s.push(`Now add the ${c.name}. Place it next to ${boardName}.`);
    });
    if (wires.length === 0 && added.length > 0) {
      s.push(`Great! Now let's connect wires. Tap a pin on one component, then tap a pin on another to create a wire.`);
    } else if (wires.length > 0) {
      s.push(`Connect each component's VCC to power, GND to ground, and signal pins to the correct Arduino pins.`);
      s.push(`Double-check: motors must connect through a motor driver, never directly to the board.`);
    }
    s.push(`When everything is wired, press Validate to check your circuit. You're doing great!`);
    return s;
  }, [components, wires, boardName, board?.id]);

  const current = steps[stepIndex] || steps[steps.length - 1];

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    u.rate = 0.85;
    u.pitch = 1.05;
    window.speechSynthesis.speak(u);
    utterRef.current = u;
  };

  useEffect(() => {
    if (isPlaying && current) speak(current);
    else if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, [isPlaying, stepIndex, lang, current]);

  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);

  return (
    <div className="absolute top-3 right-3 z-30 w-72 max-w-[calc(100vw-1.5rem)] glass-strong rounded-2xl p-3 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-xs font-bold text-cyan-400">Voice Build Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onLangChange(lang === 'en' ? 'hi' : 'en')}
            className="text-[9px] glass px-2 py-1 rounded-lg text-cyan-400 flex items-center gap-1">
            <Globe className="w-3 h-3" /> {lang === 'en' ? 'EN' : 'हि'}
          </button>
          <button aria-label="Close" onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 tap-target">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="glass rounded-xl p-2.5 mb-2.5" style={{ border: '1px solid rgba(251,191,36,0.2)' }}>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-5 h-5 rounded-full bg-yellow-500/15 flex items-center justify-center text-[9px] font-bold text-yellow-400">{stepIndex + 1}</span>
          <span className="text-[9px] text-muted-foreground">Step {stepIndex + 1} / {steps.length}</span>
        </div>
        <p className="text-xs font-medium leading-relaxed">{current}</p>
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={() => (isPlaying ? setIsPlaying(false) : setIsPlaying(true))}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all ${isPlaying ? 'glass text-yellow-400' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'}`}>
          {isPlaying ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Play</>}
        </button>
        <button onClick={() => setStepIndex(i => Math.max(0, i - 1))} disabled={stepIndex <= 0}
          className="py-2 px-3 rounded-xl glass text-cyan-400 disabled:opacity-40 hover:bg-cyan-500/10 transition-colors text-[10px]">Prev</button>
        <button onClick={() => setStepIndex(i => Math.min(steps.length - 1, i + 1))} disabled={stepIndex >= steps.length - 1}
          className="py-2 px-3 rounded-xl glass text-cyan-400 disabled:opacity-40 hover:bg-cyan-500/10 transition-colors text-[10px]">Next</button>
        <button onClick={() => current && speak(current)} className="py-2 px-3 rounded-xl glass text-cyan-400 hover:bg-cyan-500/10 transition-colors">
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}