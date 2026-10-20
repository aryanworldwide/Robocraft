import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import PythonRunner from '@/components/learning/PythonRunner';
import { PYTHON_PRACTICE, PLAYGROUND_STARTER } from '@/lib/curriculum/pythonPractice';
import { getLesson } from '@/lib/curriculum';
import { useApp } from '@/lib/AppContext';
import { Terminal, ChevronRight } from 'lucide-react';

export default function PythonPlayground() {
  const navigate = useNavigate();
  const { selectedClass } = useApp();
  const [key, setKey] = useState(0);

  // Lessons open within the selected class, so list that class's exercises.
  const exercises = Object.keys(PYTHON_PRACTICE)
    .map(id => ({ id, lesson: getLesson(selectedClass, id) }))
    .filter(x => x.lesson);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-4">
      <BackButton />
      <div className="flex items-center gap-3 animate-slide-up">
        <div className="w-11 h-11 rounded-2xl bg-green-500/15 flex items-center justify-center"><Terminal className="w-5 h-5 text-green-400" /></div>
        <div>
          <h1 className="text-xl font-bold">Python Playground</h1>
          <p className="text-xs text-muted-foreground">Write and run real Python — right in the app. Needs internet the first time.</p>
        </div>
      </div>

      <PythonRunner key={key} title="Your code" initialCode={PLAYGROUND_STARTER} storageKey="py_playground" />
      <button onClick={() => { try { localStorage.removeItem('py_playground'); } catch { /* ignore */ } setKey(k => k + 1); }}
        className="text-[11px] text-muted-foreground hover:text-cyan-400">Start fresh</button>

      <div>
        <h2 className="text-sm font-bold mb-2">Practice by lesson</h2>
        {exercises.length === 0 && <p className="text-xs text-muted-foreground">Python lessons are in Class 9 and Class 10. Use the playground above to practise anything.</p>}
        <div className="space-y-2">
          {exercises.map(({ id, lesson }) => (
            <button key={id} onClick={() => navigate(`/lesson/${id}`)} className="w-full glass rounded-xl p-3 flex items-center gap-3 text-left hover:bg-cyan-500/5">
              <span className="text-[10px] font-bold text-green-400 shrink-0">Try it</span>
              <span className="flex-1 text-xs font-medium">{lesson.title}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
