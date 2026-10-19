import React, { useMemo, useState, useEffect } from 'react';
import CyberCityStage from './CyberCityStage';
import { useTheme } from '@/lib/ThemeContext';

const MESSAGES = [
  '🤖 Welcome Future Engineer.',
  '⚙️ Every Robot Starts With One Idea.',
  "🚀 Let's Build Something Amazing Today.",
  '🧠 Curiosity Creates Innovation.',
  "🌍 Today's Lesson Can Change Tomorrow.",
];

const FACTS = [
  "NASA's Perseverance rover has travelled millions of kilometres on Mars.",
  'The first industrial robot started working in 1961.',
  'Modern cars contain over 100 microcontrollers.',
  'The word "robot" comes from the Czech word "robota".',
  'Sophia the AI robot was granted citizenship in 2017.',
  'The smallest robot in the world is smaller than a grain of rice.',
];

export default function FinalStage({ onDone }) {
  const { theme, setTheme } = useTheme();
  const [phase, setPhase] = useState(0); // 0=city, 1=logo, 2=messages
  const [explode, setExplode] = useState(false);

  const message = useMemo(() => {
    const last = localStorage.getItem('rc_last_msg');
    let pool = MESSAGES.filter(m => m !== last);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    localStorage.setItem('rc_last_msg', picked);
    return picked;
  }, []);

  const fact = useMemo(() => {
    const last = localStorage.getItem('rc_last_fact');
    let pool = FACTS.filter(f => f !== last);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    localStorage.setItem('rc_last_fact', picked);
    return picked;
  }, []);

  const particles = useMemo(() =>
    Array.from({ length: 60 }).map((_, i) => {
      const angle = (i / 60) * Math.PI * 2;
      return {
        dx: Math.cos(angle) * (150 + Math.random() * 200),
        dy: Math.sin(angle) * (150 + Math.random() * 200),
        delay: Math.random() * 0.1,
        size: Math.random() * 4 + 2,
      };
    }), []
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => setExplode(true), 4200);
    const t4 = setTimeout(onDone, 5200);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* Cyber city background */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${phase >= 1 ? 'opacity-30' : 'opacity-100'}`}>
        <CyberCityStage />
      </div>

      {/* Logo center */}
      <div className={`relative z-10 flex flex-col items-center transition-all duration-700 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} ${explode ? 'opacity-0' : ''}`}>
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-cyan-500/40 blur-3xl rounded-full animate-pulse-glow" />
          <div className="relative w-24 h-24 rounded-3xl glass-strong flex items-center justify-center neon-border animate-pulse-glow">
            <svg viewBox="0 0 24 24" fill="none" className="w-14 h-14 animate-spin-slow">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400/60" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text neon-text">RoboCraft</h1>
          <p className="text-[11px] text-cyan-200/70 mt-1 text-center">Learn Robotics. Build Robots. Control Them.</p>
        </div>
      </div>

      {/* Theme picker + Continue */}
      {phase >= 2 && !explode && (
        <div className="absolute bottom-24 w-full px-6 flex flex-col items-center gap-4 animate-fade-in">
          <p className="text-sm text-cyan-400 font-medium text-center" style={{ textShadow: '0 0 8px rgba(0,210,255,0.4)' }}>
            {message}
          </p>
          <div className="glass rounded-2xl p-4 max-w-sm w-full">
            <p className="text-[10px] text-yellow-400 font-bold mb-1 text-center">💡 DID YOU KNOW?</p>
            <p className="text-xs text-muted-foreground text-center mb-4">{fact}</p>
            <p className="text-xs font-bold text-center mb-3 text-foreground/90">Choose your theme</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white neon-glow' : 'glass text-muted-foreground hover:text-cyan-400'}`}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${theme === 'light' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white neon-glow' : 'glass text-muted-foreground hover:text-cyan-400'}`}
              >
                ☀️ Light
              </button>
            </div>
            <button
              onClick={onDone}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:neon-glow transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Explosion particles */}
      {explode && (
        <div className="absolute inset-0 flex items-center justify-center">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-cyan-400"
              style={{
                width: p.size, height: p.size,
                '--tx': `${p.dx}px`,
                '--ty': `${p.dy}px`,
                animation: `particleExplode 0.9s ease-out ${p.delay}s forwards`,
                boxShadow: '0 0 6px rgba(0,210,255,0.8)',
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes particleExplode {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}