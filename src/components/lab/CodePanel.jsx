import React, { useState } from 'react';
import { aiEnabled } from '@/lib/features';
import { backend } from '@/api/client';
import { X, Copy, Check, Download, BookOpen, Loader2 } from 'lucide-react';

function highlightCode(code) {
  let h = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  h = h.replace(/(\/\/[^\n]*)/g, '<span style="color:#64748b">$1</span>');
  h = h.replace(/(#[^\n]*)/g, '<span style="color:#f97316">$1</span>');
  h = h.replace(/\b(void|int|float|long|for|if|else|return|const|byte|char|boolean)\b/g, '<span style="color:#a78bfa">$&</span>');
  h = h.replace(/\b(digitalWrite|digitalRead|analogWrite|analogRead|pinMode|delay|delayMicroseconds|Serial|begin|print|println|attach|write|read|pulseIn|map|setup|loop|tone|noTone)\b/g, '<span style="color:#00D2FF">$&</span>');
  h = h.replace(/\b(\d+)\b/g, '<span style="color:#fbbf24">$&</span>');
  h = h.replace(/"([^"]*)"/g, '<span style="color:#4ade80">"$1"</span>');
  return h;
}

export default function CodePanel({ project, onClose }) {
  const [copied, setCopied] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(project.code)?.catch?.(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([project.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.id}.ino`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const explainCode = async () => {
    setLoading(true);
    try {
      const res = await backend.integrations.Core.InvokeLLM({
        prompt: `Explain this Arduino code for a school student in simple English. Break down each function and what it does line by line. Keep it short and friendly.\n\n${project.code}`,
        response_json_schema: { type: 'object', properties: { response: { type: 'string' } } },
      });
      setExplanation(res.response || 'Unable to generate explanation.');
    } catch {
      setExplanation('Could not connect to AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-full glass-strong rounded-t-3xl max-h-[70%] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-3 border-b border-cyan-500/10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400">Arduino Code</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex gap-1.5 mb-2">
            <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] glass px-3 py-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10">
              {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
            </button>
            <button onClick={handleDownload} className="flex items-center gap-1 text-[10px] glass px-3 py-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10">
              <Download className="w-3 h-3" /> Download
            </button>
            {aiEnabled && <button onClick={explainCode} disabled={loading}
              className="flex items-center gap-1 text-[10px] glass px-3 py-1.5 rounded-lg text-purple-400 hover:bg-purple-500/10 disabled:opacity-50">
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <BookOpen className="w-3 h-3" />} Explain
            </button>}
          </div>

          <pre className="text-[11px] font-mono leading-relaxed glass rounded-xl p-3 overflow-x-auto bg-black/30" dangerouslySetInnerHTML={{ __html: highlightCode(project.code) }} />

          {explanation && (
            <div className="glass rounded-xl p-3 mt-2 animate-fade-in">
              <p className="text-[11px] font-bold text-purple-400 mb-1.5">📖 Code Explanation</p>
              <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">{explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}