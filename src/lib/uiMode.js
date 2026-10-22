// Display style: "pro" (calm, exam/engineering focused — default for Class 11)
// or "fun" (games, confetti, coins — default for Classes 9–10). Saved per class.
const key = (classId) => `robocraft_ui_${classId}`;

export function getUiMode(classId) {
  try {
    const v = localStorage.getItem(key(classId));
    if (v === 'pro' || v === 'fun') return v;
  } catch { /* storage unavailable */ }
  const n = parseInt(String(classId || '').replace(/[^0-9]/g, ''), 10);
  return n >= 11 ? 'pro' : 'fun';
}

export function setUiMode(classId, mode) {
  try { localStorage.setItem(key(classId), mode); } catch { /* ignore */ }
  try { window.dispatchEvent(new CustomEvent('robocraft-ui-mode', { detail: { classId, mode } })); } catch { /* ignore */ }
}

export const isPro = (classId) => getUiMode(classId) === 'pro';

// Proficiency rank from a 0–100 mastery or accuracy value.
export function rankFor(pct) {
  if (pct >= 80) return { name: 'Expert', color: '#22c55e' };
  if (pct >= 60) return { name: 'Proficient', color: '#06b6d4' };
  if (pct >= 30) return { name: 'Developing', color: '#f59e0b' };
  if (pct > 0) return { name: 'Beginner', color: '#94a3b8' };
  return { name: 'Not started', color: '#64748b' };
}
