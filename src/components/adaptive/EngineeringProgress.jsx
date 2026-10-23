import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { computeMastery, weakAreas, examReadiness, challengeLevel, recentProgress } from '@/lib/adaptive';
import { exportFullRevisionPdf } from '@/lib/revision/exportRevisionPdf';
import MasteryRing from '@/components/adaptive/MasteryRing';
import { AlertTriangle, ArrowRight, BookOpen, Cpu, Download, FileText, Target, TrendingUp, Wrench } from 'lucide-react';
import { useInk } from '@/lib/ui/ink';

export default function EngineeringProgress() {
  const ink = useInk();
  const navigate = useNavigate();
  const { selectedClass, getProgressForClass } = useApp();
  const progress = getProgressForClass(selectedClass);
  const { overall, domains } = computeMastery(selectedClass, progress);
  const weak = weakAreas(selectedClass, progress, 6);
  const readiness = examReadiness(selectedClass, progress);
  const level = challengeLevel(selectedClass, progress);
  const recent = recentProgress(selectedClass, progress, 6);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
      <div className="animate-slide-up flex items-center gap-2">
        <Cpu className="w-5 h-5 text-cyan-400" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">ENGINEERING PROGRESS</h1>
          <p className="text-[11px] text-muted-foreground">Mastery diagnostics • Challenge level {level}</p>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-4 flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.03s' }}>
        <MasteryRing value={overall} size={120} label="Mastery" color="#00D2FF" />
        <div className="flex-1 space-y-1.5">
          <p className="text-xs text-muted-foreground">Overall mastery across all domains.</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="glass rounded-lg p-2"><p className="text-[10px] text-muted-foreground">Concepts Mastered</p><p className="text-base font-bold text-green-400">{domains.reduce((a, d) => a + d.mastered, 0)}</p></div>
            <div className="glass rounded-lg p-2"><p className="text-[10px] text-muted-foreground">Weak Concepts</p><p className="text-base font-bold text-red-400">{domains.reduce((a, d) => a + d.weak, 0)}</p></div>
          </div>
        </div>
      </div>

      {/* Domain mastery */}
      <div className="glass-strong rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">Domain Mastery</h3>
        <div className="space-y-3">
          {domains.map(d => (
            <div key={d.id} className="cursor-pointer" onClick={() => navigate('/learn')}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: ink(d.color) }}>{d.name}</span>
                <span className="text-[10px] text-muted-foreground tabular-nums">{d.mastered}✓ · {d.weak}✗ · {d.mastery}%</span>
              </div>
              <div className="h-2 glass rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.mastery}%`, background: d.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak areas */}
      <div className="glass-strong rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '0.07s' }}>
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 mb-3"><AlertTriangle className="w-3.5 h-3.5" /> Weak Areas</h3>
        {weak.length ? (
          <div className="space-y-2">
            {weak.map((w, i) => (
              <div key={i} className="flex items-center gap-3 glass rounded-lg p-2.5 cursor-pointer hover:bg-cyan-500/5" onClick={() => navigate(`/lesson/${w.lessonId}`)}>
                <span className="w-6 h-6 rounded-md bg-red-500/15 flex items-center justify-center text-[10px] font-bold text-red-400">{i + 1}</span>
                <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate">{w.name}</p><p className="text-[10px] text-muted-foreground">{w.domain}</p></div>
                <span className="text-xs font-bold text-red-400 tabular-nums">{w.mastery}%</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-green-400">No weak areas — strong across all domains. ✓</p>}
      </div>

      {/* Exam readiness */}
      <div className="glass-strong rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '0.09s' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Exam Readiness</h3>
          <span className="text-2xl font-bold text-cyan-400 tabular-nums">{readiness.readiness}%</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-green-400 mb-1.5">Strong</p>
            <div className="space-y-1">
              {readiness.strong.length ? readiness.strong.map(s => <p key={s.id} className="text-[11px] flex gap-1.5"><span className="text-green-400">✓</span> {s.name}</p>) : <p className="text-[10px] text-muted-foreground">—</p>}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-yellow-400 mb-1.5">Needs Revision</p>
            <div className="space-y-1">
              {readiness.needsRevision.length ? readiness.needsRevision.map(s => <p key={s.id} className="text-[11px] flex gap-1.5"><span className="text-yellow-400">⚠</span> {s.name}</p>) : <p className="text-[10px] text-green-400">All strong ✓</p>}
            </div>
          </div>
        </div>
        <button onClick={() => exportFullRevisionPdf(selectedClass)} className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg glass text-cyan-400 text-xs font-bold">
          <Download className="w-3.5 h-3.5" /> Download Revision PDF
        </button>
      </div>

      {/* Recent progress */}
      <div className="glass-strong rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '0.11s' }}>
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-3"><TrendingUp className="w-3.5 h-3.5" /> Recent Progress</h3>
        <div className="space-y-1.5">
          {recent.completed.map(l => <div key={l.id} className="flex gap-2 text-xs"><span className="text-green-400">✓</span><span className="text-foreground/85">{l.title}</span></div>)}
          {recent.nextUp.map(l => <div key={l.id} className="flex gap-2 text-xs cursor-pointer hover:text-cyan-400" onClick={() => navigate(`/lesson/${l.id}`)}><span className="text-muted-foreground">○</span><span className="text-muted-foreground">{l.title}</span></div>)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 animate-slide-up" style={{ animationDelay: '0.13s' }}>
        <button onClick={() => navigate('/challenges')} className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:neon-glow">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center"><Wrench className="w-4 h-4 text-purple-400" /></div>
          <span className="text-[10px] font-medium">Challenges</span>
        </button>
        <button onClick={() => navigate('/learn')} className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:neon-glow">
          <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center"><BookOpen className="w-4 h-4 text-green-400" /></div>
          <span className="text-[10px] font-medium">Courses</span>
        </button>
        <button onClick={() => exportFullRevisionPdf(selectedClass)} className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:neon-glow">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center"><FileText className="w-4 h-4 text-cyan-400" /></div>
          <span className="text-[10px] font-medium">Revision</span>
        </button>
      </div>
    </div>
  );
}