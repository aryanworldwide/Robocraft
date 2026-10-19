import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function VoiceAssistant({ message, lang = 'en' }) {
  const [enabled, setEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const lastRef = useRef('');

  useEffect(() => {
    if (!enabled || !message || !('speechSynthesis' in window)) return;
    if (message === lastRef.current) return;
    lastRef.current = message;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(message);
    u.rate = 0.9; u.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'hi') {
      const v = voices.find(x => /hi|hind/i.test(x.lang)) || voices.find(x => /en-GB/i.test(x.lang));
      if (v) u.voice = v; u.lang = 'hi-IN';
    } else {
      const v = voices.find(x => /en-GB|en-US/i.test(x.lang)) || voices.find(x => x.lang.startsWith('en'));
      if (v) u.voice = v; u.lang = 'en-US';
    }
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [message, enabled, lang]);

  // load voices (some browsers populate async)
  useEffect(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => { setEnabled(e => !e); if (enabled) window.speechSynthesis?.cancel(); }}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${enabled ? 'glass text-cyan-400' : 'glass text-muted-foreground'}`}>
        {enabled ? <Volume2 className={`w-3.5 h-3.5 ${speaking ? 'animate-pulse' : ''}`} /> : <VolumeX className="w-3.5 h-3.5" />}
        Voice {enabled ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}
