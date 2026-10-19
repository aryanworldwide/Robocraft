import React from 'react';
import { Circle, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

export default function StatusBar({ status, count, onClick }) {
  const map = {
    empty: { icon: Circle, color: 'var(--muted-foreground)', label: 'ADD COMPONENTS TO START' },
    incomplete: { icon: Circle, color: 'var(--warning)', label: 'CIRCUIT INCOMPLETE' },
    valid: { icon: CheckCircle2, color: 'var(--success)', label: 'CIRCUIT COMPLETE — READY TO RUN' },
    error: { icon: AlertTriangle, color: '#EF4444', label: 'WIRING ERROR' },
    running: { icon: Play, color: 'var(--primary)', label: 'SIMULATION RUNNING' },
  };
  const s = map[status] || map.incomplete;
  const Icon = s.icon;
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-[10px] font-mono hover:opacity-80 transition-opacity">
      <Icon className="w-3 h-3" style={{ color: s.color }} />
      <span style={{ color: s.color }} className="font-bold tracking-wider">{s.label}</span>
      {count != null && <span className="text-muted-foreground">· {count} parts</span>}
    </button>
  );
}
