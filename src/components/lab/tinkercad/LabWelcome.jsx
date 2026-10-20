import React from 'react';
import { aiEnabled } from '@/lib/features';
import { Sparkles, Wrench, ArrowRight } from 'lucide-react';
import { LAB_EXPERIMENTS } from '@/lib/lab/labExperiments';

const FEATURED = ['push_button', 'ultrasonic', 'ir_sensor', 'servo_sweep'];

export default function LabWelcome({ onBuildAnything, onScratch, onPickExperiment }) {
  const featured = FEATURED.map(id => LAB_EXPERIMENTS.find(e => e.id === id)).filter(Boolean);
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-5 overflow-y-auto">
      <div className="max-w-md w-full text-center my-auto">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-3">
          <Wrench className="w-7 h-7 text-cyan-400" />
        </div>
        <h2 className="text-lg font-bold mb-1">Robotics Lab</h2>
        <p className="text-xs text-muted-foreground mb-5">Build a robot, wire it, code it, and run it — all in your browser.</p>

        {/* Build Anything — large featured */}
        {aiEnabled && <button onClick={onBuildAnything}
          className="w-full flex items-center justify-between gap-2 p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:neon-glow transition-all mb-4">
          <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Build Anything</span>
          <span className="text-[10px] font-normal opacity-80 hidden sm:inline">Describe it → AI guides you</span>
          <ArrowRight className="w-4 h-4" />
        </button>}
        <p className="text-[10px] text-muted-foreground mb-2 text-left">{aiEnabled ? 'Or start with a beginner project:' : 'Start with a beginner project:'}</p>

        {/* Featured projects */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {featured.map(ex => (
            <button key={ex.id} onClick={() => onPickExperiment(ex.id)}
              className="flex items-center gap-2 p-3 rounded-2xl glass text-left hover:bg-cyan-500/10 transition-colors">
              <span className="text-xl">{ex.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">{ex.title}</div>
                <div className="text-[10px] text-muted-foreground truncate">{ex.difficulty}</div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={onScratch}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl glass text-cyan-400 text-xs font-bold hover:bg-cyan-500/10 transition-colors">
          <Wrench className="w-4 h-4" /> Start From Scratch
        </button>
      </div>
    </div>
  );
}
