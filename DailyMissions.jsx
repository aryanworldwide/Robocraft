import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { getAllLessons, getQuizForLesson } from '@/lib/curriculum';
import { BookOpen, Target, Layers, Gamepad2, Zap, CheckCircle2, Flame, ChevronRight } from 'lucide-react';

export default function DailyMissions() {
  const navigate = useNavigate();
  const { selectedClass, getDailyMissions, getProgressForClass } = useApp();
  const missions = getDailyMissions(selectedClass);
  const progress = getProgressForClass(selectedClass);
  const doneCount = missions.filter(m => m.done).length;
  const totalXP = missions.reduce((sum, m) => sum + (m.done ? m.xp : 0), 0);
  const iconMap = { BookOpen, Target, Layers, Gamepad2, Zap };

  // "Take a Quiz" links only to a lesson that actually has a quiz —
  // preferring one the student hasn't finished yet.
  const quizLessonId = useMemo(() => {
    const lessons = getAllLessons(selectedClass);
    const hasQuiz = l => (getQuizForLesson(selectedClass, l.id) || []).length > 0;
    const completed = progress.completedLessons || [];
    return (lessons.find(l => hasQuiz(l) && !completed.includes(l.id)) || lessons.find(hasQuiz))?.id || null;
  }, [selectedClass, progress]);

  return (
    <div className="glass-strong rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '0.06s' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <h3 className="font-bold text-sm">Daily Missions</h3>
        </div>
        <span className="text-[10px] glass px-2 py-1 rounded-full text-cyan-400">{doneCount}/{missions.length} done</span>
      </div>
      <div className="space-y-2">
        {missions.map(mission => {
          const Icon = iconMap[mission.icon] || Zap;
          const isQuizMission = mission.id === 'take_quiz' && !!quizLessonId;
          const Row = isQuizMission ? 'button' : 'div';
          return (
            <Row
              key={mission.id}
              {...(isQuizMission ? { onClick: () => navigate(`/quiz/${quizLessonId}`) } : {})}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${mission.done ? 'bg-green-500/10' : 'glass'} ${isQuizMission && !mission.done ? 'hover:bg-cyan-500/10' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${mission.done ? 'bg-green-500/15' : 'bg-cyan-500/10'}`}>
                {mission.done ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Icon className="w-4 h-4 text-cyan-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${mission.done ? 'text-green-400 line-through' : 'text-foreground'}`}>{mission.name}</p>
                <p className="text-[10px] text-muted-foreground">+{mission.xp} XP • +{mission.coins} coins</p>
              </div>
              {isQuizMission && !mission.done && <ChevronRight className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
            </Row>
          );
        })}
      </div>
      {doneCount === missions.length && (
        <div className="mt-3 text-center text-xs text-green-400 font-medium animate-fade-in">
          🎉 All missions complete! +{totalXP} XP earned today!
        </div>
      )}
    </div>
  );
}
