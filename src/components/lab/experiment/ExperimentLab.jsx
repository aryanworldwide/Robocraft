import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getComponentById } from '@/lib/circuit/components';
import { validateAll } from '@/lib/lab/validateConnections';
import { sanitizeCode } from '@/lib/buildsheet/sanitizeCode';
import Workbench from '@/components/lab/experiment/Workbench';
import Simulator from '@/components/lab/experiment/Simulator';
import {
  ChevronLeft, CheckCircle2, AlertCircle, AlertTriangle, Lock, Cpu, Code2, Play,
  Volume2, VolumeX, Copy, Check, Download, Sparkles, Zap, ArrowRight, Trash2, BookOpen,
} from 'lucide-react';

// Build component instances with auto-placement positions.
function buildInstances(experiment) {
  const boardDef = getComponentById(experiment.board);
  const instances = [];
  // board on the left
  instances.push({
    ...boardDef, instanceId: `${boardDef.id}_0`, x: 24, y: 40,
  });
  // other components arranged in columns to the right
  const counts = {};
  experiment.components.forEach((c, i) => {
    counts[c.id] = (counts[c.id] || 0);
    const def = getComponentById(c.id);
    const idx = counts[c.id]++;
    const col = Math.floor(i / 3);
    const row = i % 3;
    const x = 250 + col * (def.width + 30);
    const y = 20 + row * (def.height + 30);
    instances.push({ ...def, instanceId: `${def.id}_${idx}`, x, y, role: c.role });
  });
  return instances;
}

const STAGES = [
  { id: 'wiring', label: 'Wiring', icon: Zap },
  { id: 'program', label: 'Programming', icon: Code2 },
  { id: 'simulate', label: 'Simulation', icon: Play },
];

export default function ExperimentLab({ experiment, onExit }) {
  const components = useMemo(() => buildInstances(experiment), [experiment]);
  const [wires, setWires] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [selectedWire, setSelectedWire] = useState(null);
  const [stage, setStage] = useState('wiring');
  const [feedback, setFeedback] = useState(null);
  const [voiceOn, setVoiceOn] = useState(false);
  const [lang, setLang] = useState('en');
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const fbTimer = useRef(null);

  const validation = useMemo(
    () => validateAll(wires, experiment.requiredConnections, components),
    [wires, experiment, components]
  );

  // voice guidance: speak the current build step
  const voiceStep = useMemo(() => {
    const idx = Math.min(validation.correctCount, experiment.voiceSteps.length - 1);
    return experiment.voiceSteps[idx];
  }, [validation.correctCount, experiment]);

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/(?:💡|🔘|⚙️|👁️|📡|🤖|🧱|🚧|📦)/gu, ''));
    u.rate = 0.85; u.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    if (voiceOn) speak(voiceStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceStep, voiceOn, lang]);

  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);

  const handlePinClick = (instanceId, pinId) => {
    if (stage !== 'wiring') return;
    const key = `${instanceId}:${pinId}`;
    if (!selectedPin) { setSelectedPin(key); setSelectedWire(null); setFeedback(null); return; }
    if (selectedPin === key) { setSelectedPin(null); return; }
    const exists = wires.some(w =>
      (w.from === selectedPin && w.to === key) || (w.from === key && w.to === selectedPin));
    if (!exists) {
      const result = validateAll(
        [...wires, { from: selectedPin, to: key }],
        experiment.requiredConnections, components
      );
      const last = result.results[result.results.length - 1];
      const nw = [...wires, { from: selectedPin, to: key, status: last.status, message: last.message }];
      setWires(nw);
      setFeedback({ status: last.status, message: last.message });
      if (voiceOn) speak(last.message);
      clearTimeout(fbTimer.current);
      fbTimer.current = setTimeout(() => setFeedback(null), 4000);
    }
    setSelectedPin(null);
  };

  const handleWireClick = (idx) => { setSelectedWire(selectedWire === idx ? null : idx); setSelectedPin(null); };
  const deleteWire = () => {
    if (selectedWire == null) return;
    setWires(wires.filter((_, i) => i !== selectedWire));
    setSelectedWire(null);
  };

  const clearWires = () => { setWires([]); setSelectedPin(null); setSelectedWire(null); setFeedback(null); };

  const handleCopy = () => { navigator.clipboard?.writeText(sanitizeCode(experiment.code))?.catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleDownload = () => {
    const blob = new Blob([sanitizeCode(experiment.code)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `${experiment.id}.ino`; a.click(); URL.revokeObjectURL(url);
  };

  const wiringComplete = validation.complete;
  const selWire = selectedWire != null ? wires[selectedWire] : null;

  return (
    <div className="fixed inset-x-0 flex flex-col" style={{ top: 'calc(4rem + env(safe-area-inset-top))', bottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2.5 glass-strong z-30 border-b border-cyan-500/10">
        <button onClick={onExit} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-cyan-400 transition-colors tap-target">
          <ChevronLeft className="w-4 h-4" /> Experiments
        </button>
        <div className="flex items-center gap-2">
          <span className="text-base">{experiment.icon}</span>
          <span className="text-xs font-bold text-cyan-400">{experiment.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setVoiceOn(v => !v)}
            className={`p-1.5 rounded-lg ${voiceOn ? 'glass text-cyan-400 neon-glow' : 'glass text-muted-foreground'}`}>
            {voiceOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          {voiceOn && (
            <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
              className="text-[9px] glass px-1.5 py-1 rounded-lg text-cyan-400 font-bold">
              {lang === 'en' ? 'EN' : 'हिं'}
            </button>
          )}
        </div>
      </div>

      {/* Stage indicator */}
      <div className="flex items-center justify-center gap-1 px-3 py-2 glass border-b border-cyan-500/5">
        {STAGES.map((s, i) => {
          const active = stage === s.id;
          const unlocked = stage === 'wiring' ? true
            : stage === 'program' ? wiringComplete
              : wiringComplete;
          const passed = STAGES.findIndex(x => x.id === stage) > i;
          return (
            <React.Fragment key={s.id}>
              <button onClick={() => { if ((s.id === 'wiring') || wiringComplete) setStage(s.id); }}
                disabled={!unlocked && s.id !== 'wiring'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  active ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white neon-glow'
                  : passed ? 'glass text-green-400'
                  : unlocked ? 'glass text-cyan-400'
                  : 'glass text-muted-foreground/40'
                }`}>
                {!unlocked && s.id !== 'wiring' ? <Lock className="w-3 h-3" /> : <s.icon className="w-3 h-3" />}
                {s.label}
              </button>
              {i < STAGES.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground/40" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: components / checklist */}
        <div className="hidden md:flex flex-col w-52 glass border-r border-cyan-500/10 p-3 overflow-y-auto">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
            <Cpu className="w-3 h-3" /> Components
          </h3>
          <div className="space-y-1.5">
            {components.map(c => (
              <div key={c.instanceId} className="flex items-center gap-2 glass rounded-lg px-2.5 py-2">
                <span className="text-lg">{c.icon}</span>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold truncate">{c.name}</div>
                  {c.role && <div className="text-[9px] text-muted-foreground truncate">{c.role}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-cyan-500/10">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Pin Legend</h3>
            <div className="space-y-1">
              {[['Power', '#EF4444'], ['Ground', '#94A3B8'], ['Digital', '#00D2FF'], ['PWM', '#3B82F6'], ['Analog', '#A78BFA'], ['Signal', '#4ADE80']].map(([l, c]) => (
                <div key={l} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} /> {l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: stage content */}
        <div className="flex-1 flex flex-col p-3 overflow-hidden">
          {stage === 'wiring' && (
            <>
              <div className="flex-1 min-h-0">
                <Workbench
                  components={components} wires={wires}
                  selectedPin={selectedPin} selectedWire={selectedWire}
                  onPinClick={handlePinClick} onWireClick={handleWireClick}
                  onCanvasClick={() => { setSelectedPin(null); setSelectedWire(null); }}
                />
              </div>
              {/* mobile component strip */}
              <div className="md:hidden flex items-center gap-2 overflow-x-auto py-2">
                {components.map(c => (
                  <div key={c.instanceId} className="flex items-center gap-1 glass rounded-lg px-2 py-1 flex-shrink-0">
                    <span>{c.icon}</span>
                    <span className="text-[10px]">{c.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {stage === 'program' && (
            <div className="flex-1 overflow-y-auto">
              <div className="glass-strong rounded-2xl p-4 mb-3 border-l-2 border-green-500 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-green-400">Great! Your circuit is ready.</h3>
                  <p className="text-xs text-muted-foreground mt-1">Now let's program your robot. The code below matches your exact wiring.</p>
                </div>
              </div>

              <div className="glass-strong rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2"><Code2 className="w-4 h-4" /> Arduino Code</h3>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setShowHelp(s => !s)}
                      className="flex items-center gap-1 text-[11px] glass px-2.5 py-1.5 rounded-lg text-purple-400 hover:bg-purple-500/10">
                      <Sparkles className="w-3 h-3" /> Help me write the code
                    </button>
                    <button aria-label="Copy" onClick={handleCopy} className="flex items-center gap-1 text-[11px] glass px-2.5 py-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10">
                      {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-1 text-[11px] glass px-2.5 py-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10">
                      <Download className="w-3 h-3" /> .ino
                    </button>
                  </div>
                </div>
                <pre className="glass rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-cyan-300/90 leading-relaxed">
                  <code>{sanitizeCode(experiment.code)}</code>
                </pre>
                {showHelp && (
                  <div className="mt-3 glass rounded-xl p-3 border-l-2 border-purple-500 animate-slide-up">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[11px] font-bold text-purple-400">Code Explanation</span>
                    </div>
                    <p className="text-xs text-foreground/85 leading-relaxed">{experiment.codeExplanation}</p>
                  </div>
                )}
              </div>

              <button onClick={() => setStage('simulate')}
                className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:neon-glow transition-all">
                <Play className="w-4 h-4" /> Start Simulation
              </button>
            </div>
          )}

          {stage === 'simulate' && (
            <div className="flex-1 overflow-y-auto">
              <Simulator sim={experiment.sim} />
              <div className="glass rounded-2xl p-3 mt-3 flex items-start gap-2">
                <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground">
                  This simulation runs 100% locally — no internet or AI calls. It reacts to your inputs just like the real circuit would.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: info / validation dock */}
        <div className="hidden lg:flex flex-col w-64 glass border-l border-cyan-500/10 p-3 overflow-y-auto">
          {stage === 'wiring' && (
            <>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Current Step</h3>
              <div className="glass-strong rounded-xl p-3 mb-3 text-xs text-foreground/90 leading-relaxed">
                {voiceStep}
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Connections</h3>
              <div className="glass-strong rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-cyan-400">Progress</span>
                  <span className="text-xs font-bold">{validation.correctCount}/{validation.total}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all"
                    style={{ width: `${(validation.correctCount / validation.total) * 100}%` }} />
                </div>
                {validation.wrongCount > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-red-400">
                    <AlertCircle className="w-3 h-3" /> {validation.wrongCount} wrong connection{validation.wrongCount > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {selWire ? (
                <div className="glass-strong rounded-xl p-3 mb-3">
                  <div className="text-[10px] text-muted-foreground mb-1.5">Selected wire</div>
                  <div className="text-[11px] mb-2">{selWire.from} → {selWire.to}</div>
                  <button onClick={deleteWire}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/15 text-red-400 text-xs font-bold hover:bg-red-500/25">
                    <Trash2 className="w-3.5 h-3.5" /> Delete Wire
                  </button>
                </div>
              ) : (
                <button onClick={clearWires} disabled={wires.length === 0}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg glass text-muted-foreground text-xs font-bold hover:text-red-400 disabled:opacity-30">
                  <Trash2 className="w-3.5 h-3.5" /> Clear all wires
                </button>
              )}

              {wiringComplete && (
                <button onClick={() => setStage('program')}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 animate-pulse-glow">
                  <CheckCircle2 className="w-4 h-4" /> Wiring Complete — Program
                </button>
              )}
            </>
          )}
          {stage !== 'wiring' && (
            <div className="glass-strong rounded-xl p-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 mb-2 text-green-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Wiring validated
              </div>
              <div className="text-[11px]">All {validation.total} connections correct. Pins and code are in sync.</div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom feedback bar (wiring stage) */}
      {stage === 'wiring' && (feedback || wiringComplete) && (
        <div className="absolute bottom-3 left-3 right-3 z-30 flex justify-center pointer-events-none">
          {feedback ? (
            <div className={`glass-strong rounded-xl px-4 py-2.5 flex items-center gap-2 animate-slide-up pointer-events-auto max-w-md border-l-2 ${
              feedback.status === 'correct' ? 'border-green-500' : 'border-red-500'}`}>
              {feedback.status === 'correct'
                ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                : <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />}
              <p className="text-xs text-foreground/90 flex-1">{feedback.message}</p>
            </div>
          ) : wiringComplete ? (
            <div className="glass-strong rounded-xl px-4 py-2.5 flex items-center gap-2 border-l-2 border-green-500 pointer-events-auto">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-xs font-bold text-green-400">All connections correct!</span>
              <button onClick={() => setStage('program')} className="ml-2 text-xs glass px-3 py-1 rounded-lg text-cyan-400 font-bold">
                Program →
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}