import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

function LEDSim() {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="w-20 h-20 rounded-full bg-yellow-400" style={{ animation: 'blink 1s infinite', boxShadow: '0 0 40px rgba(250,204,21,0.7)' }} />
      <p className="text-sm text-yellow-400 font-bold">LED Blinking! ⚡</p>
    </div>
  );
}

function ServoSim() {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="relative h-20 flex items-end justify-center">
        <div className="w-1 h-16 bg-green-400 rounded-full origin-bottom" style={{ animation: 'servo-sweep 2.5s ease-in-out infinite', boxShadow: '0 0 10px rgba(74,222,128,0.5)' }} />
        <div className="absolute bottom-0 w-5 h-5 rounded-full bg-green-400" />
      </div>
      <p className="text-sm text-green-400 font-bold">Servo Sweeping! ⚙️</p>
    </div>
  );
}

function MotorSim() {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="text-6xl" style={{ animation: 'spin 0.5s linear infinite' }}>🌀</div>
      <p className="text-sm text-cyan-400 font-bold">Motor Spinning! 🔄</p>
    </div>
  );
}

function BuzzerSim() {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="text-6xl" style={{ animation: 'pulse 0.3s ease-in-out infinite' }}>🔊</div>
      <p className="text-sm text-orange-400 font-bold">Playing Melody! 🎵</p>
    </div>
  );
}

function UltrasonicSim() {
  const [dist, setDist] = useState(45);
  useEffect(() => {
    const interval = setInterval(() => setDist(Math.round(10 + Math.random() * 190)), 1200);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="text-5xl">📡</div>
      <div className="glass rounded-xl px-6 py-3">
        <span className="text-2xl font-bold text-purple-400">{dist}</span>
        <span className="text-sm text-muted-foreground ml-1">cm</span>
      </div>
      <p className="text-sm text-purple-400 font-bold">Measuring Distance!</p>
    </div>
  );
}

export default function SimulationOverlay({ project, onClose }) {
  const sims = { led: LEDSim, servo: ServoSim, motor: MotorSim, buzzer: BuzzerSim, ultrasonic: UltrasonicSim };
  const Sim = sims[project.simulationType] || LEDSim;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-strong rounded-3xl p-6 max-w-sm w-full mx-4 animate-scale-in text-center">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <h3 className="font-bold text-green-400 text-sm">Simulation Running</h3>
          </div>
          <button aria-label="Close" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 tap-target">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <Sim />
        <p className="text-xs text-muted-foreground mt-2">{project.title} — working perfectly! 🎉</p>
      </div>
    </div>
  );
}
