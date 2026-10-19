import React from 'react';
import { CIRCUIT_COMPONENTS } from '@/lib/circuit/components';

export default function ComponentPalette({ onAdd, requiredIds }) {
  const components = requiredIds
    ? CIRCUIT_COMPONENTS.filter(c => requiredIds.includes(c.id))
    : CIRCUIT_COMPONENTS;

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-3 py-2" style={{ scrollbarWidth: 'thin' }}>
      <span className="text-[10px] text-muted-foreground flex-shrink-0 font-medium">Components:</span>
      {components.map(comp => (
        <button key={comp.id} onClick={() => onAdd(comp)}
          className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-xl glass hover:bg-cyan-500/10 transition-colors active:scale-95">
          <span className="text-base">{comp.icon}</span>
          <span className="text-[10px] font-medium text-cyan-400">{comp.name}</span>
        </button>
      ))}
    </div>
  );
}
