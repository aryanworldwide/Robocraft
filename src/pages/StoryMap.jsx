import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { getSubjects } from '@/lib/curriculum';
import { formatClass } from '@/lib/utils';
import { equippedItems } from '@/lib/gamification';
import BackButton from '@/components/BackButton';
import { Check, Lock, Star, Map as MapIcon } from 'lucide-react';

const ROW = 92; // px between stops
const WORLD_COLORS = ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#fb923c'];
const WORLD_EMOJI = ['🤖', '🐍', '🧠', '💻', '⚙️', '🔌', '🛠️'];

function starsFor(progress, lessonId) {
  const scores = progress.quizScores?.[lessonId] || [];
  const best = scores.reduce((m, s) => Math.max(m, s?.percentage || 0), 0);
  return best >= 90 ? 3 : best >= 70 ? 2 : best >= 40 ? 1 : 0;
}

function World({ subject, index, progress, avatar, onOpen, currentRef }) {
  const color = subject.color || WORLD_COLORS[index % WORLD_COLORS.length];
  const lessons = subject.lessons || [];
  const done = new Set(progress.completedLessons || []);
  const firstOpen = lessons.findIndex(l => !done.has(l.id));
  const xOf = (i) => 50 + Math.sin(i * 1.1) * 28; // percent
  const height = lessons.length * ROW + 20;
  const pathD = lessons.map((_, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i)} ${i * ROW + 46}`).join(' ');
  const doneCount = lessons.filter(l => done.has(l.id)).length;
  const complete = doneCount === lessons.length && lessons.length > 0;

  return (
    <section className="mb-8">
      <div className="glass-strong rounded-2xl p-4 flex items-center gap-3 mb-2" style={{ borderLeft: `3px solid ${color}` }}>
        <span className="text-2xl" aria-hidden>{WORLD_EMOJI[index % WORLD_EMOJI.length]}</span>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color }}>World {index + 1}</p>
          <h2 className="text-sm font-bold">{subject.name || subject.title}</h2>
        </div>
        <span className="text-[11px] font-bold" style={{ color }}>{complete ? '🏆 Complete' : `${doneCount}/${lessons.length}`}</span>
      </div>

      <div className="relative" style={{ height }}>
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden>
          <path d={pathD} fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="6" strokeDasharray="2 10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        {lessons.map((l, i) => {
          const isDone = done.has(l.id);
          const isCurrent = i === firstOpen;
          const locked = !isDone && !isCurrent;
          const stars = starsFor(progress, l.id);
          return (
            <div key={l.id} ref={isCurrent ? currentRef : undefined} className="absolute -translate-x-1/2 flex flex-col items-center" style={{ left: `${xOf(i)}%`, top: i * ROW + 14, width: 120 }}>
              <button
                onClick={() => !locked && onOpen(l.id)}
                disabled={locked}
                aria-label={`${l.title}${isDone ? ' (done)' : locked ? ' (locked)' : ' (next)'}`}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-transform ${locked ? 'glass opacity-60' : 'hover:scale-110'} ${isCurrent ? 'animate-pulse' : ''}`}
                style={isDone ? { background: color, boxShadow: `0 4px 0 ${color}80` } : isCurrent ? { background: `${color}30`, border: `3px solid ${color}`, boxShadow: `0 0 20px ${color}80` } : {}}
              >
                {isDone ? <Check className="w-7 h-7 text-white" strokeWidth={3} /> : locked ? <Lock className="w-5 h-5 text-muted-foreground" /> : <span className="text-2xl" aria-hidden>{avatar}</span>}
                {isCurrent && <span className="absolute -top-7 text-[10px] font-bold px-2 py-0.5 rounded-full text-black" style={{ background: color }}>START</span>}
              </button>
              {isDone && (
                <div className="flex gap-0.5 mt-1" aria-label={`${stars} of 3 stars`}>
                  {[0, 1, 2].map(s => <Star key={s} className="w-3 h-3" fill={s < stars ? '#facc15' : 'transparent'} stroke={s < stars ? '#facc15' : 'currentColor'} />)}
                </div>
              )}
              <p className={`text-[10px] text-center leading-tight mt-1 line-clamp-2 ${locked ? 'text-muted-foreground' : 'font-medium'}`}>{l.title}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function StoryMap() {
  const navigate = useNavigate();
  const { selectedClass, getProgressForClass } = useApp();
  const progress = getProgressForClass(selectedClass);
  const subjects = getSubjects(selectedClass) || [];
  const avatar = equippedItems(progress).avatar?.emoji || '🤖';
  const currentRef = useRef(null);
  const total = subjects.reduce((n, s) => n + (s.lessons?.length || 0), 0);
  const done = (progress.completedLessons || []).length;

  useEffect(() => {
    const t = setTimeout(() => currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
    return () => clearTimeout(t);
  }, [selectedClass]);

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-28">
      <BackButton className="mb-3" />
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 flex items-center justify-center"><MapIcon className="w-5 h-5 text-cyan-400" /></div>
        <div>
          <h1 className="text-xl font-bold">Story Map</h1>
          <p className="text-xs text-muted-foreground">{formatClass(selectedClass)} · {done}/{total} stops cleared</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-6">Travel through each world one lesson at a time. Finish a lesson to unlock the next stop, and score well in its quiz to earn up to 3 stars. (Every lesson is still open in Learn.)</p>
      {subjects.map((s, i) => (
        <World key={s.id || i} subject={s} index={i} progress={progress} avatar={avatar} onOpen={(id) => navigate(`/lesson/${id}`)} currentRef={currentRef} />
      ))}
    </div>
  );
}
