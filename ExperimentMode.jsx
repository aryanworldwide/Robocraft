import React, { useState, useMemo } from 'react';
import { FlaskConical } from 'lucide-react';

function ServoExperiment() {
  const [angle, setAngle] = useState(90);
  return (
    <>
      <div className="flex items-center justify-center h-28 mb-4">
        <div className="relative" style={{ width: 80, height: 80 }}>
          <div className="absolute bottom-1/2 left-1/2 w-1 h-10 bg-cyan-400 rounded-full origin-bottom transition-transform duration-150"
            style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)`, boxShadow: '0 0 10px rgba(0,210,255,0.6)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-400 neon-glow" />
        </div>
      </div>
      <SliderRow value={angle} min={0} max={180} unit="°" onChange={setAngle} color="#00D2FF" />
      <ExperimentNote>Servo motors rotate to any angle between 0° and 180°. Perfect for robot arms and steering!</ExperimentNote>
    </>
  );
}

function MotorExperiment() {
  const [speed, setSpeed] = useState(128);
  const rpm = Math.round((speed / 255) * 3000);
  return (
    <>
      <div className="flex items-center justify-center h-28 mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-green-400/30 flex items-center justify-center"
          style={{ animation: speed > 0 ? `spin ${Math.max(0.2, 3 - (speed / 255) * 2.8)}s linear infinite` : 'none' }}>
          <div className="w-10 h-10 rounded-full bg-green-500/30 border-2 border-green-400 flex items-center justify-center text-2xl">⚙️</div>
        </div>
      </div>
      <SliderRow value={speed} min={0} max={255} unit="" label="PWM" onChange={setSpeed} color="#4ADE80" />
      <ExperimentNote>PWM value {speed} = {rpm} RPM. Higher PWM = faster motor. At 0, the motor stops completely.</ExperimentNote>
    </>
  );
}

function LEDExperiment() {
  const [brightness, setBrightness] = useState(128);
  return (
    <>
      <div className="flex items-center justify-center h-28 mb-4">
        <div className="w-16 h-16 rounded-full transition-all duration-150"
          style={{
            background: `radial-gradient(circle, rgba(245,158,11,${brightness / 255}) 0%, rgba(245,158,11,${(brightness / 255) * 0.3}) 70%, transparent 100%)`,
            boxShadow: brightness > 0 ? `0 0 ${brightness / 5}px rgba(245,158,11,${brightness / 255})` : 'none',
          }} />
      </div>
      <SliderRow value={brightness} min={0} max={255} unit="" label="PWM" onChange={setBrightness} color="#F59E0B" />
      <ExperimentNote>PWM controls LED brightness. At 255 it's fully bright, at 0 it's off. This is how dimmers work!</ExperimentNote>
    </>
  );
}

function UltrasonicExperiment() {
  const [distance, setDistance] = useState(100);
  const danger = distance < 20;
  const warning = distance >= 20 && distance < 50;
  return (
    <>
      <div className="flex items-center justify-center h-28 mb-4 relative overflow-hidden">
        <div className="flex items-center gap-1">
          <div className="text-2xl">📡</div>
          <div className="relative h-1 bg-cyan-500/20 rounded-full transition-all duration-150" style={{ width: Math.min(distance / 4, 100) }}>
            <div className="absolute -right-2 -top-3 text-sm" style={{ color: danger ? '#EF4444' : warning ? '#F59E0B' : '#4ADE80' }}>
              {danger ? '🚧' : '🤖'}
            </div>
          </div>
        </div>
      </div>
      <SliderRow value={distance} min={2} max={400} unit="cm" onChange={setDistance} color="#A78BFA" />
      <ExperimentNote>
        {danger ? '⚠️ Too close! Robot would STOP to avoid collision.' : warning ? '⚡ Getting close — robot would SLOW DOWN.' : '✅ Safe distance — robot keeps moving forward.'}
      </ExperimentNote>
    </>
  );
}

function SliderRow({ value, min, max, unit, label, onChange, color }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label || min}{label ? '' : unit}</span>
        <span className="text-sm font-bold" style={{ color }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: color }} />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

function ExperimentNote({ children }) {
  return <p className="text-[10px] text-muted-foreground text-center mt-3 leading-relaxed">{children}</p>;
}

export default function ExperimentMode({ lesson, onComplete, xpReward = 40 }) {
  const experimentType = useMemo(() => {
    const id = lesson.id.toLowerCase();
    const title = lesson.title.toLowerCase();
    if (id.includes('servo') || title.includes('servo')) return 'servo';
    if (id.includes('motor') || title.includes('motor') || id.includes('dc')) return 'motor';
    if (id.includes('ultrasonic') || id.includes('sensor') || title.includes('distance')) return 'ultrasonic';
    return 'led';
  }, [lesson]);

  const experiments = {
    servo: <ServoExperiment />,
    motor: <MotorExperiment />,
    led: <LEDExperiment />,
    ultrasonic: <UltrasonicExperiment />,
  };

  return (
    <div className="glass-strong rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
          <FlaskConical className="w-4 h-4 text-green-400" />
        </div>
        <span className="text-xs font-bold text-green-400">🧪 Experiment Mode — +{xpReward} XP</span>
        <span className="text-[10px] text-muted-foreground ml-auto">Move slider → Observe!</span>
      </div>
      {experiments[experimentType]}
    </div>
  );
}