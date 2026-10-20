import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Wrench, CheckCircle2 } from 'lucide-react';
import AIMentor from '@/components/learning/AIMentor';
import { aiEnabled } from '@/lib/features';

export default function Mentor() {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="text-center mb-4 animate-slide-up">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-2">
          <span className="text-2xl">🤖</span>
        </div>
        <h1 className="text-2xl font-bold gradient-text">RoboMentor</h1>
        <p className="text-sm text-muted-foreground mt-1">Your personal AI robotics teacher</p>
      </div>
      {aiEnabled ? <AIMentor /> : (
        <div className="glass-strong rounded-3xl p-6 text-center animate-slide-up">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="font-bold mb-1">RoboMentor is coming soon</h2>
          <p className="text-sm text-muted-foreground mb-5">The AI teacher isn't switched on yet. Meanwhile, everything else works — even offline:</p>
          <div className="grid gap-2 text-left">
            <button onClick={() => navigate('/learn')} className="glass rounded-xl p-3 flex items-center gap-3 hover:bg-cyan-500/5"><BookOpen className="w-5 h-5 text-cyan-400" /><span className="text-sm">Lessons, flashcards & quizzes</span></button>
            <button onClick={() => navigate('/lab')} className="glass rounded-xl p-3 flex items-center gap-3 hover:bg-cyan-500/5"><Wrench className="w-5 h-5 text-orange-400" /><span className="text-sm">Build & simulate circuits in the Lab</span></button>
            <button onClick={() => navigate('/revision')} className="glass rounded-xl p-3 flex items-center gap-3 hover:bg-cyan-500/5"><CheckCircle2 className="w-5 h-5 text-green-400" /><span className="text-sm">Revision mode & PDF notes</span></button>
          </div>
        </div>
      )}
    </div>
  );
}
