import React, { useState } from 'react';
import { DIAGRAMS, Diagram } from '@/components/diagrams';
import { TEXTBOOK } from '@/lib/curriculum/textbook';
import { getAllLessons } from '@/lib/curriculum';
import { useApp } from '@/lib/AppContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import { Shapes } from 'lucide-react';

const TOPICS = ['All', 'Robotics', 'AI', 'Python', 'Computing', 'Electronics'];

// Lessons that use each diagram (in their figures or inline in the text).
function lessonsUsing(name, lessons) {
  return lessons.filter(l => {
    const b = TEXTBOOK[l.id];
    if (!b) return false;
    return (b.figs || []).includes(name) || (b.sections || []).some(s => s.b.includes(`[fig:${name}`));
  });
}

export default function DiagramBank() {
  const { selectedClass } = useApp();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('All');
  const lessons = getAllLessons(selectedClass);
  const entries = Object.entries(DIAGRAMS).filter(([, d]) => topic === 'All' || d.topic === topic);
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-8">
      <div className="flex items-center gap-2 mb-2">
        <BackButton />
        <h1 className="text-lg font-bold flex items-center gap-2"><Shapes className="w-5 h-5 text-purple-500" /> Diagram Bank</h1>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Every labelled diagram from the textbook notes — practise drawing them for your exam.</p>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
        {TOPICS.map(t => (
          <button key={t} onClick={() => setTopic(t)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${topic === t ? 'bg-purple-500 text-white' : 'glass'}`}>{t}</button>
        ))}
      </div>
      <div className="space-y-4">
        {entries.map(([name, d]) => {
          const used = lessonsUsing(name, lessons);
          return (
            <div key={name} className="glass-strong rounded-2xl p-3">
              <Diagram name={name} />
              {used.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {used.slice(0, 4).map(l => (
                    <button key={l.id} onClick={() => navigate(`/lesson/${l.id}`)} className="text-[10px] glass px-2 py-1 rounded-full text-cyan-500">{l.title}</button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
