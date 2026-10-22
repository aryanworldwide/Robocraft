import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { aiEnabled } from '@/lib/features';
import { useNavigate } from 'react-router-dom';
import {
  Undo2, Redo2, Trash2, ChevronLeft, Code2, Play, Pause, RotateCcw, Languages,
  PanelLeftClose, PanelLeftOpen, X, Save, FolderOpen, Blocks, Cpu, Sparkles, Wrench, Terminal, Maximize2, LayoutGrid,
} from 'lucide-react';
import { LAB_EXPERIMENTS, getExperiment, generateCode } from '@/lib/lab/labExperiments';
import { validateCircuit, resolvePins } from '@/lib/lab/validateLab';
import { createSimState, stepSim, simInputsFor } from '@/lib/lab/simulateLab';
import {
  detectBoard, validateFreeBuild, resolveFreePins, freeWireStatuses,
  generateFreeCode, createFreeSimState, stepFreeSim, freeSimInputs, nextWiringStep,
} from '@/lib/lab/freeBuild';
import { getDef } from '@/lib/lab/labComponents';
import { CircuitBoard } from '@/lib/lab/circuitBoard';
import { runSketch } from '@/lib/arduino/runtime';
import { transpile } from '@/lib/arduino/transpile';
import Palette from './Palette';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import CodePanel from './CodePanel';
import SerialMonitor from './SerialMonitor';
import SimControls from './SimControls';
import StatusBar from './StatusBar';
import LabWelcome from './LabWelcome';
import BuildAnything from './BuildAnything';
import WorkflowStepper from './WorkflowStepper';
import HelpMeBuild from './HelpMeBuild';

let _id = 1;
const newId = () => `c${_id++}`;
const BUILDS_KEY = 'robocraft_lab_builds';

export default function TinkercadLab({ onExit }) {
  const navigate = useNavigate();
  const [experimentId, setExperimentId] = useState(null);
  const experiment = experimentId ? getExperiment(experimentId) : null;
  const free = !experiment;

  const [components, setComponents] = useState([]);
  const [wires, setWires] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [pendingWire, setPendingWire] = useState(null);
  const [lang, setLang] = useState('en');

  const [running, setRunning] = useState(false);
  const [simState, setSimState] = useState(free ? createFreeSimState() : createSimState());
  const [serial, setSerial] = useState([]);
  const [inputs, setInputs] = useState({ buttonPressed: false, objectCm: 30, motorSpeed: 200, knob: 50 });
  const [userCode, setUserCode] = useState(null); // student's edited sketch (null = generated code)
  const [engine, setEngine] = useState('code');   // 'code' = run the sketch, 'script' = fallback animation
  const [codeError, setCodeError] = useState(null);

  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const pendingRef = useRef(null);

  // drawers / overlays
  const [showComponents, setShowComponents] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showSerial, setShowSerial] = useState(false);

  // mobile sheet
  const [mobileSheet, setMobileSheet] = useState(null);

  // modals
  const [showBuildAnything, setShowBuildAnything] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSaves, setShowSaves] = useState(false);
  const [wiringGuide, setWiringGuide] = useState(null);

  const board = detectBoard(components) || { type: 'arduino_uno', id: 'default' };
  const boardType = board.type;

  const snapshot = useCallback(() => {
    setPast(p => [...p, { components, wires }].slice(-50));
    setFuture([]);
  }, [components, wires]);

  const undo = () => {
    setPast(p => {
      if (!p.length) return p;
      const prev = p[p.length - 1];
      setFuture(f => [{ components, wires }, ...f]);
      setComponents(prev.components); setWires(prev.wires);
      return p.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture(f => {
      if (!f.length) return f;
      const next = f[0];
      setPast(p => [...p, { components, wires }]);
      setComponents(next.components); setWires(next.wires);
      return f.slice(1);
    });
  };

  // auto-open inspector when a component is selected
  useEffect(() => {
    if (selectedId) setInspectorOpen(true);
  }, [selectedId]);

  // ── derived ──
  const templateValidation = useMemo(() => experiment ? validateCircuit(experiment, components, wires) : null, [experiment, components, wires]);
  const freeCheck = useMemo(() => free ? validateFreeBuild(components, wires) : null, [free, components, wires]);
  const templatePins = useMemo(() => experiment ? resolvePins(experiment, components, wires) : {}, [experiment, components, wires]);
  const freePins = useMemo(() => free ? resolveFreePins(components, wires) : {}, [free, components, wires]);
  const pins = experiment ? templatePins : freePins;

  const code = useMemo(() => {
    if (experiment) return experiment && templateValidation?.valid ? generateCode(experiment, templatePins) : '';
    return components.length ? generateFreeCode(components, wires) : '';
  }, [experiment, templateValidation, templatePins, components, wires]);

  const wireStatuses = useMemo(() => {
    if (experiment) return templateValidation ? templateValidation.wireResults.map(w => w.status) : [];
    return freeCheck ? freeWireStatuses(components, wires) : [];
  }, [experiment, templateValidation, freeCheck, components, wires]);

  const activeCode = userCode ?? code;
  const needsInput = experiment ? { ...simInputsFor(experiment), ...freeSimInputs(components), motor: false } : { ...freeSimInputs(components), motor: engine === 'script' && freeSimInputs(components).motor };
  const canRun = experiment ? !!templateValidation?.valid : (freeCheck?.status !== 'error' && components.length > 0 && !!detectBoard(components));

  const status = running ? 'running' : components.length === 0 ? 'empty'
    : experiment
    ? (templateValidation?.valid ? 'valid' : (templateValidation && (templateValidation.wireResults.some(w => w.status === 'incorrect') || templateValidation.componentIssues.length) ? 'error' : 'incomplete'))
    : (freeCheck?.status || 'incomplete');

  // ── simulation loop ──
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const simRef = useRef(simState);
  const inputsRef = useRef(inputs);
  const componentsRef = useRef(components);
  useEffect(() => { simRef.current = simState; }, [simState]);
  useEffect(() => { inputsRef.current = inputs; }, [inputs]);
  useEffect(() => { componentsRef.current = components; }, [components]);
  useEffect(() => {
    if (!running || engine !== 'script') return;
    lastRef.current = performance.now();
    const loop = (now) => {
      const dt = now - lastRef.current; lastRef.current = now;
      const step = experiment
        ? stepSim(experiment, pins, simRef.current, inputsRef.current, dt)
        : stepFreeSim(componentsRef.current, pins, simRef.current, inputsRef.current, dt);
      simRef.current = step.state; setSimState(step.state);
      if (step.serial) setSerial(arr => [...arr, `[${new Date().toLocaleTimeString()}] ${step.serial}`].slice(-200));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, experiment, pins, engine]);

  // ── real code execution: the sketch drives the wired circuit ──
  const wiresRef = useRef(wires);
  const codeRef = useRef(activeCode);
  useEffect(() => { wiresRef.current = wires; }, [wires]);
  useEffect(() => { codeRef.current = activeCode; }, [activeCode]);
  useEffect(() => {
    if (!running || engine !== 'code') return;
    const comps = componentsRef.current;
    const board = new CircuitBoard(comps, resolveFreePins(comps, wiresRef.current), () => inputsRef.current);
    let buf = [];
    const stamp = (ms) => `[${(ms / 1000).toFixed(1)}s]`;
    board.onSerial = (line) => buf.push(`${stamp(board.t)} ${line}`);
    const h = runSketch(codeRef.current, board, {
      onError: (e) => { buf.push(`⚠ ${e.line ? `Line ${e.line}: ` : ''}${e.message}`); setCodeError(e.message); },
    });
    let raf;
    const frame = () => {
      setSimState({ ...board.snapshot(), t: h.time });
      if (buf.length) { const add = buf; buf = []; setSerial(arr => [...arr, ...add].slice(-200)); }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    h.done.then((res) => {
      if (res?.error) {
        if (buf.length) { const add = buf; buf = []; setSerial(arr => [...arr, ...add].slice(-200)); }
        setRunning(false);
      }
    });
    return () => { h.stop(); cancelAnimationFrame(raf); };
  }, [running, engine]);

  // ── actions ──
  const addComponent = (type, x, y) => {
    snapshot();
    const id = newId();
    setComponents(c => [...c, { id, type, x: Math.round(x), y: Math.round(y), rot: 0 }]);
    setSelectedId(id);
    setShowWelcome(false);
  };
  const addComponentsList = (types) => {
    snapshot();
    const cols = 3, gap = 260, sx = 120, sy = 120;
    const placed = types.map((t, i) => ({ id: newId(), type: t, x: sx + (i % cols) * gap, y: sy + Math.floor(i / cols) * gap, rot: 0 }));
    setComponents(c => [...c, ...placed]);
    setShowWelcome(false);
    setTimeout(() => window.dispatchEvent(new CustomEvent('lab-fit')), 60);
  };
  const moveComponent = (id, x, y) => setComponents(c => c.map(p => p.id === id ? { ...p, x: Math.round(x), y: Math.round(y) } : p));
  const rotateSelected = () => { if (!selectedId) return; snapshot(); setComponents(c => c.map(p => p.id === selectedId ? { ...p, rot: ((p.rot || 0) + 90) % 360 } : p)); };
  const deleteSelected = () => {
    if (!selectedId) return; snapshot();
    setComponents(c => c.filter(p => p.id !== selectedId));
    setWires(w => w.filter(x => x.from.compId !== selectedId && x.to.compId !== selectedId));
    setSelectedId(null);
  };
  const clearAll = () => { snapshot(); setUserCode(null); setComponents([]); setWires([]); setSelectedId(null); setPendingWire(null); setWiringGuide(null); pendingRef.current = null; setShowWelcome(true); setRunning(false); };

  const onPinDown = (compId, pinId) => {
    setSelectedId(compId);
    const prev = pendingRef.current;
    if (!prev) { pendingRef.current = { compId, pinId }; setPendingWire({ compId, pinId }); return; }
    if (prev.compId === compId && prev.pinId === pinId) { pendingRef.current = null; setPendingWire(null); return; }
    const exists = wires.some(w =>
      (w.from.compId === prev.compId && w.from.pinId === prev.pinId && w.to.compId === compId && w.to.pinId === pinId) ||
      (w.to.compId === prev.compId && w.to.pinId === prev.pinId && w.from.compId === compId && w.from.pinId === pinId));
    if (!exists) { snapshot(); setWires(ws => [...ws, { id: newId(), from: prev, to: { compId, pinId } }]); }
    pendingRef.current = null; setPendingWire(null);
  };

  const chooseExperiment = (id) => {
    const exp = getExperiment(id);
    setExperimentId(id); setUserCode(null); setCodeError(null); setSelectedId(null); setPendingWire(null); pendingRef.current = null;
    setWiringGuide(null); setRunning(false); setSerial([]); setSimState(createSimState()); setShowWelcome(false); setShowTemplates(false);
    setShowComponents(false); setInspectorOpen(false);
    if (!exp) return;
    // Starter build: place every required component and pre-wire it exactly as
    // the project's pin map specifies — one Run away from working, then the
    // student can rewire, break and rebuild it.
    const cols = 3, gapX = 320, gapY = 260;
    const placed = exp.components.map((t, i) => ({
      id: t, type: t,
      x: 160 + (i % cols) * gapX,
      y: 160 + Math.floor(i / cols) * gapY,
      rot: 0,
    }));
    const starUsed = {};
    const preWired = exp.required.map(r => {
      const end = (e) => {
        let pinId = e.pin;
        if (pinId === '*') { // symmetric terminals: first free wire uses 'a', second 'b'
          const c = starUsed[e.comp] || 0;
          pinId = c === 0 ? 'a' : 'b';
          starUsed[e.comp] = c + 1;
        }
        return { compId: e.comp, pinId };
      };
      return { id: newId(), from: end(r.from), to: end(r.to) };
    });
    setComponents(placed);
    setWires(preWired);
    setTimeout(() => window.dispatchEvent(new CustomEvent('lab-fit')), 80);
  };

  const resetSim = () => { setRunning(false); setSimState(experiment ? createSimState() : createFreeSimState()); setSerial([]); };
  const runSim = () => {
    setSimState(experiment ? createSimState() : createFreeSimState()); setSerial([]); setCodeError(null);
    let eng = 'code';
    try { transpile(activeCode); } catch (e) {
      if (userCode != null) { // the student's own code has an error — show it instead of faking a run
        setCodeError(e.message); setSerial([`⚠ ${e.line ? `Line ${e.line}: ` : ''}${e.message}`]); setShowSerial(true); return;
      }
      eng = 'script'; // generated code uses a library the simulator doesn't model — animate instead
    }
    setEngine(eng); setRunning(true); setShowSerial(true);
  };

  // ── save / load ──
  const saveBuild = () => {
    const name = window.prompt('Name this build:', `Build ${new Date().toLocaleDateString()}`);
    if (!name) return;
    const builds = JSON.parse(localStorage.getItem(BUILDS_KEY) || '[]');
    builds.push({ id: `b${Date.now()}`, name, components, wires, boardType, code: userCode });
    localStorage.setItem(BUILDS_KEY, JSON.stringify(builds));
  };
  const loadBuild = (b) => {
    snapshot();
    setComponents(b.components); setWires(b.wires); setSelectedId(null); setPendingWire(null); pendingRef.current = null;
    setExperimentId(null); setUserCode(b.code ?? null); setWiringGuide(null); setRunning(false); setSimState(createFreeSimState()); setSerial([]);
    setShowSaves(false); setShowWelcome(false);
  };
  const savedBuilds = JSON.parse(localStorage.getItem(BUILDS_KEY) || '[]');

  const helpStep = nextWiringStep(wiringGuide, components, wires);
  const selectedComp = selectedId ? components.find(c => c.id === selectedId) : null;

  return (
    <div className="fixed inset-x-0 flex flex-col z-50" style={{ top: 'calc(4rem + env(safe-area-inset-top))', bottom: '0' }}>
      {/* ── TOP TOOLBAR ── */}
      <div className="glass-strong border-b border-border flex items-center gap-1 px-2 py-2">
        <button onClick={onExit || (() => navigate(-1))} className="p-1 text-muted-foreground hover:text-cyan-400 transition-colors" aria-label="Back">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-orange-500 leading-none whitespace-nowrap">CIRCUIT · 2D</p>
          <p className="text-xs font-semibold truncate max-w-[5.5rem] sm:max-w-[11rem]">{experiment ? experiment.title : 'Free build'}</p>
        </div>
        <button onClick={() => navigate('/design')} className="ml-1 px-2 py-1 rounded-lg glass text-[10px] font-bold text-violet-500 shrink-0" title="Switch to 3D design">3D →</button>

        {aiEnabled && <button onClick={() => setShowBuildAnything(true)} className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold hover:neon-glow transition-all shrink-0">
          <Sparkles className="w-3.5 h-3.5" /><span className="hidden sm:inline">Build Anything</span>
        </button>}

        <div className="ml-auto flex items-center gap-1">
          <button onClick={undo} disabled={!past.length} title="Undo" className="p-1.5 rounded-lg glass text-cyan-500 disabled:opacity-30"><Undo2 className="w-4 h-4" /></button>
          <button onClick={redo} disabled={!future.length} title="Redo" className="p-1.5 rounded-lg glass text-cyan-500 disabled:opacity-30 hidden sm:block"><Redo2 className="w-4 h-4" /></button>
          <button onClick={saveBuild} title="Save build" className="p-1.5 rounded-lg glass text-cyan-500"><Save className="w-4 h-4" /></button>
          <button onClick={() => setShowSaves(true)} title="My builds" className="p-1.5 rounded-lg glass text-cyan-500"><FolderOpen className="w-4 h-4" /></button>
          <button onClick={clearAll} title="Clear" className="p-1.5 rounded-lg glass text-red-400 hidden sm:block"><Trash2 className="w-4 h-4" /></button>
          <button onClick={() => setShowTemplates(true)} title="Projects" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg glass text-cyan-500 text-[11px] font-bold hover:bg-cyan-500/10 transition-colors hidden md:flex"><LayoutGrid className="w-3.5 h-3.5" /><span>Projects</span></button>
          <button onClick={() => setShowCode(true)} title="Code" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg glass text-cyan-400 text-[11px] font-bold hover:bg-cyan-500/10 transition-colors hidden md:flex"><Code2 className="w-3.5 h-3.5" /><span>Code</span></button>
          <button onClick={() => setShowSerial(s => !s)} title="Serial" className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors hidden md:flex ${showSerial ? 'bg-green-500/20 text-green-400' : 'glass text-cyan-400 hover:bg-cyan-500/10'}`}><Terminal className="w-3.5 h-3.5" /><span>Serial</span></button>
          <div className="h-5 w-px bg-border mx-0.5 hidden md:block" />
          {!running
            ? <button onClick={runSim} disabled={!canRun} title="Run" className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[11px] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"><Play className="w-3.5 h-3.5" /><span className="hidden md:inline">Run</span></button>
            : <button onClick={() => setRunning(false)} className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-[11px] font-bold transition-colors"><Pause className="w-3.5 h-3.5" /><span className="hidden md:inline">Stop</span></button>}
          <button onClick={resetSim} title="Reset" className="p-1.5 rounded-lg glass text-cyan-400 hover:bg-cyan-500/10 transition-colors"><RotateCcw className="w-4 h-4" /></button>
          <div className="h-5 w-px bg-border mx-0.5 hidden lg:block" />
          <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg glass text-cyan-400 text-[10px] font-bold transition-colors"><Languages className="w-3.5 h-3.5" />{lang === 'en' ? 'EN' : 'हिं'}</button>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div className="glass border-b border-border px-3 py-1.5 flex items-center gap-3">
        <StatusBar status={status} count={components.length} onClick={() => !free && setShowSerial(true)} />
        <div className="ml-auto flex items-center gap-3">
          <WorkflowStepper hasComponents={components.length > 0} hasWires={wires.length > 0} hasCode={!!code} hasRun={running || serial.length > 0} />
          {experiment && <span className="text-[10px] text-cyan-400 font-medium hidden sm:inline">{experiment.title}</span>}
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Components drawer — desktop (collapsed default) */}
        {showComponents ? (
          <div className="w-52 flex-shrink-0 glass border-r border-border hidden md:flex flex-col relative animate-slide-up">
            <button onClick={() => setShowComponents(false)} className="absolute -right-3 top-3 z-10 w-6 h-6 rounded-full glass-strong border border-border flex items-center justify-center text-muted-foreground hover:text-cyan-400"><PanelLeftClose className="w-3.5 h-3.5" /></button>
            <Palette onAdd={(type) => window.dispatchEvent(new CustomEvent('lab-add', { detail: { type } }))} />
          </div>
        ) : (
          <button onClick={() => setShowComponents(true)} title="Components" className="w-9 flex-shrink-0 glass border-r border-border hidden md:flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-cyan-400 transition-colors py-3">
            <Blocks className="w-4 h-4" />
            <span className="text-[9px] font-bold rotate-180" style={{ writingMode: 'vertical-rl' }}>Components</span>
          </button>
        )}

        {/* Canvas */}
        <div className="flex-1 min-w-0 relative">
          <Canvas
            components={components} wires={wires} selectedId={selectedId} pendingWire={pendingWire}
            simState={simState} running={running} wireStatuses={wireStatuses}
            onSelect={setSelectedId} onMove={moveComponent} onMoveStart={snapshot}
            onPinDown={onPinDown} onBackgroundDown={() => { setSelectedId(null); setPendingWire(null); pendingRef.current = null; }}
            onDropComponent={addComponent}
          />
          {showWelcome && components.length === 0 && (
            <LabWelcome
              onBuildAnything={() => { setShowWelcome(false); setShowBuildAnything(true); }}
              onScratch={() => setShowWelcome(false)}
              onPickExperiment={chooseExperiment}
            />
          )}
          {/* floating fit/help (desktop) */}
          <div className="absolute left-3 bottom-3 hidden md:flex items-center gap-1.5">
            <button onClick={() => window.dispatchEvent(new CustomEvent('lab-fit'))} className="px-2.5 py-1.5 rounded-lg glass text-cyan-400 text-[10px] font-bold flex items-center gap-1 hover:bg-cyan-500/10"><Maximize2 className="w-3.5 h-3.5" /> Fit</button>
            <button onClick={() => setShowComponents(true)} className="px-2.5 py-1.5 rounded-lg glass text-muted-foreground text-[10px] font-bold flex items-center gap-1 hover:bg-cyan-500/10"><Blocks className="w-3.5 h-3.5" /> Add</button>
          </div>

          {/* Serial + sim-input drawer — canvas stays visible above; appears on demand */}
          {showSerial && (
            <div className="absolute left-0 right-0 bottom-0 h-52 glass-strong border-t border-border flex flex-col animate-slide-up md:left-52 z-20">
              <div className="flex items-center justify-between px-3 py-1 border-b border-border">
                <span className="text-[11px] font-bold text-green-400 flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> Serial Monitor</span>
                <button onClick={() => setShowSerial(false)} className="p-1 rounded text-muted-foreground hover:text-red-400"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 min-h-0"><SerialMonitor lines={serial} running={running} /></div>
              <SimControls running={running} onRun={runSim} onStop={() => setRunning(false)} onReset={resetSim}
                inputs={inputs} setInputs={setInputs} needsInput={needsInput} canRun={canRun} />
            </div>
          )}
        </div>

        {/* Inspector — desktop, only when a component is selected */}
        {inspectorOpen && selectedId ? (
          <div className="w-64 flex-shrink-0 glass border-l border-border hidden md:flex flex-col relative animate-slide-up">
            <button onClick={() => setInspectorOpen(false)} className="absolute -left-3 top-3 z-10 w-6 h-6 rounded-full glass-strong border border-border flex items-center justify-center text-muted-foreground hover:text-cyan-400"><X className="w-3.5 h-3.5" /></button>
            <PropertiesPanel
              selected={selectedId} components={components} wires={wires}
              experiment={experiment} validation={templateValidation} freeCheck={freeCheck}
              wiringGuide={wiringGuide} helpStep={helpStep}
              onRotate={rotateSelected} onDelete={deleteSelected} />
          </div>
        ) : null}
      </div>

      {/* ── Code overlay (slides over canvas, right side; full on mobile) ── */}
      {showCode && (
        <div className="absolute inset-0 z-40 flex animate-fade-in">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowCode(false)} />
          <div className="relative ml-auto w-full md:w-[28rem] lg:w-[32rem] h-full glass-strong border-l border-border flex flex-col animate-slide-up">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5"><Code2 className="w-4 h-4" /> Code</span>
              <button onClick={() => setShowCode(false)} className="p-1.5 rounded-lg glass text-muted-foreground hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 min-h-0">
              <CodePanel code={code} pins={pins} experiment={experiment || { id: 'free', title: 'Free Build' }} canProgram={canRun}
                userCode={userCode} onEdit={(v) => { setUserCode(v); setCodeError(null); }} onResetCode={() => { setUserCode(null); setCodeError(null); }} error={codeError}
                onKnowCode={() => { setShowCode(false); setShowSerial(true); }} />
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM BAR ── */}
      <div className="md:hidden glass-strong border-t border-border grid grid-cols-5 safe-area-bottom">
        <MobTab icon={Blocks} label="Parts" active={mobileSheet === 'components'} onClick={() => setMobileSheet(mobileSheet === 'components' ? null : 'components')} />
        <MobTab icon={LayoutGrid} label="Projects" active={showTemplates} onClick={() => { setShowTemplates(true); setMobileSheet(null); }} />
        <MobTab icon={Cpu} label="Inspect" active={mobileSheet === 'inspector'} onClick={() => setMobileSheet(mobileSheet === 'inspector' ? null : 'inspector')} />
        <MobTab icon={Code2} label="Code" active={showCode} onClick={() => { setShowCode(true); setMobileSheet(null); }} />
        <MobTab icon={running ? Pause : Play} label={running ? 'Stop' : 'Run'} active={running} onClick={() => running ? setRunning(false) : runSim()} />
      </div>

      {/* ── MOBILE BOTTOM SHEETS ── */}
      {mobileSheet === 'components' && (
        <MobSheet title="Components" onClose={() => setMobileSheet(null)}>
          <Palette onAdd={(type) => { window.dispatchEvent(new CustomEvent('lab-add', { detail: { type } })); setMobileSheet(null); }} />
        </MobSheet>
      )}
      {mobileSheet === 'inspector' && (
        <MobSheet title="Inspector" onClose={() => setMobileSheet(null)}>
          <PropertiesPanel
            selected={selectedId} components={components} wires={wires}
            experiment={experiment} validation={templateValidation} freeCheck={freeCheck}
            wiringGuide={wiringGuide} helpStep={helpStep}
            onRotate={rotateSelected} onDelete={deleteSelected} />
        </MobSheet>
      )}

      {/* ── floating AI help ── */}
      <HelpMeBuild components={components} wires={wires} code={activeCode} status={status} />

      {/* ── MODALS ── */}
      {showBuildAnything && (
        <BuildAnything
          boardType={boardType}
          onAddComponents={(types) => { addComponentsList(types); setShowBuildAnything(false); }}
          onUseGuide={(guide) => { setWiringGuide(guide); setShowBuildAnything(false); setMobileSheet(null); }}
          onClose={() => setShowBuildAnything(false)}
        />
      )}
      {showTemplates && (
        <TemplatePicker onPick={chooseExperiment} onClose={() => setShowTemplates(false)} />
      )}
      {showSaves && (
        <SavesModal builds={savedBuilds} onLoad={loadBuild} onClose={() => setShowSaves(false)} />
      )}
    </div>
  );
}

function MobTab({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-0.5 py-2 transition-colors ${active ? 'text-cyan-400' : 'text-muted-foreground'}`}>
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function MobSheet({ title, onClose, children }) {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 animate-slide-up" style={{ maxHeight: '70vh' }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative glass-strong border-t border-border rounded-t-2xl flex flex-col" style={{ height: '70vh' }}>
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <span className="text-sm font-bold text-cyan-400">{title}</span>
          <button onClick={onClose} className="p-1.5 rounded-lg glass text-muted-foreground hover:text-red-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function TemplatePicker({ onPick, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md glass-strong rounded-2xl p-5 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold">Projects ({LAB_EXPERIMENTS.length})</h2>
          <button onClick={onClose} className="p-2 rounded-lg glass text-muted-foreground hover:text-red-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-2">
          {LAB_EXPERIMENTS.map(ex => (
            <button key={ex.id} onClick={() => onPick(ex.id)} className="w-full flex items-center gap-3 p-3 rounded-xl glass hover:bg-cyan-500/10 transition-colors text-left">
              <span className="text-xl">{ex.icon}</span>
              <div>
                <div className="text-sm font-bold">{ex.title}</div>
                <div className="text-[10px] text-muted-foreground">{ex.difficulty} · {ex.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SavesModal({ builds, onLoad, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md glass-strong rounded-2xl p-5 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold">My Builds</h2>
          <button onClick={onClose} className="p-2 rounded-lg glass text-muted-foreground hover:text-red-400"><X className="w-4 h-4" /></button>
        </div>
        {builds.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">No saved builds yet. Build something and tap Save.</p>
        ) : (
          <div className="space-y-2">
            {builds.map(b => (
              <button key={b.id} onClick={() => onLoad(b)} className="w-full flex items-center gap-3 p-3 rounded-xl glass hover:bg-cyan-500/10 transition-colors text-left">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-sm font-bold">{b.name}</div>
                  <div className="text-[10px] text-muted-foreground">{b.components.length} components · {b.wires.length} wires</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}