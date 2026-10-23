import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

export default function SerialMonitor({ lines, running }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [lines]);

  return (
    <div className="h-full flex flex-col on-dark">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-green-500/10">
        <Terminal className="w-3.5 h-3.5 text-green-400" />
        <span className="text-[11px] font-bold text-green-400">Serial Monitor</span>
        <span className="text-[10px] text-muted-foreground">9600 baud</span>
        <span className={`ml-auto mr-6 text-[10px] ${running ? 'text-green-400' : 'text-muted-foreground'}`}>{running ? '● running' : '○ idle'}</span>
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto p-2 font-mono text-[10px] leading-relaxed terminal-surface">
        {lines.length === 0 ? (
          <div className="text-muted-foreground/60">{running ? 'waiting for output…' : 'start the simulation to see serial output.'}</div>
        ) : (
          lines.map((l, i) => <div key={i} className="text-green-300/90">{l}</div>)
        )}
      </div>
    </div>
  );
}
