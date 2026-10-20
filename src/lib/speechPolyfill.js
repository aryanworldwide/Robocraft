// Gives the Android app a working window.speechSynthesis.
// Android's in-app web view has no speech engine, so inside the native app we
// route speech to the phone's own text-to-speech (free, offline) through the
// @capacitor-community/text-to-speech plugin. Browsers/iPhone keep their own.
import { TextToSpeech } from '@capacitor-community/text-to-speech';

const native = typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.();

if (native && !('speechSynthesis' in window)) {
  let current = null;

  class Utterance {
    constructor(text = '') {
      this.text = text; this.lang = 'en-IN'; this.rate = 1; this.pitch = 1; this.volume = 1; this.voice = null;
      this.onstart = null; this.onend = null; this.onerror = null; this.onboundary = null;
      this._listeners = {};
    }
    addEventListener(type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); }
    removeEventListener(type, fn) { this._listeners[type] = (this._listeners[type] || []).filter(f => f !== fn); }
    _emit(type, ev = {}) {
      const e = { type, utterance: this, ...ev };
      try { this['on' + type]?.(e); } catch {}
      (this._listeners[type] || []).forEach(f => { try { f(e); } catch {} });
    }
  }

  const queue = [];
  const synth = {
    speaking: false, pending: false, paused: false, onvoiceschanged: null,
    getVoices() { return []; },
    speak(u) { queue.push(u); synth.pending = true; if (!synth.speaking) next(); },
    cancel() { queue.length = 0; const c = current; current = null; synth.speaking = false; synth.pending = false; TextToSpeech.stop().catch(() => {}); if (c) c._emit('end', { cancelled: true }); },
    pause() { synth.paused = true; const c = current; queue.length = 0; current = null; synth.speaking = false; TextToSpeech.stop().catch(() => {}); if (c) c._emit('end', { cancelled: true }); },
    resume() { synth.paused = false; },
    addEventListener() {}, removeEventListener() {},
  };

  async function next() {
    const u = queue.shift();
    synth.pending = queue.length > 0;
    if (!u) { synth.speaking = false; return; }
    current = u; synth.speaking = true;
    u._emit('start');
    try {
      await TextToSpeech.speak({
        text: u.text, lang: u.lang || 'en-IN',
        rate: Math.max(0.1, Math.min(2, u.rate || 1)), pitch: u.pitch || 1, volume: u.volume ?? 1,
        category: 'playback',
      });
      if (current === u) { current = null; u._emit('end'); }
    } catch (e) {
      if (current === u) { current = null; u._emit('error', { error: String(e?.message || e) }); }
    }
    if (!current) next();
  }

  window.SpeechSynthesisUtterance = Utterance;
  window.speechSynthesis = synth;
}
