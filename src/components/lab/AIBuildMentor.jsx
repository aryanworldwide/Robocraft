import React, { useState, useEffect, useRef } from 'react';
import { aiEnabled } from '@/lib/features';
import { backend } from '@/api/client';
import { Play, Pause, SkipForward, RotateCw, MessageCircle, X, Loader2, Volume2, Globe } from 'lucide-react';

export default function AIBuildMentor({ project, step, isPlaying, lang, components, wires, onPlay, onPause, onNext, onLangChange, onClose }) {
  const [showAsk, setShowAsk] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [loading, setLoading] = useState(false);
  const utterRef = useRef(null);

  const currentStep = project.steps[step];

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    u.rate = 0.85;
    u.pitch = 1.05;
    window.speechSynthesis.speak(u);
    utterRef.current = u;
  };

  useEffect(() => {
    if (isPlaying && currentStep) speak(currentStep.instruction);
    else if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, [isPlaying, step, lang]);

  const askAI = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await backend.integrations.Core.InvokeLLM({
        user_input: q,
        prompt: `You are a friendly robotics build mentor. Student is building "${project.title}" (Step ${step + 1}: "${currentStep?.instruction}"). Components placed: ${components.map(c => c.name).join(', ')}. Wires connected: ${wires.filter(w => w.correct).length}/${project.correctWiring.length}. Question: "${q}". Language: ${lang === 'hi' ? 'Hindi' : 'English'}. Answer in 2-3 sentences, friendly and encouraging.`,
        response_json_schema: { type: 'object', properties: { response: { type: 'string' } } },
      });
      setAiReply(res.response || 'Keep going, you can do it!');
    } catch {
      setAiReply('Check: VCC→5V, GND→GND, and signal pins match the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-3 right-3 z-30 w-72 max-w-[calc(100vw-1.5rem)] glass-strong rounded-2xl p-3 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-xs font-bold text-cyan-400">AI Build Mentor</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onLangChange(lang === 'en' ? 'hi' : 'en')}
            className="text-[9px] glass px-2 py-1 rounded-lg text-cyan-400 flex items-center gap-1">
            <Globe className="w-3 h-3" /> {lang === 'en' ? 'EN' : 'हि'}
          </button>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="glass rounded-xl p-2.5 mb-2.5" style={{ border: '1px solid rgba(251,191,36,0.2)' }}>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-5 h-5 rounded-full bg-yellow-500/15 flex items-center justify-center text-[9px] font-bold text-yellow-400">{step + 1}</span>
          <span className="text-[9px] text-muted-foreground">Step {step + 1} / {project.steps.length}</span>
        </div>
        <p className="text-xs font-medium leading-relaxed">{currentStep?.instruction}</p>
        {currentStep?.hint && <p className="text-[10px] text-muted-foreground mt-1">💡 {currentStep.hint}</p>}
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <button onClick={() => (isPlaying ? onPause() : onPlay())}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all ${isPlaying ? 'glass text-yellow-400' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'}`}>
          {isPlaying ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Play</>}
        </button>
        <button onClick={onNext} disabled={step >= project.steps.length - 1}
          className="py-2 px-3 rounded-xl glass text-cyan-400 disabled:opacity-40 hover:bg-cyan-500/10 transition-colors">
          <SkipForward className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => currentStep && speak(currentStep.instruction)} className="py-2 px-3 rounded-xl glass text-cyan-400 hover:bg-cyan-500/10 transition-colors">
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {showAsk ? (
        <div className="space-y-1.5">
          <input autoFocus value={question} onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askAI(question)}
            placeholder="Ask AI anything..." className="w-full glass rounded-lg px-2.5 py-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-cyan-500/50" />
          <div className="flex gap-1.5">
            <button onClick={() => askAI(question)} disabled={loading || !question.trim()}
              className="flex-1 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 text-[10px] font-bold disabled:opacity-40">Ask</button>
            <button onClick={() => { setShowAsk(false); setAiReply(''); setQuestion(''); }}
              className="py-1.5 px-3 rounded-lg glass text-muted-foreground text-[10px]">Close</button>
          </div>
          {loading && <div className="flex items-center gap-1.5 py-1"><Loader2 className="w-3 h-3 animate-spin text-cyan-400" /><span className="text-[10px] text-muted-foreground">AI thinking...</span></div>}
          {aiReply && <p className="text-[11px] text-foreground/90 leading-relaxed glass rounded-lg p-2 animate-fade-in">{aiReply}</p>}
        </div>
      ) : aiEnabled && (
        <button onClick={() => setShowAsk(true)}
          className="w-full py-2 rounded-xl glass text-purple-400 text-[11px] font-medium hover:bg-purple-500/10 transition-colors flex items-center justify-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5" /> Ask AI
        </button>
      )}
    </div>
  );
}