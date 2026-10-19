import React from 'react';
import { Compass } from 'lucide-react';
import AIExplainerCard from './AIExplainerCard';

export default function ImConfused({ lesson }) {
  return (
    <AIExplainerCard
      title="😕 I'm Confused"
      subtitle="I'll simplify it more with a new analogy and tiny steps."
      icon={Compass}
      color="#EC4899"
      prompt={`A student is confused about "${lesson.title}" (${lesson.subject}). They need a MUCH simpler explanation.

Break it down into tiny pieces:
1. Use a completely NEW analogy (different from obvious ones)
2. Break the concept into 3 tiny steps
3. Use the simplest words possible
4. Give a mini quiz (1 simple question) at the end

Summary: ${lesson.summary || ''}
Key concepts: ${(lesson.keyConcepts || []).join(', ')}

Keep it short and very easy to understand. Friendly tone.`}
    />
  );
}
