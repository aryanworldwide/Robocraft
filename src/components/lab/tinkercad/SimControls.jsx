import React from 'react';
import { Play, Pause, RotateCcw, MousePointerClick, Ruler, Gauge, SlidersHorizontal } from 'lucide-react';

export default function SimControls({ running, onRun, onStop, onReset, inputs, setInputs, needsInput, canRun }) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-3 py-2 border-t border-cyan-500/10">
      <div className="flex gap-1.5 items-center">
        {!running
          ? <button onClick={onRun} title={!canRun ? 'Complete & verify the wiring first' : ''} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold disabled:opacity-40 disabled:cursor-not-allowed"><Play className="w-3.5 h-3.5" /> Run</button>
          : <button onClick={onStop} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-[11px] font-bold"><Pause className="w-3.5 h-3.5" /> Stop</button>}
        <button onClick={onReset} className="flex items-center gap-1 px-3 py-1.5 rounded-lg glass text-cyan-400 text-[11px] font-bold hover:bg-cyan-500/10"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
        {!canRun && !running && <span className="text-[10px] text-yellow-400/80">Complete the wiring to enable simulation</span>}
      </div>

      {needsInput.button && (
        <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <MousePointerClick className="w-3.5 h-3.5 text-cyan-400" />
          <button
            onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); setInputs(i => ({ ...i, buttonPressed: true })); }}
            onPointerUp={() => setInputs(i => ({ ...i, buttonPressed: false }))}
            onPointerCancel={() => setInputs(i => ({ ...i, buttonPressed: false }))}
            style={{ touchAction: 'none' }}
            className="px-3 py-1.5 rounded-lg glass text-cyan-400 font-bold active:bg-cyan-500/20 select-none">HOLD BUTTON</button>
        </label>
      )}

      {needsInput.object && (
        <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground flex-1 max-w-xs">
          <Ruler className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span className="whitespace-nowrap">Object {inputs.objectCm ?? 30}cm</span>
          <input type="range" min={0} max={50} value={inputs.objectCm ?? 30}
            onChange={e => setInputs(i => ({ ...i, objectCm: Number(e.target.value) }))}
            className="flex-1 accent-cyan-400" />
        </label>
      )}

      {needsInput.knob && (
        <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground flex-1 max-w-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span className="whitespace-nowrap">Knob / light {inputs.knob ?? 50}%</span>
          <input type="range" min={0} max={100} value={inputs.knob ?? 50}
            onChange={e => setInputs(i => ({ ...i, knob: Number(e.target.value) }))}
            className="flex-1 accent-cyan-400" />
        </label>
      )}

      {needsInput.motor && (
        <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground flex-1 max-w-xs">
          <Gauge className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span className="whitespace-nowrap">Speed {inputs.motorSpeed ?? 200}</span>
          <input type="range" min={0} max={255} value={inputs.motorSpeed ?? 200}
            onChange={e => setInputs(i => ({ ...i, motorSpeed: Number(e.target.value) }))}
            className="flex-1 accent-cyan-400" />
        </label>
      )}
    </div>
  );
}
