import React from 'react';
import { HelpCircle } from 'lucide-react';
import AIExplainerCard from './AIExplainerCard';

export default function AskWhy({ lesson }) {
  return (
    <AIExplainerCard
      title="❓ Ask Why?"
      subtitle="Why do engineers use this? What problem does it solve?"
      icon={HelpCircle}
      color="#F59E0B"
      prompt={`You are a friendly robotics teacher. A student asks: "Why do we need ${lesson.title}?"

Explain in simple English:
1. WHY engineers use ${lesson.title}
2. WHERE it is used in the real world
3. WHAT problem it solves

Start with a short analogy, then explain. Keep it under 5 sentences. Friendly, encouraging tone.

Topic: ${lesson.title}
Subject: ${lesson.subject}
Summary: ${lesson.summary || ''}`}
    />
  );
}
