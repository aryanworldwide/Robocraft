import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { Cpu, Bot, Shapes, Cog, Trophy, ChevronRight, FileText } from 'lucide-react';

const CARDS = [
  { path: '/lab', icon: Cpu, color: '#f97316', title: 'Circuit Lab', sub: 'Wire Arduino circuits like Tinkercad Circuits — then edit the code and run it on the simulated board.', tag: 'Wiring + code' },
  { path: '/arena', icon: Bot, color: '#38bdf8', title: 'Robot Arena 3D', sub: 'Write real Arduino code for a robot car: line follower, obstacle avoider, smart bin, maze, PID.', tag: 'Syllabus lab experiments', key: 'arena' },
  { path: '/design', icon: Shapes, color: '#fb7185', title: '3D Design Studio', sub: 'Tinkercad-style 3-D modelling: shapes, holes, group, real robot parts and STL export for 3-D printing.', tag: 'CAD', key: 'design' },
  { path: '/mechanisms', icon: Cog, color: '#a3e635', title: 'Mechanism Lab', sub: 'Four-bar linkages, slider-crank, 2R arm kinematics, gear trains and degrees of freedom.', tag: 'Mechanics', key: 'mech' },
  { path: '/challenges', icon: Trophy, color: '#a78bfa', title: 'Engineering Challenges', sub: 'Design problems with constraints and trade-offs.', tag: 'Problem solving' },
  { path: '/assessment', icon: FileText, color: '#34d399', title: 'Practical File', sub: 'CISCE-format assignments, variable description tables and a printable practical file.', tag: 'Internal assessment' },
];

export default function BuildHub() {
  const navigate = useNavigate();
  const { selectedClass, getProgressForClass } = useApp();
  const p = getProgressForClass(selectedClass);
  const count = (k) => Object.values(p[k] || {}).filter(v => (typeof v === 'object' ? v?.passed : v)).length;
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-10">
      <h1 className="text-xl font-bold">Build</h1>
      <p className="text-xs text-muted-foreground mb-4">Design it, wire it, code it, test it — the full engineering loop.</p>
      <div className="space-y-2.5">
        {CARDS.map(c => {
          const Icon = c.icon;
          const n = c.key ? count(c.key) : 0;
          return (
            <button key={c.path} onClick={() => navigate(c.path)} className="w-full glass-strong rounded-2xl p-3.5 flex items-center gap-3 text-left hover:scale-[1.01] transition-transform">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${c.color}20` }}>
                <Icon className="w-6 h-6" style={{ color: c.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold flex items-center gap-2">{c.title} <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color: c.color, background: `${c.color}18` }}>{c.tag}</span></p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{c.sub}</p>
                {n > 0 && <p className="text-[10px] text-green-500 mt-0.5">{n} completed</p>}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
