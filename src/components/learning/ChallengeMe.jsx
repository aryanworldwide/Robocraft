import React from 'react';
import { Rocket } from 'lucide-react';
import AIExplainerCard from './AIExplainerCard';

export default function ChallengeMe({ lesson, selectedClass }) {
  return (
    <AIExplainerCard
      title="Challenge Me"
      subtitle="Advanced problems for curious minds."
      icon={Rocket}
      color="#F97316"
      prompt={`You are a robotics engineering mentor. Give an advanced challenge for a student who understands "${lesson.title}" (${lesson.subject}, ${selectedClass}).

Include these sections:
1. 🏗️ Engineering Problem: A real design problem (1-2 sentences)
2. 💻 Coding Task: A programming challenge related to this topic
3. 🐛 Debug Challenge: Show a short broken Arduino code snippet and ask what's wrong

Keep it practical and connected to real robotics. Use simple English but challenging concepts.`}
    />
  );
}
