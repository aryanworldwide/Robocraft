import React, { useState, useEffect, useRef } from 'react';
import { aiEnabled } from '@/lib/features';
import { backend } from '@/api/client';
import { Play, Pause, SkipForward, SkipBack, Gauge, Languages, Loader2, Radio, RotateCcw } from 'lucide-react';
import SpeedPicker from './SpeedPicker';
import { speak, stopSpeaking, speechAvailable } from '@/lib/speech';

function PodcastPlayerInner({ lesson, language = 'en', onLanguageChange }) {
  const [segments, setSegments] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [rate, setRate] = useState(1);
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);
  const [error, setError] = useState(null);
  const playToken = useRef(0); // increments to stop an ongoing playback loop
  const cacheKey = `podcast_v2_${lesson.id}_${language}`;

  useEffect(() => {
    stopSpeaking(); setIsPlaying(false); setCurrentIdx(0);
    try {
      const cached = localStorage.getItem(cacheKey);
      setSegments(cached ? JSON.parse(cached) : []);
    } catch { setSegments([]); }
  }, [cacheKey]);

  // Stop talking when leaving the screen.
  useEffect(() => () => { playToken.current++; stopSpeaking(); }, []);

  // Read the segments aloud one after another with the phone's own voices.
  const playFrom = async (idx, list = segments) => {
    const token = ++playToken.current;
    stopSpeaking();
    setIsPlaying(true);
    for (let i = idx; i < list.length; i++) {
      if (token !== playToken.current) return;
      setCurrentIdx(i);
      await speak(list[i].text, { lang: language, rate, speaker: list[i].speaker === 1 ? 1 : 2 });
    }
    if (token === playToken.current) setIsPlaying(false);
  };

  const stop = () => { playToken.current++; stopSpeaking(); setIsPlaying(false); };

  const generatePodcast = async () => {
    setIsLoading(true);
    setError(null);
    setLoadingStep('Writing the podcast script…');
    try {
      const res = await backend.integrations.Core.InvokeLLM({
        prompt: `Create an engaging podcast-style conversation between two speakers discussing "${lesson.title}" for Indian school students (Classes 9-11).

Topic: ${lesson.title}
Subject: ${lesson.subject}
Key concepts: ${(lesson.keyConcepts || []).join(', ')}
Theory: ${lesson.theory?.substring(0, 1500) || 'N/A'}
Real-world examples: ${(lesson.examples || []).join('; ')}

Rules:
- Speaker 1 (Host): asks questions, introduces topics, keeps it fun and relatable
- Speaker 2 (Expert): explains concepts simply with real-world examples
- Conversational and engaging tone for teenagers (12-16 years old)
- Use simple language, no jargon without explanation
- Include real-world examples (Indian context: ISRO, everyday gadgets, factories)
- Cover ALL key concepts listed above
- Keep each turn short (1-3 sentences max)
- Total: 8-12 turns (about 2-3 minutes when spoken)
- Start with Speaker 1 introducing the topic
- End with Speaker 2 giving a quick summary

${language === 'hi' ? 'Write entirely in Hindi (Devanagari script)' : 'Write in English'}

Return as JSON with a "turns" array.`,
        response_json_schema: {
          type: 'object',
          properties: {
            turns: {
              type: 'array',
              items: {
                type: 'object',
                properties: { speaker: { type: 'number' }, text: { type: 'string' } },
                required: ['speaker', 'text']
              }
            }
          },
          required: ['turns']
        }
      });
      const turns = (res.turns || []).filter(t => t && t.text).map(t => ({ speaker: Number(t.speaker) === 1 ? 1 : 2, text: String(t.text) }));
      if (turns.length === 0) throw new Error('No script generated');
      setSegments(turns);
      try { localStorage.setItem(cacheKey, JSON.stringify(turns)); } catch {}
      setIsLoading(false);
      setCurrentIdx(0);
      if (speechAvailable()) playFrom(0, turns);
    } catch (err) {
      setError(err?.message && !/script/i.test(err.message) ? err.message : 'Could not create the podcast. Please try again.');
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (segments.length === 0) { generatePodcast(); return; }
    if (isPlaying) stop(); else playFrom(currentIdx);
  };

  const goSegment = (idx) => {
    if (idx < 0 || idx >= segments.length) return;
    setCurrentIdx(idx);
    if (isPlaying) playFrom(idx);
  };

  const regenerate = () => {
    stop();
    try { localStorage.removeItem(cacheKey); } catch {}
    setSegments([]);
    setCurrentIdx(0);
    setError(null);
    generatePodcast();
  };

  if (isLoading) {
    return (
      <div className="glass-strong rounded-3xl p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
        <h3 className="font-bold text-sm mb-1">Creating Your Podcast</h3>
        <p className="text-xs text-muted-foreground">{loadingStep}</p>
      </div>
    );
  }

  if (segments.length === 0) {
    return (
      <div className="glass-strong rounded-3xl p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <Radio className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="font-bold text-sm mb-1">AI Podcast Lesson</h3>
        <p className="text-xs text-muted-foreground mb-4">Listen to two hosts chat about this topic in a fun, podcast style. Uses your phone's voice — no data needed after it's created.</p>
        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
        <button onClick={generatePodcast} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:neon-glow transition-all">
          Generate Podcast
        </button>
      </div>
    );
  }

  const currentSegment = segments[currentIdx];
  const progress = segments.length ? ((currentIdx + (isPlaying ? 0.5 : 0)) / segments.length) * 100 : 0;
  const speakerColor = currentSegment?.speaker === 1 ? '#22D3EE' : '#A78BFA';

  return (
    <div className="glass-strong rounded-3xl p-5" style={{ border: '1px solid rgba(0,210,255,0.15)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Radio className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold text-cyan-400">AI PODCAST</span>
        <span className="text-[10px] text-muted-foreground ml-auto">{currentIdx + 1} / {segments.length}</span>
        <button aria-label="Reset" onClick={regenerate} className="p-1 rounded-lg glass hover:bg-cyan-500/10 transition-colors tap-target" title="Regenerate">
          <RotateCcw className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${speakerColor}20`, color: speakerColor }}>
            {currentSegment?.speaker === 1 ? 'H' : 'E'}
          </div>
          <span className="text-xs font-medium" style={{ color: speakerColor }}>
            {currentSegment?.speaker === 1 ? 'Host' : 'Expert'}
          </span>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">{currentSegment?.text}</p>
      </div>

      <div className="h-1.5 glass rounded-full overflow-hidden mb-4">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button onClick={() => goSegment(currentIdx - 1)} disabled={currentIdx === 0} className="p-2 rounded-xl glass disabled:opacity-30 hover:bg-cyan-500/10 transition-colors">
          <SkipBack className="w-4 h-4 text-cyan-400" />
        </button>
        <button aria-label="Play or pause" onClick={togglePlayPause} className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center hover:neon-glow transition-all">
          {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-0.5" />}
        </button>
        <button onClick={() => goSegment(currentIdx + 1)} disabled={currentIdx === segments.length - 1} className="p-2 rounded-xl glass disabled:opacity-30 hover:bg-cyan-500/10 transition-colors">
          <SkipForward className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyan-500/10">
        <button onClick={() => onLanguageChange?.(language === 'en' ? 'hi' : 'en')} className="flex items-center gap-1 p-1.5 rounded-lg glass hover:bg-cyan-500/10 transition-colors">
          <Languages className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold text-cyan-400">{language === 'hi' ? 'हि' : 'EN'}</span>
        </button>
        <button onClick={() => setShowSpeedPicker(true)} className="flex items-center gap-1 p-1.5 rounded-lg glass hover:bg-cyan-500/10 transition-colors">
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold text-cyan-400">{rate}x</span>
        </button>
      </div>

      <SpeedPicker
        open={showSpeedPicker}
        currentRate={rate}
        onSelect={(r) => { setRate(r); setShowSpeedPicker(false); if (isPlaying) setTimeout(() => playFrom(currentIdx), 0); }}
        onClose={() => setShowSpeedPicker(false)}
      />
    </div>
  );
}

export default function PodcastPlayer(props) {
  if (!aiEnabled) return null; // AI not configured for this build
  return <PodcastPlayerInner {...props} />;
}
