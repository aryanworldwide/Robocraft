import React, { useState, useEffect } from 'react';

// Real RoboCraft modules — only features that actually exist in the app.
const MODULES = [
  'Learn — Lessons & Quizzes',
  'Projects — 22 Build Guides',
  'Virtual Robotics Lab',
  'AI Lab Assistant',
  'Revision Mode',
  'Progress & Badges',
];

export default function BootModulesStage({ onDone }) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (completed >= MODULES.length) {
      const t = setTimeout(onDone, 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCompleted(c => c + 1), 140);
    return () => clearTimeout(t);
  }, [completed, onDone]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 hex-grid opacity-20" />
      <div className="absolute inset-0 grid-pattern opacity-10" />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-6">
        <h2 className="text-xs font-mono text-cyan-400/60 tracking-widest mb-4 text-center">
          ROBOTICS OS BOOT
        </h2>
        <div className="glass-strong rounded-2xl p-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {MODULES.map((mod, i) => {
              const isDone = i < completed;
              const isActive = i === completed;
              return (
                <div key={mod} className="flex items-center gap-2">
                  {isDone ? (
                    <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center animate-scale-in flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 text-green-400" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full border border-cyan-400/40 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-muted-foreground/20 flex-shrink-0" />
                  )}
                  <span className={`text-[11px] ${isDone ? 'text-foreground/80' : isActive ? 'text-cyan-400' : 'text-muted-foreground/40'}`}>
                    {mod}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
