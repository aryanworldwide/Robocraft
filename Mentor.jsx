import React from 'react';
import AIMentor from '@/components/learning/AIMentor';

export default function Mentor() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="text-center mb-6 animate-slide-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
          <span className="text-3xl">🤖</span>
        </div>
        <h1 className="text-2xl font-bold gradient-text">RoboMentor</h1>
        <p className="text-sm text-muted-foreground mt-1">Your personal AI robotics teacher</p>
      </div>
      <AIMentor />
    </div>
  );
}
