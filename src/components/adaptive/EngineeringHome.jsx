import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { getLevel } from '@/lib/gamification';
import { getSubjects } from '@/lib/curriculum';
import { computeMastery, weakAreas, examReadiness, challengeLevel, recentProgress } from '@/lib/adaptive';
import { ENGINEERING_CHALLENGES } from '@/lib/curriculum/engineeringChallenges';
import { exportFullRevisionPdf, exportRevisionPdf } from '@/lib/revision/exportRevisionPdf';
import MasteryRing from '@/components/adaptive/MasteryRing';
import ExamSeasonCard from '@/components/ExamSeasonCard';
import { Activity, AlertTriangle, ArrowRight, BookOpen, Cpu, Download, FileText, Lightbulb, Target, TrendingUp, Wrench, Zap, GraduationCap, Sigma, Calculator, Shapes, Terminal, Medal } from 'lucide-react';
import { rankFor } from '@/lib/uiMode';
import { getAllLessons } from '@/lib/curriculum';
import { topicsForClass } from '@/lib/problems';
import { useInk } from '@/lib/ui/ink';

export default function EngineeringHome() {
  const ink = useInk();
  const navigate = useNavigate();
  const { selectedClass, getProgressForClass } = useApp();
  const progress = getProgressForClass(selectedClass);
  const { overall, domains } = computeMastery(selectedClass, progress);
  const weak = weakAreas(selectedClass, progress, 4);
  const readiness = examReadiness(selectedClass, progress);
  const level = challengeLevel(selectedClass, progress);
  const recent = recentProgress(selectedClass, progress, 4);
  const levelInfo = getLevel(progress.xp || 0);
  const allLessons = getAllLessons(selectedClass);
  const done = (progress.completedLessons || []).filter(id => allLessons.some(l => l.id === id)).length;
  const coverage = allLessons.length ? Math.round((done / allLessons.length) * 100) : 0;
  const pstats = progress.problemStats || {};
  const ptopics = topicsForClass(selectedClass);
  const pTries = ptopics.reduce((n, t) => n + (pstats[t.id]?.tries || 0), 0);
  const pRight = ptopics.reduce((n, t) => n + (pstats[t.id]?.correct || 0), 0);
  const lastPaper = (progress.examHistory || [])[0];

  const solved = new Set(progress.engineering?.solved || []);
  const nextChallenge = ENGINEERING_CHALLENGES.find(c => !solved.has(c.id)) || ENGINEERING_CHALLENGES[0];
  // featured domain = lowest mastery (needs most attention)
  const featured = [...domains].sort((a, b) => a.mastery - b.mastery)[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
      {/* Header — engineering control panel */}
      <div className="animate-slide-up flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight">ROBOTICS ENGINEERING</h1>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">System analysis • Mastery • Diagnostics</p>
        </div>
        <div className="glass rounded-xl px-3 py-1.5 text-right">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Syllabus</p>
          <p className="text-sm font-bold text-cyan-400">{coverage}% <span className="text-[10px] text-muted-foreground font-normal">· {done}/{allLessons.length}</span></p>
        </div>
      </div>

      {/* Overall mastery + domain bars */}
      <div className="glass-strong rounded-2xl p-4 animate-slide-up grid grid-cols-[auto_1fr] gap-4 items-center" style={{ animationDelay: '0.03s' }}>
        <MasteryRing value={overall} size={118} label="Mastery" color="#00D2FF" sublabel={rankFor(overall).name} />
        <div className="space-y-2.5">
          {domains.map(d => (
            <div key={d.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium" style={{ color: ink(d.color) }}>{d.name}</span>
                <span className="text-[10px] text-muted-foreground tabular-nums"><span style={{ color: ink(rankFor(d.mastery).color) }}>{rankFor(d.mastery).name}</span> · {d.mastery}%</span>
              </div>
              <div className="h-1.5 glass rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.mastery}%`, background: d.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice snapshot */}
      <div className="grid grid-cols-3 gap-2 animate-slide-up">
        <button onClick={() => navigate('/problems')} className="glass-strong rounded-2xl p-3 text-left">
          <Sigma className="w-4 h-4 text-cyan-400 mb-1" />
          <p className="text-sm font-bold tabular-nums">{pTries ? `${Math.round((pRight / pTries) * 100)}%` : '—'}</p>
          <p className="text-[10px] text-muted-foreground">Numericals{pTries ? ` · ${pTries} solved` : ''}</p>
        </button>
        <button onClick={() => navigate('/exam')} className="glass-strong rounded-2xl p-3 text-left">
          <GraduationCap className="w-4 h-4 text-amber-400 mb-1" />
          <p className="text-sm font-bold tabular-nums">{lastPaper ? `${lastPaper.total}/${lastPaper.max}` : '—'}</p>
          <p className="text-[10px] text-muted-foreground">Last sample paper</p>
        </button>
        <button onClick={() => navigate('/tools')} className="glass-strong rounded-2xl p-3 text-left">
          <Calculator className="w-4 h-4 text-purple-400 mb-1" />
          <p className="text-sm font-bold">12</p>
          <p className="text-[10px] text-muted-foreground">Engineering tools</p>
        </button>
      </div>

      <ExamSeasonCard />


      {/* Featured domain — engineering focus */}
      {featured && (
        <div className="glass-strong rounded-2xl p-4 animate-slide-up border-l-2" style={{ animationDelay: '0.05s', borderLeftColor: featured.color }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: ink(featured.color) }}>{featured.name}</h3>
            <span className="text-[10px] glass px-2 py-0.5 rounded-full text-muted-foreground">Priority domain</span>
          </div>
          <div className="flex items-end gap-3 mb-3">
            <span className="text-3xl font-bold" style={{ color: ink(featured.color, 0, 3) }}>{featured.mastery}%</span>
            <span className="text-[11px] text-muted-foreground mb-1">mastered</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center mb-3">
            <div className="glass rounded-lg py-2">
              <p className="text-base font-bold text-green-400">{featured.mastered}</p>
              <p className="text-[9px] text-muted-foreground uppercase">Mastered</p>
            </div>
            <div className="glass rounded-lg py-2">
              <p className="text-base font-bold text-yellow-400">{featured.review}</p>
              <p className="text-[9px] text-muted-foreground uppercase">Needs Review</p>
            </div>
            <div className="glass rounded-lg py-2">
              <p className="text-base font-bold text-red-400">{featured.weak}</p>
              <p className="text-[9px] text-muted-foreground uppercase">Weak</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/learn')} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold">
              <Target className="w-3.5 h-3.5" /> Review Weak Areas
            </button>
            <button onClick={() => exportRevisionPdf(selectedClass, { id: featured.id, name: featured.name, lessons: getSubjects(selectedClass).find(s => s.id === featured.id).lessons })}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg glass text-cyan-400 text-xs font-bold">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </div>
      )}

      {/* Next engineering challenge */}
      <div className="glass-strong rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '0.07s' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" /> Your Next Challenge</h3>
          <span className="text-[10px] glass px-2 py-0.5 rounded-full text-purple-400">Level {level}</span>
        </div>
        <p className="text-sm text-foreground/90 mb-1 font-medium">{nextChallenge.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{nextChallenge.scenario}</p>
        <button onClick={() => navigate('/challenges')} className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold">
          Start Challenge <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Weak areas */}
      {weak.length > 0 && (
        <div className="glass-strong rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '0.09s' }}>
          <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 mb-3"><AlertTriangle className="w-3.5 h-3.5" /> Weak Areas</h3>
          <div className="space-y-2">
            {weak.map((w, i) => (
              <div key={i} className="flex items-center gap-3 glass rounded-lg p-2.5 cursor-pointer hover:bg-cyan-500/5 transition-colors" onClick={() => navigate(`/lesson/${w.lessonId}`)}>
                <span className="w-6 h-6 rounded-md bg-red-500/15 flex items-center justify-center text-[10px] font-bold text-red-400">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{w.name}</p>
                  <p className="text-[10px] text-muted-foreground">{w.domain}</p>
                </div>
                <span className="text-xs font-bold text-red-400 tabular-nums">{w.mastery}%</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam readiness */}
      <div className="glass-strong rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '0.11s' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Exam Readiness</h3>
          <span className="text-2xl font-bold text-cyan-400 tabular-nums">{readiness.readiness}%</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-green-400 mb-1.5 flex items-center gap-1"><Zap className="w-3 h-3" /> Strong</p>
            <div className="space-y-1">
              {readiness.strong.length ? readiness.strong.map(s => (
                <p key={s.id} className="text-[11px] text-foreground/85 flex items-center gap-1.5"><span className="text-green-400">✓</span> {s.name}</p>
              )) : <p className="text-[10px] text-muted-foreground">—</p>}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-yellow-400 mb-1.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Needs Revision</p>
            <div className="space-y-1">
              {readiness.needsRevision.length ? readiness.needsRevision.map(s => (
                <p key={s.id} className="text-[11px] text-foreground/85 flex items-center gap-1.5"><span className="text-yellow-400">⚠</span> {s.name}</p>
              )) : <p className="text-[10px] text-green-400">All strong ✓</p>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/revision')} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:neon-glow">
            <Zap className="w-3.5 h-3.5" /> Revision Mode
          </button>
          <button onClick={() => exportFullRevisionPdf(selectedClass)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg glass text-cyan-400 text-xs font-bold">
            <FileText className="w-3.5 h-3.5" /> Revision PDF
          </button>
        </div>
      </div>

      {/* Recent progress */}
      <div className="glass-strong rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '0.13s' }}>
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-3"><TrendingUp className="w-3.5 h-3.5" /> Recent Progress</h3>
        <div className="space-y-1.5">
          {recent.completed.map(l => (
            <div key={l.id} className="flex items-center gap-2 text-xs">
              <span className="text-green-400">✓</span>
              <span className="text-foreground/85">{l.title}</span>
            </div>
          ))}
          {recent.nextUp.map(l => (
            <div key={l.id} className="flex items-center gap-2 text-xs cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => navigate(`/lesson/${l.id}`)}>
              <span className="text-muted-foreground">○</span>
              <span className="text-muted-foreground">{l.title}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto" />
            </div>
          ))}
          {recent.completed.length === 0 && recent.nextUp.length === 0 && (
            <p className="text-xs text-muted-foreground">No progress yet.</p>
          )}
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-4 gap-2 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        {[
          { icon: BookOpen, label: 'Chapters', path: '/learn', color: '#4ADE80' },
          { icon: GraduationCap, label: 'Exam Prep', path: '/exam', color: '#F59E0B' },
          { icon: FileText, label: 'Practical File', path: '/assessment', color: '#34D399' },
          { icon: Sigma, label: 'Numericals', path: '/problems', color: '#22D3EE' },
          { icon: Calculator, label: 'Tools', path: '/tools', color: '#C084FC' },
          { icon: Wrench, label: 'Lab', path: '/lab', color: '#F97316' },
          { icon: Cpu, label: 'Robot Arena', path: '/arena', color: '#38BDF8' },
          { icon: Shapes, label: '3D CAD', path: '/design', color: '#FB7185' },
          { icon: Activity, label: 'Mechanisms', path: '/mechanisms', color: '#A3E635' },
          { icon: Activity, label: 'Challenges', path: '/challenges', color: '#A78BFA' },
          { icon: Shapes, label: 'Diagrams', path: '/diagrams', color: '#F472B6' },
          { icon: Terminal, label: 'Python', path: '/python', color: '#34D399' },
          { icon: Target, label: 'Syllabus', path: '/story', color: '#60A5FA' },
          { icon: Medal, label: 'Leaderboard', path: '/leaderboard', color: '#FB7185' },
          { icon: FileText, label: 'Revision', path: '/revision', color: '#2DD4BF' },
          { icon: TrendingUp, label: 'Progress', path: '/progress', color: '#FBBF24' },
        ].map(a => {
          const Icon = a.icon;
          return (
            <button key={a.label} onClick={() => navigate(a.path)} className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:neon-glow transition-all">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${a.color}15` }}>
                <Icon className="w-4 h-4" style={{ color: ink(a.color, 0.125) }} />
              </div>
              <span className="text-[10px] font-medium">{a.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}