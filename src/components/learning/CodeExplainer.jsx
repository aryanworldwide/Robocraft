import ReportButton from '@/components/ReportButton';
import React, { useState } from 'react';
import { aiEnabled } from '@/lib/features';
import { backend } from '@/api/client';
import { BookOpen, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

function CodeExplainerInner({ code, title = 'Arduino Code' }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const handleExplain = async () => {
    if (explanation) { setExpanded(!expanded); return; }
    setExpanded(true);
    setLoading(true);
    try {
      const res = await backend.integrations.Core.InvokeLLM({
        prompt: `You are explaining ${title} to a school student (Class 9-11).

Here is the Arduino code:
\`\`\`cpp
${code}
\`\`\`

Write a detailed, beginner-friendly explanation covering:
1. What setup() does (explain each line inside it)
2. What loop() does (explain each line inside it)
3. Key variables used and what they store
4. Important functions used: pinMode(), digitalWrite(), analogWrite(), delay(), Serial.print(), etc. — explain each one that appears in the code
5. What happens when the code runs (the overall behavior)

Use simple English. Use short sentences. Use bullet points. Do NOT use HTML tags. Write in plain text only.`,
        response_json_schema: { type: 'object', properties: { explanation: { type: 'string' } } },
      });
      setExplanation(res.explanation || 'Could not generate explanation.');
    } catch {
      setExplanation('Could not connect to AI. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!code) return null;

  return (
    <div className="glass-strong rounded-2xl p-4 animate-slide-up">
      <button onClick={handleExplain}
        className="w-full flex items-center justify-between text-left">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-purple-400">Code Explanation</h3>
            <p className="text-[10px] text-muted-foreground">AI explains what each part of the code does</p>
          </div>
        </div>
        {explanation && (expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />)}
      </button>

      {expanded && (
        <div className="mt-3 animate-fade-in">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              <span className="text-xs text-muted-foreground ml-2">AI is reading the code...</span>
            </div>
          ) : explanation ? (
            <div className="glass rounded-xl p-3 border border-purple-500/15">
              <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">{explanation}</p>
              <div className="text-right mt-1"><ReportButton ai context={{ excerpt: explanation }} /></div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}


export default function CodeExplainer(props) {
  if (!aiEnabled) return null; // AI not configured for this build
  return <CodeExplainerInner {...props} />;
}
