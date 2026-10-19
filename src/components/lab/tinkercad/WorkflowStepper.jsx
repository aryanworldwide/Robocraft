import React from 'react';

export default function WorkflowStepper({ hasComponents, hasWires, hasCode, hasRun }) {
  const steps = [
    { label: 'Components', done: hasComponents },
    { label: 'Wiring', done: hasWires },
    { label: 'Code', done: hasCode },
    { label: 'Test', done: hasRun },
  ];
  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${s.done ? 'bg-cyan-400' : 'bg-muted-foreground/30'}`} />
            <span className={`text-[10px] font-medium ${s.done ? 'text-cyan-400' : 'text-muted-foreground'} hidden xs:inline sm:inline`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && <span className={`w-3 h-px ${steps[i + 1].done ? 'bg-cyan-400/40' : 'bg-muted-foreground/20'}`} />}
        </div>
      ))}
    </div>
  );
}
