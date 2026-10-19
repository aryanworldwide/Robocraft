import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, Info, Maximize2 } from 'lucide-react';
import CircuitDiagram from '@/components/buildsheet/CircuitDiagram';
import { COMPONENT_INFO } from '@/components/buildsheet/RealisticComponents';

export default function FullscreenCircuit({ pinConnections, projectName, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [highlightWire, setHighlightWire] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('text') || e.target.closest('[data-pin]')) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  // Touch pan
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsPanning(true);
      panStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
    }
  };
  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isPanning) {
      e.preventDefault();
      setPan({ x: e.touches[0].clientX - panStart.current.x, y: e.touches[0].clientY - panStart.current.y });
    }
  };
  const handleTouchEnd = () => setIsPanning(false);

  // Collect component IDs from pin connections for the info panel
  const componentIds = pinConnections?.reduce((acc, conn) => {
    if (conn.componentId && !acc.includes(conn.componentId)) acc.push(conn.componentId);
    if (conn.controllerId && !acc.includes(conn.controllerId)) acc.push(conn.controllerId);
    return acc;
  }, []) || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 glass-strong border-b border-cyan-500/20" style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}>
        <div className="flex items-center gap-2">
          <Maximize2 className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-sm gradient-text">{projectName} — Circuit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setZoom(z => Math.max(0.3, z - 0.2))} className="p-2 rounded-lg glass text-cyan-400 hover:bg-cyan-500/10">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs glass px-2.5 py-1 rounded-lg text-cyan-400 min-w-[52px] text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 rounded-lg glass text-cyan-400 hover:bg-cyan-500/10">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="text-xs glass px-3 py-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10 font-bold">
            Reset
          </button>
          <button onClick={onClose} className="p-2 rounded-lg glass text-red-400 hover:bg-red-500/10">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas + Side panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ background: '#0F172A' }}
        >
          <div
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            <CircuitDiagram
              pinConnections={pinConnections}
              projectName={projectName}
              onComponentClick={setSelectedComponent}
              highlightWire={highlightWire}
            />
          </div>

          {/* Hint */}
          <div className="absolute bottom-3 left-3 text-[10px] glass-strong px-3 py-1.5 rounded-lg text-muted-foreground pointer-events-none">
            Drag to pan · Scroll to zoom · Tap a wire or component
          </div>

          {/* Wire list (tap to highlight) */}
          {pinConnections && pinConnections.length > 0 && (
            <div className="absolute top-3 right-3 glass-strong rounded-xl p-2 max-h-[40%] overflow-y-auto" style={{ minWidth: '200px' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 px-1 py-1 flex items-center gap-1">
                <Info className="w-3 h-3" /> Wires ({pinConnections.length})
              </p>
              {pinConnections.map((conn, i) => {
                const colors = { red: '#EF4444', black: '#1A1A1A', blue: '#3B82F6', green: '#22C55E', purple: '#A78BFA', yellow: '#F59E0B' };
                const color = colors[conn.wireColor] || conn.color || '#64748B';
                return (
                  <button
                    key={i}
                    onClick={() => setHighlightWire(highlightWire === i ? null : i)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${highlightWire === i ? 'bg-cyan-500/15' : 'hover:bg-cyan-500/5'}`}
                  >
                    <span className="w-4 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-[10px] text-foreground/90 truncate">
                      <span className="text-cyan-400 font-bold">{conn.controllerPin}</span> → {conn.componentPin}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Component info panel */}
        {selectedComponent && COMPONENT_INFO[selectedComponent] && (
          <div className="w-72 glass-strong border-l border-cyan-500/20 p-4 overflow-y-auto animate-slide-up" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-cyan-400">{COMPONENT_INFO[selectedComponent].name}</h3>
              <button onClick={() => setSelectedComponent(null)} className="p-1 rounded-lg glass text-muted-foreground hover:text-cyan-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">{COMPONENT_INFO[selectedComponent].description}</p>
            <div className="mt-3 glass rounded-lg p-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Pin Connections</p>
              <div className="space-y-1">
                {pinConnections.filter(c => c.componentId === selectedComponent).map((c, i) => (
                  <div key={i} className="text-[10px] flex items-center gap-1.5">
                    <span className="text-cyan-400 font-bold">{c.controllerPin}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-foreground/80">{c.componentPin}</span>
                  </div>
                ))}
                {pinConnections.filter(c => c.componentId === selectedComponent).length === 0 && (
                  <p className="text-[10px] text-muted-foreground">No specific connections shown. This component is part of the circuit.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}