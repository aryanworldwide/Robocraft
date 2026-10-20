// Small helper on top of window.speechSynthesis (works in browsers, iPhone,
// and in the Android app through lib/speechPolyfill.js).
export const speechAvailable = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

function pickVoice(lang, n) {
  try {
    const all = window.speechSynthesis.getVoices() || [];
    const base = lang.split('-')[0];
    const matches = all.filter(v => (v.lang || '').toLowerCase().startsWith(base));
    return matches.length ? matches[n % matches.length] : null;
  } catch { return null; }
}

// Speak text; resolves when finished (or cancelled). `speaker` 1/2 gives two
// different-sounding voices for podcasts.
export function speak(text, { lang = 'en', rate = 1, speaker = 1 } = {}) {
  return new Promise((resolve) => {
    if (!speechAvailable() || !text) return resolve(false);
    const full = lang === 'hi' ? 'hi-IN' : 'en-IN';
    const u = new window.SpeechSynthesisUtterance(text);
    u.lang = full;
    u.rate = rate;
    u.pitch = speaker === 1 ? 1.08 : 0.88;
    const v = pickVoice(full, speaker - 1);
    if (v) u.voice = v;
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    window.speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  try { window.speechSynthesis.cancel(); } catch {}
}
