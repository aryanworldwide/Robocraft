import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, Volume2, Gauge, Languages } from 'lucide-react';
import SpeedPicker from './SpeedPicker';

export default function AIVoicePlayer({ text, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [lang, setLang] = useState('en-IN');
  const [voices, setVoices] = useState([]);
  const [currentWord, setCurrentWord] = useState(-1);
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);
  const utteranceRef = useRef(null);
  const wordsRef = useRef([]);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  wordsRef.current = words;

  const speak = useCallback(() => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;

    const matchingVoice = voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (matchingVoice) utterance.voice = matchingVoice;

    let charIndex = 0;
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const spoken = text.substring(0, e.charIndex);
        const wordIdx = spoken.split(/\s+/).filter(Boolean).length - 1;
        setCurrentWord(wordIdx);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWord(-1);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWord(-1);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [text, lang, rate, voices]);

  const pause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWord(-1);
  };

  const togglePlayPause = () => {
    if (!isPlaying) {
      speak();
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const toggleLang = () => {
    stop();
    setLang(prev => prev === 'en-IN' ? 'hi-IN' : 'en-IN');
  };

  if (!window.speechSynthesis) {
    return (
      <div className="glass rounded-xl p-3 text-xs text-muted-foreground text-center">
        Voice playback not supported on this device.
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-2xl p-3 flex items-center gap-3" style={{ border: '1px solid rgba(0,210,255,0.15)' }}>
      <button
        onClick={togglePlayPause}
        className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center hover:neon-glow transition-all flex-shrink-0"
      >
        {isPlaying && !isPaused ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
      </button>
      {isPlaying && (
        <button
          onClick={stop}
          className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-red-500/15 transition-colors flex-shrink-0"
        >
          <Square className="w-3.5 h-3.5 text-red-400" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <Volume2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
          <span className="text-[10px] font-medium text-cyan-400">{title || 'AI Voice Lesson'}</span>
          {currentWord >= 0 && (
            <span className="text-[9px] text-muted-foreground ml-auto">{Math.round((currentWord / words.length) * 100)}%</span>
          )}
        </div>
        {isPlaying && currentWord >= 0 && currentWord < words.length ? (
          <p className="text-[10px] text-foreground/70 line-clamp-1 leading-tight">
            {words.slice(Math.max(0, currentWord - 2), currentWord).join(' ')}
            <span className="text-cyan-400 font-bold"> {words[currentWord]} </span>
            {words[currentWord + 1]}
          </p>
        ) : (
          <p className="text-[10px] text-muted-foreground">{lang === 'hi-IN' ? 'हिंदी में सुनें' : 'Listen in English'}</p>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={toggleLang}
          className="p-1.5 rounded-lg glass hover:bg-cyan-500/10 transition-colors flex items-center gap-1"
          title={lang === 'hi-IN' ? 'Switch to English' : 'Switch to Hindi'}
        >
          <Languages className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[9px] font-bold text-cyan-400">{lang === 'hi-IN' ? 'हि' : 'EN'}</span>
        </button>
        <button
          onClick={() => setShowSpeedPicker(true)}
          className="flex items-center gap-1 p-1.5 rounded-lg glass hover:bg-cyan-500/10 transition-colors"
        >
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold text-cyan-400">{rate}x</span>
        </button>
      </div>
      <SpeedPicker
        open={showSpeedPicker}
        currentRate={rate}
        onSelect={(r) => { setRate(r); setShowSpeedPicker(false); if (isPlaying) { stop(); } }}
        onClose={() => setShowSpeedPicker(false)}
      />
    </div>
  );
}