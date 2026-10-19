import React from 'react';
import { Brain } from 'lucide-react';
import AIExplainerCard from './AIExplainerCard';

export default function MemoryHacks({ lesson }) {
  return (
    <AIExplainerCard
      title="🧠 Memory Hacks"
      subtitle="Easy ways to remember this topic forever."
      icon={Brain}
      color="#22D3EE"
      prompt={`Create 3 memory hacks for a student learning "${lesson.title}" (${lesson.subject}).

Each hack should:
1. Use an emoji
2. Link the concept to something familiar
3. Be one line only

Format each hack as:
• Emoji Concept = Familiar Thing

Example:
• Sensor = Robot's Eyes 👀
• Battery = Robot's Heart ❤️
• Motor = Robot's Muscles 💪

Key concepts: ${(lesson.keyConcepts || []).join(', ')}
Summary: ${lesson.summary || ''}

Create 3 hacks, one per line, each starting with a bullet point.`}
    />
  );
}
