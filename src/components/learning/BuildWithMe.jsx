import React, { useState, useRef, useEffect} from 'react';
import { aiEnabled } from '@/lib/features';
import { Wrench, Zap, Check, RotateCcw, Upload, Lightbulb, ChevronRight, Code2, Copy, Download, Wrench as WrenchIcon, Package, AlertCircle } from 'lucide-react';
import { backend } from '@/api/client';
import { BUILD_CHALLENGES, getComponentById } from '@/lib/curriculum/buildChallenges';

export default function BuildWithMe({ challengeId, onComplete, xpReward = 50 }) {
  const challenge = BUILD_CHALLENGES.find(c => c.id === challengeId) || BUILD_CHALLENGES[0];

  const [placedComponents, setPlacedComponents] = useState([]);
  const [wires, setWires] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [wiringFeedback, setWiringFeedback] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [aiHint, setAiHint] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [draggingComponent, setDraggingComponent] = useState(null);
  const canvasRef = useRef(null);

  // Initialize: auto-place first component
  useEffect(() => {
    if (placedComponents.length === 0 && challenge) {
      const firstComp = getComponentById(challenge.components[0]);
      if (firstComp) {
        setPlacedComponents([{ ...firstComp, instanceId: `${firstComp.id}_0`, x: 20, y: 30 }]);
        setCurrentStep(1);
      }
    }
  }, [challenge]);

  const addComponent = (comp) => {
    const existing = placedComponents.find(c => c.id === comp.id);
    if (existing) return;
    const newComp = { ...comp, instanceId: `${comp.id}_${placedComponents.length}`, x: 250, y: 30 + placedComponents.length * 30 };
    setPlacedComponents([...placedComponents, newComp]);
  };

  const handlePinClick = (instanceId, pinId) => {
    const pinKey = `${instanceId}:${pinId}`;
    if (!selectedPin) {
      setSelectedPin(pinKey);
      setWiringFeedback(null);
    } else if (selectedPin === pinKey) {
      setSelectedPin(null);
    } else {
      const newWire = { from: selectedPin, to: pinKey };
      const isCorrect = challenge.correctWiring.some(
        w => (w.from === newWire.from && w.to === newWire.to) ||
             (w.from === newWire.to && w.to === newWire.from)
      );
      if (isCorrect) {
        setWires([...wires, { ...newWire, correct: true }]);
        setWiringFeedback({ type: 'success', message: '✓ Correct connection! Great job!' });
        checkCompletion([...wires, { ...newWire, correct: true }]);
      } else {
        setWires([...wires, { ...newWire, correct: false }]);
        const correctWire = challenge.correctWiring.find(w =>
          w.from === newWire.from || w.to === newWire.from ||
          w.from === newWire.to || w.to === newWire.to
        );
        setWiringFeedback({
          type: 'error',
          message: getWiringError(newWire, challenge),
        });
        setTimeout(() => {
          setWires(prev => prev.filter(w => !(w.from === newWire.from && w.to === newWire.to)));
        }, 2000);
      }
      setSelectedPin(null);
    }
  };

  const getWiringError = (wire, challenge) => {
    const [fromInst, fromPin] = wire.from.split(':');
    const [toInst, toPin] = wire.to.split(':');
    const fromComp = getComponentById(fromInst.split('_')[0]);
    const toComp = getComponentById(toInst.split('_')[0]);
    const fromPinData = fromComp?.pins.find(p => p.id === fromPin);
    const toPinData = toComp?.pins.find(p => p.id === toPin);

    if (fromPinData?.type === 'power' && toPinData?.type === 'ground') {
      return '⚠️ You connected Power (+) to Ground (−)! This is a short circuit — never do this in real life!';
    }
    if (fromPinData?.type === 'ground' && toPinData?.type === 'power') {
      return '⚠️ You connected Ground (−) to Power (+)! This is a short circuit — check polarity carefully.';
    }
    return '❌ This connection is incorrect. Check the pin labels and try again.';
  };

  const checkCompletion = (allWires) => {
    const correctCount = allWires.filter(w => w.correct).length;
    if (correctCount >= challenge.correctWiring.length) {
      setCurrentStep(challenge.steps.length);
      setCompleted(true);
      if (onComplete) onComplete();
    } else {
      setCurrentStep(Math.max(currentStep, correctCount + 1));
    }
  };

  const handleReset = () => {
    setWires([]);
    setSelectedPin(null);
    setWiringFeedback(null);
    setCompleted(false);
    setCurrentStep(1);
    setSimulating(false);
    setShowCode(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(challenge.code)?.catch?.(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([challenge.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${challenge.id}.ino`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const askAI = async (question) => {
    setAiLoading(true);
    try {
      const res = await backend.integrations.Core.InvokeLLM({
        prompt: `You are a robotics build assistant helping a student build: "${challenge.title}". The student asked: "${question}". Components: ${challenge.components.join(', ')}. Wiring needed: ${JSON.stringify(challenge.correctWiring)}. Give a short, friendly, educational answer (2-3 sentences). Explain WHY, not just WHAT.`,
        response_json_schema: { type: 'object', properties: { response: { type: 'string' } } },
      });
      setAiHint(res.response || 'Keep going, you can do it!');
    } catch {
      setAiHint('Make sure each component has VCC→5V, GND→GND, and signal pins connected to the correct Arduino pins.');
    } finally {
      setAiLoading(false);
    }
  };

  const currentStepData = challenge.steps[currentStep - 1] || challenge.steps[0];
  const correctCount = wires.filter(w => w.correct).length;
  const progressPct = (correctCount / challenge.correctWiring.length) * 100;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-strong rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm">{challenge.title}</h3>
            <p className="text-[10px] text-muted-foreground">{challenge.description}</p>
          </div>
          <span className="text-[10px] glass px-2 py-1 rounded-full text-orange-400">{challenge.difficulty}</span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 glass rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px] text-muted-foreground">{correctCount} / {challenge.correctWiring.length} connections</span>
          {completed && <span className="text-[9px] text-green-400 font-bold">✓ Circuit Complete!</span>}
        </div>
      </div>

      {/* Step instruction */}
      <div className="glass rounded-xl p-3 flex items-start gap-2" style={{ border: '1px solid rgba(251,191,36,0.2)' }}>
        <div className="w-7 h-7 rounded-lg bg-yellow-500/15 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-yellow-400">{currentStep}</span>
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium">{currentStepData?.instruction}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">💡 {currentStepData?.hint}</p>
        </div>
      </div>

      {/* Component palette */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-[10px] text-muted-foreground flex-shrink-0">Components:</span>
        {challenge.components.map(compId => {
          const comp = getComponentById(compId);
          const isPlaced = placedComponents.some(c => c.id === compId);
          return (
            <button
              key={compId}
              onClick={() => !isPlaced && addComponent(comp)}
              disabled={isPlaced}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all flex-shrink-0 ${
                isPlaced ? 'glass text-muted-foreground opacity-50' : 'glass text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              <span>{comp.icon}</span>
              {comp.name}
              {!isPlaced && <ChevronRight className="w-3 h-3" />}
            </button>
          );
        })}
        <button onClick={handleReset} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium glass text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0 ml-auto">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Virtual workspace */}
      <div ref={canvasRef} className="relative glass-strong rounded-2xl overflow-hidden" style={{ minHeight: '280px', background: 'radial-gradient(circle at 50% 50%, rgba(0,210,255,0.03), transparent)' }}>
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* SVG for wires */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {wires.map((wire, i) => {
            const [fromInst, fromPin] = wire.from.split(':');
            const [toInst, toPin] = wire.to.split(':');
            const fromComp = placedComponents.find(c => c.instanceId === fromInst);
            const toComp = placedComponents.find(c => c.instanceId === toInst);
            if (!fromComp || !toComp) return null;
            const fromPinData = fromComp.pins.find(p => p.id === fromPin);
            const toPinData = toComp.pins.find(p => p.id === toPin);
            if (!fromPinData || !toPinData) return null;

            const x1 = fromComp.x + fromPinData.x;
            const y1 = fromComp.y + fromPinData.y;
            const x2 = toComp.x + toPinData.x;
            const y2 = toComp.y + toPinData.y;
            const midX = (x1 + x2) / 2;

            return (
              <g key={i}>
                <path
                  d={`M ${x1} ${y1} Q ${midX} ${Math.min(y1, y2) - 20} ${x2} ${y2}`}
                  fill="none"
                  stroke={wire.correct ? '#4ADE80' : '#EF4444'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={wire.correct ? 'animate-fade-in' : ''}
                  style={{ filter: `drop-shadow(0 0 4px ${wire.correct ? '#4ADE8080' : '#EF444480'})` }}
                />
              </g>
            );
          })}
          {/* Selected pin indicator */}
          {selectedPin && (() => {
            const [instId, pinId] = selectedPin.split(':');
            const comp = placedComponents.find(c => c.instanceId === instId);
            const pin = comp?.pins.find(p => p.id === pinId);
            if (!comp || !pin) return null;
            return (
              <circle
                cx={comp.x + pin.x}
                cy={comp.y + pin.y}
                r="8"
                fill="none"
                stroke="#00D2FF"
                strokeWidth="2"
                className="animate-pulse"
              />
            );
          })()}
        </svg>

        {/* Components */}
        {placedComponents.map(comp => (
          <div
            key={comp.instanceId}
            className="absolute glass-strong rounded-xl p-2"
            style={{ left: comp.x, top: comp.y, width: comp.width, zIndex: 2, border: `1px solid ${comp.color}30` }}
          >
            {/* Component header */}
            <div className="flex items-center gap-1.5 mb-1.5 px-1">
              <span className="text-base">{comp.icon}</span>
              <span className="text-[10px] font-bold" style={{ color: comp.color }}>{comp.name}</span>
            </div>
            {/* Pins */}
            <div className="relative" style={{ height: comp.height - 30 }}>
              {comp.pins.map(pin => {
                const pinKey = `${comp.instanceId}:${pin.id}`;
                const isSelected = selectedPin === pinKey;
                const isConnected = wires.some(w => w.from === pinKey || w.to === pinKey);
                const pinColor = pin.type === 'power' ? '#EF4444' : pin.type === 'ground' ? '#1E293B' : '#00D2FF';
                return (
                  <button
                    key={pin.id}
                    onClick={() => handlePinClick(comp.instanceId, pin.id)}
                    className="absolute flex items-center gap-1 group"
                    style={{ left: pin.x, top: pin.y, transform: 'translate(-50%, -50%)' }}
                  >
                    <div
                      className={`w-3 h-3 rounded-full transition-all border-2 ${isSelected ? 'scale-150 animate-pulse' : 'group-hover:scale-125'}`}
                      style={{
                        background: isConnected ? pinColor : 'transparent',
                        borderColor: pinColor,
                        boxShadow: isSelected ? `0 0 8px ${pinColor}` : 'none',
                      }}
                    />
                    <span className="text-[8px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{pin.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {placedComponents.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Add components from the palette above</p>
          </div>
        )}

        {/* Simulation overlay */}
        {simulating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" style={{ zIndex: 10 }}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-sm font-bold text-green-400">Simulation Running!</p>
              <p className="text-[10px] text-muted-foreground mt-1">Your circuit is working perfectly 🎉</p>
            </div>
          </div>
        )}
      </div>

      {/* Wiring feedback */}
      {wiringFeedback && (
        <div className={`glass rounded-xl p-3 flex items-start gap-2 animate-fade-in ${wiringFeedback.type === 'success' ? 'border-l-2 border-green-500' : 'border-l-2 border-red-500'}`}>
          {wiringFeedback.type === 'success' ? <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
          <p className="text-xs text-foreground/90">{wiringFeedback.message}</p>
        </div>
      )}

      {/* AI Build Assistant */}
      {aiEnabled && <div className="glass-strong rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <span className="text-[10px] font-bold text-purple-400">AI Build Assistant</span>
        </div>
        {aiHint && (
          <p className="text-xs text-foreground/90 mb-2 animate-fade-in">{aiHint}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => askAI('Explain what each component does in this circuit')} disabled={aiLoading} className="text-[9px] glass rounded-lg px-2 py-1 text-purple-400 hover:bg-purple-500/10 transition-colors disabled:opacity-50">
            Explain components
          </button>
          <button onClick={() => askAI('Why do I need to connect GND?')} disabled={aiLoading} className="text-[9px] glass rounded-lg px-2 py-1 text-purple-400 hover:bg-purple-500/10 transition-colors disabled:opacity-50">
            Why GND?
          </button>
          <button onClick={() => askAI('What happens if I connect wrong pins?')} disabled={aiLoading} className="text-[9px] glass rounded-lg px-2 py-1 text-purple-400 hover:bg-purple-500/10 transition-colors disabled:opacity-50">
            What if wrong?
          </button>
        </div>
        {aiLoading && <p className="text-[9px] text-muted-foreground mt-1.5">AI is thinking...</p>}
      </div>}

      {/* Action buttons */}
      <div className="flex gap-2">
        {!completed ? (
          <div className="flex-1 py-3 rounded-xl glass text-muted-foreground text-sm text-center flex items-center justify-center gap-2">
            <WrenchIcon className="w-4 h-4" /> Complete all wiring first
          </div>
        ) : !showCode ? (
          <button onClick={() => setShowCode(true)} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:neon-glow transition-all flex items-center justify-center gap-2 animate-pulse-glow">
            <Upload className="w-4 h-4" /> Upload & Simulate Code
          </button>
        ) : !simulating ? (
          <button onClick={() => setSimulating(true)} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold hover:neon-glow transition-all flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Run Simulation
          </button>
        ) : (
          <button onClick={handleReset} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:neon-glow transition-all flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Build Again
          </button>
        )}
      </div>

      {/* Code viewer */}
      {showCode && (
        <div className="glass-strong rounded-2xl p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400">Arduino Code</span>
            </div>
            <div className="flex items-center gap-1">
              <button aria-label="Copy" onClick={handleCopyCode} className="p-1.5 rounded-lg glass hover:bg-cyan-500/10 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
              <button aria-label="Download" onClick={handleDownloadCode} className="p-1.5 rounded-lg glass hover:bg-cyan-500/10 transition-colors tap-target">
                <Download className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>
          <pre className="text-[10px] font-mono text-foreground/90 bg-black/30 rounded-xl p-3 overflow-x-auto leading-relaxed">
            <code>{challenge.code}</code>
          </pre>
        </div>
      )}

      {/* Real hardware mode */}
      {simulating && (
        <div className="glass-strong rounded-2xl p-4 animate-slide-up" style={{ border: '1px solid rgba(74,222,128,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
              <Package className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-green-400">Now Build It For Real!</span>
              <p className="text-[9px] text-muted-foreground">You mastered the virtual circuit — build it with real hardware!</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="glass rounded-xl p-3">
              <p className="text-[10px] font-bold text-cyan-400 mb-1.5">📋 Parts List</p>
              <ul className="text-[10px] text-foreground/80 space-y-0.5">
                {challenge.realWorld.parts.map((p, i) => <li key={i}>• {p}</li>)}
              </ul>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-[10px] font-bold text-yellow-400 mb-1.5">💰 Estimated Cost</p>
              <p className="text-sm font-bold text-yellow-400">{challenge.realWorld.cost}</p>
              <p className="text-[9px] text-muted-foreground mt-1">⚠️ {challenge.realWorld.safety}</p>
            </div>
          </div>
          <div className="glass rounded-xl p-3 mt-2">
            <p className="text-[10px] font-bold text-green-400 mb-1">✅ Testing</p>
            <p className="text-[10px] text-foreground/80">{challenge.realWorld.testing}</p>
          </div>
          <div className="glass rounded-xl p-3 mt-2">
            <p className="text-[10px] font-bold text-orange-400 mb-1">🔧 Troubleshooting</p>
            <p className="text-[10px] text-foreground/80">{challenge.realWorld.troubleshooting}</p>
          </div>
        </div>
      )}
    </div>
  );
}