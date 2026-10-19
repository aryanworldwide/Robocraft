import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function KeyTakeaways({ lesson }) {
  const takeaways = [];

  // From key concepts
  if (lesson.keyConcepts) {
    lesson.keyConcepts.slice(0, 4).forEach(c => takeaways.push(c));
  }

  // From summary
  if (lesson.summary && takeaways.length < 5) {
    takeaways.push(lesson.summary);
  }

  // From examples
  if (lesson.examples && takeaways.length < 5) {
    takeaways.push(lesson.examples[0]);
  }

  const displayTakeaways = takeaways.slice(0, 5);

  if (displayTakeaways.length === 0) return null;

  return (
    <div className="glass-strong rounded-3xl p-6" style={{ border: '1px solid rgba(0,210,255,0.15)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>
        <span className="text-[10px] text-cyan-400 font-medium uppercase tracking-wider">Key Takeaways</span>
      </div>
      <div className="space-y-3">
        {displayTakeaways.map((t, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/90 leading-snug">{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
