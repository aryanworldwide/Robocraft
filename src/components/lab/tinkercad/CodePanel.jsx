import React, { useState } from 'react';
import { aiEnabled } from '@/lib/features';
import { Copy, Check, Download, Sparkles, Loader2 } from 'lucide-react';
import { backend } from '@/api/client';
import { sanitizeCode } from '@/lib/buildsheet/sanitizeCode';

export default function CodePanel({ code, pins, experiment, canProgram, onKnowCode, userCode, onEdit, onResetCode, error }) {
  const [copied, setCopied] = useState(false);
  const [aiCode, setAiCode] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [mode, setMode] = useState('local'); // 'local' | 'ai'

  const shown = mode === 'ai' ? sanitizeCode(aiCode || '') : (userCode ?? sanitizeCode(code));

  const handleCopy = () => { navigator.clipboard?.writeText(shown)?.catch?.(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleDownload = () => {
    const blob = new Blob([shown], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${experiment?.id || 'sketch'}.ino`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleHelp = async () => {
    if (aiCode) { setMode('ai'); return; }
    setAiLoading(true);
    try {
      const res = await backend.integrations.Core.InvokeLLM({
        prompt: `Write clean Arduino C++ code for a "${experiment.title}" project. Use ONLY these pins (from the student's wiring): ${JSON.stringify(pins)}. The board is Arduino Uno. Output pure code, no markdown, no HTML.`,
        response_json_schema: { type: 'object', properties: { code: { type: 'string' } } },
      });
      setAiCode(sanitizeCode(res.code || ''));
      setMode('ai');
    } catch { setAiCode('// Could not reach AI. Using local template.'); setMode('ai'); }
    finally { setAiLoading(false); }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyan-500/10">
        <span className="text-[11px] font-bold text-cyan-400">Arduino Code {mode === 'ai' && <span className="text-purple-400">· AI</span>}</span>
        <div className="flex gap-1.5">
          <button onClick={handleCopy} disabled={!shown} className="text-[10px] glass px-2 py-1 rounded-lg text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-1 disabled:opacity-40">
            {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
          </button>
          <button onClick={handleDownload} disabled={!shown} className="text-[10px] glass px-2 py-1 rounded-lg text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-1 disabled:opacity-40">
            <Download className="w-3 h-3" /> .ino
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {mode === 'local' && canProgram && onEdit ? (
          <textarea
            value={shown}
            onChange={(e) => onEdit(e.target.value)}
            spellCheck={false} autoCapitalize="off" autoCorrect="off"
            className="w-full h-full min-h-[16rem] text-[11px] leading-relaxed font-mono text-cyan-200 bg-[#0d1117] rounded-lg p-3 outline-none resize-none whitespace-pre"
          />
        ) : (
          <pre className="text-[10px] leading-relaxed font-mono text-cyan-300/90 whitespace-pre code-surface p-3 m-1">{shown || '// Complete the wiring, then check the circuit to reveal the code.'}</pre>
        )}
      </div>
      {canProgram && mode === 'local' && (
        <div className="px-3 py-1.5 text-[10px] border-t border-cyan-500/10 flex items-center gap-2">
          {error ? <span className="text-red-400 font-mono flex-1">{error}</span>
            : <span className="text-muted-foreground flex-1">{userCode != null ? '✏️ Your edited code runs when you press Run.' : 'Edit the code — Run executes it line by line on the simulated Arduino.'}</span>}
          {userCode != null && <button onClick={onResetCode} className="text-cyan-400 font-bold shrink-0">Reset code</button>}
        </div>
      )}
      {mode === 'ai' && aiCode && onEdit && (
        <div className="px-3 py-1.5 border-t border-cyan-500/10">
          <button onClick={() => { onEdit(aiCode); setMode('local'); }} className="w-full text-[10px] font-bold rounded-lg py-1.5 bg-purple-500/20 text-purple-300">Use this code</button>
        </div>
      )}
      {!canProgram && <div className="px-3 py-1.5 text-[10px] text-yellow-400 border-t border-yellow-500/20">Finish & verify the wiring first to unlock the code.</div>}
      {canProgram && (
        <div className="flex gap-1.5 p-2 border-t border-cyan-500/10">
          <button onClick={() => { setMode('local'); onKnowCode(); }} className={`flex-1 text-[10px] font-bold rounded-lg py-1.5 ${mode === 'local' ? 'bg-cyan-500/20 text-cyan-400' : 'glass text-muted-foreground'}`}>I know the code</button>
          {aiEnabled && <button onClick={handleHelp} disabled={aiLoading} className="flex-1 text-[10px] font-bold rounded-lg py-1.5 glass text-purple-400 hover:bg-purple-500/10 flex items-center justify-center gap-1">
            {aiLoading ? <><Loader2 className="w-3 h-3 animate-spin" /> …</> : <><Sparkles className="w-3 h-3" /> Help me</>}
          </button>}
        </div>
      )}
    </div>
  );
}
