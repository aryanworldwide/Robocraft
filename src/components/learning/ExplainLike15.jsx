import React from 'react';
import { Sparkles } from 'lucide-react';
import AIExplainerCard from './AIExplainerCard';

export default function ExplainLike15({ lesson }) {
  return (
    <AIExplainerCard
      title="✨ Explain Like I'm 15"
      subtitle="Super simple. Everyday examples. Friendly tone."
      icon={Sparkles}
      color="#A78BFA"
      prompt={`You are a friendly robotics teacher. A student is learning about "${lesson.title}" (Subject: ${lesson.subject}).

Rewrite this topic in VERY simple English suitable for a 15-year-old. Use:
- Everyday words (no technical jargon)
- Daily-life examples and analogies
- Small paragraphs (2-3 sentences each)
- Friendly, conversational tone

Topic summary: ${lesson.summary || ''}
Key concepts: ${(lesson.keyConcepts || []).join(', ')}

Structure your response:
1. Start with a simple analogy
2. Explain what it is (2-3 sentences)
3. Give a real-life example
4. End with a one-line summary starting with "In short:"`}
    />
  );
}
