import React from 'react';
import { ListChecks, Clock, BarChart3, Target } from 'lucide-react';
import { useInk } from '@/lib/ui/ink';

export default function LessonCover({ lesson, color }) {
  const ink = useInk();
  const coverColors = {
    Robotics: '#00D2FF',
    'Python Programming': '#4ADE80',
    'Artificial Intelligence': '#A78BFA',
    'Computing Fundamentals': '#F59E0B',
    'Mechanical Systems': '#F97316',
    Computing: '#F59E0B',
    Microcontrollers: '#22D3EE',
    'Electrical & Control Systems': '#EAB308',
    Applications: '#EC4899',
  };
  const c = color || coverColors[lesson.subject] || '#00D2FF';

  return (
    <div className="space-y-4">
      {/* Hero cover */}
      <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: '180px' }}>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${c}15 0%, ${c}05 50%, transparent 100%), radial-gradient(circle at 80% 20%, ${c}20, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="relative p-6 flex flex-col h-full justify-between" style={{ minHeight: '180px' }}>
          <div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ background: `${c}20`, color: ink(c, 0.125) }}
            >
              {lesson.subject}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2 leading-tight">{lesson.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" /> {lesson.readingTime} min
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <BarChart3 className="w-3.5 h-3.5" /> {lesson.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: c }}>
                <Target className="w-3.5 h-3.5" /> {lesson.objectives?.length || 0} objectives
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <div className="glass-strong rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${c}15` }}>
              <ListChecks className="w-4 h-4" style={{ color: c }} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: c }}>Mission Objectives</span>
          </div>
          <div className="space-y-2">
            {lesson.objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ background: `${c}15`, color: c }}>
                  {i + 1}
                </div>
                <p className="text-sm text-foreground/90 leading-snug">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
