import React, { useMemo, useEffect, useState } from 'react';

const MESSAGES = [
  'Training Intelligence...',
  'Optimizing Learning Experience...',
  'Loading Interactive Labs...',
  'Preparing Virtual Robotics World...',
];

export default function NeuralNetworkStage({ onDone }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const nodes = useMemo(() => {
    const layers = [3, 5, 5, 3];
    const result = [];
    layers.forEach((count, layerIdx) => {
      for (let i = 0; i < count; i++) {
        result.push({
          x: 15 + (layerIdx / (layers.length - 1)) * 70,
          y: 20 + ((i + 0.5) / count) * 60,
          layer: layerIdx,
        });
      }
    });
    return result;
  }, []);

  const connections = useMemo(() => {
    const conns = [];
    for (let l = 0; l < 4; l++) {
      const from = nodes.filter(n => n.layer === l);
      const to = nodes.filter(n => n.layer === l + 1);
      from.forEach(f => to.forEach(t => conns.push({ from: f, to: t })));
    }
    return conns;
  }, [nodes]);

  const [activeNode, setActiveNode] = useState(0);
  const [activeConn, setActiveConn] = useState(0);

  useEffect(() => {
    const n1 = setInterval(() => setActiveNode(a => (a + 1) % nodes.length), 150);
    const n2 = setInterval(() => setActiveConn(a => (a + 1) % connections.length), 80);
    const n3 = setInterval(() => setMsgIdx(m => (m + 1) % MESSAGES.length), 700);
    const t = setTimeout(onDone, 3200);
    return () => { clearInterval(n1); clearInterval(n2); clearInterval(n3); clearTimeout(t); };
  }, [nodes.length, connections.length, onDone]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 hex-grid opacity-10" />

      {/* Floating particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      <svg viewBox="0 0 100 80" className="w-full max-w-md h-auto px-6" style={{ filter: 'drop-shadow(0 0 4px rgba(0,210,255,0.3))' }}>
        {/* Connections */}
        {connections.map((c, i) => {
          const isActive = i === activeConn;
          return (
            <line
              key={i}
              x1={c.from.x} y1={c.from.y} x2={c.to.x} y2={c.to.y}
              stroke={isActive ? 'rgba(0,210,255,0.8)' : 'rgba(0,210,255,0.1)'}
              strokeWidth={isActive ? '0.4' : '0.15'}
              style={{ transition: 'stroke 0.1s' }}
            />
          );
        })}
        {/* Nodes */}
        {nodes.map((n, i) => {
          const isActive = i === activeNode;
          return (
            <circle
              key={i}
              cx={n.x} cy={n.y} r={isActive ? '1.8' : '1'}
              fill={isActive ? '#00D2FF' : 'rgba(0,210,255,0.3)'}
              style={{ transition: 'r 0.1s, fill 0.1s', filter: isActive ? 'drop-shadow(0 0 3px #00D2FF)' : 'none' }}
            />
          );
        })}
      </svg>

      <div className="absolute bottom-1/4 text-center w-full px-6">
        <p key={msgIdx} className="text-xs font-mono text-cyan-400 tracking-widest animate-fade-in" style={{ textShadow: '0 0 8px rgba(0,210,255,0.5)' }}>
          {MESSAGES[msgIdx]}
        </p>
      </div>
    </div>
  );
}
